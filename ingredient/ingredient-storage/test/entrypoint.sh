#!/bin/bash
cd /usr/local
git clone --single-branch --branch "${git_branch}" "${git_repo}"
cd azure-bake
npm run clean:build
