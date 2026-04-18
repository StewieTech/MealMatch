#!/usr/bin/env bash
set -euo pipefail
stage="$1"
echo "Verifying stage: ${stage}"
echo "Expected bucket: mealmatch-uploads-${stage}"
echo "Expected SSM prefix: /mealmatch/${stage}/"