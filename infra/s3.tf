resource "random_id" "suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "daisuke_tanabe_web_s3" {
  bucket = "${var.bucket_name}-${random_id.suffix.hex}"

  # OAIを使ってCloudFrontのアクセスを許可
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.daisuke_tanabe_web_s3.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_account_public_access_block" "this" {
  block_public_acls   = false
  block_public_policy = false
}

resource "aws_s3_bucket_server_side_encryption_configuration" "daisuke_tanabe_web_s3" {
  bucket = aws_s3_bucket.daisuke_tanabe_web_s3.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }

    bucket_key_enabled = true
  }
}

resource "aws_cloudfront_origin_access_identity" "daisuke_tanabe_oai" {
  comment = "CloudFront OAI for S3 access"
}

resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.daisuke_tanabe_web_s3.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.daisuke_tanabe_oai.iam_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.daisuke_tanabe_web_s3.arn}/*"
      }
    ]
  })
}
