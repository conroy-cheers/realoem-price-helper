{
  inputs',
  lib,
  stdenv,
  importNpmLock,
  nodePackages,
  pkg-config,
  vips,
  zip,
}:
let
  packageJSON = lib.importJSON ../package.json;
  pname = packageJSON.name;
  version = packageJSON.version;

  # Cleaned sources from this repository
  src = lib.fileset.toSource {
    root = ../.;
    fileset = lib.fileset.difference ../. (
      lib.fileset.unions [
        ../flake.nix
        ../flake.lock
        ./.
      ]
    );
  };

  npmDeps = importNpmLock.buildNodeModules {
    npmRoot = ../.;
    inherit (nodePackages) nodejs;

    derivationArgs = {
      env.SHARP_FORCE_GLOBAL_LIBVIPS = "1";
      nativeBuildInputs = [
        vips
        pkg-config
      ];
    };
  };
in
stdenv.mkDerivation (finalAttrs: {
  inherit pname version;

  inherit src;
  sourceRoot = "${finalAttrs.src.name}";

  inherit npmDeps;

  nativeBuildInputs = [
    nodePackages.npm
    zip
  ];

  buildPhase = ''
    cp -rp "$npmDeps/node_modules" .
    chmod -R u+w node_modules/@plasmohq/parcel-config
    npm run build
  '';

  installPhase = ''
    mkdir -p $out
    cp -rp build/chrome-mv3-prod/* $out
  '';
})
