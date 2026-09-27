#!/usr/bin/env bash
# ==============================================================================
# verify_all.sh - Automated Verification Suite for spine-starter
# ==============================================================================
# Usage:
#   bash verify_all.sh                 # Verify all workspaces
#   bash verify_all.sh --dry-run       # Check file integrity and syntax only
#   bash verify_all.sh --phase <name>  # Test specific phase (e.g. 00-cpp17-lib)
# ==============================================================================

set -u

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PHASE_FILTER=""
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --phase)
      PHASE_FILTER="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--phase <phase-dir>]"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOTAL=0
PASSED=0
FAILED=0

log_pass() {
  echo -e "  [${GREEN}PASS${NC}] $1"
  ((PASSED++))
  ((TOTAL++))
}

log_fail() {
  echo -e "  [${RED}FAIL${NC}] $1: $2"
  ((FAILED++))
  ((TOTAL++))
}

log_info() {
  echo -e "${BLUE}==>${NC} $1"
}

check_file_exists() {
  local file="$1"
  if [[ -f "$SCRIPT_DIR/$file" ]]; then
    log_pass "File exists: $file"
  else
    log_fail "Missing file" "$file"
  fi
}

echo "=============================================================================="
echo " AOSP Mastery - Companion Workspace Verification"
echo "=============================================================================="

# 1. Structural Verification across all 18 modules
log_info "Step 1: Checking workspace directory structure and critical files..."

MODULES=(
  "00-cpp17-lib/CMakeLists.txt"
  "00-cpp17-lib/include/ring_buffer.hpp"
  "00-cpp17-lib/tests/test_ring_buffer.cpp"
  "00-abi-probe/Makefile"
  "00-abi-probe/abi_probe.c"
  "00-cli/verify_env.sh"
  "01-ipc/Android.bp"
  "01-ipc/shm_producer.c"
  "01-ipc/shm_consumer.c"
  "02-instrumentation/Android.bp"
  "03-init-service/my_daemon.rc"
  "04-gki/verify_gki.sh"
  "04-gki/gki_abi_checker.py"
  "05-ndk-daemon/Android.bp"
  "05-ndk-daemon/cpp_daemon/main.cpp"
  "05-ndk-daemon/rust_daemon/Cargo.toml"
  "06-aidl-hal/Android.bp"
  "06-aidl-hal/aidl/android/hardware/custom/ICustomDevice.aidl"
  "07-systemservice/aidl/android/os/ICustomManager.aidl"
  "07-systemservice/java/com/android/server/CustomManagerService.java"
  "08-selinux/my_daemon.te"
  "08-selinux/file_contexts"
  "09-seeded-bug/Makefile"
  "09-seeded-bug/src/uaf_target.cpp"
  "10-kmod/Makefile"
  "10-kmod/hello_kmod.c"
  "10.5-driver/Makefile"
  "10.5-driver/gpio_sensor_driver.c"
  "11-image-analysis/unpack_images.sh"
  "12-pixel/device.mk"
  "12-pixel/BoardConfig.mk"
  "13-hardening/Android.bp"
  "14-patch-series/commit-template.txt"
  "15-full/README.md"
)

for m in "${MODULES[@]}"; do
  if [[ -n "$PHASE_FILTER" ]]; then
    if [[ "$m" == *"$PHASE_FILTER"* ]]; then
      check_file_exists "$m"
    fi
  else
    check_file_exists "$m"
  fi
done

# 2. Syntax & Compilation Checks (if compilers available and not dry-run)
if [[ $DRY_RUN -eq 0 ]]; then
  log_info "Step 2: Checking compilers and toolchains..."

  # Check C compiler
  if command -v gcc >/dev/null 2>&1 || command -v clang >/dev/null 2>&1; then
    CC="$(command -v clang || command -v gcc)"
    echo "  Found C compiler: $CC"
    
    # Check 00-abi-probe
    if [[ -z "$PHASE_FILTER" || "$PHASE_FILTER" == *"00-abi-probe"* ]]; then
      log_info "Compiling 00-abi-probe/abi_probe.c..."
      if $CC -Wall -Wextra -std=c11 "$SCRIPT_DIR/00-abi-probe/abi_probe.c" -o "$SCRIPT_DIR/00-abi-probe/abi_probe.out" 2>/dev/null; then
        log_pass "00-abi-probe compiled cleanly"
        rm -f "$SCRIPT_DIR/00-abi-probe/abi_probe.out"
      else
        log_fail "00-abi-probe" "Compilation error"
      fi
    fi
  else
    echo -e "  [${YELLOW}SKIP${NC}] No C compiler (gcc/clang) found in current shell. Skipping native builds."
  fi

  # Check Python syntax for 04-gki
  if command -v python3 >/dev/null 2>&1 || command -v python >/dev/null 2>&1; then
    PY="$(command -v python3 || command -v python)"
    if [[ -z "$PHASE_FILTER" || "$PHASE_FILTER" == *"04-gki"* ]]; then
      if $PY -m py_compile "$SCRIPT_DIR/04-gki/gki_abi_checker.py" 2>/dev/null; then
        log_pass "04-gki Python script syntax valid"
      else
        log_fail "04-gki" "Python syntax error"
      fi
    fi
  fi
fi

echo "=============================================================================="
echo -e " Summary: Passed: ${GREEN}$PASSED${NC}, Failed: ${RED}$FAILED${NC}, Total checks: $TOTAL"
echo "=============================================================================="

if [[ $FAILED -gt 0 ]]; then
  exit 1
fi
exit 0
