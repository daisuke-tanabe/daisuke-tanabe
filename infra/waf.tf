resource "aws_wafv2_web_acl" "daisuke_tanabe_web_waf" {
  provider = aws.use1 # WAF は us-east-1 に作成
  name     = "daisuke_tanabe"
  scope    = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "rate-limit-rule"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 1000 # 1000リクエスト/5分
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "rate-limit-rule"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "daisuke_tanabe"
    sampled_requests_enabled   = true
  }
}
