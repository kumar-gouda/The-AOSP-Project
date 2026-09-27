# 🤖 The AOSP Project — AOSP Mastery

[![AOSP Target](https://img.shields.io/badge/AOSP%20Target-Android%2017%20%2F%20API%2037-3DDC84?style=flat-square&logo=android)](https://source.android.com)
[![Kernel Baseline](https://img.shields.io/badge/Kernel-ACK%206.18%20GKI-blue?style=flat-square&logo=linux)](https://source.android.com/docs/core/architecture/kernel)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![Build Toolchain](https://img.shields.io/badge/Engine-Docusaurus%203.10%20%2B%20Rspack-orange?style=flat-square&logo=docusaurus)](https://docusaurus.io)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey?style=flat-square)](LICENSE)

> **A project-based curriculum and interactive learning platform: from C++17 and systems fundamentals to production-grade AOSP, Linux kernel, and real-device bring-up.**

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

## ⚡ Quickstart Guide

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
Navigate into the site directory and install dependencies:
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

*Hot reload is enabled by default: any edits made to documentation (`docs/`) or React components (`src/`) will update instantly in the browser.*

### 5. Build for Production
To generate the optimized static build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run serve
```

### 6. Verify Link Integrity
To execute strict link validation across all pages and sidebars:
```powershell
# Windows PowerShell:
$env:STRICT_LINKS="true"; npm run build

# Linux / macOS Bash:
STRICT_LINKS=1 npm run build
```

---

## 📂 Project Structure

```
The-AOSP-Project/
├── README.md                           <-- Repository Overview & Quickstart Guide
├── AOSP_Mastery_Platform_Plan_v4.md    <-- Complete Architectural Specification
└── aosp-mastery-site/                  <-- Docusaurus Web Application
    ├── docs/                           <-- 18 Comprehensive Learning Units (.mdx)
    │   ├── intro.md                    <-- Getting Started Guide
    │   ├── phase-minus-1-foundation.mdx<-- C++17 & Systems Foundations
    │   ├── phase-0-basecamp.mdx        <-- Verification Gate & Cuttlefish
    │   ├── ...                         <-- Phases 1 through 14
    │   ├── phase-15-capstone.mdx       <-- Full-Stack Capstone
    │   ├── glossary.mdx                <-- Searchable Glossary Page
    │   └── changelog.mdx               <-- Platform Revision History
    ├── data/
    │   ├── competency-map.yaml         <-- Single Source of Truth for Skills & Tiers
    │   └── load-competency-map.mjs     <-- Build-time YAML Schema Validator
    ├── src/
    │   ├── components/
    │   │   ├── Unit/                   <-- KeywordSpotlight, DeepDive, ConceptComparison, etc.
    │   │   ├── PhaseHeader/            <-- Tier, Time Estimate, Difficulty Badge
    │   │   ├── Progress/               <-- LocalStorage Progress Engine & JSON Export/Import
    │   │   ├── Roadmap/                <-- Interactive Visual Learning Map
    │   │   ├── Glossary/               <-- Searchable Category-Filtered Dictionary
    │   │   ├── CompetencyMap/          <-- YAML-driven Competency Grid
    │   │   ├── TestRunner/             <-- Runnable Shell Command Tabs with Copy Button
    │   │   └── NavbarProgress/         <-- Live Progress Bar in Top Navigation
    │   ├── pages/
    │   │   ├── index.js                <-- Hero Landing Page & Live Progress Panel
    │   │   ├── roadmap.js              <-- Visual Roadmap Route (/roadmap)
    │   │   └── competency-map.js       <-- Competency Map Route (/competency-map)
    │   └── css/
    │       └── custom.css              <-- Global Styles & WCAG AA Dark Mode Colors
    ├── docusaurus.config.js            <-- Site Config & Faster Rspack Bundler
    └── sidebars.js                     <-- Structured Curriculum Navigation
```

---

## 🧩 Pedagogical Components

Every learning phase in this curriculum uses specialized, accessible React components:

- **`<KeywordSpotlight>`**: Cards providing pronunciation, plain-English analogies, and AOSP-specific context for new keywords and acronyms.
- **`<DeepDive>`**: Accessible collapsible sections explaining under-the-hood technical mechanics (memory layouts, registers, kernel routines).
- **`<ConceptComparison>`**: Side-by-side comparison tables disambiguating commonly confused concepts (e.g. Stack vs Heap, Bionic vs glibc, HIDL vs AIDL).
- **`<CodeAnnotator>`**: Line-by-line syntax dissection for compiler attributes, macros, and configuration flags.
- **`<BreakIt>`**: Practical failure drills showing real symptoms, root causes, and fixes.
- **`<Checkpoint>`**: Instant-feedback conceptual quizzes with detailed explanations.
- **`<Troubleshooting>`**: Diagnostic matrices for resolving common build and runtime errors.

---

## 🔒 Offline-First & Privacy-Respecting

- **No Remote Telemetry:** All learner progress is stored locally in your browser's `localStorage`.
- **JSON Backup:** One-click JSON export and import allows you to back up progress or transfer it across workstations.
- **Zero Third-Party APIs:** Local search operates completely client-side using pre-indexed offline files.

---

## 📜 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.
All content and commands are verified against official Android Open Source Project documentation at [source.android.com](https://source.android.com).
