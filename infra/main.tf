terraform {
  required_version = "1.11.2"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.91.0"
    }
  }
}

provider "aws" {
  profile = var.aws_sso_profile
  region  = var.aws_region

  default_tags {
    tags = {
      Environment = "prod"
      Project     = "daisuke-tanabe"
      ManagedBy   = "Terraform"
    }
  }
}

provider "aws" {
  alias   = "use1"
  profile = var.aws_sso_profile
  region  = "us-east-1" # CloudFront 用 WAF のため us-east-1 を追加
}

resource "aws_iam_role_policy" "daisuke_tanabe_policy" {
  role = aws_iam_role.daisuke_tanabe_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup"
        ]
        Effect   = "Allow"
        Resource = format("arn:aws:logs:%s:%s:*",
          var.aws_region,
          var.aws_sso_account_id,
        )
      },
      {
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = format("arn:aws:logs:%s:%s:log-group:/aws/lambda/%s:*",
          var.aws_region,
          var.aws_sso_account_id,
          aws_lambda_function.daisuke_tanabe_lambda.function_name
        )
      }
    ]
  })
}

resource "aws_iam_role" "daisuke_tanabe_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}
