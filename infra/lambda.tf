resource "aws_lambda_function" "daisuke_tanabe_lambda" {
  function_name = "daisuke-tanabe"
  architectures = [
    "arm64"
  ]
  memory_size = "256"
  package_type = "Image"
  reserved_concurrent_executions = "-1"
  image_uri = "${aws_ecr_repository.daisuke_tanabe_web_ecr.repository_url}:latest"
  role = aws_iam_role.daisuke_tanabe_role.arn
  timeout = "10"
  depends_on = [aws_ecr_repository.daisuke_tanabe_web_ecr]

  ephemeral_storage {
    size = "512"
  }
}

resource "aws_lambda_function_url" "nextjs_on_lambda" {
  function_name      = aws_lambda_function.daisuke_tanabe_lambda.function_name
  authorization_type = "AWS_IAM"
  invoke_mode = "BUFFERED"
}
