{
  description = "App consuming @wl/frontend-system";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # Pinned by flake.lock. Swap to a tag/commit for a stable pin.
    frontend-system.url = "github:WilsonLessley14/frontend-system";
  };

  outputs = { self, nixpkgs, frontend-system }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (system: pkgs:
        let ds = frontend-system.packages.${system}.default;
        in {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_22 ];
            # The pinned design-system tarball. Install it into this project with:
            #   npm install "$FRONTEND_SYSTEM_TGZ"
            FRONTEND_SYSTEM_TGZ = "${ds}/frontend-system.tgz";
            shellHook = ''
              echo "design system tarball → $FRONTEND_SYSTEM_TGZ"
              echo "first-time setup:  npm install && npm install \"$FRONTEND_SYSTEM_TGZ\""
            '';
          };
        });
    };
}
