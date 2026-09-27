#!/usr/bin/env bash
# ==============================================================================
# unpack_images.sh - Phase 11: Android Image Analysis & Partition Unpacking
# ==============================================================================

set -euo pipefail

IMAGE_DIR="${1:-./images}"

echo "=============================================================================="
echo " Phase 11: Real Device Partition Analysis"
echo " Target Image Directory: $IMAGE_DIR"
echo "=============================================================================="

if [[ ! -d "$IMAGE_DIR" ]]; then
  echo "Image directory $IMAGE_DIR does not exist."
  echo "Place raw super.img or boot.img here to analyze."
  exit 0
fi

if [[ -f "$IMAGE_DIR/super.img" ]]; then
  echo "Converting sparse super.img to raw if needed..."
  if command -v simg2img >/dev/null 2>&1; then
    simg2img "$IMAGE_DIR/super.img" "$IMAGE_DIR/super.raw.img" || cp "$IMAGE_DIR/super.img" "$IMAGE_DIR/super.raw.img"
  fi

  if command -v lpunpack >/dev/null 2>&1; then
    echo "Unpacking dynamic partitions using lpunpack..."
    mkdir -p "$IMAGE_DIR/unpacked"
    lpunpack "$IMAGE_DIR/super.raw.img" "$IMAGE_DIR/unpacked/"
    echo "Dynamic partitions extracted:"
    ls -lh "$IMAGE_DIR/unpacked"
  fi
fi

if [[ -f "$IMAGE_DIR/boot.img" && command -v avbtool >/dev/null 2>&1 ]]; then
  echo "Inspecting AVB footer on boot.img..."
  avbtool info_image --image "$IMAGE_DIR/boot.img"
fi

echo "Done."
