# GitHub OIDC プロバイダーの設定
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"] # GitHub の OIDC 固定 thumbprint
}

# IAM ロールの作成
resource "aws_iam_role" "github_actions_role" {
  name = "GitHubActionsOIDCRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          "StringEquals" = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          "StringLike" = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "github_actions_ecr_policy" {
  name        = "GitHubActionsECRPolicy"
  description = "GitHub Actions が ECR にアクセスできるようにするポリシー"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "ecr:GetAuthorizationToken"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:GetDownloadUrlForLayer", # docker/build-push-action@v6 で必要
          "ecr:BatchGetImage"           # docker/build-push-action@v6 で必要
        ]
        Resource = "arn:aws:ecr:ap-northeast-1:${var.aws_account_id}:repository/daisuke-tanabe/web"
      }
    ]
  })
}

# Lambda にアクセス権限を付与する IAM ポリシー
resource "aws_iam_policy" "github_actions_lambda_policy" {
  name        = "GitHubActionsLambdaPolicy"
  description = "GitHub Actions が Lambda にアクセスできるようにするポリシー"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:UpdateFunctionCode"
        ]
        Resource = var.lambda_arn
      }
    ]
  })
}

# Cloud front にアクセス権限を付与する IAM ポリシー
resource "aws_iam_policy" "github_actions_cloud_front_policy" {
  name        = "GitHubActionsCloudFrontPolicy"
  description = "GitHub Actions が Lambda にアクセスできるようにするポリシー"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = var.cloud_front_arn
      }
    ]
  })
}

# S3 へのアクセス権限を付与する IAM ポリシー
resource "aws_iam_policy" "s3_policy" {
  name        = "GitHubActionsS3Policy"
  description = "GitHub Actions が S3 にアップロードできるようにするポリシー"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject"]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*"
        ]
      }
    ]
  })
}

# ロールに Lambda ポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "attach_lambda_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_lambda_policy.arn
}

# ロールに ECR ポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "attach_ecr_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_ecr_policy.arn
}

# ロールに Cloud front ポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "attach_cloud_front_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_cloud_front_policy.arn
}

# ロールに S3 ポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}
