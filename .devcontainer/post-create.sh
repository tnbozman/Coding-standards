#!/usr/bin/env bash
# .devcontainer/post-create.sh
# Runs once after the devcontainer is created.
set -euo pipefail

echo "==> Installing frontend dependencies..."
if [ -f "src/frontend/package.json" ]; then
  cd src/frontend && npm ci && cd -
fi

echo "==> Restoring .NET backend dependencies..."
if ls src/backend/*.sln 2>/dev/null | grep -q .; then
  dotnet restore src/backend
elif ls src/backend/*.csproj 2>/dev/null | grep -q .; then
  dotnet restore src/backend
fi

echo "==> DevContainer setup complete."
