import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Searchable AOSP/Android/kernel glossary.
 *
 * Every definition here is sourced from the curriculum content or
 * source.android.com. Terms are grouped by category and filterable
 * via a live search input.
 */

const GLOSSARY = [
  // --- Architecture ---
  {term: 'AIDL', full: 'Android Interface Definition Language', category: 'Architecture', def: 'A language for defining stable IPC interfaces between processes. Used for HALs (with @VintfStability) and framework services. Replaced HIDL for new HALs.'},
  {term: 'ART', full: 'Android Runtime', category: 'Architecture', def: 'The managed runtime that executes Android application code. Uses ahead-of-time compilation (dex2oat) and a garbage collector. Replaced Dalvik in Android 5.0.'},
  {term: 'Bionic', full: 'Android C Library', category: 'Architecture', def: "Android's custom C library, replacing glibc. Smaller, BSD-licensed, with stable NDK ABI guarantees. All native Android code links against Bionic."},
  {term: 'Binder', full: 'Binder IPC', category: 'Architecture', def: "Android's inter-process communication mechanism. Implemented as a kernel driver (drivers/android/binder.c) with userspace libraries. All HAL calls and framework service calls use Binder."},
  {term: 'HAL', full: 'Hardware Abstraction Layer', category: 'Architecture', def: 'The interface between Android framework services and hardware-specific vendor code. Modern HALs use AIDL with @VintfStability. Registered with servicemanager.'},
  {term: 'HIDL', full: 'HAL Interface Definition Language', category: 'Architecture', def: 'The predecessor to AIDL HALs, introduced with Project Treble. Deprecated for new HALs; existing HIDL HALs are being migrated to AIDL.'},
  {term: 'init', full: 'Init Process (PID 1)', category: 'Architecture', def: "The first userspace process started by the kernel. Parses init.rc files, starts services, sets properties. Android uses a two-stage init (first-stage and second-stage)."},
  {term: 'SELinux', full: 'Security-Enhanced Linux', category: 'Architecture', def: "Mandatory access control system enforced by the kernel. Android uses SELinux in enforcing mode. Policy is written in .te files defining process domains, file contexts, and allowed operations."},
  {term: 'SurfaceFlinger', full: 'SurfaceFlinger', category: 'Architecture', def: "Android's display compositor. Receives graphical buffers from apps via BufferQueue and composes them into the final display frame using the Hardware Composer HAL."},
  {term: 'system_server', full: 'System Server', category: 'Architecture', def: 'The core Android framework process. Hosts all SystemService instances (ActivityManager, PackageManager, etc.). Started by Zygote during boot.'},
  {term: 'Treble', full: 'Project Treble', category: 'Architecture', def: "A modular architecture (Android 8.0+) separating the vendor implementation from the Android OS framework. Enables framework updates without vendor changes via stable HAL interfaces and VINTF."},
  {term: 'VINTF', full: 'Vendor Interface', category: 'Architecture', def: 'The compatibility manifest system that declares which HAL interfaces a device provides (device manifest) and which the framework requires (framework compatibility matrix).'},
  {term: 'Zygote', full: 'Zygote Process', category: 'Architecture', def: 'A warm-started process that preloads common classes and resources. All Android app processes are forked from Zygote, which gives them a fast startup with shared memory pages.'},

  // --- Build & Tooling ---
  {term: 'AOSP', full: 'Android Open Source Project', category: 'Build & Tooling', def: 'The open-source codebase of the Android operating system, hosted at source.android.com. Includes the framework, runtime, kernel, and device support code.'},
  {term: 'Blueprint', full: 'Blueprint (.bp) Files', category: 'Build & Tooling', def: "Soong's declarative build file format (Android.bp). JSON-like syntax defining modules (cc_binary, java_library, rust_binary, etc.) with their sources, dependencies, and flags."},
  {term: 'Kati', full: 'Kati (ckati)', category: 'Build & Tooling', def: 'A GNU Make clone that converts Android.mk (legacy Make) files into Ninja build files. Used during the transition from Make to Soong. New code should use Android.bp.'},
  {term: 'lunch', full: 'lunch Command', category: 'Build & Tooling', def: 'Shell function (from build/envsetup.sh) that selects a build target. Format: lunch <product>-<release>-<variant>. Example: aosp_cf_x86_64_only_phone-aosp_current-userdebug.'},
  {term: 'm', full: 'Build Command', category: 'Build & Tooling', def: "Shell alias for building the entire AOSP tree. Runs Soong, then Ninja. Must be run after 'source build/envsetup.sh' and 'lunch'. Supports -jN for parallelism."},
  {term: 'Ninja', full: 'Ninja Build System', category: 'Build & Tooling', def: "A small, fast build system focused on speed. Soong and Kati generate .ninja files; Ninja executes them. Not written by hand — it's the execution engine beneath Soong."},
  {term: 'repo', full: 'Repo Tool', category: 'Build & Tooling', def: "Google's tool for managing the hundreds of Git repositories that make up AOSP. Commands: repo init, repo sync, repo upload. Requires version >= 2.4 for modern AOSP."},
  {term: 'Soong', full: 'Soong Build System', category: 'Build & Tooling', def: "AOSP's primary build system. Reads Android.bp (Blueprint) files, resolves dependencies, and generates Ninja build files. Replaced the legacy Make-based build system."},

  // --- Kernel ---
  {term: 'ACK', full: 'Android Common Kernel', category: 'Kernel', def: 'The shared Linux kernel branch maintained by Google that Android devices derive from. Tracks upstream LTS kernels with Android-specific patches (Binder, ashmem, etc.).'},
  {term: 'DTS/DTB', full: 'Device Tree Source / Binary', category: 'Kernel', def: "Hardware description files. DTS is the human-readable source; DTB is the compiled binary loaded by the bootloader. Describes hardware topology, register addresses, and IRQs. Matched to drivers via 'compatible' strings."},
  {term: 'ftrace', full: 'Function Tracer', category: 'Kernel', def: 'A kernel tracing framework accessed via /sys/kernel/tracing. Records function calls, scheduling events, and custom tracepoints. Used for performance analysis and debugging.'},
  {term: 'GKI', full: 'Generic Kernel Image', category: 'Kernel', def: 'A single, signed kernel binary shared across devices. Vendor-specific code is loaded as kernel modules (.ko). Enforced by KMI stability guarantees.'},
  {term: 'Kleaf', full: 'Kleaf (Kernel Leaf)', category: 'Kernel', def: 'The Bazel-based build system for Android kernels. Replaces the legacy build.sh scripts. Build target example: //common:kernel_aarch64_dist.'},
  {term: 'KMI', full: 'Kernel Module Interface', category: 'Kernel', def: 'The set of exported kernel symbols that GKI guarantees as stable for a given Android release. Vendor modules (.ko) link against KMI symbols; breaking KMI breaks all vendor modules.'},
  {term: 'KUnit', full: 'Kernel Unit Testing', category: 'Kernel', def: 'An in-kernel unit testing framework. Tests run inside the kernel and report results via /sys/kernel/debug/kunit or dmesg. Used for testing kernel subsystems and drivers.'},
  {term: 'kselftest', full: 'Kernel Self-Test', category: 'Kernel', def: 'A collection of user-space test programs for the Linux kernel. Run from tools/testing/selftests/. Tests kernel interfaces, syscalls, and subsystems from the user side.'},

  // --- Testing ---
  {term: 'atest', full: 'Android Test Runner', category: 'Testing', def: 'A command-line tool for running Android tests. Builds the test module, pushes it to the device, runs it, and reports results. Supports GTest, JUnit, and VTS tests.'},
  {term: 'CTS', full: 'Compatibility Test Suite', category: 'Testing', def: "Android's compatibility test suite. Verifies that a device implementation meets the Android Compatibility Definition. Run via Trade Federation. Required for GMS certification."},
  {term: 'GTest', full: 'Google Test', category: 'Testing', def: "Google's C++ testing and mocking framework. Used extensively in AOSP for testing native (C/C++) code. Test binaries are declared in Android.bp with cc_test modules."},
  {term: 'Trade Federation', full: 'Trade Federation (tradefed)', category: 'Testing', def: "Android's test harness for running CTS, VTS, and custom test suites across devices. Manages device allocation, test execution, and result reporting."},
  {term: 'VTS', full: 'Vendor Test Suite', category: 'Testing', def: 'Tests that verify vendor HAL implementations comply with their AIDL/HIDL interface contracts. Ensures Treble compatibility. Run via atest or Trade Federation.'},

  // --- Device & Deployment ---
  {term: 'A/B', full: 'A/B (Seamless) Updates', category: 'Device', def: 'A dual-partition scheme where the device has two sets of partitions (slots A and B). Updates are applied to the inactive slot while the device runs from the active one. Enables rollback on failure.'},
  {term: 'adb', full: 'Android Debug Bridge', category: 'Device', def: 'A command-line tool for communicating with a device. Provides a shell, file transfer, app installation, logcat access, and port forwarding. Client-server architecture.'},
  {term: 'APEX', full: 'Android Pony EXpress', category: 'Device', def: 'A container format for modular system components. Allows Google to update OS components (runtime, media, networking) independently via the Play Store, without a full OTA.'},
  {term: 'Cuttlefish', full: 'Cuttlefish Virtual Device', category: 'Device', def: "Google's configurable Android virtual device designed for AOSP development. Runs the same system image as real devices. Launched with launch_cvd and accessed via WebRTC at https://localhost:8443."},
  {term: 'fastboot', full: 'Fastboot Protocol', category: 'Device', def: "A protocol and tool for communicating with a device's bootloader. Used for flashing images, unlocking the bootloader, and booting custom kernels. Commands: fastboot flash, fastboot flashing unlock."},
  {term: 'Mainline', full: 'Project Mainline', category: 'Device', def: "Google's initiative to deliver updates to core OS components as APEX modules via the Play Store, bypassing full OTA updates. Covers ~30 modules including media, DNS, and the runtime."},
  {term: 'OTA', full: 'Over-The-Air Update', category: 'Device', def: "A mechanism for updating the device's system software wirelessly. Modern Android uses A/B seamless updates with payload-based (not block-based) OTA packages."},

  // --- Debugging ---
  {term: 'dmesg', full: 'Kernel Ring Buffer', category: 'Debugging', def: "Prints the kernel's ring buffer log. Shows boot messages, driver initialization, SELinux audit denials (avc: denied), and kernel panics. First place to look for kernel-level issues."},
  {term: 'logcat', full: 'Android Log System', category: 'Debugging', def: 'The Android logging system. Captures log messages from apps, framework, and native daemons. Supports multiple buffers: main, system, crash, kernel. Access via adb logcat.'},
  {term: 'ndk-stack', full: 'NDK Stack Symbolizer', category: 'Debugging', def: 'A tool that converts raw addresses in native crash tombstones into human-readable function names and line numbers using debug symbol binaries.'},
  {term: 'Perfetto', full: 'Perfetto Tracing', category: 'Debugging', def: 'A system-wide tracing tool for Android. Captures scheduling, syscalls, Binder transactions, GPU activity, and custom events. Traces are visualized at ui.perfetto.dev.'},
  {term: 'tombstone', full: 'Tombstone (Crash Dump)', category: 'Debugging', def: 'A crash report file generated when a native process crashes. Stored at /data/tombstones/. Contains the signal, register state, backtrace, memory maps, and log excerpts.'},

  // --- Other ---
  {term: 'cs.android.com', full: 'Android Code Search', category: 'Reference', def: "Google's online code search tool for the AOSP tree. Supports cross-references, symbol search, and browsing by branch. The primary tool for reading AOSP source."},
  {term: 'dex2oat', full: 'DEX-to-OAT Compiler', category: 'Architecture', def: "ART's ahead-of-time compiler. Converts DEX bytecode (from APKs) into native machine code (.oat files) during app installation or background optimization."},
  {term: 'Gerrit', full: 'Gerrit Code Review', category: 'Build & Tooling', def: 'The web-based code review system used by AOSP. Developers submit changes via repo upload. Each change gets a Change-Id and goes through code review before merging.'},
  {term: 'NDK', full: 'Native Development Kit', category: 'Build & Tooling', def: 'A set of tools for building native (C/C++) code for Android. Provides headers, libraries, and a toolchain. NDK APIs have stable ABI guarantees across Android versions.'},
];

// Sort alphabetically by term
GLOSSARY.sort((a, b) => a.term.localeCompare(b.term));

const CATEGORIES = [...new Set(GLOSSARY.map((g) => g.category))].sort();

export default function Glossary() {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    let list = GLOSSARY;
    if (category !== 'all') {
      list = list.filter((g) => g.category === category);
    }
    if (filter) {
      const lower = filter.toLowerCase();
      list = list.filter(
        (g) =>
          g.term.toLowerCase().includes(lower) ||
          g.full.toLowerCase().includes(lower) ||
          g.def.toLowerCase().includes(lower),
      );
    }
    return list;
  }, [filter, category]);

  return (
    <div className={styles.glossary}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search terms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.search}
          aria-label="Search glossary terms"
        />
        <div className={styles.filters}>
          <button
            type="button"
            className={clsx(
              'button button--sm',
              category === 'all' ? 'button--primary' : 'button--secondary',
            )}
            onClick={() => setCategory('all')}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={clsx(
                'button button--sm',
                category === cat ? 'button--primary' : 'button--secondary',
              )}
              onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <p className={styles.count}>
        Showing <strong>{filtered.length}</strong> of {GLOSSARY.length} terms
      </p>
      <dl className={styles.list}>
        {filtered.map((g) => (
          <div key={g.term} className={styles.entry}>
            <dt className={styles.term}>
              <code>{g.term}</code>
              <span className={styles.full}>{g.full}</span>
              <span className={styles.category}>{g.category}</span>
            </dt>
            <dd className={styles.def}>{g.def}</dd>
          </div>
        ))}
      </dl>
      {filtered.length === 0 && (
        <p className={styles.empty}>No terms match your search.</p>
      )}
    </div>
  );
}
