import React, {useMemo, useState, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Searchable AOSP/Android/kernel glossary with interactive Flashcard / Active Recall mode.
 *
 * Every definition here is sourced from the curriculum content or
 * source.android.com. Terms are grouped by category and filterable
 * via a live search input or practiced via active recall flashcards.
 */

const GLOSSARY = [
  // --- Architecture ---
  {term: 'AIDL', full: 'Android Interface Definition Language', category: 'Architecture', def: 'A language for defining stable IPC interfaces between processes. Used for HALs (with @VintfStability) and framework services. Replaced HIDL for modern HALs.'},
  {term: 'ART', full: 'Android Runtime', category: 'Architecture', def: 'The managed runtime that executes Android application code. Uses ahead-of-time compilation (dex2oat) and a garbage collector. Replaced Dalvik in Android 5.0.'},
  {term: 'Bionic', full: 'Android C Library', category: 'Architecture', def: "Android's custom C library, replacing glibc. Smaller, BSD-licensed, with stable NDK ABI guarantees. All native Android code links against Bionic."},
  {term: 'Binder', full: 'Binder IPC', category: 'Architecture', def: "Android's inter-process communication mechanism. Implemented as a kernel driver (drivers/android/binder.c) with single-copy mmap userspace libraries."},
  {term: 'BnInterface / BpInterface', full: 'Binder Native Stub / Binder Proxy', category: 'Architecture', def: 'Generated C++ AIDL classes. Bp (Binder Proxy) lives in client process and marshals arguments into Parcels; Bn (Binder Native) lives in server process and unmarshals transactions via onTransact().'},
  {term: 'HAL', full: 'Hardware Abstraction Layer', category: 'Architecture', def: 'The interface between Android framework services and hardware-specific vendor code. Modern HALs use AIDL with @VintfStability. Registered with servicemanager.'},
  {term: 'HIDL', full: 'HAL Interface Definition Language', category: 'Architecture', def: 'The predecessor to AIDL HALs, introduced with Project Treble. Deprecated for new HALs; existing HIDL HALs are being migrated to AIDL.'},
  {term: 'init', full: 'Init Process (PID 1)', category: 'Architecture', def: "The first userspace process started by the kernel. Parses init.rc files, starts services, sets properties. Android uses a two-stage init (first-stage and second-stage)."},
  {term: 'SELinux', full: 'Security-Enhanced Linux', category: 'Architecture', def: "Mandatory access control system enforced by the kernel. Android uses SELinux in enforcing mode. Policy is written in .te files defining process domains, file contexts, and allowed operations."},
  {term: 'SurfaceFlinger', full: 'SurfaceFlinger Compositor', category: 'Architecture', def: "Android's display compositor. Receives graphical buffers from apps via BufferQueue and composes them into the final display frame using the Hardware Composer (HWC) HAL."},
  {term: 'Gralloc', full: 'Graphics Memory Allocator HAL', category: 'Architecture', def: 'The HAL responsible for allocating zero-copy graphics buffers (GraphicBuffer/AHardwareBuffer) backed by Linux dma-buf, shared between CPU, GPU, Camera, and Display.'},
  {term: 'HWC', full: 'Hardware Composer HAL', category: 'Architecture', def: 'The HAL that offloads window layer composition from the GPU directly to dedicated display hardware overlays (MDP/DPU).'},
  {term: 'system_server', full: 'System Server (UID 1000)', category: 'Architecture', def: 'The core Android framework Java process. Hosts all SystemService instances (ActivityManager, PackageManager, etc.). Started by Zygote during boot.'},
  {term: 'Treble', full: 'Project Treble', category: 'Architecture', def: "A modular architecture (Android 8.0+) separating the vendor implementation (/vendor) from the Android OS framework (/system). Enables framework updates without vendor rebuilds."},
  {term: 'VINTF', full: 'Vendor Interface', category: 'Architecture', def: 'The compatibility manifest system that declares which HAL interfaces a device provides (device manifest) and which the framework requires (framework compatibility matrix).'},
  {term: 'Zygote', full: 'Zygote Process', category: 'Architecture', def: 'A warm-started process that preloads common classes and resources. All Android app processes are forked from Zygote with Copy-On-Write memory pages.'},

  // --- Systems & C++ Foundations ---
  {term: 'RAII', full: 'Resource Acquisition Is Initialization', category: 'Systems & C++', def: 'A core C++ design pattern where resource lifetime (memory, file descriptors, locks) is strictly bound to object lifetime via constructors and destructors.'},
  {term: 'COW', full: 'Copy-On-Write', category: 'Systems & C++', def: 'A kernel memory optimization where child processes created by fork() share physical RAM pages with parent as read-only until either process writes to a page.'},
  {term: 'mmap', full: 'Memory Mapping System Call', category: 'Systems & C++', def: 'Maps files or device buffers directly into process virtual memory space. Powers Binder single-copy IPC, POSIX shared memory, and ELF binary execution.'},
  {term: 'container_of', full: 'Kernel Parent Struct Pointer Macro', category: 'Systems & C++', def: 'A foundational Linux kernel and systems macro that computes the base address of an enclosing struct from a pointer to one of its internal members using offsetof.'},
  {term: 'sp<> / wp<>', full: 'Strong Pointer & Weak Pointer', category: 'Systems & C++', def: 'Android platform reference-counting smart pointers defined in <utils/RefBase.h>. sp increments strong reference count; wp holds a non-owning weak reference to prevent cycles.'},
  {term: 'ERR_PTR / IS_ERR', full: 'Kernel Top-Page Error Pointer Encoding', category: 'Systems & C++', def: 'A kernel pattern encoding negative integer error numbers (-errno) into the top 4KB of virtual memory space, allowing a single pointer return value to represent either valid memory or an error code.'},

  // --- Build & Tooling ---
  {term: 'AOSP', full: 'Android Open Source Project', category: 'Build & Tooling', def: 'The open-source codebase of the Android operating system, hosted at source.android.com. Includes the framework, runtime, kernel, and device support code.'},
  {term: 'Blueprint', full: 'Blueprint (.bp) Files', category: 'Build & Tooling', def: "Soong's declarative build file format (Android.bp). JSON-like syntax defining modules (cc_binary, java_library, rust_binary, etc.) with sources, dependencies, and flags."},
  {term: 'Kati', full: 'Kati (ckati)', category: 'Build & Tooling', def: 'A GNU Make clone that converts Android.mk (legacy Make) files into Ninja build files. Used during the transition from Make to Soong.'},
  {term: 'lunch', full: 'lunch Command', category: 'Build & Tooling', def: 'Shell function (from build/envsetup.sh) that selects a build target. Format: lunch <product>-<release>-<variant>. Example: aosp_cf_x86_64_only_phone-aosp_current-userdebug.'},
  {term: 'm', full: 'Build Command', category: 'Build & Tooling', def: "Shell alias for building the entire AOSP tree. Runs Soong, then Ninja. Must be run after 'source build/envsetup.sh' and 'lunch'. Supports -jN for parallelism."},
  {term: 'Ninja', full: 'Ninja Build System', category: 'Build & Tooling', def: "A small, fast build system focused on speed. Soong and Kati generate .ninja files; Ninja executes them with maximum CPU parallelism."},
  {term: 'repo', full: 'Repo Tool', category: 'Build & Tooling', def: "Google's tool for managing the hundreds of Git repositories that make up AOSP. Commands: repo init, repo sync, repo upload."},
  {term: 'Soong', full: 'Soong Build System', category: 'Build & Tooling', def: "AOSP's primary build system. Reads Android.bp (Blueprint) files, resolves dependencies, and generates Ninja build graphs. Replaced GNU Make."},
  {term: 'Gerrit', full: 'Gerrit Code Review', category: 'Build & Tooling', def: 'The web-based patch review system used across AOSP (android-review.googlesource.com). Reviews individual commits via Change-Id footers.'},
  {term: 'Change-Id', full: 'Gerrit Unique Change Identifier', category: 'Build & Tooling', def: 'A 40-character SHA-1 hash appended to git commits by the commit-msg hook. Tracks revisions of a patch across multiple git commit --amend uploads.'},
  {term: 'NDK', full: 'Native Development Kit', category: 'Build & Tooling', def: 'A set of tools for building native (C/C++) code for Android. Provides headers, libraries, and a toolchain with stable cross-release ABI guarantees.'},

  // --- Kernel ---
  {term: 'ACK', full: 'Android Common Kernel', category: 'Kernel', def: 'The shared Linux kernel branch maintained by Google that Android devices derive from. Tracks upstream LTS kernels with Android-specific patches.'},
  {term: 'DTS/DTB', full: 'Device Tree Source / Binary', category: 'Kernel', def: "Hardware description files. DTS is the human-readable source; DTB is the compiled binary loaded by the bootloader. Matched to drivers via 'compatible' strings."},
  {term: 'ftrace', full: 'Function Tracer', category: 'Kernel', def: 'A kernel tracing framework accessed via /sys/kernel/tracing. Records function graphs, scheduling events (sched_switch), and tracepoints.'},
  {term: 'GKI', full: 'Generic Kernel Image', category: 'Kernel', def: 'A single, signed kernel binary shared across all Android devices. Vendor hardware drivers load as out-of-tree modules (.ko) conforming to the KMI.'},
  {term: 'Kleaf', full: 'Kleaf (Kernel Leaf)', category: 'Kernel', def: 'The Bazel-based build system for Android kernels and kernel modules. Replaces legacy build.sh scripts.'},
  {term: 'KMI', full: 'Kernel Module Interface', category: 'Kernel', def: 'The set of exported kernel symbols that GKI guarantees as stable for a given Android release. Vendor modules (.ko) link against KMI symbols.'},
  {term: 'KUnit', full: 'Kernel Unit Testing', category: 'Kernel', def: 'An in-kernel unit testing framework executing tests directly inside kernel space and reporting results via dmesg and KTAP output.'},
  {term: 'kselftest', full: 'Kernel Self-Test', category: 'Kernel', def: 'A collection of user-space test programs for the Linux kernel under tools/testing/selftests/.'},
  {term: 'seq_file', full: 'Sequential File Interface', category: 'Kernel', def: 'A Linux kernel helper API for safely streaming formatted data through /proc and debugfs without overflowing kernel page buffers.'},

  // --- Testing ---
  {term: 'atest', full: 'Android Test Runner', category: 'Testing', def: 'A command-line tool for running Android tests locally. Builds the test module, pushes it to device, runs it, and reports results.'},
  {term: 'CTS', full: 'Compatibility Test Suite', category: 'Testing', def: "Android's compatibility test suite. Verifies that a device meets the Android Compatibility Definition Document (CDD). Required for GMS certification."},
  {term: 'GTest', full: 'Google Test', category: 'Testing', def: "Google's C++ testing and mocking framework. Used extensively in AOSP for native testing (cc_test modules)."},
  {term: 'Trade Federation', full: 'Trade Federation (Tradefed)', category: 'Testing', def: "Android's host-driven continuous test harness powering CTS, VTS, and automated device lab orchestration."},
  {term: 'VTS', full: 'Vendor Test Suite', category: 'Testing', def: 'Tests verifying vendor HAL implementations comply with their AIDL interface contracts across the Treble boundary.'},

  // --- Security & Sandboxing ---
  {term: 'AVC', full: 'Access Vector Cache', category: 'Security', def: 'The kernel cache storing SELinux access decisions. An "avc: denied" log entry in dmesg indicates an unauthorized operation blocked by policy.'},
  {term: 'neverallow', full: 'SELinux Invariant Assertion', category: 'Security', def: 'Compile-time build assertions in AOSP sepolicy that forbid dangerous permission grants, guaranteeing baseline system security.'},
  {term: 'AVB', full: 'Android Verified Boot 2.0', category: 'Security', def: 'Cryptographic chain of trust using vbmeta signatures and dm-verity to authenticate all system images before execution.'},
  {term: 'dm-verity', full: 'Device-Mapper Verity', category: 'Security', def: 'A kernel feature that uses transparent Merkle cryptographic hash trees to ensure read-only block devices (/system, /vendor) have not been modified.'},
  {term: 'HWASan', full: 'Hardware-Assisted AddressSanitizer', category: 'Security', def: 'Clang compiler memory bug detector utilizing ARM64 Top-Byte Ignore pointer tagging to detect buffer overflows and use-after-free with low overhead.'},

  // --- Device & Deployment ---
  {term: 'A/B', full: 'A/B (Seamless) Updates', category: 'Device', def: 'A dual-partition scheme where the device maintains two copies of bootable partitions (slots A and B). Enables seamless background updates and automatic rollback.'},
  {term: 'super.img', full: 'Dynamic Partitions Container', category: 'Device', def: 'A single physical partition that dynamically hosts resizeable sub-partitions (system, vendor, product) using Linux dm-linear.'},
  {term: 'fastbootd', full: 'Userspace Fastboot Daemon', category: 'Device', def: 'A fastboot implementation running in userspace (recovery/init) rather than firmware bootloader, enabling flashing of dynamic partitions.'},
  {term: 'adb', full: 'Android Debug Bridge', category: 'Device', def: 'Command-line tool providing shell access, file transfer, and logging over USB/TCP for device debugging.'},
  {term: 'APEX', full: 'Android Pony EXpress', category: 'Device', def: 'A container format mounting system components loopback at /apex/<name>, enabling Project Mainline updates via Google Play.'},
  {term: 'Cuttlefish', full: 'Cuttlefish Virtual Device', category: 'Device', def: "Google's configurable Android virtual reference device running upstream AOSP in crosvm with WebRTC remote desktop access."},
  {term: 'fastboot', full: 'Fastboot Protocol', category: 'Device', def: "Bootloader communication protocol used for flashing raw partition images and unlocking bootloaders over USB."},
  {term: 'Mainline', full: 'Project Mainline', category: 'Device', def: "Google's initiative delivering updates to core OS components as modular APEX containers via Google Play."},

  // --- Debugging ---
  {term: 'dmesg', full: 'Kernel Ring Buffer', category: 'Debugging', def: "Prints the kernel log buffer. Shows boot messages, driver init, SELinux AVC denials, and kernel Oops crashes."},
  {term: 'logcat', full: 'Android Logcat System', category: 'Debugging', def: 'Android multi-buffer logging tool capturing logs from apps, system_server, and native daemons across main, system, and crash buffers.'},
  {term: 'ndk-stack', full: 'NDK Stack Symbolizer', category: 'Debugging', def: 'Host utility converting raw hex memory addresses in crash tombstones into exact C++ source file names and line numbers.'},
  {term: 'Perfetto', full: 'Perfetto Tracing Platform', category: 'Debugging', def: 'The unified system-wide performance profiling tool for Android capturing thread scheduling, Binder IPC, and graphics frames.'},
  {term: 'tombstone', full: 'Tombstone (Crash Dump)', category: 'Debugging', def: 'Post-mortem crash dump file in /data/tombstones/ written by debuggerd containing CPU registers, backtraces, and memory maps.'},
  {term: 'cs.android.com', full: 'Android Code Search', category: 'Reference', def: "Google's Kythe-powered semantic code search platform indexing the complete AOSP source tree with cross-reference navigation."},
];

// Sort alphabetically by default
const DEFAULT_SORTED = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
const CATEGORIES = [...new Set(GLOSSARY.map((g) => g.category))].sort();

export default function Glossary() {
  const [mode, setMode] = useState('list'); // 'list' or 'flashcard'
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');

  // Flashcard specific state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(DEFAULT_SORTED);
  const [mastered, setMastered] = useState({});

  // Reset flashcard state when category changes
  useEffect(() => {
    let list = DEFAULT_SORTED;
    if (category !== 'all') {
      list = list.filter((g) => g.category === category);
    }
    setDeck(list);
    setCardIndex(0);
    setIsFlipped(false);
  }, [category]);

  const filteredList = useMemo(() => {
    let list = DEFAULT_SORTED;
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

  const currentCard = deck[cardIndex] || null;

  const handleShuffle = useCallback(() => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCardIndex(0);
    setIsFlipped(false);
  }, [deck]);

  const handleNextCard = useCallback(() => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrevCard = useCallback(() => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleMarkMastered = useCallback((term, status) => {
    setMastered((prev) => ({...prev, [term]: status}));
    handleNextCard();
  }, [handleNextCard]);

  // Keyboard navigation for flashcard mode
  useEffect(() => {
    if (mode !== 'flashcard') return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleNextCard, handlePrevCard]);

  const masteredCount = Object.values(mastered).filter((v) => v === 'known').length;

  return (
    <div className={styles.glossary}>
      {/* Mode Switcher */}
      <div className={styles.modeTabs}>
        <button
          type="button"
          className={clsx(
            styles.modeButton,
            mode === 'list' && styles.modeButtonActive,
          )}
          onClick={() => setMode('list')}>
          📚 Browse Glossary
        </button>
        <button
          type="button"
          className={clsx(
            styles.modeButton,
            mode === 'flashcard' && styles.modeButtonActive,
          )}
          onClick={() => setMode('flashcard')}>
          ⚡ Flashcards & Active Recall
        </button>
      </div>

      {/* Category filter bar */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            type="button"
            className={clsx(
              'button button--sm',
              category === 'all' ? 'button--primary' : 'button--secondary',
            )}
            onClick={() => setCategory('all')}>
            All ({GLOSSARY.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = GLOSSARY.filter((g) => g.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={clsx(
                  'button button--sm',
                  category === cat ? 'button--primary' : 'button--secondary',
                )}
                onClick={() => setCategory(cat)}>
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'list' ? (
        <>
          <div className={styles.searchRow}>
            <input
              type="text"
              placeholder="Search terms, acronyms, or descriptions..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.search}
              aria-label="Search glossary terms"
            />
            <p className={styles.count}>
              Showing <strong>{filteredList.length}</strong> of {GLOSSARY.length} terms
            </p>
          </div>

          <dl className={styles.list}>
            {filteredList.map((g) => (
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
          {filteredList.length === 0 && (
            <p className={styles.empty}>No terms match your search filter.</p>
          )}
        </>
      ) : (
        <div className={styles.flashcardSection}>
          <div className={styles.flashcardHeader}>
            <span className={styles.deckStats}>
              Card <strong>{cardIndex + 1}</strong> of <strong>{deck.length}</strong>
              {' '}&bull; Mastered: <strong>{masteredCount}</strong>
            </span>
            <div className={styles.deckActions}>
              <button
                type="button"
                className="button button--sm button--secondary"
                onClick={handleShuffle}>
                🔀 Shuffle
              </button>
              <button
                type="button"
                className="button button--sm button--secondary"
                onClick={() => {
                  setMastered({});
                  setCardIndex(0);
                  setIsFlipped(false);
                }}>
                ↺ Reset Progress
              </button>
            </div>
          </div>

          {currentCard ? (
            <div
              className={clsx(styles.cardContainer, isFlipped && styles.cardFlipped)}
              onClick={() => setIsFlipped((f) => !f)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') setIsFlipped((f) => !f);
              }}>
              <div className={styles.cardInner}>
                {/* Front of card */}
                <div className={styles.cardFront}>
                  <div className={styles.cardBadge}>{currentCard.category}</div>
                  <div className={styles.cardTerm}>{currentCard.term}</div>
                  <div className={styles.cardHint}>Tap card or press [Space] to reveal answer</div>
                </div>

                {/* Back of card */}
                <div className={styles.cardBack}>
                  <div className={styles.cardBadge}>{currentCard.category}</div>
                  <div className={styles.cardTermSmall}>{currentCard.term}</div>
                  <div className={styles.cardFullName}>{currentCard.full}</div>
                  <div className={styles.cardDefinition}>{currentCard.def}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className={styles.empty}>No cards in this category.</p>
          )}

          {/* Flashcard Controls */}
          {currentCard && (
            <div className={styles.cardControls}>
              <button
                type="button"
                className="button button--secondary"
                onClick={handlePrevCard}
                disabled={deck.length <= 1}>
                &larr; Prev
              </button>
              <button
                type="button"
                className={clsx('button', isFlipped ? 'button--warning' : 'button--primary')}
                onClick={() => setIsFlipped((f) => !f)}>
                {isFlipped ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              {isFlipped && (
                <>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() => handleMarkMastered(currentCard.term, 'review')}>
                    Need Review
                  </button>
                  <button
                    type="button"
                    className="button button--success"
                    onClick={() => handleMarkMastered(currentCard.term, 'known')}>
                    ✓ I Know This!
                  </button>
                </>
              )}
              <button
                type="button"
                className="button button--secondary"
                onClick={handleNextCard}
                disabled={deck.length <= 1}>
                Next &rarr;
              </button>
            </div>
          )}
          <p className={styles.hotkeyHint}>
            Keyboard Shortcuts: <code>Space</code> to flip, <code>&larr;</code> / <code>&rarr;</code> for prev/next card.
          </p>
        </div>
      )}
    </div>
  );
}
