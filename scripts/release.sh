#!/usr/bin/env bash
# Mechanical half of a release: bump the version, sync the flake, recompute the
# npm deps hash, and verify the build. Leaves committing & pushing to you.
#
#   npm run release -- patch        # or: minor | major | 1.2.3
#
set -euo pipefail
cd "$(dirname "$0")/.."

BUMP="${1:-patch}"

echo "→ bumping version ($BUMP)"
npm version "$BUMP" --no-git-tag-version >/dev/null
VERSION="$(node -p "require('./package.json').version")"
echo "  version is now $VERSION"

echo "→ syncing flake.nix version"
node -e "let s=require('fs').readFileSync('flake.nix','utf8'); s=s.replace(/version = \"[0-9.]+\";/, 'version = \"$VERSION\";'); require('fs').writeFileSync('flake.nix', s)"

echo "→ recomputing npmDepsHash (the lockfile changed)"
HASH="$(nix run nixpkgs#prefetch-npm-deps -- package-lock.json)"
node -e "let s=require('fs').readFileSync('flake.nix','utf8'); s=s.replace(/npmDepsHash = \"[^\"]*\";/, 'npmDepsHash = \"$HASH\";'); require('fs').writeFileSync('flake.nix', s)"
echo "  $HASH"

echo "→ verifying nix build"
nix build .#frontend-system --no-link

cat <<EOF

✓ v$VERSION prepared and the package builds. Review, then publish:

    git commit -am "release: v$VERSION"
    git push origin main

Consumers then pull it with:  nix flake update frontend-system && npm install "\$FRONTEND_SYSTEM_TGZ"
EOF
