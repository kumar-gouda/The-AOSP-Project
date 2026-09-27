# AOSP Mastery Companion Workspace (`spine-starter/`)

Welcome to the hands-on engineering companion workspace for the **AOSP Mastery** curriculum.

Each directory in this folder corresponds directly to the official learning phases and their respective spine artifacts. Every directory includes build definitions (`CMakeLists.txt`, `Makefile`, or `Android.bp`), unit tests, and structured starter code with `// TODO:` markers indicating exactly what logic you need to write.

---

## Workspace Map

| Phase | Directory | Artifact Name | Focus Area & Tech Stack |
| :--- | :--- | :--- | :--- |
| **Phase -1** | `00-cpp17-lib/` | `spine/00-cpp17-lib` | C++17 RAII, templates, move semantics, smart pointers (`std::unique_ptr`, `std::shared_ptr`), GTest |
| **Phase -1** | `00-abi-probe/` | `spine/00-abi-probe` | Systems-C, `container_of`, `volatile`, struct alignment, endianness, ABI probing |
| **Phase 0** | `00-cli/` | `spine/00-cli` | Environment verification script (Repo, Java 17, ADB, Fastboot, RAM/Disk checks) |
| **Phase 1** | `01-ipc/` | `spine/01-ipc` | POSIX shared memory (`shm_open`, `mmap`) & semaphores across processes |
| **Phase 2** | `02-instrumentation/` | `spine/02-instrumentation` | AOSP Soong build system, `Android.bp`, AddressSanitizer (ASan) & UBSan flags |
| **Phase 3** | `03-init-service/` | `spine/03-init-service` | Android Init language (`.rc`), process state transitions, triggers, Linux capabilities |
| **Phase 4** | `04-gki/` | `spine/04-gki` | Generic Kernel Image (GKI), KMI symbol preservation (`Module.symvers`), ABI compliance |
| **Phase 5** | `05-ndk-daemon/` | `spine/05-ndk-daemon` | Modern Native daemons in C++ (`libbinder_ndk`) and Rust (`android_logger`, cxx) |
| **Phase 6** | `06-aidl-hal/` | `spine/06-aidl-hal` | AIDL HAL interface definition, `BnCustomDevice` implementation, Soong `aidl_interface` |
| **Phase 7** | `07-systemservice/` | `spine/07-systemservice` | Framework System Service (`CustomManagerService.java`), binder permissions enforcement |
| **Phase 8** | `08-selinux/` | `spine/08-selinux` | SELinux policy rules (`.te`), file labeling (`file_contexts`), macro expansion, CTS compliance |
| **Phase 9** | `09-seeded-bug/` | `spine/09-seeded-bug` | Debugging use-after-free, race conditions, ASan triage, core dump symbolication |
| **Phase 10** | `10-kmod/` | `spine/10-kmod` | Out-of-tree Linux kernel loadable module (`miscdevice`, memory barriers, spinlocks) |
| **Phase 10.5** | `10.5-driver/` | `spine/10.5-driver` | Linux platform driver, Device Tree (`of_match_table`), sysfs attributes, mutex locking |
| **Phase 11** | `11-image-analysis/` | `spine/11-image-analysis` | Partition unpacking (`super.img`, dynamic partitions), AVB vbmeta hash verification |
| **Phase 12** | `12-pixel/` | `spine/12-pixel` | Pixel bring-up workshop templates (`device.mk`, `BoardConfig.mk`, proprietary blobs) |
| **Phase 13** | `13-hardening/` | `spine/13-hardening` | Hardened compile profiles: Clang CFI, SafeStack, Fortify Source, seccomp-bpf filters |
| **Phase 14** | `14-patch-series/` | `spine/14-patch-series` | Gerrit commit hooks (`Change-Id`), formatting guidelines, multi-commit review chains |
| **Phase 15** | `15-full/` | `spine/15-full` | Capstone End-to-End Vertical Slice: Driver $\rightarrow$ HAL $\rightarrow$ Service $\rightarrow$ SELinux $\rightarrow$ CTS |

---

## How to Test and Verify

Run the automated verification script from this directory:

```bash
# Verify environment and dry-run syntax checks across all modules
bash verify_all.sh --dry-run

# Run full checks on a specific phase
bash verify_all.sh --phase 00-cpp17-lib
bash verify_all.sh --phase 00-abi-probe
bash verify_all.sh --phase 09-seeded-bug
```

For C++ modules using CMake locally:
```bash
cd 00-cpp17-lib
mkdir -p build && cd build
cmake ..
make
ctest --output-on-failure
```
