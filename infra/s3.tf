resource "random_id" "suffix" {
  byte_length = 8
}

resource "aws_s3_bucket" "daisuke_tanabe_web_s3" {
  bucket = "${var.bucket_name}-${random_id.suffix.hex}"

  lifecycle {
    prevent_destroy = true
  }
}

#--------------------------------------------------------------
# Logs bucket
#--------------------------------------------------------------
resource "aws_s3_bucket" "logs" {
  bucket = "${var.bucket_name}-logs-${random_id.suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket                  = aws_s3_bucket.logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logs" {
  depends_on = [aws_s3_bucket_ownership_controls.logs]
  bucket     = aws_s3_bucket.logs.id
  acl        = "private"
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.daisuke_tanabe_web_s3.bucket
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_account_public_access_block" "this" {
  block_public_acls   = true
  block_public_policy = true
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

resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.daisuke_tanabe_web_s3.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.daisuke_tanabe_web_s3.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.daisuke_tanabe_web_cloudfront.arn
          }
        }
      }
    ]
  })
}
