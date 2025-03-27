resource "aws_cloudfront_origin_access_control" "daisuke_tanabe_web_cloudfront_oac" {
  name                              = "daisuke-tanabe"
  origin_access_control_origin_type = "lambda"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

locals {
  lambda_origin_id = "lambda-origin"
  s3_origin_id = "s3-origin"
}

resource "aws_cloudfront_distribution" "daisuke_tanabe_web_cloudfront" {
  depends_on      = [aws_s3_bucket.daisuke_tanabe_web_s3]
  http_version    = "http2and3"
  is_ipv6_enabled = true
  enabled         = true
  aliases         = ["daisuke-tanabe.dev"]

  origin {
    domain_name = split("/", trimprefix(aws_lambda_function_url.nextjs_on_lambda.function_url, "https://"))[0]
    origin_access_control_id = aws_cloudfront_origin_access_control.daisuke_tanabe_web_cloudfront_oac.id
    origin_id = local.lambda_origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = aws_s3_bucket.daisuke_tanabe_web_s3.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.daisuke_tanabe_oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.lambda_origin_id
    cache_policy_id            = aws_cloudfront_cache_policy.daisuke_tanabe_web_default_cache_policy.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.daisuke_tanabe_web_default_request_policy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.daisuke_tanabe_web_default_headers_policy.id
    viewer_protocol_policy     = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern               = "/_next/static/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    cache_policy_id            = aws_cloudfront_cache_policy.daisuke_tanabe_web_next_static_cache_policy.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.daisuke_tanabe_web_assets_request_policy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.daisuke_tanabe_web_assets_headers_policy.id
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern               = "/images/*"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    cache_policy_id            = aws_cloudfront_cache_policy.daisuke_tanabe_web_images_cache_policy.id
    origin_request_policy_id   = aws_cloudfront_origin_request_policy.daisuke_tanabe_web_assets_request_policy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.daisuke_tanabe_web_assets_headers_policy.id
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:${var.aws_sso_account_id}:certificate/6a00c25f-81bd-4e0f-bf93-ba816e4200d5"
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method = "sni-only"
  }

  web_acl_id = aws_wafv2_web_acl.daisuke_tanabe_web_waf.arn # WAF を CloudFront に適用
}

# デフォルトキャッシュポリシー
resource "aws_cloudfront_cache_policy" "daisuke_tanabe_web_default_cache_policy" {
  name    = "DaisukeTanabeWebDefaultCaching"
  comment = "Policy with caching enabled. Supports Gzip and Brotli compression"

  min_ttl     = 0
  max_ttl     = 31536000
  default_ttl = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Accept"]
      }
    }

    cookies_config {
      cookie_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }

    enable_accept_encoding_gzip = true
    enable_accept_encoding_brotli = true
  }
}

# デフォルトオリジンリクエストポリシー
resource "aws_cloudfront_origin_request_policy" "daisuke_tanabe_web_default_request_policy" {
  name    = "DaisukeTanabeWebDefaultRequestPolicy"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "allExcept"
    headers {
      items = ["host", "Accept"]
    }
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

# アセットオリジンリクエストポリシー
resource "aws_cloudfront_origin_request_policy" "daisuke_tanabe_web_assets_request_policy" {
  name    = "DaisukeTanabeWebAssetsRequestPolicy"

  cookies_config {
    cookie_behavior = "none"
  }

  headers_config {
    header_behavior = "whitelist"
    headers {
      items = [
        "Origin",
        "Referer",
        "Accept",
      ]
    }
  }

  query_strings_config {
    query_string_behavior = "none"
  }
}

# NextStaticキャッシュポリシー
resource "aws_cloudfront_cache_policy" "daisuke_tanabe_web_next_static_cache_policy" {
  name    = "NextStaticCaching"
  min_ttl     = 0
  max_ttl     = 31536000
  default_ttl = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    headers_config {
      header_behavior = "none"
    }

    cookies_config {
      cookie_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }

    enable_accept_encoding_gzip = true
    enable_accept_encoding_brotli = true
  }
}

# imagesキャッシュポリシー
resource "aws_cloudfront_cache_policy" "daisuke_tanabe_web_images_cache_policy" {
  name    = "ImagesCaching"
  min_ttl     = 0
  max_ttl     = 31536000
  default_ttl = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    headers_config {
      header_behavior = "none"
    }

    cookies_config {
      cookie_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }

    enable_accept_encoding_gzip = true
    enable_accept_encoding_brotli = true
  }
}

# デフォルトレスポンスヘッダーポリシー
resource "aws_cloudfront_response_headers_policy" "daisuke_tanabe_web_default_headers_policy" {
  name    = "DaisukeTanabeWebDefaultHeadersPolicy"

  # 不要なヘッダー削除
  remove_headers_config {
    items { header = "X-Powered-By" }
  }
}

# アセットレスポンスヘッダーポリシー
resource "aws_cloudfront_response_headers_policy" "daisuke_tanabe_web_assets_headers_policy" {
  name    = "DaisukeTanabeWebAssetsHeadersPolicy"

  # 不要なヘッダー削除
  remove_headers_config {
    items { header = "X-Powered-By" }
  }
}
