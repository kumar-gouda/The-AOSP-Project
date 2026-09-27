#!/usr/bin/env bash
# ==============================================================================
# verify_env.sh - Phase 0 Basecamp Environment Verification Gate
# ==============================================================================

set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

check_cmd() {
  local cmd="$1"
  local desc="$2"
  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver="$("$cmd" --version 2>&1 | head -n 1)"
    echo -e "  [${GREEN}OK${NC}] $desc ($cmd): $ver"
  else
    echo -e "  [${RED}MISSING${NC}] $desc ($cmd) is NOT installed in PATH."
    ((ERRORS++))
  fi
}

echo "=============================================================================="
echo " Phase 0: Basecamp Environment Verification Gate"
echo "=============================================================================="

echo "Checking core AOSP CLI tools..."
check_cmd "git" "Git version control"
check_cmd "python3" "Python 3 runtime"
check_cmd "repo" "AOSP Repo tool"
check_cmd "adb" "Android Debug Bridge"
check_cmd "fastboot" "Android Fastboot utility"
check_cmd "java" "OpenJDK Java runtime (Java 17 recommended for modern AOSP)"
check_cmd "cmake" "CMake build system"
check_cmd "ninja" "Ninja build tool"

echo ""
echo "Checking system resources..."
if [[ -f /proc/meminfo ]]; then
  TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
  TOTAL_RAM_GB=$((TOTAL_RAM_KB / 1024 / 1024))
  if [[ $TOTAL_RAM_GB -ge 32 ]]; then
    echo -e "  [${GREEN}OK${NC}] RAM: ${TOTAL_RAM_GB} GB (Meets >= 32GB recommended for full AOSP build)"
  elif [[ $TOTAL_RAM_GB -ge 16 ]]; then
    echo -e "  [${YELLOW}WARN${NC}] RAM: ${TOTAL_RAM_GB} GB (Minimum 16GB, recommended 32GB+)"
  else
    echo -e "  [${RED}FAIL${NC}] RAM: ${TOTAL_RAM_GB} GB (Less than 16GB, AOSP builds will OOM)"
  fi
fi

echo "=============================================================================="
if [[ $ERRORS -eq 0 ]]; then
  echo -e "${GREEN}All required tools installed! Basecamp gate PASSED.${NC}"
  exit 0
else
  echo -e "${RED}Total missing dependencies: $ERRORS. Please install them before proceeding.${NC}"
  exit 1
fi
