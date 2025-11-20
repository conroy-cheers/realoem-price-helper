{
  description = "Browser extension for parts shopping via RealOEM";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        # To import an internal flake module: ./other.nix
        # To import an external flake module:
        #   1. Add foo to inputs
        #   2. Add foo as a parameter to the outputs function
        #   3. Add here: foo.flakeModule
      ];
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      perSystem =
        {
          config,
          self',
          inputs',
          pkgs,
          system,
          ...
        }:
        let
          realoem-price-helper = pkgs.callPackage ./nix/realoem-price-helper.nix { inherit inputs'; };
        in
        {
          packages = {
            inherit realoem-price-helper;
            default = realoem-price-helper;
          };

          devShells = import ./nix/devshell.nix { inherit self' pkgs; };
        };
      flake = {
        passthru = {
          inherit inputs;
        };
      };
    };
}
