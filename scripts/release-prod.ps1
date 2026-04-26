param(
  [string]$Region = 'ca-central-1',
  [switch]$ReturnToOriginalBranch
)

$ErrorActionPreference = 'Stop'

function Write-RecoveryHint {
  param([string]$OriginalBranch = '')

  if ([string]::IsNullOrWhiteSpace($OriginalBranch)) {
    Write-Warning "Tip: If state looks wrong, run 'git reflog' to recover previous HEAD state."
    return
  }

  Write-Warning "Tip: If state looks wrong, run 'git reflog' or 'git checkout $OriginalBranch' to recover."
}

function Run-Step {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][scriptblock]$Action
  )

  Write-Host "==> $Title"
  $global:LASTEXITCODE = 0
  & $Action
  if (-not $?) {
    Write-RecoveryHint
    throw "Step failed: $Title"
  }
  if ($global:LASTEXITCODE -ne 0) {
    Write-RecoveryHint
    throw "Step failed with exit code ${LASTEXITCODE}: $Title"
  }
}

function Get-TrimmedOutput {
  param(
    [Parameter(Mandatory = $true)][scriptblock]$Action
  )

  $output = & $Action
  if ($LASTEXITCODE -ne 0) {
    Write-RecoveryHint
    throw "Command failed."
  }
  return ($output | Out-String).Trim()
}

function Get-RemoteBranchSha {
  param(
    [Parameter(Mandatory = $true)][string]$Remote,
    [Parameter(Mandatory = $true)][string]$BranchName
  )

  $line = Get-TrimmedOutput {
    git ls-remote --heads $Remote $BranchName
  }

  if ([string]::IsNullOrWhiteSpace($line)) {
    return $null
  }

  return ($line -split '\s+')[0]
}

function Assert-CleanWorktree {
  $status = Get-TrimmedOutput {
    git status --porcelain
  }

  if (-not [string]::IsNullOrWhiteSpace($status)) {
    Write-RecoveryHint
    throw "Working tree is not clean. Commit or stash changes before running release."
  }
}

function Assert-GitRepo {
  $inside = Get-TrimmedOutput {
    git rev-parse --is-inside-work-tree
  }

  if ($inside -ne 'true') {
    Write-RecoveryHint
    throw "This script must be run inside a git repository."
  }
}

function Ensure-MasterCheckedOut {
  $currentBranch = Get-TrimmedOutput {
    git rev-parse --abbrev-ref HEAD
  }

  if ($currentBranch -ne 'master') {
    Run-Step -Title "Switching to master" -Action {
      git checkout master
    }
  }
}

Assert-GitRepo
Assert-CleanWorktree

$releaseDate = (Get-Date).ToString('yyyy-MM-dd')
$releaseBranch = "release/$releaseDate"
$remote = 'origin'
$releaseSucceeded = $false
$originalBranch = Get-TrimmedOutput {
  git rev-parse --abbrev-ref HEAD
}

try {
  Run-Step -Title "Fetching latest refs from origin" -Action {
    git fetch $remote
  }

  $remoteReleaseRootSha = Get-RemoteBranchSha -Remote $remote -BranchName 'release'
  if ($remoteReleaseRootSha) {
    Write-RecoveryHint -OriginalBranch $originalBranch
    throw "Remote branch 'release' exists. Rename/delete it before using 'release/YYYY-MM-DD' naming."
  }

  if ($originalBranch -ne 'master') {
    Write-Warning "WARNING: You are on '$originalBranch'. This release will check out master. Your commits on '$originalBranch' remain intact and can be restored with: git checkout $originalBranch"
  }

  Ensure-MasterCheckedOut

  Run-Step -Title "Fast-forwarding local master from origin/master" -Action {
    git pull --ff-only $remote master
  }

  Run-Step -Title "Running test suite" -Action {
    npm test
  }

  Run-Step -Title "Running build" -Action {
    npm run build
  }

  Run-Step -Title "Running lint" -Action {
    npm run lint
  }

  Run-Step -Title "Deploying API to prod" -Action {
    npm run deploy:prod
  }

  Run-Step -Title "Deploying web to prod" -Action {
    npm run deploy:web:prod
  }

  $headCommit = Get-TrimmedOutput {
    git rev-parse HEAD
  }

  $remoteReleaseSha = Get-RemoteBranchSha -Remote $remote -BranchName $releaseBranch
  if ($remoteReleaseSha) {
    & git merge-base --is-ancestor $remoteReleaseSha $headCommit | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-RecoveryHint -OriginalBranch $originalBranch
      throw "Remote branch '$releaseBranch' has diverged. Resolve manually before re-running."
    }
  }

  Run-Step -Title "Pushing master to origin" -Action {
    git push $remote master
  }

  Run-Step -Title "Pushing $releaseBranch to origin" -Action {
    git push $remote "$headCommit`:refs/heads/$releaseBranch"
  }

  $releaseSucceeded = $true
  Write-Host "Release complete."
  Write-Host "master and $releaseBranch now point to $headCommit"
} finally {
  Write-RecoveryHint -OriginalBranch $originalBranch

  $currentBranch = Get-TrimmedOutput {
    git rev-parse --abbrev-ref HEAD
  }

  if ($releaseSucceeded -and $ReturnToOriginalBranch -and $originalBranch -ne 'master') {
    if ($currentBranch -ne $originalBranch) {
      Run-Step -Title "Returning to $originalBranch" -Action {
        git checkout $originalBranch
      }
    }

    Write-Host "Finished on '$originalBranch' (-ReturnToOriginalBranch)."
  } else {
    if ($currentBranch -ne 'master') {
      Run-Step -Title "Returning to master" -Action {
        git checkout master
      }
    }

    if ($originalBranch -eq 'master') {
      Write-Host "Finished on master."
    } else {
      Write-Host "Original branch was '$originalBranch'; intentionally left on master per release policy."
    }
  }
}
