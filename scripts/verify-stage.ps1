param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('dev', 'prod')]
  [string]$Stage
)

Write-Host "Verifying stage: $Stage"
Write-Host "Expected bucket: mealmatch-uploads-$Stage"
Write-Host "Expected SSM prefix: /mealmatch/$Stage/"