variable "github_repo" {}
variable "aws_account_id" {}
variable "s3_bucket_name" {}

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

# S3 へのアクセス権限を付与する IAM ポリシー
resource "aws_iam_policy" "s3_policy" {
  name        = "GitHubActionsS3Policy"
  description = "GitHub Actions が S3 にアップロードできるようにするポリシー"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket"]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_name}",
          "arn:aws:s3:::${var.s3_bucket_name}/*"
        ]
      }
    ]
  })
}

# ロールに S3 ポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}
