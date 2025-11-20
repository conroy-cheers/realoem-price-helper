{
  self',
  pkgs,
}:
{
  default = pkgs.mkShell {
    packages = with pkgs; [
      nodejs
      rsync
    ];

    shellHook = ''
      mkdir -p node_modules
      rsync -a \
        "$npmDeps/node_modules/" \
        node_modules/
      chmod -R u+w .plasmo
      chmod -R u+w node_modules
    '';

    inherit (self'.packages.realoem-price-helper) npmDeps;
  };
}
