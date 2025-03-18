variable "app_name" {
  default = "daisuke-tanabe"
}

#--------------------------------------------------------------
# AWS
#--------------------------------------------------------------
variable "aws_sso_profile" {}

variable "aws_sso_account_id" {}

variable "aws_region" {
  default = "ap-northeast-1"
}

variable "bucket_name" {}

variable "gibhub_repo" {
  default = "daisuke-tanabe/daisuke-tanabe"
}
