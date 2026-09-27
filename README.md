# 🤖 The AOSP Project — AOSP Mastery

[![CI](https://github.com/kumar-gouda/The-AOSP-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/kumar-gouda/The-AOSP-Project/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/Live%20Platform-GitHub%20Pages-2ea44f?style=flat-square&logo=github)](https://kumar-gouda.github.io/The-AOSP-Project/)
[![AOSP Target](https://img.shields.io/badge/AOSP%20Target-Android%2017%20%2F%20API%2037-3DDC84?style=flat-square&logo=android)](https://source.android.com)
[![Kernel Baseline](https://img.shields.io/badge/Kernel-ACK%206.18%20GKI-blue?style=flat-square&logo=linux)](https://source.android.com/docs/core/architecture/kernel)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey?style=flat-square)](LICENSE)

> **A project-based curriculum, interactive learning platform, and hands-on companion workspace: from C++17 and systems fundamentals to production-grade AOSP, Linux kernel, and real-device bring-up.**

🌐 **Live Platform:** [https://kumar-gouda.github.io/The-AOSP-Project/](https://kumar-gouda.github.io/The-AOSP-Project/)  
💻 **Companion Workspace:** [`spine-starter/`](./spine-starter/)

---

## 🌟 Overview

**AOSP Mastery** is a zero-dependency, local-first learning platform and curriculum designed for software engineers who know standard high-level programming (Java, Kotlin, Python, basic C++) but have zero background in Linux systems programming, the Linux kernel, or Android platform internals.

Instead of presenting an intimidating reference manual, the curriculum follows a single, continuous **Project Spine**: you build, debug, and ship **one cohesive hardware feature** as a complete vertical slice through every layer of the operating system:

```
  +-------------------------------------------------------------------------+
  | 1. App Layer: Java/Kotlin Client via Context.getSystemService()        |
  +------------------------------------+------------------------------------+
                                       |
  +------------------------------------v------------------------------------+
  | 2. Framework Layer: SystemService in system_server (UID 1000)          |
  +------------------------------------+------------------------------------+
                                       |
  +------------------------------------v------------------------------------+
  | 3. Hardware Layer: Stable AIDL HAL with @VintfStability (/vendor)      |
  +------------------------------------+------------------------------------+
                                       |
  +------------------------------------v------------------------------------+
  | 4. Security Layer: SELinux Policy (.te, file_contexts, AVB 2.0)         |
  +------------------------------------+------------------------------------+
                                       |
  +------------------------------------v------------------------------------+
  | 5. Kernel Layer: Loadable Kernel Module (.ko) & Device Tree (.dts)      |
  +-------------------------------------------------------------------------+
```

---

## 🗺️ The 18-Phase Curriculum

| Phase | Title | Tier | Est. Time | Focus & Deliverable |
| :---: | :--- | :---: | :---: | :--- |
| **−1** | **[Foundation](docs/phase-minus-1-foundation.mdx)** | Builder | ~6 hrs | C++17 memory models, RAII, `std::move`, `sp<>`/`wp<>`, `container_of`, `ERR_PTR`, ELF anatomy |
| **0** | **[Basecamp](docs/phase-0-basecamp.mdx)** | Recruit | ~3 hrs | Hardware self-checks (400GB disk, 64GB RAM), `repo`, Cuttlefish KVM setup, tree navigation |
| **1** | **[Systems Foundations](docs/phase-1-systems.mdx)** | Builder | ~5 hrs | Virtual memory, page tables, `fork()` Copy-On-Write, `mmap`, ARM64 cross-compile, `strace` |
| **2** | **[Build System](docs/phase-2-build-system.mdx)** | Builder | ~8 hrs | Soong (`Android.bp`), Kati (`Android.mk`), Ninja graphs, `lunch` targets, `userdebug` vs `user` |
| **3** | **[Boot & Init](docs/phase-3-boot-init.mdx)** | Builder | ~4 hrs | 6-stage boot chain, `init` (PID 1), `init.rc` services/actions, `dmesg` vs `logcat`, system properties |
| **4** | **[Kernel Foundations](docs/phase-4-kernel-foundations.mdx)** | Engineer | ~6 hrs | ACK, GKI, KMI frozen symbol list, Kleaf Bazel builds, Binder driver single-copy `mmap` buffer |
| **5** | **[Native Runtime](docs/phase-5-native-runtime.mdx)** | Engineer | ~5 hrs | Bionic libc vs glibc, NDK native daemon, Zygote COW app fork, `dex2oat` AOT/JIT, Rust in AOSP |
| **6** | **[HAL, Treble & Binder](docs/phase-6-hal-binder.mdx)** | Engineer | ~6 hrs | Treble partition split, AIDL HAL, Proxy (`Bp`) vs Stub (`Bn`), `libbinder_ndk`, VINTF, VTS tests |
| **7** | **[Framework Layer](docs/phase-7-framework-layer.mdx)** | Engineer | ~5 hrs | `system_server` lifecycle, `SystemService`, `clearCallingIdentity()`, Manager pattern, `atest` |
| **8** | **[Security Model](docs/phase-8-security-model.mdx)** | Engineer | ~5 hrs | DAC vs MAC, SELinux domains, resolving real AVC denials, compile-time `neverallow`, AVB 2.0 |
| **9** | **[Debugging & Performance](docs/phase-9-debugging-performance.mdx)** | Engineer | ~4 hrs | Native crash `tombstones`, `ndk-stack` symbolication, Perfetto SQL trace querying, `ftrace` |
| **10** | **[Kernel Mastery](docs/phase-10-kernel-mastery.mdx)** | Architect | ~6 hrs | Out-of-tree `.ko` modules, `/proc` vs `/sys` vs `/dev`, `seq_file`, decoding ARM64 Oops, KUnit |
| **10.5** | **[Subsystems & Drivers](docs/phase-10-5-drivers.mdx)** | Architect | ~8 hrs | Linux Driver Model (Bus/Device/Driver), Device Tree (`.dts`), `probe()`, `fops`, `copy_to_user`, IIO |
| **11** | **[Real Device Fundamentals](docs/phase-11-real-device.mdx)** | Architect | ~3 hrs | Cuttlefish vs Pixel, physical partitions vs `super.img`, `fastbootd`, A/B update state machine |
| **12** | **[Pixel Bring-Up Workshop](docs/phase-12-pixel-bringup.mdx)** | Master | ~10 hrs | `BoardConfig.mk`, extracting vendor blobs, compiling hardware targets, flashing, brick prevention |
| **13** | **[Production Readiness](docs/phase-13-production-readiness.mdx)** | Architect | ~6 hrs | Memory-safe Rust daemons, modular APEX containers, Gralloc/HWC graphics pipeline, Tradefed |
| **14** | **[Contribution Workflow](docs/phase-14-contribution.mdx)** | Architect | ~3 hrs | Google Gerrit review workflow, `repo upload`, `Change-Id` hooks, AOSP commit standards |
| **15** | **[Capstone Project](docs/phase-15-capstone.mdx)** | Architect | ~20 hrs | End-to-end full-stack vertical slice, defined CTS/VTS acceptance test subset, signed public fork |

---

## 💻 Companion Workspace (`spine-starter/`)

Alongside the interactive curriculum site, this repository includes the complete engineering companion workspace in [`spine-starter/`](./spine-starter/):

```
spine-starter/
├── 00-cpp17-lib/          <-- C++17 Circular RingBuffer (RAII, Move Semantics, GTest)
├── 00-abi-probe/          <-- Systems-C ABI Prober (container_of, alignment, endianness)
├── 00-cli/                <-- Basecamp Environment Verification Gate script
├── 01-ipc/                <-- POSIX Shared Memory Producer & Consumer
├── 02-instrumentation/    <-- Soong Android.bp with ASan/UBSan sanitizers
├── 03-init-service/       <-- Android init .rc daemon configuration & signal handler
├── 04-gki/                <-- Generic Kernel Image ABI verification & KMI checker
├── 05-ndk-daemon/         <-- Native C++ (libbinder_ndk) & Rust daemons
├── 06-aidl-hal/           <-- AIDL HAL service (ICustomDevice.aidl, BnCustomDevice)
├── 07-systemservice/      <-- System Server service & permission enforcement
├── 08-selinux/            <-- SELinux policy rules (.te) & file_contexts labels
├── 09-seeded-bug/         <-- Reproducible Use-After-Free diagnostics sandbox
├── 10-kmod/               <-- Out-of-tree Linux kernel module (miscdevice, spinlocks)
├── 10.5-driver/           <-- Platform device driver with Device Tree & sysfs
├── 11-image-analysis/     <-- Android image partition unpacking (lpunpack, avbtool)
├── 12-pixel/              <-- Pixel board configuration & device makefiles
├── 13-hardening/          <-- Compile hardening: Clang CFI, Fortify, Stack Protector
├── 14-patch-series/       <-- Gerrit Change-Id commit hook & commit message guidelines
├── 15-full/               <-- Full Vertical Slice Architecture checklist
└── verify_all.sh          <-- Automated test & verification suite
```

### Running Workspace Verification:
```bash
# Verify directory structure and syntax in dry-run mode
bash spine-starter/verify_all.sh --dry-run

# Run verification on a specific phase
bash spine-starter/verify_all.sh --phase 00-cpp17-lib
```

---

## ⚡ Quickstart Guide for the Web Platform

### 1. Prerequisites
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js:** Version `20.0.0` or higher (`node -v`).
- **Git:** Installed and configured (`git --version`).

### 2. Clone the Repository
```bash
git clone https://github.com/kumar-gouda/The-AOSP-Project.git
cd The-AOSP-Project
```

### 3. Setup Dependencies
```bash
cd aosp-mastery-site
npm install
```

### 4. Run the Development Server
Launch the interactive web application locally:
```bash
npm start
```
The application will automatically open in your default browser at:  
👉 **`http://localhost:3000`**

### 5. Build for Production
```bash
npm run build
```

To preview the production build locally:
```bash
npm run serve
```

### 6. Verify Strict Link Integrity
```powershell
# Windows PowerShell:
$env:STRICT_LINKS="true"; npm run build

# Linux / macOS Bash:
STRICT_LINKS=1 npm run build
```

---

## 🧩 Interactive Platform Features

- **⚡ Flashcards & Active Recall Mode:** In the [Glossary](https://kumar-gouda.github.io/The-AOSP-Project/docs/glossary), toggle between the traditional dictionary list and interactive 3D flipping flashcards with self-assessment tracking and keyboard shortcuts (`Space` to flip, `Arrow` keys to navigate).
- **🖥️ In-Browser ADB Terminal Sandbox:** Visit the [Terminal Sandbox](https://kumar-gouda.github.io/The-AOSP-Project/terminal) to practice running real `adb` and `fastboot` commands against a simulated Android 15 / Linux 6.1 GKI device (querying `getprop`, testing `service list`, inspecting `lshal`, toggling SELinux modes, and reading kernel module nodes).
- **📊 Real-Time Competency Map & Local Storage:** Track completed phases, earned XP, and milestone deliverables across Recruit, Builder, Engineer, Architect, and Master tiers. Back up your progress anytime with one-click JSON export/import.
- **🛠️ Pedagogical Learning Units:** Every phase contains structured pedagogical sections: `<KeywordSpotlight>`, `<DeepDive>`, `<ConceptComparison>`, `<CodeAnnotator>`, `<BreakIt>`, `<Checkpoint>`, and `<Troubleshooting>`.

---

## 📂 Repository File Tree

```
The-AOSP-Project/
├── .github/
│   └── workflows/
│       ├── ci.yml                      <-- Strict build & competency map CI
│       └── deploy.yml                  <-- Automated GitHub Pages deployment
├── spine-starter/                      <-- Hands-on C++/C/Rust/Java/Kernel exercises
│   ├── verify_all.sh                   <-- Multi-phase automated verification script
│   └── 00-* through 15-*               <-- Phase-specific starter workspaces
├── aosp-mastery-site/                  <-- Docusaurus Web Application
│   ├── docs/                           <-- 18 Comprehensive Learning Units (.mdx)
│   ├── data/
│   │   ├── competency-map.yaml         <-- Single Source of Truth for Skills & Tiers
│   │   └── load-competency-map.mjs     <-- Build-time YAML Schema Validator
│   ├── src/
│   │   ├── components/
│   │   │   ├── Glossary/               <-- Searchable Dictionary + Flashcard Mode
│   │   │   ├── TerminalSandbox/        <-- Mock ADB / Fastboot Web Terminal
│   │   │   ├── Unit/                   <-- Pedagogical UI components
│   │   │   ├── Roadmap/                <-- Visual Learning Roadmap
│   │   │   └── Progress/               <-- LocalStorage Progress Engine
│   │   └── pages/
│   │       ├── index.js                <-- Hero Landing Page
│   │       ├── roadmap.js              <-- Visual Roadmap Route (/roadmap)
│   │       ├── competency-map.js       <-- Competency Map Route (/competency-map)
│   │       └── terminal.js             <-- Interactive Terminal Route (/terminal)
│   └── docusaurus.config.js            <-- Docusaurus Config with dynamic baseUrl
├── LICENSE                             <-- Apache 2.0 Open Source License
└── README.md                           <-- Master Documentation & Guide
```

---

## 🔒 Offline-First & Privacy-Respecting

- **No Remote Telemetry:** All learner progress is stored locally in your browser's `localStorage`.
- **JSON Backup:** One-click JSON export and import allows you to back up progress or transfer it across workstations.
- **Zero Third-Party APIs:** Local search operates completely client-side using pre-indexed offline files.

---

## 📜 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.  
All content and commands are verified against official Android Open Source Project documentation at [source.android.com](https://source.android.com).
