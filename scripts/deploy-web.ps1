param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('staging', 'prod')]
  [string]$Stage,

  [string]$Region = 'ca-central-1'
)

$ErrorActionPreference = 'Stop'

$stackName = "mealmatch-api-$Stage"
$frontendBucket = "mealmatch-frontend-$Stage"

function Get-StackOutput {
  param([Parameter(Mandatory = $true)][string]$OutputKey)

  $value = aws cloudformation describe-stacks `
    --stack-name $stackName `
    --region $Region `
    --query "Stacks[0].Outputs[?OutputKey=='$OutputKey'].OutputValue | [0]" `
    --output text

  if ([string]::IsNullOrWhiteSpace($value) -or $value -eq 'None') {
    throw "Could not find CloudFormation output '$OutputKey' on stack '$stackName'. Deploy the API stack first."
  }

  return $value.Trim()
}

$apiBaseUrl = Get-StackOutput -OutputKey 'HttpApiUrl'
$distributionId = Get-StackOutput -OutputKey 'FrontendDistributionId'
$distributionDomain = Get-StackOutput -OutputKey 'FrontendDistributionDomainName'

function Assert-ExportedApiBase {
  param([Parameter(Mandatory = $true)][string]$ExpectedApiBaseUrl)

  $bundleFiles = Get-ChildItem -Path "mobile/dist/_expo/static/js/web" -Filter "*.js" -ErrorAction Stop
  if (-not $bundleFiles) {
    throw "No web JS bundles were generated under mobile/dist/_expo/static/js/web."
  }

  $hasExpectedApiBase = Select-String -Path $bundleFiles.FullName -Pattern ([Regex]::Escape($ExpectedApiBaseUrl)) -Quiet
  if (-not $hasExpectedApiBase) {
    throw "Web export did not embed expected API base '$ExpectedApiBaseUrl'. Failing deploy to avoid cross-stage API routing."
  }
}

Write-Host "Deploying MealMatch web ($Stage)"
Write-Host "API base: $apiBaseUrl"
Write-Host "CloudFront: https://$distributionDomain"

$env:EXPO_PUBLIC_API_BASE_URL = $apiBaseUrl
npm --workspace mobile run build:web -- --clear
Assert-ExportedApiBase -ExpectedApiBaseUrl $apiBaseUrl
aws s3 sync "mobile/dist" "s3://$frontendBucket" --delete --region $Region --no-cli-pager
aws cloudfront create-invalidation --distribution-id $distributionId --paths '/*' --no-cli-pager

Write-Host "Web deploy complete: https://$distributionDomain"
