{pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/1e3deb3d8a86a870d925760db1a5adecc64d329d.tar.gz") {}}:
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [bun];
}
