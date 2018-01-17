#!/bin/bash

set -o errexit
set -o nounset

cd cp_github_repo/src_frontend

npm run cover
