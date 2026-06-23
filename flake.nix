{
  description = "frontend-system — a soft/hard × light/dark token-driven Svelte design system";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      # The built library, packed as an npm tarball in the store. Consumers add it
      # as a dependency (see templates/consumer); the flake.lock pins it by hash.
      packages = forAllSystems (pkgs: rec {
        default = frontend-system;

        frontend-system = pkgs.buildNpmPackage {
          pname = "frontend-system";
          version = "0.3.3";
          src = ./.;

          # Recompute after lockfile changes: `nix run nixpkgs#prefetch-npm-deps -- package-lock.json`
          npmDepsHash = "sha256-eiqyeG0fBhEieqasjByNQfC/ID94GmSrRAYTGGYHxnQ=";

          # `npm run package` => svelte-kit sync && svelte-package && publint
          npmBuildScript = "package";

          # Output the built dist plus a `npm pack` tarball consumers can depend on.
          installPhase = ''
            runHook preInstall
            mkdir -p "$out"
            cp -r dist "$out/dist"
            cp package.json "$out/package.json"
            # npm pack needs a writable cache/HOME (the store deps cache is read-only).
            export HOME="$TMPDIR"
            npm pack --cache "$TMPDIR/.npm" --pack-destination "$out"
            ln -s "$out"/wl-frontend-system-*.tgz "$out/frontend-system.tgz" || true
            runHook postInstall
          '';
        };
      });

      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [ pkgs.nodejs_22 ];
          shellHook = ''
            echo "frontend-system dev shell — node $(node --version)"
          '';
        };
      });

      templates.consumer = {
        path = ./templates/consumer;
        description = "A Svelte + Vite project pre-wired to consume @wl/frontend-system";
      };

      formatter = forAllSystems (pkgs: pkgs.nixpkgs-fmt);
    };
}
