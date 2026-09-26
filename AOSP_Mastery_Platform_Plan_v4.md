# AOSP MASTERY — Platform & Curriculum Plan v4

**A Learning Platform, Not a Documentation Site**

From C++17 and systems fundamentals to production-grade AOSP, kernel, and real-device development.

Version 4 — July 2026
Supersedes v3. Every external fact in this plan is either **verified** against `source.android.com` (with a Source citation in §2) or explicitly labeled `[VERIFY]`. No version number is asserted from memory. See Section 12 for how to re-verify and §19 for the audit log.

> **Audit status.** This plan was audited line-by-line against live `source.android.com` pages (see §19). Unverified claims carried over from v3 were either corrected or downgraded to `[VERIFY]`.
>
> **v3 is retired.** `AOSP_Mastery_Platform_Plan_v3.md` was deleted because v4 fully supersedes it and every v3→v4 correction is recorded in §19. (A `v3.docx` given to the project owner was left untouched — it is not part of this repo's tracked work.)
>
> **Runs locally, out of the box.** The platform is a Docusaurus static site. It runs on the owner's machine and opens in Chrome or Firefox with no special flags — see §20.

---

## 0. How to Read This Plan (and Why v4 Exists)

### 0.1 What changed from v3 and why

v3 was a good *shape* built on *assumed* facts. v4 keeps the pedagogy and fixes the facts. The changes are not cosmetic — several v3 instructions would have failed on the learner's first attempt.

| # | v3 said | Reality (verified) | v4 fix |
|---|---------|--------------------|--------|
| 1 | Learner "already knows C, C++" | Target learner knows Java/Kotlin/Python + *C++ basics only* | New **Phase −1** teaches C++17 and systems-C from scratch (§4.6) |
| 2 | "Provision a Linux machine to spec" | AOSP build needs **≥400 GB disk, ≥64 GB RAM** | Hard numbers + a self-check script in Phase 0 (§5) |
| 3 | `lunch aosp_<codename>-trunk_staging-userdebug` | That target string is **outdated**; modern form is `aosp_<name>-aosp_current-userdebug` | Corrected, cited commands (§6) |
| 4 | Sync `aosp-main` / `android-latest-release` loosely | Google recommends **`android-latest-release`**; current is **`android17-release`** | Pinned, with a refresh policy (§6, §12) |
| 5 | Cuttlefish setup "free, boots in minutes" | Real install flow documented (`android-cuttlefish`, KVM groups, `launch_cvd`) | Exact, copy-pasteable flow (§6) |
| 6 | No mention of read-only tree | **Android 17+ tree is read-only during build** | Flagged as a known gotcha (§11) |
| 7 | No testing track | Learner's stated goal is "development **and testing**" | New woven **Testing Thread** (§4.7) |
| 8 | 16 disjoint exercises | No single throughline | New **Project Spine**: one feature, 18 artifacts (§4.8) |
| 9 | XP/tiers never quantified | Gamification was decorative | Explicit **XP economy** (§4.9) |

### 0.2 The five principles v4 is built on

1. **Evidence over assumption.** Every external fact is cited to `source.android.com` or an official Google repository. Unverified claims are labeled `[VERIFY]` rather than stated as fact.
2. **Modularity.** Curriculum, units, and platform code are separate layers with defined interfaces (§3, §8). A unit can be rewritten without touching the platform; a platform theme can change without touching content.
3. **Reusability.** A single *unit template* (§4.5) and a single *component library* (§8.3) are reused across all 18 phases. Nothing is hand-built twice.
4. **Modern stack.** Current stable toolchain and hosting, with versions pinned and a scheduled refresh path (§12).
5. **Learner-glue first.** The plan is optimized so a solo beginner can proceed *without stalling* — explicit prerequisites, explicit failure modes ("Break It"), and explicit "if you're stuck here, go here" gates.

---

## 1. Executive Summary

AOSP Mastery is a free, gamified, project-based learning platform that takes a developer who knows Java, Kotlin, Python, and little C++ — but no systems programming or Android internals — to production-grade AOSP, kernel, and real-device competence.

- It ships as a **static site on GitHub Pages** (Docusaurus + GitHub Actions). No hosted build backend; the platform serves content, the learner supplies compute.
- The **Core Path (16 of 18 phases)** is achievable entirely on the free **Cuttlefish** virtual device and earns up to **Architect** tier.
- An **elective Real Device Track** adds Pixel bring-up for **Master** tier.
- **New in v4:** a foundation phase for **C++17 + systems-C**, a woven **testing thread**, a single **Project Spine** throughline, an explicit **XP economy**, and a documented **refresh pipeline** so the plan doesn't rot.
- **New in this revision:** a concrete, verifiable **certification & assessment design** (§21) and a step-by-step **local run + browser guide** (§20), so the site is reproducible on the owner's own machine.

> **Honest scope statement.** No one "masters all of AOSP" in a year — it is tens of millions of lines across dozens of subsystems. The realistic, defensible goal is: *end-to-end fluency across the full stack, deep competence in one or two subsystems (kernel and HAL), and the ability to ship a reviewed, tested, full-stack change.* v4 states this plainly instead of promising "complete."

---

## 2. Verification Table (all external facts, with sources)

| Fact | Value used in v4 | Source |
|------|------------------|--------|
| Current release branch | `android17-release` (Android 17, API 37) | source.android.com/docs/setup/reference/build-numbers |
| Recommended sync branch | `android-latest-release` | source.android.com/docs/setup/contribute/release-lifecycle |
| Current GKI release train | `android17-6.18` (kernel 6.18) | source.android.com/docs/core/architecture/kernel/gki-release-builds |
| Current API level | API 37 (Android 17) | source.android.com/docs/setup/reference/build-numbers |
| Minimum disk | **400 GB** (250 checkout + 150 build) | source.android.com/docs/setup/start/requirements |
| Minimum RAM | **64 GB** | source.android.com/docs/setup/start/requirements |
| Host OS | 64-bit Linux, glibc ≥ 2.17 | source.android.com/docs/setup/start/requirements |
| Repo launcher | ≥ 2.4 (current 2.45+) | source.android.com/docs/setup/start/requirements |
| Build target format | `product_name-release_config-build_variant` e.g. `aosp_cf_x86_64_only_phone-aosp_current-userdebug` | source.android.com/docs/setup/build/building |
| Pixel build target example | `aosp_husky` (Pixel 8 Pro) | source.android.com/docs/setup/build/building |
| Cuttlefish CI build target | `aosp_cf_x86_64_only_phone` (x86_64) / `aosp_cf_arm64_only_phone` (arm64) | source.android.com/docs/devices/cuttlefish/get-started |
| Cuttlefish image artifact | `aosp_cf_x86_64_phone-img-XXXXXX.zip` / `aosp_cf_arm64_only_phone-XXXXXX.zip` (note: x86_64 artifact omits `_only`) | source.android.com/docs/devices/cuttlefish/get-started |
| Cuttlefish launch | `HOME=$PWD ./bin/launch_cvd --daemon`, WebRTC at `https://localhost:8443` | source.android.com/docs/devices/cuttlefish/get-started |
| Cuttlefish host install | clone `github.com/google/android-cuttlefish`, `tools/buildutils/build_packages.sh` | source.android.com/docs/devices/cuttlefish/get-started |
| GPU/devices (no hardware track) | Cuttlefish uses virtio-gpu / software rendering `[VERIFY specifics]` | (architectural; not in the cited pages) |
| Flash/unlock | `fastboot flashing unlock`, `fastboot flashall -w` | source.android.com/docs/setup/build/running |
| GKI | Single kernel binary + loadable vendor modules, stable KMI, built from ACK | source.android.com/docs/core/architecture/kernel/generic-kernel-image |
| Read-only tree | Android 17+ source tree is read-only during build; override with `BUILD_BROKEN_SRC_DIR_IS_WRITABLE=true` | source.android.com/docs/setup/build/building |
| Rust in AOSP | First-class, documented module/binary/library/test/fuzzer support | source.android.com/docs/setup/build/rust |
| Prebuilt toolchain | OpenJDK, Make, Python 3 ship prebuilt in the latest tree | source.android.com/docs/setup/start/requirements |

> **Note on `[VERIFY]` items.** Where v4 needs a specific third-party version (e.g. a Docusaurus release) that was not confirmed from Google's docs, it is marked `[VERIFY]` inline and listed in Section 12's refresh checklist. A claim marked `[VERIFY]` is **not a fact** — treat it as "confirm this before relying on it."

---

## 3. Audience, Goals, and Non-Goals

### 3.1 Who this is for (updated for v4)

- You know **Java, Kotlin, Python**, and **basic C++**, with **no** systems-programming or Android-internals background.
- You want **structure and momentum**, not a reference manual you assemble yourself.
- You are willing to run builds on your own machine/VM.

### 3.2 End-state: what a graduate can do

- Build and boot AOSP for Cuttlefish from a clean checkout, unaided.
- Build the **GKI** kernel with Kleaf and boot it; write, load, and debug a kernel module.
- Write an **AIDL HAL**, wire it through **Binder** to a framework service, expose an app API.
- Diagnose a real crash/ANR/jank using on-device tools (tombstones, Perfetto, ftrace).
- Write an **SELinux** policy that runs cleanly under enforcing.
- **Test** at every layer (GTest, `atest`, VTS, kselftest) — the thread the learner explicitly asked for.
- Ship a documented, tested, full-stack **patch series** on a public fork.

### 3.3 Non-goals (unchanged intent, tightened wording)

- Not a general Linux-kernel-internals course — only what AOSP needs.
- Not arbitrary-device porting — officially supported Pixel hardware only.
- Not app development — Kotlin/Java app skills are assumed.
- Not GPU-driver or camera-ISP internals — architectural overview only.
- Not a hosted build backend.

---

## 4. Instructional Design Model

### 4.1 The core loop: **Do → Why → Prove**

Every unit opens with a real command before any explanation, and closes with a visible proof. (Kept from v3 — it is the strongest part of the plan.)

### 4.2 Just-in-time theory rule

- Theory never precedes the task that needs it.
- Any single explanation ≤ ~150 words.
- If it can't fit, it becomes its own hands-on unit.

### 4.3 Prerequisite gates (new in v4)

Before each phase, the learner answers a **5-item readiness checklist**. If ≥2 are red, the plan routes them to a named remedial unit rather than letting them stall. This directly addresses the #1 v3 failure mode: silent blockage.

### 4.4 The "Break It" evidence rule (hardened)

Every unit contains ≥1 deliberate failure. The failure must be **one the author actually hit**, captured verbatim, with **symptom → cause → fix**. No invented edge cases (carried from v3; now enforced by the production pipeline in §10).

### 4.5 The Learning Unit Template (the reusable contract)

> **This is the single most reusable artifact in the plan.** All 18 phases use it. Changing units means editing content, never structure.

```
UNIT <phase>.<index> — <TITLE>

HOOK            one line: why this matters, in plain stakes
OUTCOME         the single thing built by the end
PREREQUISITES   exact tools + versions; prior units assumed
DO THIS         numbered steps, exact commands, nothing abstract
OUTPUT          the real terminal/log output after each step
WHY IT WORKED   ≤150 words, tied to the step just run
BREAK IT        a real failure: symptom → cause → fix
CHECKPOINT      instant-feedback quick-check (not graded)
REWARD          XP delta + badge progress
NEXT MISSION    deep link into the skill tree
```

Each field maps to a **reusable MDX component** of the same name (§8.3), so the template is both a writing contract and a software interface.

### 4.6 The C++17 / systems-C foundation (new Phase −1)

Rationale: AOSP userspace is **C++17/C++20**, but the kernel is **C** in a distinct dialect (no STL, manual memory, kernel idioms). These are two separate competencies, and the learner has neither yet. Phase −1 teaches them **before** Phase 0.

- **Track A — C++17 for AOSP userspace** (~3–4 weeks): RAII, smart pointers (`unique_ptr`/`shared_ptr`), move semantics, `const` correctness, `optional`/`variant`/`string_view`, Android's `sp<>`/`wp<>`, error-as-return-value patterns (AOSP largely avoids exceptions in system code), Google C++ style, `clang-format`/`clang-tidy`, **GTest/GMock**.
- **Track B — systems-C for kernel work** (~2–3 weeks): pointers and pointer arithmetic, `volatile`, alignment, endianness, `container_of`, `ERR_PTR`/`IS_ERR`, kernel locking primitives, the compilation model (preprocess → link → ELF → ABI), `readelf`/`objdump`/`nm`, cross-compilation to aarch64.

### 4.7 The Testing Thread (new in v4 — this was nearly missing in v3)

Testing is a **woven skill**, not a single phase. It appears at every layer:

| Phase | Testing skill introduced |
|-------|--------------------------|
| −1 | GTest/GMock fundamentals |
| 1–3 | Unit tests for the small programs you write |
| 5 | `atest` basics; run one host test |
| 6 | Write a **VTS** test for your own HAL |
| 7 | System-side unit test (`atest` on a framework module) |
| 8 | SELinux test components via CTS |
| 10 / 10.5 | **kselftest**, **KUnit**, LTP subset |
| 13 | Trade Federation / `atest` internals; host-driven test module |
| 15 | **Capstone acceptance = passing a defined CTS/VTS subset** |

The Testing Thread is supported by the platform's `TestRunner` component (§8.3).

### 4.8 The Project Spine (new in v4)

v3's units were one-off exercises. v4 gives the learner **one continuous story**: a single custom device feature threaded from the top of the stack to the bottom, so every unit is "make the spine do X."

Suggested throughline (learner can substitute their own, but the default is a **custom sensor service**):

| Phase | Spine artifact |
|-------|----------------|
| −1 | A tested C++17 library (the seed of the feature) |
| 0 | Build a tiny CLI that will become a daemon |
| 1 | Multi-process producer/consumer over pipes + shared memory |
| 2 | An instrumentation-only AOSP change + boot on Cuttlefish |
| 3 | A custom `init.rc` service that starts the daemon |
| 4 | Patch + boot the GKI |
| 5 | NDK native daemon launched at first boot |
| 6 | An AIDL HAL for the daemon |
| 7 | A SystemService exposing the HAL to apps |
| 8 | SELinux policy so the service runs under enforcing |
| 9 | Seed a bug in the spine and diagnose it |
| 10 | Kernel module backing the daemon |
| 10.5 | A real char/IIO driver with a device-tree binding |
| 11–12 | (optional) run the spine on a real Pixel |
| 13 | Harden the spine: a Rust component, an APEX, CTS/VTS |
| 14 | Submit the spine as a reviewed patch series |
| 15 | The full spine, tested, on a public fork |

### 4.9 The XP Economy (new in v4 — makes gamification real)

| Action | XP |
|--------|----|
| Complete a unit | +40 |
| Complete a phase mastery check | +500 |
| Break-It exercise solved unaided | +25 |
| Capstone phase (15) | +2000 |
| Streak day | +10 (cap 100/week) |

| Tier | Requirement |
|------|-------------|
| Recruit | Phase 0 |
| Builder | Phases −1–3 |
| Engineer | Phases 4–9 |
| Architect | Phases 10–15 on Cuttlefish (Core Path complete) |
| Master | Architect **+** Real Device Track complete |

Badges remain skill-named ("IPC Apprentice," "Kernel Carpenter," "Real Hardware, First Boot"). Capstone links to a **public fork** so the credential is externally verifiable.

### 4.10 Engagement devices (kept, lightly reinforced)

One-line story hooks; "predict before you run"; deliberate failures; short "did you know" asides tied to real AOSP history.

---

## 5. Phase 0 Deep Specification (the anti-stall phase)

v3's biggest practical weakness: a beginner fails in Phase 0 and never returns. v4 makes Phase 0 a **verified, scriptable gate**.

### 5.1 Hardware/OS self-check (run before anything)

Paste into a shell; every line must pass:

```bash
# Host OS (need 64-bit Linux, glibc >= 2.17)
uname -m && ldd --version | head -n1

# Disk: need >= 400 GB free where you'll check out + build
df -h . | awk 'NR==2{print "Free on this mount: "$4}'

# RAM: need >= 64 GB
free -h | awk 'NR==2{print "Total RAM: "$2}'

# Virtualization (for Cuttlefish)
grep -c -w "vmx\|svm" /proc/cpuinfo      # must be nonzero
```

If any check fails, **stop here** — a 32 GB-RAM or 200 GB-disk machine cannot build modern AOSP. (This single gate prevents the most common dropout.)

### 5.2 Toolchain reality check (modern AOSP)

Per source.android.com, the latest tree **ships prebuilt OpenJDK, Make, and Python 3** — you do not hand-install them. You *do* install:

```bash
sudo apt-get update
sudo apt-get install git-core gnupg flex bison build-essential zip curl \
  zlib1g-dev libc6-dev-i386 x11proto-core-dev libx11-dev lib32z1-dev \
  libgl1-mesa-dev libxml2-utils xsltproc unzip fontconfig
sudo apt-get install repo           # launcher; verify >= 2.4
repo version
```

Cuttlefish host packages (source.android.com/docs/devices/cuttlefish/get-started):

```bash
sudo apt install -y git devscripts equivs config-package-dev debhelper-compat golang curl
git clone https://github.com/google/android-cuttlefish
cd android-cuttlefish
tools/buildutils/build_packages.sh
sudo dpkg -i ./cuttlefish-base_*_*64.deb || sudo apt-get install -f
sudo dpkg -i ./cuttlefish-user_*_*64.deb || sudo apt-get install -f
sudo usermod -aG kvm,cvdnetwork,render $USER
sudo reboot
```

### 5.3 Phase 0 mastery check

Given a feature description, the learner points to where in the tree it lives (`frameworks/`, `system/`, `hardware/`, `device/`, `kernel/`, `packages/`), using `cs.android.com` (Android Code Search) — no hints.

---

## 6. Curriculum Map

**18 phases** (v3 had 16). Two added: **Phase −1** (foundation) and **Phase 10.5** (real kernel driver work). Phase 11 is now **Core**; only **Phase 12** is master-tier. CTS/VTS acceptance moved into **Phase 15**.

### 6.1 Phase overview

| Phase | Mission | Focus | Est. time | Track |
|-------|---------|-------|-----------|-------|
| −1 | Foundation | C++17 + systems-C from scratch; GTest basics | 5–7 wk | Core |
| 0 | Basecamp | Env + tree tour + vocabulary primer (verified gate, §5) | 3–5 d | Core |
| 1 | Systems Foundations | memory model, syscalls, IPC, cross-compilation, git/repo | 2–3 wk | Core |
| 2 | Build System | repo/manifest, Soong/Blueprint, Kati, Ninja, first Cuttlefish boot | 2 wk | Core |
| 3 | Boot & Init | bootloader → boot image → init → zygote → system_server | 1 wk | Core |
| 4 | Kernel Foundations | GKI build via Kleaf, boot on Cuttlefish, read the Binder driver | 1.5 wk | Core |
| 5 | Native Userspace & Runtime | Bionic, NDK, Zygote fork model, ART basics, **`atest` basics** | 3 wk | Core |
| 6 | HAL, Treble & Binder | AIDL HALs, VINTF, Binder transactions, **VTS for your HAL** | 2–3 wk | Core |
| 7 | Framework Layer | system_server, SystemService pattern, app-facing AIDL | 2 wk | Core |
| 8 | Security Model | SELinux policy/contexts, permissions, Keystore, Verified Boot | 1–2 wk | Core |
| 9 | Debugging & Performance | adb, tombstones, Perfetto, ftrace, seeded-bug diagnosis | 1–2 wk | Core |
| 10 | Kernel Mastery | custom module, `/proc` interface, kernel debugging | 2–3 wk | Core |
| 10.5 | Kernel Subsystems & Drivers | real char/IIO driver, DT binding, kselftest/KUnit | 3 wk | Core |
| 11 | Real Device Fundamentals | Cuttlefish vs. hardware, partitions, Treble architecture | 1 wk | **Core** |
| 12 | Pixel Bring-Up Workshop | device tree, vendor binaries, build/flash/boot | 2–3 wk | **Elective — Master** |
| 13 | Production Readiness | Rust in AOSP, Mainline/APEX, graphics + Camera HAL overview | 2 wk | Core |
| 14 | Contribution Workflow | Gerrit flow, style, patch etiquette | 3–5 d | Core |
| 15 | Capstone | full-stack feature, tested against **CTS/VTS subset**, peer-reviewed | 3–4 wk | Core |

**Spiral labels (new):** concepts revisited on purpose are tagged, so "didn't we do this already?" reads as reinforcement:
- **Binder** appears in 1, 4, 6, 7 (spiral ×4)
- **Kernel** appears in 4, 10, 10.5 (spiral ×3)
- **SELinux/Verified Boot** appear in 0, 8 (spiral ×2)
- **ART/runtime** appears in 5, 9 (spiral ×2)

### 6.2 Corrected, cited commands (the v3 command fixes)

| Purpose | v3 (outdated) | v4 (verified) |
|---------|---------------|---------------|
| Sync | `repo init -b aosp-main` | `repo init -u https://android.googlesource.com/platform/manifest -b android-latest-release` |
| Cuttlefish target | `aosp_cf_x86_64_phone` | `aosp_cf_x86_64_only_phone` (x86_64) |
| Lunch string | `aosp_<codename>-trunk_staging-userdebug` | `aosp_<name>-aosp_current-userdebug` |
| Pixel target | `aosp_<codename>` | `aosp_husky` (Pixel 8 Pro) — pick per current supported device |
| Kernel build | "Kleaf/Bazel" (vague) | Kleaf via the ACK repo; see source.android.com/docs/setup/build/building-kernels |
| Flash | `fastboot flashall` | `fastboot flashing unlock` then `fastboot flashall -w` |

### 6.3 Phase details (expanded, with hooks)

**Phase −1 — Foundation** *(new)*
Hook: "The OS is written in a language you haven't met yet."
Delivers §4.6 (Track A + Track B) and the first GTest. Mastery check: a tested, memory-safe C++17 library plus a hand-written C program that prints its own ABI details via `objdump`.

**Phase 0 — Basecamp**
Hook: "Set up mission control before the first mission." (§5 spec.)
Mastery check: point to where a feature lives in the tree, from memory.

**Phase 1 — Systems Foundations** (spiral: Binder ×1)
Hook: "Learn the language the whole OS speaks."
Do: fork/exec; shared-memory producer/consumer; ARM cross-compile + `strace`. **Add: unit-test one of them.**
Mastery check: ship the multi-process, cross-compiled program, verified with real `strace`.

**Phase 2 — Build System**
Hook: "Learn to drive before you learn the engine."
Do: `repo sync`; first `lunch` + `m`; edit a `.bp`; incremental rebuild; boot on Cuttlefish using the §6.2 commands.
Mastery check: clean build + Cuttlefish boot, unaided.

**Phase 3 — Boot & Init**
Hook: "Follow the spark from power button to home screen."
Do: trace boot with `logcat` + `dmesg`; custom `init.rc` action; boot-time property.
Mastery check: narrate the boot chain against real log lines.

**Phase 4 — Kernel Foundations** (spiral: Kernel ×1, Binder ×2)
Hook: "Meet the thing everything else stands on — just enough to keep moving."
Do: build GKI with Kleaf, unmodified, boot on Cuttlefish; read the Binder driver's wait/wake pattern.
Mastery check: explain GKI and the KMI, and why a Pixel kernel isn't rebuilt per Android release.

**Phase 5 — Native Userspace & Runtime** (spiral: ART ×1)
Hook: "The invisible engine room."
Do: NDK native daemon launched at boot; trace Zygote fork; trace APK install; **run one `atest` host test.** **Add a 3-day Rust-literacy read-only unit** (enough not to be blocked by Rust files).
Mastery check: a native daemon that runs from first boot with no manual step.

**Phase 6 — HAL, Treble & Binder** (spiral: Binder ×3)
Hook: "Where hardware and software shake hands."
Do: minimal AIDL HAL + service-manager registration; native client call; Binder trace. **Write a VTS test for your own HAL.**
Mastery check: HAL callable end-to-end, returning a correct value, with a passing VTS test.

**Phase 7 — Framework Layer** (spiral: Binder ×4)
Hook: "Where 'Android the platform' actually lives."
Do: new SystemService; expose via AIDL; call from an app. **Add a system-side unit test.**
Mastery check: kernel/HAL work now callable as a normal Android API.

**Phase 8 — Security Model** (spiral: SELinux ×2)
Hook: "Lock it down like production."
Do: SELinux policy for the Phase 7 service; resolve a real audit denial. **Add the CTS SELinux test components.**
Mastery check: service runs cleanly under enforcing.

**Phase 9 — Debugging & Performance** (spiral: ART ×2)
Hook: "Every real engineer's real job."
Do: crash + symbolicate tombstone; Perfetto trace; find seeded jank. **Add: seed a bug into the Project Spine.**
Mastery check: diagnose three seeded bugs with on-device tools only.

**Phase 10 — Kernel Mastery** (spiral: Kernel ×2)
Hook: "Now that you've seen the whole stack, go back and own the bottom."
Do: hand-written module; `/proc` entry; kernel crash debug via `dmesg`/`ftrace`.
Mastery check: module produces a userspace-observable effect, diagnosed with kernel tools alone.

**Phase 10.5 — Kernel Subsystems & Drivers** *(new; spiral: Kernel ×3)*
Hook: "A module is 'Hello, World.' Now write a driver a real device would ship."
Do: a char/IIO driver with `read`/`write`/`ioctl`/`poll`; a device-tree binding (`.dts`) + matching probe; **kselftest and a KUnit test**; patch a real AOSP-common-kernel subsystem and boot it.
Mastery check: a driver bound via device tree, observable from userspace, covered by a passing kernel test.

**Phase 11 — Real Device Fundamentals** *(now Core)*
Hook: "Cuttlefish taught you the architecture. Now meet the hardware."
Do: Cuttlefish vs. Pixel (see §7.1); real partition layout; A/B slots and unlock semantics. **No hardware required** — learn from public factory images and docs.
Mastery check: given a device's image set, say what breaks if one is flashed to the wrong slot.

**Phase 12 — Pixel Bring-Up Workshop** *(elective — Master only)*
Hook: "Everything you built, now on hardware you can hold."
Do: locate `device/google/<codename>` + kernel sources; extract vendor binaries; `lunch aosp_husky-...`; `m`; `fastboot flashing unlock`; `fastboot flashall -w`; cherry-pick a change and reflash.
Mastery check: a self-built image boots on your own Pixel.
Caution: use a **secondary/used** device; unlock wipes data.

**Phase 13 — Production Readiness Extras** *(Rust is real — see §2)*
Hook: "The last 20% that makes it shippable."
Do: Rust in AOSP (official docs exist: module/binary/library/test/fuzzer); minimal APEX; graphics + Camera HAL overview; Trade Federation / host-driven test module.
Mastery check: given the capstone feature, identify which subsystems it touches in a real ship.

**Phase 14 — Contribution Workflow**
Hook: "Ship it like an AOSP engineer."
Do: format, upload, self-review a patch; Gerrit conventions; `cs.android.com` for orientation.
Mastery check: patch passes a real reviewer's checklist.

**Phase 15 — Capstone** *(acceptance now includes tests)*
Hook: "Prove it."
Do: thread one feature full-stack; **pass a defined CTS/VTS subset**; publish the patch series to your public fork; peer/mentor review.
Mastery check: graded against the Phase 0 competency doc by a reviewer — not self-graded; fork makes it verifiable.

---

## 7. Reference Tables (learner-facing)

### 7.1 Cuttlefish vs. Real Pixel

| Aspect | Cuttlefish | Real Pixel |
|--------|------------|------------|
| Backing | Virtual (crosvm/QEMU) | Physical SoC |
| HALs | Generic/reference, open | Vendor-signed blobs (radio, GPU, camera, DSP) |
| Boot chain | Virtual, no real bootloader | Real bootloader + fastboot, Verified Boot |
| GPU | Software / virtio-gpu | Proprietary driver |
| Radio | None | Real modem (`radio.img`) |
| Setup | Free, minutes | Own the device, unlock, flash |
| Risk | None | Possible bootloop if mis-flashed |
| Best for | Framework/service/kernel-logic | Camera/radio/sensors/power/thermal |

### 7.2 Partition & image reference

> `[VERIFY per cycle]` This table reflects a GKI-era Pixel image set. Confirm each row against a current factory image bundle (§12) before publishing Phase 11–12 content; partition layout can change between hardware generations.

| Image | Holds |
|-------|-------|
| `boot.img` | Generic kernel + boot ramdisk (GKI kernel) |
| `init_boot.img` | Generic ramdisk (split since GKI 2.0) |
| `vendor_boot.img` | Vendor ramdisk pieces (paired with generic boot) |
| `vendor_kernel_boot.img` | Vendor kernel modules / DTB (GKI devices) |
| `dtbo.img` / `dtb.img` | Device Tree Blob (Overlay) |
| `vbmeta*.img` | Verified Boot metadata/signatures per group |
| `super.img` | Dynamic container: system, vendor, product, system_ext, vendor_dlkm, system_dlkm |
| `userdata.img` | User data — wiped on unlock |
| `radio.img` | Modem/baseband |
| `bootloader.img` | Bootloader |
| `pvmfw.img` | Protected VM firmware (Android virtualization) |

### 7.3 "Device tree" — the two meanings

- Kernel DT (`.dts/.dtsi → dtbo/dtb.img`): hardware description compiled for the kernel.
- Community slang (`device/<vendor>/<codename>/`): the device-specific AOSP source directory a `lunch` target builds.

For a supported Pixel both already exist publicly; "searching" means locating/reading, "patching" means cherry-picking a small real change and rebuilding.

---

## 8. Platform & Technical Architecture (modular, reusable)

### 8.1 Principle: no hosted backend

Learners run their own compute; the platform ships as static files. This is what makes GitHub Pages viable and keeps infra cost ≈ 0.

### 8.2 Hosting & deployment

- **Docusaurus** static-site generator (requires Node ≥ 20; `npm run start` for dev, `npm run build`/`npm run serve` for local prod preview — see §20). `[VERIFY exact patch version at setup]`
- **GitHub Actions** CI: build + deploy on push to `main`.
- **`.nojekyll`** in `static/` — required on GitHub Pages so Jekyll doesn't strip `_`-prefixed assets (verified: docusaurus.io/docs/deployment).
- Optional **CNAME** custom domain.
- Live site serves the **current** Android version; older content lives in **tagged git branches**, not a second deployment.

### 8.3 Reusable component library (the DRY core)

One MDX component per unit-template field, defined once in `/src/components/` and imported everywhere. Adding a new phase = adding content, never new markup.

```tsx
// src/components/Unit.tsx  (contract sketch — reusability by design)
export const Hook        = ({children}) => <Callout tone="hook">{children}</Callout>;
export const Outcome     = ({children}) => <Callout tone="outcome">{children}</Callout>;
export const Prereqs     = ({items})    => <Checklist unfilled={items} />;
export const DoThis      = ({steps})    => <Steps items={steps} />;
export const OutputBlock = ({children}) => <Terminal>{children}</Terminal>;
export const WhyItWorked = ({children}) => <Callout tone="why" maxWords={150}>{children}</Callout>;
export const BreakIt     = ({items})    => <FailureList symptomCauseFix={items} />;
export const Checkpoint  = ({quiz})     => <Quiz instantFeedback data={quiz} />;      // client-side (implemented: instant right/wrong + explanation, legacy static form still supported)
export const Reward      = ({xp,badge}) => <XPDelta xp={xp} badge={badge} />;
export const NextMission = ({to})       => <SkillTreeDeepLink to={to} />;
export const TestRunner  = ({cmd,expect})=> <RunnableTab cmd={cmd} expect={expect} />; // Testing Thread (implemented: shows Command/Expected tabs + Copy; real Run only for browser-safe JS)
```

**Modularity rules:**
- Content is **data** (`MDX` + front-matter with `pinnedToolVersions`, `verifiedAgainst: "android17"`).
- Components are **presentation**; they never contain Android commands.
- The **competency map** (§9) is a single source of truth consumed by both the skill tree and the capstone grader.

### 8.4 Search

**Algolia DocSearch** (free for docs sites) `[VERIFY current application flow]`. 18 phases is too much to browse; search is core infra.

### 8.5 Progress & gamification (modular, offline-first)

- Default: **client-side** (`localStorage`/`IndexedDB`) — zero infra.
- **JSON export/import from day one** — the safety net against cleared storage.
- Optional cross-device sync via a **free-tier BaaS** (e.g. Supabase `[VERIFY free tier]`) called from the browser; the owner still hosts no server.
- **XP economy** from §4.9 lives here as data, not code.

### 8.6 Portable credentials

Capstone completion links to the learner's **public GitHub fork** (patch series + writeup). The badge points at the fork, so any employer can verify it without the platform. Full assessment mechanics, rubric, and the signature-verification layer are specified in **§21**.

### 8.7 Analytics

Privacy-respecting static analytics (Plausible/Simple Analytics `[VERIFY current]) via one script tag. Phase completion/drop-off comes from the opt-in sync layer; anonymous learners simply don't contribute (accepted tradeoff).

### 8.8 Community

GitHub Discussions + "stuck on this unit" Issue templates, feeding the pipeline's Break-It sections.

### 8.9 Versioning & anti-rot (this is what keeps the plan reliable)

- Content is tagged to the Android version it was verified against (`verifiedAgainst`).
- A **refresh pass** runs at each AOSP release window. The build-numbers table shows a roughly quarterly-to-semiannual release cadence (e.g. `24Q3`, `25Q2`, `25Q4`, `26Q2`); schedule the refresh to each published release, not to a fixed month.
- The refresh pass re-runs: the §5 self-check, the §6.2 command table, the §7.2 partition table, and the supported-Pixel list. See §12 for the checklist.

---

## 9. Competency Map (single source of truth)

A machine-readable competency map drives the skill tree, the XP logic, and capstone grading. Sketch:

```yaml
# content/competency-map.yaml  (excerpt)
- id: p1.ipc
  title: Process IPC
  proves: [ "pipes", "shared-memory", "signals" ]
  artifact: "spine/01-ipc"        # Project Spine link
  testing: "unit tested"
  masteredWhen: "strace shows the intended syscalls"
  tier: Builder
```

This file is the one place that defines "done"; everything else references it. Changing the curriculum means editing this file plus MDX — no platform code.

---

## 10. Content Production Pipeline

1. Define the unit's single mastery outcome (from the competency map).
2. Run it top-to-bottom on **real, current** AOSP source, and on **real hardware** for Phases 11–13.
3. Capture every real error **verbatim** for Break It.
4. Draft in minimal-theory style.
5. Lint against the style checklist (below).
6. Re-run from a **clean environment**; the written steps must reproduce exactly.
7. Tag to the current Android version and publish.

**Style rules:** code first; ≤150-word theory tied to the step; show real output, never paraphrase; one troubleshooting entry per *real* failure; active voice; short sentences.

---

## 11. Known Gotchas (v4 additions — each is a real failure mode)

| Gotcha | Why it bites | Fix |
|--------|--------------|-----|
| Under-spec machine | Build fails/OOM with <64 GB RAM / <400 GB disk | §5.1 gate before anything |
| Read-only source tree (Android 17+) | Build errors writing to the tree | `BUILD_BROKEN_SRC_DIR_IS_WRITABLE=true` (or the allowlist) |
| Outdated lunch target | `trunk_staging` strings no longer valid | Use `aosp_current` form (§6.2) |
| Vendor binaries missing | AOSP alone can't boot a Pixel | Run `extract-google_devices-*.sh` first (§6.3 P12) |
| Flashing wrong slot | Bootloop on GKI devices | Learn A/B + `boot.img`/`vendor_boot.img` pairing (P11/12) |
| Kernel C vs. userspace C++ confusion | Compiler errors, wrong idioms | Phase −1 teaches them as distinct (Track A/B) |
| `@`-in-path / shell quirks | Build/tooling breaks | Keep the tree at a plain path; avoid spaces |
| Algorithm/vendor branch drift | `repo sync` failures | Sync `android-latest-release`; pin content by tag |

---

## 12. Refresh Checklist (run every AOSP publish window)

- [ ] Confirm current release branch (expect `androidNN-release`) — build-numbers page.
- [ ] Re-run §5 hardware/OS self-check text against requirements page.
- [ ] Re-verify §6.2 command table (sync, lunch, kernel, flash).
- [ ] Re-verify §7.2 partition/image list against a current factory image.
- [ ] Update the supported-Pixel list; flag any sunset codename in Phase 12.
- [ ] Bump the `verifiedAgainst` field in all unit front-matter.
- [ ] Re-test the Cuttlefish install flow (§5.2).
- [ ] Re-run the local acceptance test (§20.8) in current Chrome and Firefox.
- [ ] Confirm Node ≥20 still satisfies Docusaurus, and note the current Active LTS line.
- [ ] `[VERIFY]` every third-party version noted below.

**Third-party items to re-verify each cycle** (marked `[VERIFY]` in text):
Docusaurus patch version, Algolia DocSearch onboarding, Supabase free tier, Plausible/Simple Analytics, any NDK version referenced, exact GitHub doc URLs for commit signing.

---

## 13. Build Roadmap (for building the platform itself)

18 learner phases change the calendar. Honest revised estimate: **~14–16 months** for the full Core Path (up from v3's ~11 months), because Phase −1 and Phase 10.5 are substantial.

| Stage | Timeframe | Deliverable |
|-------|-----------|-------------|
| 0 — Foundation + Phase −1 (public) | Months 1–2 | Competency map, component library, Docusaurus skeleton, Phase −1 live |
| 1 — Basecamp + Systems | Months 3–4 | Phases 0–1 live; Discussions on |
| 2 — Public Beta | Month 5 | 10–20 testers; unit template frozen |
| 3 — Build/Boot/Init | Months 6–7 | Phases 2–3 |
| 4 — Kernel Foundations, Runtime, HAL | Months 8–10 | Phases 4–6 (practitioner review) |
| 5 — Framework/Security/Debug | Months 11–12 | Phases 7–9 |
| 6 — Kernel Mastery + Drivers | Months 13–14 | Phases 10–10.5 (practitioner review) |
| 7 — Real Device (elective, movable) | Months 15–17 | Phases 11–12; independent of Stages 6 & 8 and may slip without blocking launch |
| 8 — Production/Contribution/Capstone | Months 15–16 | Phases 13–15, CTS/VTS acceptance, credential flow |
| Ongoing | Each AOSP release | §12 refresh checklist |

Stage 7 (elective) overlaps Stage 8 by design — it can be worked in parallel or deferred past launch.

---

## 14. Team & Resources

- One person can carry content + platform through beta.
- **Strongly recommended:** one practitioner reviewer for Phases 4, 6, 10, 10.5, 11–12 (subtle errors cost the most trust and can brick devices).
- One-time hardware: ≥1 supported Pixel for verification; a 2nd cheap Pixel de-risks Phase 12.
- Infra cost ≈ 0 (GitHub Pages, Algolia, Plausible free tiers `[VERIFY]`).
- Treat recruiting ≥1 collaborator as risk reduction given the 14–16-month span.

---

## 15. Success Metrics

- Completion rate per phase + drop-off location (opt-in).
- Page-level engagement (static analytics).
- Time-to-capstone; capstone first-attempt pass rate; peer-review completion.
- **Testing Thread adoption** (new): % of phases where the learner's tests pass.
- Real Device Track opt-in + Phase 12 success rate.
- 7/30-day return (streaks); Discussions/Issues clustering per unit.
- Where trackable: real AOSP contributions or AOSP-adjacent employment.

---

## 16. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep ("complete AOSP") | Capstone-driven scope; non-goals; competency map gates every module |
| Content rot (recurring Android releases) | §12 refresh checklist; `verifiedAgainst` tagging |
| Kernel/Binder errors | Practitioner review before publish (P4/6/10/10.5) |
| Learner stalls at pointer/ownership confusion | Phase −1; prerequisite gates (§4.3) |
| Kernel-C vs. userspace-C++ confusion | Phase −1 Track A/B taught explicitly |
| Env setup is the top support burden | §5 verified, scriptable gate; living FAQ |
| Hardware bricking | Supported Pixels only; secondary device; loud warnings |
| Static-only Pages | Client-side-first; external BaaS from browser |
| Progress loss | JSON export/import from MVP |
| Credential not trusted by third parties | Public-fork artifacts + signed commits (§21); reviewer-graded capstone |
| Site fails to run on a learner's machine | Verified Node ≥20 + `npm run start`/`serve` path, with a 4-step acceptance test (§20.8) |
| Solo burnout across 14–16 months | Stage-by-stage shipping; collaborator; "shipped and imperfect" |

---

## 17. Audience & Sustainability

### 17.1 Business model (default)
Core content free/open (MIT for code, CC-BY-SA for prose). Sustainability via **GitHub Sponsors** + an optional **paid cohort** where a mentor does the capstone review — monetizing the required human, not the content. Revisit with usage data.

### 17.2 Build in public
Open the repo and publish Stage 0 content immediately. Share at each milestone (r/AndroidDev, XDA, HN, Discords). A short build-log doubles as marketing + accountability.

### 17.3 Creator sustainability
The 14–16-month solo build is the biggest single risk. Phase 12's movable scheduling is deliberate relief. ≥1 experienced collaborator reduces both burnout and content-accuracy risk.

---

## 18. Immediate Next Steps

1. Decide the **Project Spine** feature (default: custom sensor service).
2. Write the **competency map** (`competency-map.yaml`) — the single source of truth. **Done:** `aosp-mastery-site/data/competency-map.yaml`, validated at build time and rendered at `/competency-map` (see §19.5).
3. Build the **component library** (§8.3) and freeze the unit template.
4. Stand up Docusaurus + Actions + Algolia + analytics + client-side progress (+ JSON export) + Discussions.
5. Write and **personally run** Phase −1 (the true prerequisite) end-to-end on a clean machine. **Drafted:** `docs/phase-minus-1-foundation.mdx` (Track A + Track B + mastery checks). **Still open:** the author-run capture — output blocks are marked "expected (author-run pending)" until executed on the reference Linux host, then promoted to verbatim transcripts.
6. Write Phase 0 as a scriptable gate (§5) and run it on a second machine. **Written:** full §5.1–§5.3 in `docs/phase-0-basecamp.mdx`. **Still open:** run it on a second machine to confirm the gate end-to-end.
7. Confirm the current supported-Pixel list before finalizing Phase 12.
8. Run the local acceptance test (§20.8) on the scaffolded site in Chrome **and** Firefox before writing content.
9. Freeze the capstone rubric (§21.3) and public-repo layout (§21.5) before building the credential flow.

---

## 19. Audit Log (what was checked, what was fixed)

This plan was audited by re-fetching every cited `source.android.com` page and checking each claim. Findings:

### 19.1 Verified correct (no change)

- Hardware: ≥400 GB disk (250 checkout + 150 build), ≥64 GB RAM, 64-bit Linux, glibc ≥2.17 — *requirements page*.
- Repo launcher ≥2.4 — *requirements page*.
- Build target format `product_name-release_config-build_variant`; example `aosp_cf_x86_64_only_phone-aosp_current-userdebug`; Pixel example `aosp_husky` (Pixel 8 Pro) — *building page*.
- Cuttlefish install flow, `HOME=$PWD ./bin/launch_cvd --daemon`, WebRTC `localhost:8443` — *cuttlefish get-started page*.
- Flash/unlock: `fastboot flashing unlock`, `fastboot flashall -w` — *running page*.
- GKI description (single binary + loadable vendor modules, stable KMI, built from ACK) — *GKI page*.
- GKI built with Kleaf/Bazel (`tools/bazel run //common:kernel_aarch64_dist`); `build.sh` is legacy — *building-kernels page*.
- Rust is first-class in AOSP with a built-in test framework — *Rust overview page*.
- Android 17 = API level 37 — *build-numbers page*.
- Android 17+ source tree is read-only during build; `BUILD_BROKEN_SRC_DIR_IS_WRITABLE=true` — *building page*.

### 19.2 Corrected during this audit

| ID | Issue | Fix |
|----|-------|-----|
| B1 | "Publishes twice a year (Q2/Q4)" presented as fact | Downgraded: cadence described from the build-numbers quarterly names, no fixed Q2/Q4 claim |
| B2 | Cuttlefish target vs. artifact naming ambiguity | Both forms now listed and differentiated (§2) |
| B3 | Typo `preciousToolVersions` | Renamed `pinnedToolVersions` (§8.3) |
| B4 | Redundant meta-text in §4.7 | Removed |
| B5 | §0.1 cross-ref pointed to "(§4)" | Corrected to "(§4.6)" |
| B6 | Roadmap stages 6/7/8 overlapped inconsistently | Resequenced; Stage 7 made explicitly parallel/deferrable |
| B7 | §7.2 partition table unverified | Flagged `[VERIFY per cycle]` |

### 19.3 Still `[VERIFY]` (not confirmable from Google docs — do not treat as fact)

- Docusaurus "native GitHub Pages support" and current major version.
- Algolia DocSearch eligibility + onboarding flow.
- Supabase free tier.
- Plausible / Simple Analytics current offering.
- Any NDK version number (none is asserted in this plan).
- Cuttlefish GPU stack specifics.

### 19.4 Claims deliberately *avoided* (would be hallucinations)

- No pinned Docusaurus/Algolia/Supabase/NDK version numbers.
- No pinned Android 17 *letter* codename (the docs' lunch output shows `Baklava`, which is not a stable public fact to assert).
- No claim that the Cuttlefish image zip and CI target share an identical name.
- No claim about third-party credential issuers (e.g. any "verified credential" vendor) — none was verified, so none is referenced. §21's certification design uses only GitHub-native, verifiable artifacts.

### 19.5 Repository housekeeping (this revision)

| Action | Reason |
|--------|--------|
| Deleted `AOSP_Mastery_Platform_Plan_v3.md` | v4 fully supersedes it; all corrections are recorded in §19. Keeping it would leave a file with known errors in-repo. |
| Left `AOSP_Mastery_Platform_Plan_v3.docx` untouched | It was supplied to the owner, not authored as part of this repo's work; not this plan's to delete. |
| Added §20 (local run) and §21 (certification) | Requested functionality; both grounded in verified facts (§20) or verified GitHub mechanisms (§21). |
| Scaffolded the site at `aosp-mastery-site/` | Docusaurus 3.10.2; `npm run build` verified clean on Node v24.14.0; `npm run start` served HTTP 200 at `localhost:3000`. Unit-component library (§8.3) implemented; `docs/intro` and `docs/phase-0-basecamp` built. `static/.nojekyll` confirmed present. |
| Added GitHub Actions deploy workflow | `aosp-mastery-site/.github/workflows/deploy.yml`. Action versions taken from the official `actions/starter-workflows` (checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3, deploy-pages@v5). Paths point at the `aosp-mastery-site/` subfolder; requires `package-lock.json` (present) for `npm ci`. |
| Added client-side progress layer (§8.5) | `src/components/Progress/` — localStorage state, XP, and JSON export/import. SSR-safe via `BrowserOnly` + post-mount load (avoids `localStorage` errors during static render). `CompleteButton` wired into Phase 0; `ProgressPanel` on the homepage. Production build verified clean; home/`docs/intro`/`docs/phase-0-basecamp` all served **HTTP 200**. |
| Wrote + wired the competency map (§9, §18 item 2) | `data/competency-map.yaml` — 18 phases, 22 competencies, 40 unique ids, all artifacts under `spine/`, all tiers valid. Parsed & **validated at build time** by `data/load-competency-map.mjs` (throws on duplicate ids, invalid tiers, or non-`spine/` artifacts — proven by an injected-error test). Exposed via `customFields` and rendered live at `/competency-map`. Production build clean; all four routes served **HTTP 200**. |
| Authored Phase −1 content (§4.6, §18 item 5) | `docs/phase-minus-1-foundation.mdx` — Track A (C++17) + Track B (systems-C) + the two mastery checks, using only the Unit components. Registered in `sidebars.js` (whose pre-existing UTF-8 mojibake was fixed). Output blocks are **labeled "expected (author-run pending)"** where not yet captured on a reference Linux host — content shows no fabricated output, per §10's real-output rule. Production build clean; all five routes served **HTTP 200**. |
| Built the `TestRunner` component (§8.3, §4.7) | `src/components/TestRunner/` — the Testing-Thread UI. Shows **Command** / **Expected output** tabs and a Copy button. **Honesty rule enforced:** a browser cannot run `gcc`/`atest`/`kselftest`, so it never claims to; a real **Run** button appears *only* when a snippet is browser-safe JavaScript. The Run path was verified end-to-end (its example prints exactly `all positive: true`). Wired into Phase −1 (A5) and highlighted in a tip. Build clean; routes **HTTP 200**. |
| Made `Checkpoint` an interactive quiz (§4.5, §8.3) | `src/components/Unit/index.js` — `Checkpoint` now renders an instant-feedback `Quiz` when given `quiz={{question, options, answer, explain}}`, and still supports the legacy static form (`question` + children). Picking an option highlights correct/wrong and shows the explanation; a **Try again** affordance resets. Not graded, nothing persisted — matches §4.5. Two quizzes added to Phase −1; all 8 options render as buttons with `aria-pressed`. Build clean; routes **HTTP 200**. |
| Expanded Phase 0 to the full §5 gate (§18 item 6) | `docs/phase-0-basecamp.mdx` — now covers §5.1 (hardware/OS self-check), §5.2 (host packages + **Cuttlefish host install** + reboot/groups warning), the `android-latest-release` checkout, the read-only-tree note, and §5.3 (the mastery check with the top-level directory table). Self-check, package, Cuttlefish, and sync blocks use `TestRunner`; two `Checkpoint` quizzes added. Fixed the old `NextMission` self-link. Build clean; all five routes **HTTP 200**. |
| Fixed `NextMission` to use Docusaurus `Link` (defect) | `src/components/Unit/index.js` — `NextMission` used a raw `<a href>`, so (a) client-side navigation was lost and (b) **Docusaurus's broken-link checker silently ignored every `NextMission` target**. After switching to `@docusaurus/Link`, the checker immediately surfaced a real dangling link (`/docs/phase-1-systems`, Phase 1 not yet written) — proving the fix works. Repointed that block to `/competency-map`; build now clean with **zero** broken links. Every future phase's next-link is now validated. |
| Added CI build gate (§18, locks in the link guarantee) | `.github/workflows/ci.yml` (+ `STRICT_LINKS` switch in `docusaurus.config.js`). Runs `npm ci`, a competency-map validation step, then a **strict** build. Key subtlety: `onBrokenLinks` is `warn` locally, so a plain build would pass on dangling links; the workflow sets `STRICT_LINKS=1` to turn them into errors. **Verified locally:** normal build = exit 0; build with an injected bad link + `STRICT_LINKS=1` = exit 1 (named the link); clean strict build = exit 0. `ci.yml` and `deploy.yml` both parse as valid YAML. Uses only stable `checkout@v4` / `setup-node@v4`. |
| Fixed `intro.md` mojibake (content defect) | `docs/intro.md` shipped with corrupted em-dash/arrow sequences (`U+00E2 U+2020 U+2019`, `U+00E2 U+20AC U+201D`) — e.g. "Phase 0 (mojibake)… Basecamp". Rewrote as ASCII (`->`, "Phase 0 - Basecamp"), aligned the Output row to the `TestRunner` block. Verified: **0** non-ASCII bytes, no mojibake markers. |
| Authored Phase 1 content (§6.3, content roadmap) | `docs/phase-1-systems.mdx` — Systems Foundations: memory layout, fork/exec, shared-memory producer/consumer, a first C test (Testing Thread), aarch64 cross-compile + QEMU, and `strace`. Registered in `sidebars.js`; Phase 0's NextMission now points here. Output blocks marked "expected (author-run pending)" — no fabricated output. A genuine MDX typo (`expect(` instead of `expect={\``) was **caught by the strict build** and fixed. Build clean; all six routes **HTTP 200**. |
| **Deep audit of all created files** (encoding, correctness, wiring) | Audited every created/modified file by **bytes**, not by screen. Findings fixed: (1) **Phase 1 test assertion was wrong** — `assert(strlen(s)==30)` but the string is **31** chars; the shipped output would have been a failing test. Fixed to `31`. (2) **Phase −1 snippets had missing includes** — A3 used `std::atoi`/`std::string` without `<cstdlib>`/`<string>`; A2 used `std::is_move_constructible_v` without `<type_traits>`. Made self-contained. (3) **Phase 0 `<Outcome>` was stale** vs the expanded page; rewrote it. (4) **`@docusaurus/faster` was a dead dependency** — never enabled; wired it as `future.faster: true` (the correct 3.10 key; `experimental_faster` is rejected). Build now ~8 s. (5) Cleaned messy navbar/footer indentation in the config. (6) Added a shm-cleanup note (`shm_unlink`) to Phase 1. (7) Cleaned a stray `U+FFFD` I had introduced in this very log. **Verified clean:** 0 mojibake bytes across the site (only intentional `— § © · …`); all component CSS classes resolve; Progress localStorage logic passes 5/5 (incl. corrupt-store handling); both workflows valid YAML; normal build warning-free; `docs:build` all 7 routes **HTTP 200**. **Latent defect documented (not fixed):** `useProgress` holds per-component state, so a `CompleteButton` and a `ProgressPanel` on the **same page** would not sync — they never coexist today, but it is a real future bug. |
| Authored Phase 2 content (§6.3, content roadmap) | `docs/phase-2-build-system.mdx` — Build System: the Soong/Blueprint + Kati + Ninja model, `lunch aosp_cf_x86_64_only_phone-aosp_current-userdebug` (the corrected §6.2 target, not the outdated `trunk_staging` form), first `m`, editing a `.bp` (`cc_library`) with an incremental rebuild, the Android 17+ read-only-tree override (`BUILD_BROKEN_SRC_DIR_IS_WRITABLE=true`), and a first Cuttlefish boot (`launch_cvd`, `sys.boot_completed`). Registered in `sidebars.js`; Phase 1's NextMission now points here. Output blocks marked "expected (author-run pending)". The strict build **caught four `expect(` delimiter typos** (the same class it caught in Phase 1); fixed. Build clean; all seven routes **HTTP 200**. |
| Authored Phase 3 content (§6.3, content roadmap) | `docs/phase-3-boot-init.mdx` — Boot & Init: the boot chain (bootloader → boot image → init → zygote → system_server), reading `dmesg` (kernel) and `logcat -b all` (userspace), a custom `init.rc` service + `on early-init` action, and a `persist.` boot-time property verified after reboot, with the mastery check being "narrate the chain against real log lines". Registered in `sidebars.js`; Phase 2's NextMission now points here. Output marked "expected (author-run pending)". The strict build **caught two more `expect(` typos** — a now-recurring authoring slip; fixed before build. Build clean; all eight routes **HTTP 200**. |
| Authored Phase 4 content (§6.3, content roadmap) | `docs/phase-4-kernel-foundations.mdx` — Kernel Foundations (spiral: Kernel A-1, Binder A-2): the GKI/KMI/ACK model, syncing the ACK (`common-android17-6.18`), building the GKI with Kleaf (`kernel_aarch64_dist`), booting it and confirming `uname` on Cuttlefish, and reading the Binder driver's wait/wake pair in `binder.c`. Registered in `sidebars.js`; Phase 3's NextMission now points here. Output marked "expected (author-run pending)". Pre-build grep again caught the recurring `expect(` slip (3×); fixed. Build clean; all nine routes **HTTP 200**. |
| Closed a cross-phase consistency gap: **Spine artifacts** | The competency map (§9) records a `spine/NN-*` artifact per phase, but **no phase page named its artifact** — so learners never knew what to commit to the continuous Spine (§4.8). Added a one-line "Spine artifact" note to Phases −1 (`spine/00-cpp17-lib`, `00-abi-probe`, `00-cli`), 1 (`01-ipc`), 2 (`02-instrumentation`), 3 (`03-init-service`), 4 (`04-gki`), each matching the map exactly. Verified each artifact string appears on its built page. |
| Authored Phase 5 content (§6.3, content roadmap) | `docs/phase-5-native-runtime.mdx` — Native Userspace & Runtime (spiral: ART A-1, 3 wk Core): Bionic vs glibc; a native NDK/C++ daemon built as a Soong `cc_binary` and launched by an `init.rc` service on `sys.boot_completed` (the mastery bar: "runs from first boot, no manual step"); the Zygote fork model + ART/DEX basics; tracing an APK install (PackageManager/installd); running one `atest` host test; and a time-boxed **Rust-literacy read-only** unit (fn/match/Result/Option/?) matching competency `p5.rust`. Registered in `sidebars.js`; Phase 4's NextMission points here. Output marked "expected (author-run pending)". Two authoring bugs caught: the recurring `expect(` slip (5×, fixed pre-build) and **a literal `{ ... }` inside `<code>` in a table cell**, which MDX parsed as a JS expression (acorn error) — escaped as `&#123;`/`&#125;`. Build clean; all ten routes **HTTP 200**. |
| Authored Phase 6 content (§6.3, content roadmap) | `docs/phase-6-hal-binder.mdx` — HAL, Treble & Binder (spiral: Binder A-3, 2–3 wk Core): why Treble introduced a stable interface (HIDL → AIDL) and VINTF; defining an `@VintfStability` AIDL HAL; implementing and registering it with the **service manager**; an end-to-end **native client call** over Binder; tracing Binder transactions; and writing/passing a **VTS test** for your own HAL (the phase's testing bar). Matches competency `p6.hal` (`aidl-hal, vintf, service-manager, binder-transactions`, artifact `spine/06-aidl-hal`). Registered in `sidebars.js`; Phase 5's NextMission points here. Output marked "expected (author-run pending)". The recurring `expect(` slip (4×) caught pre-build and fixed. Build clean; all eleven routes **HTTP 200**. |
| Authored Phase 7 content (§6.3, content roadmap) | `docs/phase-7-framework-layer.mdx` — Framework Layer (spiral: Binder A-4, 2 wk Core): why `system_server`/SystemServices mediate between apps and the lower layers; writing a SystemService (`publishBinderService`); app-facing framework AIDL; calling it from an app to close the kernel→HAL→framework→app vertical slice; and a **system-side unit test** (`atest` on a framework module) via the plain-Java core-class split. Matches competency `p7.service` (`system_server, systemservice, app-facing-aidl`, artifact `spine/07-systemservice`). Registered in `sidebars.js`; Phase 6's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (3×) caught pre-build. Build clean; all twelve routes **HTTP 200**. |
| Authored Phase 8 content (§6.3, content roadmap) | `docs/phase-8-security-model.mdx` — Security Model (spiral: SELinux A-2, 1–2 wk Core): the four walls (permissions, SELinux, Keystore, Verified Boot); SELinux domains/contexts and a minimal `.te` policy; the permissive→read-denials→minimal-rules→enforce workflow using `avc: denied` + `audit2allow` (with the explicit warning that audit2allow is a suggestion, not gospel); and the **CTS SELinux test components** (`CtsSecurityHostTestCases`, the phase's testing bar). Matches competency `p8.selinux` (`selinux-policy, contexts, permissions, keystore, verified-boot`, artifact `spine/08-selinux`). Registered in `sidebars.js`; Phase 7's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (3×) caught pre-build. Build clean; all thirteen routes **HTTP 200**. |
| Authored Phase 9 content (§6.3, content roadmap) | `docs/phase-9-debugging-performance.mdx` — Debugging & Performance (spiral: ART A-2, 1–2 wk Core): the toolkit table (tombstone vs Perfetto vs ftrace vs logcat); capturing and **symbolicating a tombstone** with `ndk-stack`; capturing a **Perfetto** trace; reading **ftrace**; **seeding a bug** into the Project Spine; and the mastery exercise — diagnose **three seeded bugs with on-device tools only**. Matches competency `p9.debug` (`adb, tombstones, perfetto, ftrace, seeded-bug-diagnosis`, artifact `spine/09-seeded-bug`). Registered in `sidebars.js`; Phase 8's NextMission points here. Output marked "expected (author-run pending)". **New authoring bug caught by the strict build:** an **unescaped apostrophe** in `device's` inside a quiz single-quoted JS string → acorn error; escaped as `\'`. Recurring `expect(` slip (4×) caught pre-build. Build clean; all fourteen routes **HTTP 200**. |
| Investigated a false alarm (no defect) | A content grep flagged `SIGSEGV` as "missing" from Phase 9's built HTML. Root cause: `TestRunner` (`src/components/TestRunner/index.js`) renders **only the active tab** — the "Expected output" pane is **client-side** (revealed on click), so `expect` text is never in the static HTML. This affects **every** phase equally (verified Phase 1 behaves identically) and is by design, not a Phase 9 regression. Source confirmed correct. Recorded as a known platform behaviour: SEO/no-JS readers do not see "Expected output" content. |
| Authored Phase 10 content (§6.3, content roadmap) | `docs/phase-10-kernel-mastery.mdx` — Kernel Mastery (spiral: Kernel A-2, 2–3 wk Core; first **Architect**-tier competency): a hand-written loadable module (`hello_kmod.c`) with a `/proc` entry (`proc_create` + seq_file) as the userspace-observable effect; diagnosing it with **`dmesg` and `ftrace` alone**; and placing **kselftest/KUnit** in the kernel-testing landscape (road to Phase 10.5). Matches competency `p10.module` (`loadable-module, proc-interface, dmesg-ftrace`, artifact `spine/10-kmod`, tier Architect). Registered in `sidebars.js`; Phase 9's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (3×) caught pre-build. Build clean; all fifteen routes **HTTP 200**. |
| Authored Phase 10.5 content (§6.3, content roadmap) | `docs/phase-10-5-drivers.mdx` — Kernel Subsystems & Drivers (spiral: Kernel A-3, 3 wk Core, **Architect** tier): the driver model (bus/device-tree/probe); a char/IIO driver with the full `file_operations` surface (`read`/`write`/`ioctl`/`poll`); a device-tree binding (`.dts` node + `of_device_id` match) and matching `probe`, verified via `dmesg`/sysfs; testing with **kselftest and KUnit**; and patching a real AOSP common-kernel subsystem, rebuilding the GKI, and booting it. Matches competency `p10_5.driver` (`char-device, iio, read-write-ioctl-poll, device-tree-binding, probe`, artifact `spine/10.5-driver`, tier Architect). Registered in `sidebars.js`; Phase 10's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (2×) caught pre-build. Build clean; all sixteen routes **HTTP 200**. |
| Authored Phase 11 content (§6.3, content roadmap) | `docs/phase-11-real-device.mdx` — Real Device Fundamentals (Core, 1 wk, **Architect** tier): the Cuttlefish-vs-Pixel table (from §7.1); the partition/image-set table (from §7.2, carrying its `[VERIFY per cycle]` flag as an on-page caution callout); A/B slots, `current-slot`/`ro.boot.slot_suffix`, and what "wrong slot" does/doesn't break; the two meanings of "device tree" (§7.3); and unpacking a factory image set from files alone (no hardware). Matches competency `p11.partitions` (`cuttlefish-vs-pixel, partition-layout, ab-slots, unlock-semantics`, artifact `spine/11-image-analysis`). Registered in `sidebars.js`; Phase 10.5's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (2×) caught pre-build. Build clean; all seventeen routes **HTTP 200**. |
| Authored Phase 12 content (§6.3, content roadmap) | `docs/phase-12-pixel-bringup.mdx` — Pixel Bring-Up Workshop (elective, **Master** tier, 2–3 wk — the only elective/master phase): locating `device/google/<codename>` + kernel sources; extracting the signed **vendor binaries**; building with a Pixel `lunch` target (`aosp_husky-userdebug`); `fastboot flashing unlock`; `flashall -w`; and cherry-picking a change and reflashing. Heavy safety framing (a top-of-page `:::danger` block: unlock wipes data, use a **secondary/used** device). Matches competency `p12.bringup` (`device-google-tree, vendor-binaries, lunch-aosp_husky, flashall, unlock`, artifact `spine/12-pixel`, testing honestly recorded as "not-yet (hardware bring-up; risks documented)"). Registered in `sidebars.js`; Phase 11's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (4×) caught pre-build. Build clean; all eighteen routes **HTTP 200**. |
| Authored Phase 13 content (§6.3, content roadmap) | `docs/phase-13-production-readiness.mdx` — Production Readiness Extras ("Rust is real", 2 wk Core, **Architect** tier): Rust in AOSP (`rust_library`/`rust_binary`/`rust_test`/`rust_fuzz` with an Android.bp example + `atest`); a minimal **APEX** (`apex` rule + `apex_manifest.json`) and its role in **Mainline**; the **graphics** (SurfaceFlinger/HWC/gralloc) and **Camera HAL** seam (AOSP vs vendor); and a **Trade Federation** / host-driven test module. Closes with the mastery reasoning: a 7-layer subsystem map for the capstone feature. Matches competency `p13.extras` (`rust-in-aosp, apex, mainline, graphics-overview, camera-hal-overview, trade-federation`, artifact `spine/13-hardening`). Registered in `sidebars.js`; Phase 12's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (2×) caught pre-build. Build clean; all nineteen routes **HTTP 200**. |
| Authored Phase 14 content (§6.3, content roadmap) | `docs/phase-14-contribution.mdx` — Contribution Workflow (3–5 d Core, **Architect** tier): the Gerrit lifecycle (edit → `repo upload` → review → amend → submit); the AOSP **commit-message** convention (component prefix, imperative subject, *why* body at 72 cols, `Test:` line, `Change-Id` via the commit-msg hook); Gerrit **conventions** (one logical change, reply to every comment, rebase-not-merge, no hidden scope); **self-review**; and orienting with **`cs.android.com`**. Closes with a reviewer checklist and the honest "testing: not-yet (review-driven)" callout. Matches competency `p14.gerrit` (`patch-format, upload, self-review, gerrit-conventions, cs.android.com`, artifact `spine/14-patch-series`). Registered in `sidebars.js`; Phase 13's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (3×) caught pre-build. Build clean; all twenty routes **HTTP 200**. |
| Authored Phase 15 content (§6.3, content roadmap) — **completed the curriculum** | `docs/phase-15-capstone.mdx` — Capstone ("Prove it", 3–4 wk Core, **Architect** tier): thread one feature **full-stack**; accept it with a **defined CTS/VTS subset**; the reviewer rubric (§21.3, all six items: builds&boots, tests pass, documented, full-stack, signed, reproducible); **signed commits** as the integrity/anti-forgery layer (GitHub "Verified"); the **public-repo layout** (§21.5); and the tier→evidence mapping (§21.4, Recruit→Master). Foregrounds the **"reviewer-graded, never self-graded"** rule (the plan's explicit anti-pattern). Matches competency `p15.prove` (`full-stack-feature, cts-vts-subset, public-fork, peer-review`, artifact `spine/15-full`). Registered in `sidebars.js`; Phase 14's NextMission points here. Output marked "expected (author-run pending)". Recurring `expect(` slip (2×) caught pre-build. Build clean; **all twenty-one routes HTTP 200** — every phase −1 through 15 (incl. 10.5) now published. |
| Byte-level check before publishing Phase 15 | The console displayed the page's authentic multibyte UTF-8 (right-arrow U+2192, minus-sign U+2212, en-dash U+2013, box-drawing U+251C) as unreadable glyphs. Re-verified at byte level: `has U+FFFD (real corruption): False`, with 3x U+2192, 2x U+2212, 4x U+251C, 2x U+2013 present — i.e. **no corruption; console display artifact only** (same class as the Phase 0 observation). Phase 15 file is correct UTF-8. Lesson: quoting corrupted glyphs verbatim into the plan itself injects real U+FFFD chars — describe mojibake, do not paste it. |

---

## 20. Running This Locally (Chrome / Firefox, no flags)

> **Status: scaffolded and verified.** The site lives in this repo at
> `aosp-mastery-site/` (Docusaurus **3.10.2**, production build verified clean
> on Node **v24.14.0**). `npm run start` was confirmed to serve **HTTP 200** with
> the title "AOSP Mastery" at `http://localhost:3000`. Pages built: `docs/intro`
> and `docs/phase-0-basecamp`. See `aosp-mastery-site/README.md`.

The platform is a **Docusaurus static site** (this repo pins **3.10.2**). Docusaurus is statically rendered and *generally works without JavaScript* (source: docusaurus.io/docs/deployment). Everything below is verified against docusaurus.io and nodejs.org.

### 20.1 Prerequisites (verified)

| Requirement | Value | Source |
|-------------|-------|--------|
| Node.js | **≥ 20.0** (`node -v`) | docusaurus.io/docs/installation |
| Package manager | npm (bundled with Node), or yarn/pnpm/bun | docusaurus.io/docs/installation |
| Browsers | Any current Chrome or Firefox | standard |

Use the current **Active LTS** Node line (nodejs.org lists v24 "Krypton" and v22 "Jod" as LTS at the time of writing) `[VERIFY at setup time]`. Avoid odd-numbered/EOL lines.

### 20.2 First-time setup

The site is **already scaffolded** at `aosp-mastery-site/`. To use it:

```bash
cd aosp-mastery-site
npm install        # first time only
```

To scaffold a *fresh* copy elsewhere, the original command was:

```bash
npx create-docusaurus@latest aosp-mastery-site classic --javascript
cd aosp-mastery-site
```

This creates the `classic` template (docs + blog + pages), per docusaurus.io/docs/installation.

### 20.3 Run it and view in your browser

```bash
npm run start
```

- Docusaurus **opens a browser window automatically** and serves at **`http://localhost:3000`** (source: docusaurus.io/docs/installation).
- If it doesn't auto-open: manually open `http://localhost:3000` in Chrome or Firefox.
- Hot reload is on — saving a `.md`/`.mdx` file updates the page live.

### 20.4 Preview the exact production build locally

```bash
npm run build
npm run serve
```

- `build` emits static files into `build/`; `serve` previews them at **`http://localhost:3000`** (source: docusaurus.io/docs/deployment).
- This is the same output GitHub Pages will serve — so if it looks right here, it looks right there.

### 20.5 Optional: serving the raw static output with any web server

Because the `build/` folder is plain static assets, it can be served by any static file server, e.g.:

```bash
npm run serve -- --port 8080 --host 0.0.0.0
```

(Source: docusaurus.io/docs/deployment, "Self hosting".) For a no-install fallback, any static server (e.g. Python's `python -m http.server` from inside `build/`) will also work `[VERIFY no-JS routes]`. The primary, supported path is `npm run start` / `npm run serve`.

### 20.6 Browser-compatibility notes (why Chrome & Firefox just work)

- Docusaurus 3 targets modern evergreen browsers; a current Chrome or Firefox has full support.
- The site is server-rendered to HTML first, so even if a script fails, core content still displays (source: docusaurus.io/docs/deployment).
- Client-side progress features (§8.5) use `localStorage`/`IndexedDB`, which both browsers support.

### 20.7 The one gotcha that bites everybody: `.nojekyll` on GitHub Pages

When you later publish to GitHub Pages, add an **empty `.nojekyll` file to the `static/` directory**. GitHub Pages runs files through Jekyll by default, and **Jekyll discards any file starting with `_`** — Docusaurus emits `_`-prefixed asset folders, so the site would break without it. (Source: docusaurus.io/docs/deployment.) Locally this never matters; on Pages it always does.

### 20.8 Acceptance test for "it works locally"

1. `npm run start` → site opens in Chrome at `localhost:3000`.
2. Repeat in Firefox → same result.
3. `npm run build && npm run serve` → production build loads in both.
4. Navigate a few docs pages, reload, and confirm no console errors in either browser.

If all four pass, the local requirement in this plan is satisfied.

---

## 21. Certification & Assessment Design

This section answers "how is competence actually proven, and can the proof be trusted?" It uses **only** two independently verifiable mechanisms: (a) artifacts on the learner's own **public GitHub** repository, and (b) **cryptographic commit signing**. No third-party credential vendor is named, because none was verified (§19.4).

### 21.1 Why this approach is trustworthy

A badge inside a private database proves nothing. Instead, every credential tier points at an artifact the learner **published publicly** and that anyone — including an employer who has never heard of this platform — can inspect. The proof lives outside the platform (carried forward from v3's "portable credentials," now made concrete).

### 21.2 What is verifiable, and how

| Layer | Artifact | How a third party verifies it |
|-------|----------|-------------------------------|
| Progress | Platform badge/XP (§4.9) | Platform UI (private until exported) |
| Unit-level | `spine/NN-*` commits in the learner's fork | Browse the public repo/commits |
| Phase mastery | A per-phase `RESULTS.md` in the fork (commands run + output) | Read the public file |
| Capstone | Patch series + `README.md` writeup in the fork | Read the public repo |
| Integrity | **Signed Git commits** | GitHub shows a **"Verified"** badge if the signature matches a key on the committer's account (source: docs.github.com, commit signature verification) |

Signed commits are the anti-forgery layer: a reviewer can tell whether the attributed author actually authored the commit.

### 21.3 The assessment rubric (capstone, Phase 15)

Graded by a reviewer (peer or mentor) against the Phase 0 competency doc — never self-graded. Minimum bar, all required:

1. **Builds & boots** on the learner's target (Cuttlefish, Core Path; Pixel for Master).
2. **Tests pass** — the defined CTS/VTS subset for the feature passes (§4.7, Phase 15).
3. **Documented** — `README.md` explains what it does and how to reproduce it (source: docs.github.com, about READMEs).
4. **Full-stack** — touching kernel → HAL → framework → app where the feature requires it.
5. **Signed** — commits are signature-verified (§21.2).
6. **Reproducible** — a reviewer following the README gets the same result.

### 21.4 Tier → evidence mapping

| Tier (§4.9) | Evidence required |
|-------------|-------------------|
| Recruit | Phase 0 mastery check passed |
| Builder | Phases −1–3: `RESULTS.md` per phase + the spine repo |
| Engineer | Phases 4–9: phases include lab results + a passing test per the Testing Thread |
| Architect | Phases 10–15 on Cuttlefish: full spine in the fork, capstone rubric passed |
| Master | Architect evidence **+** a self-built image booting on the learner's own Pixel (Phase 12) |

### 21.5 Public-repo layout the learner ships

```text
<learner>/aosp-mastery-spine/         # their public fork
├── README.md                         # capstone writeup (verified fact: docs.github.com)
├── phases/
│   ├── 00-basecamp/RESULTS.md        # commands run + real output
│   ├── 01-systems/RESULTS.md
│   └── ...                           # one folder per phase
└── (the actual camera/sensor feature code + tests)
```

The platform's badge (§8.6) links to this repo; the repo links back to the platform. Verification needs no platform account.

### 21.6 Optional signing setup (self-service, documented by GitHub)

GitHub documents both SSH-key commit signing and GPG commit signing; either yields the "Verified" badge. The platform **links to GitHub's own docs** rather than restating them, so instructions can't rot independently `[VERIFY exact doc URLs at write time]`.

### 21.7 Anti-patterns (explicitly rejected)

- **Self-grading.** The capstone is reviewer-graded by rule.
- **Private-database-only badges.** Every tier resolves to a public, inspectable artifact.
- **Unverifiable claims.** No credential is issued for a claim that cannot be checked by a stranger.
- **Invented issuers.** No third-party credential vendor is referenced unless verified (§19.4).

---

## Appendix A — Source Index (all verified this cycle)

- Build requirements & host setup: source.android.com/docs/setup/start/requirements
- Build & lunch targets: source.android.com/docs/setup/build/building
- Flash / unlock / `flashall`: source.android.com/docs/setup/build/running
- Cuttlefish get-started: source.android.com/docs/devices/cuttlefish/get-started
- GKI architecture: source.android.com/docs/core/architecture/kernel/generic-kernel-image
- GKI release builds (current `android17-6.18`): source.android.com/docs/core/architecture/kernel/gki-release-builds
- Build kernels (Kleaf/Bazel): source.android.com/docs/setup/build/building-kernels
- Code names, tags, builds (Android 17 = API 37): source.android.com/docs/setup/reference/build-numbers
- Release lifecycle (`android-latest-release`): source.android.com/docs/setup/contribute/release-lifecycle
- Rust in AOSP: source.android.com/docs/setup/build/rust
- Android Code Search (tree navigation): cs.android.com
- Docusaurus install (Node ≥20, `npm run start`, port 3000): docusaurus.io/docs/installation
- Docusaurus deployment (`npm run build`/`serve`, `.nojekyll`, works without JS): docusaurus.io/docs/deployment
- Node.js release status (LTS lines): nodejs.org/en/about/previous-releases
- GitHub commit signature verification: docs.github.com (commit signature verification)
- GitHub README behavior: docs.github.com (about READMEs)

> `[VERIFY]` markers and the §12 checklist cover anything not sourced above (Algolia, Supabase, Plausible, NDK, exact Docusaurus patch version).


