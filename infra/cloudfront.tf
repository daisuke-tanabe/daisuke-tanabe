resource "aws_cloudfront_origin_access_control" "daisuke_tanabe_cloudfront_oac" {
  name                              = "daisuke-tanabe"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

locals {
  origin_id = "daisuke-tanabe"
}

resource "aws_cloudfront_distribution" "daisuke_tanabe_cloudfront" {
  is_ipv6_enabled = true
  enabled         = true
  aliases = ["daisuke-tanabe.dev"]

  origin {
    domain_name = split("/", trimprefix(aws_lambda_function_url.nextjs_on_lambda.function_url, "https://"))[0]
    origin_access_control_id = aws_cloudfront_origin_access_control.daisuke_tanabe_cloudfront_oac.id
    origin_id   = local.origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:${var.aws_sso_account_id}:certificate/6a00c25f-81bd-4e0f-bf93-ba816e4200d5"
    ssl_support_method = "sni-only"
  }
}
