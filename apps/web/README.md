# web

## AWS CLI

AWS CLIをインストールして`~/.aws/config`に追加する。

```
[profile daisuke-tanabe]
sso_session=daisuke-tanabe
sso_account_id={SSO_ACCOUNT_ID}
sso_role_name=AdministratorAccess
region={REGION}

[sso-session daisuke-tanabe]
sso_start_url={SSO_START_URL}
sso_region={REGION}
sso_registration_scopes=sso:account:access
```

aws sso loginでログインする。

```
aws sso login --profile daisuke-tanabe
```

## terraform

```
// インフラの適用
terraform apply

// 途中で失敗したらECRにDockerイメージをプッシュする

// インフラ適用後にCloudfrontからLambdaを呼び出すため、LambdaにCloudfrontの権限を与える
// Cloudfrontからも確認可能
aws lambda --profile daisuke-tanabe add-permission \
--statement-id "AllowCloudFrontServicePrincipal" \
--action "lambda:InvokeFunctionUrl" \
--principal "cloudfront.amazonaws.com" \
--source-arn "arn:aws:cloudfront::{SSO_ACCOUNT_ID}:distribution/{DISTRIBUTION_ID}" \
--region "{REGION}" \
--function-name {FUNCTION_NAME}
```

## Github Secrets

Github Actionsを実行するには以下が必要。

```
// ECRのリポジトリ名
AWS_ECR_REPO_NAME

// OICDがアタッチされたIAMロール
AWS_GITHUB_ACTIONS_OIDC_ROLE_ARN

// S3のバケット名
AWS_S3_BUCKET_NAME

// AWS SSOのアカウントID
AWS_SSO_ACCOUNT_ID
```

## ECR

ECRリポジトリを作成してイメージをプッシュする

```
// Dockerクライアントを認証する
aws ecr get-login-password --profile ${SSO_PROFILE} --region {REGION} | docker login --username AWS --password-stdin {SSO_ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com

// Dockerイメージを構築する（プロジェクトルートで実行すること）
docker build -t daisuke-tanabe/web . -f ./apps/web/Dockerfile

// イメージにタグをつける
docker tag daisuke-tanabe/web:latest {SSO_ACCOUNT_ID}.dkr.ecr.{REGION}.amazonaws.com/daisuke-tanabe/web:latest

// AWSにイメージをプッシュする
docker push {REGION}.dkr.ecr.{REGION}.amazonaws.com/daisuke-tanabe/web:latest
```
