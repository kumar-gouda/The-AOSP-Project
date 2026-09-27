import React, {useMemo, useState, useEffect, useCallback} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Searchable AOSP/Android/kernel glossary with interactive Flashcard / Active Recall mode,
 * and a Plain-English / Everyday Analogy toggle designed for non-native English speakers.
 */

const GLOSSARY = [
  // --- Architecture ---
  {
    term: 'AIDL',
    full: 'Android Interface Definition Language',
    category: 'Architecture',
    def: 'A language for defining stable IPC interfaces between processes. Used for HALs (with @VintfStability) and framework services. Replaced HIDL for modern HALs.',
    simpleDef: 'A clear contract language that lets two separate programs talk to each other without caring about how they are written internally.',
    analogy: 'Like an international embassy translator: both sides agree on the questions and answers before speaking.',
  },
  {
    term: 'ART',
    full: 'Android Runtime',
    category: 'Architecture',
    def: 'The managed runtime that executes Android application code. Uses ahead-of-time compilation (dex2oat) and a garbage collector. Replaced Dalvik in Android 5.0.',
    simpleDef: 'The engine inside Android that runs app code, translates it into fast machine instructions, and cleans up unused memory.',
    analogy: 'Like an electric engine in a car that converts fuel (app bytecode) into motion (running apps) smoothly.',
  },
  {
    term: 'Bionic',
    full: 'Android C Library',
    category: 'Architecture',
    def: "Android's custom C library, replacing glibc. Smaller, BSD-licensed, with stable NDK ABI guarantees. All native Android code links against Bionic.",
    simpleDef: "Android's own lightweight standard C library. It provides fundamental tools like malloc (memory) and open (files) with low RAM usage.",
    analogy: 'Like a pocket multi-tool instead of a giant heavy toolbox: light, fast to open, and has just what mobile hardware needs.',
  },
  {
    term: 'Binder',
    full: 'Binder IPC',
    category: 'Architecture',
    def: "Android's inter-process communication mechanism. Implemented as a kernel driver (drivers/android/binder.c) with single-copy mmap userspace libraries.",
    simpleDef: 'The main telephone line in Android. It safely moves messages and commands between different apps, system services, and drivers with single-copy speed.',
    analogy: 'Like a pneumatic hospital tube system: a process drops a capsule in, and the kernel immediately delivers it to the target room.',
  },
  {
    term: 'BnInterface / BpInterface',
    full: 'Binder Native Stub / Binder Proxy',
    category: 'Architecture',
    def: 'Generated C++ AIDL classes. Bp (Binder Proxy) lives in client process and marshals arguments into Parcels; Bn (Binder Native) lives in server process and unmarshals transactions via onTransact().',
    simpleDef: 'The two ends of a Binder connection. Bp (Proxy) is the client-side remote control; Bn (Native) is the device receiving the button presses.',
    analogy: 'Bp is like a TV remote in your hand; Bn is the infrared sensor on the TV screen executing your commands.',
  },
  {
    term: 'HAL',
    full: 'Hardware Abstraction Layer',
    category: 'Architecture',
    def: 'The interface between Android framework services and hardware-specific vendor code. Modern HALs use AIDL with @VintfStability. Registered with servicemanager.',
    simpleDef: 'A standard software bridge connecting high-level Android Java features to low-level physical chipsets (cameras, sensors, bluetooth).',
    analogy: 'Like a universal power adapter plug: Android framework provides the wall socket, and hardware makers build the plug that fits it.',
  },
  {
    term: 'HIDL',
    full: 'HAL Interface Definition Language',
    category: 'Architecture',
    def: 'The predecessor to AIDL HALs, introduced with Project Treble. Deprecated for new HALs; existing HIDL HALs are being migrated to AIDL.',
    simpleDef: 'The older interface format introduced in Android 8 to separate vendor drivers from Android OS updates. Replaced by AIDL.',
    analogy: 'Like USB-A: widely used in the past, but modern Android devices now use USB-C (AIDL).',
  },
  {
    term: 'init',
    full: 'Init Process (PID 1)',
    category: 'Architecture',
    def: "The first userspace process started by the kernel. Parses init.rc files, starts services, sets properties. Android uses a two-stage init (first-stage and second-stage).",
    simpleDef: 'The parent of all userspace processes. It starts first when the phone boots, mounts disks, reads configuration files, and launches background daemons.',
    analogy: 'Like the building manager who arrives at 5 AM: turns on the lights, unlocks the doors, and boots up all office equipment.',
  },
  {
    term: 'SELinux',
    full: 'Security-Enhanced Linux',
    category: 'Architecture',
    def: "Mandatory access control system enforced by the kernel. Android uses SELinux in enforcing mode. Policy is written in .te files defining process domains, file contexts, and allowed operations.",
    simpleDef: 'A strict security guard inside the Linux kernel. Even if a hacker gains root access (UID 0), SELinux blocks them unless a policy rule explicitly permits the action.',
    analogy: 'Like a security badge door system in a laboratory: even the director cannot enter the bio-hazard room without the specific room badge.',
  },
  {
    term: 'SurfaceFlinger',
    full: 'SurfaceFlinger Compositor',
    category: 'Architecture',
    def: "Android's display compositor. Receives graphical buffers from apps via BufferQueue and composes them into the final display frame using the Hardware Composer (HWC) HAL.",
    simpleDef: 'The graphics compositor that stacks window layers, status bars, and app screens together 60 to 120 times every second onto your screen.',
    analogy: 'Like a film director layering background scenery, actors, and subtitles into a single composite movie frame.',
  },
  {
    term: 'Gralloc',
    full: 'Graphics Memory Allocator HAL',
    category: 'Architecture',
    def: 'The HAL responsible for allocating zero-copy graphics buffers (GraphicBuffer/AHardwareBuffer) backed by Linux dma-buf, shared between CPU, GPU, Camera, and Display.',
    simpleDef: 'The memory manager for display buffers that allows CPU, GPU, and camera hardware to share image pixels with zero extra copying.',
    analogy: 'Like a shared whiteboard in a meeting room: all team members look at the same board instead of printing copies for everyone.',
  },
  {
    term: 'HWC',
    full: 'Hardware Composer HAL',
    category: 'Architecture',
    def: 'The HAL that offloads window layer composition from the GPU directly to dedicated display hardware overlays (MDP/DPU).',
    simpleDef: 'A dedicated hardware chip driver that merges screen layers together without wasting battery on the main GPU.',
    analogy: 'Like an automatic stamping machine in a factory that takes over repetitive tasks from human artists.',
  },
  {
    term: 'system_server',
    full: 'System Server (UID 1000)',
    category: 'Architecture',
    def: 'The core Android framework Java process. Hosts all SystemService instances (ActivityManager, PackageManager, etc.). Started by Zygote during boot.',
    simpleDef: 'The central brain of Android userspace. It manages power, battery, installed apps, wifi, sensors, and notifications.',
    analogy: 'Like an airport flight control tower orchestrating all planes (apps) and runways (hardware).',
  },
  {
    term: 'Treble',
    full: 'Project Treble',
    category: 'Architecture',
    def: "A modular architecture (Android 8.0+) separating the vendor implementation (/vendor) from the Android OS framework (/system). Enables framework updates without vendor rebuilds.",
    simpleDef: 'A major architectural split in Android that separates phone hardware drivers from Android OS updates, allowing faster updates without breaking drivers.',
    analogy: 'Like separating a game cartridge from a gaming console: you can upgrade the console software without buying new game cartridges.',
  },
  {
    term: 'VINTF',
    full: 'Vendor Interface',
    category: 'Architecture',
    def: 'The compatibility manifest system that declares which HAL interfaces a device provides (device manifest) and which the framework requires (framework compatibility matrix).',
    simpleDef: 'A checklist of XML manifests that confirms whether the hardware vendor provided all the drivers Android framework expects to run.',
    analogy: 'Like a pre-flight checklist: before takeoff, the pilot checks that fuel, engines, and landing gear all match safety requirements.',
  },
  {
    term: 'Zygote',
    full: 'Zygote Process',
    category: 'Architecture',
    def: 'A warm-started process that preloads common classes and resources. All Android app processes are forked from Zygote with Copy-On-Write memory pages.',
    simpleDef: 'A warm template process that preloads Android code into RAM. Every new app is created in milliseconds by cloning Zygote.',
    analogy: 'Like a baker making 1,000 cookies from a pre-made dough template rather than mixing flour and sugar from scratch every time.',
  },

  // --- Systems & C++ Foundations ---
  {
    term: 'RAII',
    full: 'Resource Acquisition Is Initialization',
    category: 'Systems & C++',
    def: 'A core C++ design pattern where resource lifetime (memory, file descriptors, locks) is strictly bound to object lifetime via constructors and destructors.',
    simpleDef: 'A C++ rule where opening a resource (file, memory, lock) is paired with an automatic cleanup when the enclosing code block finishes.',
    analogy: 'Like a hotel keycard slot: lights turn on when you insert the card, and turn off automatically the second you remove it and leave.',
  },
  {
    term: 'COW',
    full: 'Copy-On-Write',
    category: 'Systems & C++',
    def: 'A kernel memory optimization where child processes created by fork() share physical RAM pages with parent as read-only until either process writes to a page.',
    simpleDef: 'A smart RAM optimization: two processes share identical memory pages as read-only until one process writes new data, at which point the kernel makes a private copy.',
    analogy: 'Like students reading the same shared library textbook until someone needs to highlight notes in their own personal copy.',
  },
  {
    term: 'mmap',
    full: 'Memory Mapping System Call',
    category: 'Systems & C++',
    def: 'Maps files or device buffers directly into process virtual memory space. Powers Binder single-copy IPC, POSIX shared memory, and ELF binary execution.',
    simpleDef: 'A system call that connects a file or hardware buffer directly into a program virtual RAM, avoiding slow file read/write operations.',
    analogy: 'Like opening a window directly into a warehouse instead of hauling boxes back and forth through a narrow doorway.',
  },
  {
    term: 'container_of',
    full: 'Kernel Parent Struct Pointer Macro',
    category: 'Systems & C++',
    def: 'A foundational Linux kernel and systems macro that computes the base address of an enclosing struct from a pointer to one of its internal members using offsetof.',
    simpleDef: 'A clever C macro that calculates the starting memory address of a whole structure when given only a pointer to one of its internal variables.',
    analogy: 'Like finding the front entrance address of an apartment building when you only know the door location of apartment #4B.',
  },
  {
    term: 'sp<> / wp<>',
    full: 'Strong Pointer & Weak Pointer',
    category: 'Systems & C++',
    def: 'Android platform reference-counting smart pointers defined in <utils/RefBase.h>. sp increments strong reference count; wp holds a non-owning weak reference to prevent cycles.',
    simpleDef: "Android's automatic reference-counting smart pointers. `sp` keeps an object alive; `wp` observes an object without preventing its deletion.",
    analogy: '`sp` is like an owner holding a dog leash (keeps dog in park); `wp` is like a spectator taking a photo of the dog (does not hold the dog).',
  },
  {
    term: 'ERR_PTR / IS_ERR',
    full: 'Kernel Top-Page Error Pointer Encoding',
    category: 'Systems & C++',
    def: 'A kernel pattern encoding negative integer error numbers (-errno) into the top 4KB of virtual memory space, allowing a single pointer return value to represent either valid memory or an error code.',
    simpleDef: 'A kernel trick where negative error codes (like -ENOMEM) are disguised as invalid memory pointers, so functions return both data and errors in one pointer.',
    analogy: 'Like a teacher handing back an exam: if there is a paper, it has your grade; if they hand you a colored warning ticket, it indicates an issue.',
  },

  // --- Build & Tooling ---
  {
    term: 'AOSP',
    full: 'Android Open Source Project',
    category: 'Build & Tooling',
    def: 'The open-source codebase of the Android operating system, hosted at source.android.com. Includes the framework, runtime, kernel, and device support code.',
    simpleDef: 'The complete open-source operating system source code behind all Android devices, maintained by Google and the Android community.',
    analogy: 'Like the blueprint, engine specs, and assembly instructions for an automobile.',
  },
  {
    term: 'Blueprint',
    full: 'Blueprint (.bp) Files',
    category: 'Build & Tooling',
    def: "Soong's declarative build file format (Android.bp). JSON-like syntax defining modules (cc_binary, java_library, rust_binary, etc.) with sources, dependencies, and flags.",
    simpleDef: 'The declarative configuration files (Android.bp) in AOSP that specify what source files to compile, what libraries to link, and what flags to apply.',
    analogy: 'Like a cooking recipe listing ingredients, preparation order, and oven temperature.',
  },
  {
    term: 'Soong',
    full: 'Soong Build System',
    category: 'Build & Tooling',
    def: "AOSP's primary build system. Reads Android.bp (Blueprint) files, resolves dependencies, and generates Ninja build graphs. Replaced GNU Make.",
    simpleDef: 'The modern build system that reads Android.bp files, figures out compiler dependencies, and writes fast execution plans for Ninja.',
    analogy: 'Like an architect turning hand-drawn sketches into rigorous blueprints for the construction crew.',
  },
  {
    term: 'Ninja',
    full: 'Ninja Build System',
    category: 'Build & Tooling',
    def: "A small, fast build system focused on speed. Soong and Kati generate .ninja files; Ninja executes them with maximum CPU parallelism.",
    simpleDef: 'A tiny, blazing-fast compiler execution engine that uses all CPU cores to compile thousands of source files in parallel.',
    analogy: 'Like a team of 32 construction workers building a house simultaneously using an exact step-by-step assembly manual.',
  },
  {
    term: 'repo',
    full: 'Repo Tool',
    category: 'Build & Tooling',
    def: "Google's tool for managing the hundreds of Git repositories that make up AOSP. Commands: repo init, repo sync, repo upload.",
    simpleDef: 'A Python command-line tool built by Google that orchestrates hundreds of individual Git repositories as one unified codebase.',
    analogy: 'Like a fleet admiral commanding 500 individual ships to sail in perfect formation.',
  },
  {
    term: 'lunch',
    full: 'lunch Command',
    category: 'Build & Tooling',
    def: 'Shell function (from build/envsetup.sh) that selects a build target. Format: lunch <product>-<release>-<variant>. Example: aosp_cf_x86_64_only_phone-aosp_current-userdebug.',
    simpleDef: 'A shell command that sets environment variables to choose what target device (emulator, Pixel, Cuttlefish) and build variant (userdebug vs user) to compile.',
    analogy: 'Like selecting your destination and vehicle on a GPS before starting a road trip.',
  },
  {
    term: 'Gerrit',
    full: 'Gerrit Code Review',
    category: 'Build & Tooling',
    def: 'The web-based patch review system used across AOSP (android-review.googlesource.com). Reviews individual commits via Change-Id footers.',
    simpleDef: 'The official code review platform for Android where Google engineers inspect, verify, and approve code changes commit-by-commit.',
    analogy: 'Like a peer review board evaluating scientific papers before they can be published in a journal.',
  },
  {
    term: 'NDK',
    full: 'Native Development Kit',
    category: 'Build & Tooling',
    def: 'A set of tools for building native (C/C++) code for Android. Provides headers, libraries, and a toolchain with stable cross-release ABI guarantees.',
    simpleDef: 'A toolset containing compilers, headers, and libraries for compiling high-performance C and C++ code for Android hardware.',
    analogy: 'Like specialized precision tools for tuning race car engines directly rather than driving in automatic mode.',
  },

  // --- Kernel ---
  {
    term: 'GKI',
    full: 'Generic Kernel Image',
    category: 'Kernel',
    def: 'A single, signed kernel binary shared across all Android devices. Vendor hardware drivers load as out-of-tree modules (.ko) conforming to the KMI.',
    simpleDef: 'A universal, Google-built Linux kernel binary that boots on all Android devices, while chip makers load drivers as modular add-ons.',
    analogy: 'Like a universal smartphone operating system that runs on any brand, while custom camera sensors plug in via standard USB.',
  },
  {
    term: 'KMI',
    full: 'Kernel Module Interface',
    category: 'Kernel',
    def: 'The set of exported kernel symbols that GKI guarantees as stable for a given Android release. Vendor modules (.ko) link against KMI symbols.',
    simpleDef: 'The frozen, protected list of Linux kernel functions that driver makers can link against without breaking compatibility during OS updates.',
    analogy: 'Like a standardized electrical socket: manufacturers build plugs that always fit regardless of how the power grid is updated.',
  },
  {
    term: 'DTS/DTB',
    full: 'Device Tree Source / Binary',
    category: 'Kernel',
    def: "Hardware description files. DTS is the human-readable source; DTB is the compiled binary loaded by the bootloader. Matched to drivers via 'compatible' strings.",
    simpleDef: 'Hardware description files that tell the Linux kernel what physical chips, pins, and memory addresses exist on the circuit board.',
    analogy: 'Like a detailed electrical wiring diagram and floorplan for a house.',
  },
  {
    term: 'ftrace',
    full: 'Function Tracer',
    category: 'Kernel',
    def: 'A kernel tracing framework accessed via /sys/kernel/tracing. Records function graphs, scheduling events (sched_switch), and tracepoints.',
    simpleDef: 'A high-speed kernel recording system that records which CPU ran which task, when thread switches occurred, and how long functions took.',
    analogy: 'Like a black-box flight recorder on an airplane documenting every knob turned and speed change in milliseconds.',
  },

  // --- Testing ---
  {
    term: 'CTS',
    full: 'Compatibility Test Suite',
    category: 'Testing',
    def: "Android's compatibility test suite. Verifies that a device meets the Android Compatibility Definition Document (CDD). Required for GMS certification.",
    simpleDef: 'An automated testing battery with over 1 million test cases that every Android phone must pass before it is allowed to include Google Play.',
    analogy: 'Like a government crash-safety and emissions test required before any new car model can be sold on public roads.',
  },
  {
    term: 'atest',
    full: 'Android Test Runner',
    category: 'Testing',
    def: 'A command-line tool for running Android tests locally. Builds the test module, pushes it to device, runs it, and reports results.',
    simpleDef: 'The everyday terminal command for engineers that automatically finds, builds, installs, and executes unit tests on your device.',
    analogy: 'Like a one-click "Run All Tests" button that automatically sets up and cleans up test benches.',
  },

  // --- Security & Sandboxing ---
  {
    term: 'AVC',
    full: 'Access Vector Cache',
    category: 'Security',
    def: 'The kernel cache storing SELinux access decisions. An "avc: denied" log entry in dmesg indicates an unauthorized operation blocked by policy.',
    simpleDef: 'The kernel security cache. When you see "avc: denied" in logs, it means SELinux blocked an unauthorized file read or system call.',
    analogy: 'Like an automated building security log: "Badge #42 denied entry to Server Room at 03:14 AM".',
  },
  {
    term: 'AVB',
    full: 'Android Verified Boot 2.0',
    category: 'Security',
    def: 'Cryptographic chain of trust using vbmeta signatures and dm-verity to authenticate all system images before execution.',
    simpleDef: 'A cryptographic chain of security keys that verifies whether your bootloader, kernel, and system partitions were modified or tampered with before booting.',
    analogy: 'Like tamper-evident wax seals on legal envelopes: if the wax seal is broken, the receiver rejects the letter.',
  },
  {
    term: 'dm-verity',
    full: 'Device-Mapper Verity',
    category: 'Security',
    def: 'A kernel feature that uses transparent Merkle cryptographic hash trees to ensure read-only block devices (/system, /vendor) have not been modified.',
    simpleDef: 'A transparent disk verification feature that checks memory hash trees block-by-block. If a single byte is changed, the phone refuses to read it.',
    analogy: 'Like a barcode scanner checking every item on a grocery shelf against a central database before allowing it to be purchased.',
  },

  // --- Device & Deployment ---
  {
    term: 'adb',
    full: 'Android Debug Bridge',
    category: 'Device',
    def: 'Command-line tool providing shell access, file transfer, and logging over USB/TCP for device debugging.',
    simpleDef: 'The primary command-line tool connecting your development computer to your Android phone for running shells, installing apps, and viewing logs.',
    analogy: 'Like a secure direct USB cable console between your computer and the phone operating system.',
  },
  {
    term: 'Cuttlefish',
    full: 'Cuttlefish Virtual Device',
    category: 'Device',
    def: "Google's configurable Android virtual reference device running upstream AOSP in crosvm with WebRTC remote desktop access.",
    simpleDef: "Google's official virtual reference Android phone running in Linux virtualization (KVM) with full upstream AOSP parity.",
    analogy: 'Like a high-fidelity flight simulator: pilots practice landings safely on a simulator before flying real multi-million dollar jets.',
  },
  {
    term: 'super.img',
    full: 'Dynamic Partitions Container',
    category: 'Device',
    def: 'A single physical partition that dynamically hosts resizeable sub-partitions (system, vendor, product) using Linux dm-linear.',
    simpleDef: 'A single physical storage partition that flexes to contain dynamic OS partitions (system, vendor, product) without requiring fixed partition sizes.',
    analogy: 'Like an accordion folder: you can adjust the pocket sizes inside as needed without buying a new physical folder.',
  },

  // --- Debugging ---
  {
    term: 'dmesg',
    full: 'Kernel Ring Buffer',
    category: 'Debugging',
    def: "Prints the kernel log buffer. Shows boot messages, driver init, SELinux AVC denials, and kernel Oops crashes.",
    simpleDef: 'The command that dumps the Linux kernel message log, showing driver initialization, hardware detection, and security denials.',
    analogy: 'Like a ship captain engine room journal recording every valve open, temperature warning, and engine start.',
  },
  {
    term: 'logcat',
    full: 'Android Logcat System',
    category: 'Debugging',
    def: 'Android multi-buffer logging tool capturing logs from apps, system_server, and native daemons across main, system, and crash buffers.',
    simpleDef: "Android's live logging terminal that displays print statements, errors, and warnings from Java apps, system server, and native C++ daemons.",
    analogy: 'Like a live digital ticker tape reporting every transaction happening inside a bustling financial exchange.',
  },
  {
    term: 'ndk-stack',
    full: 'NDK Stack Symbolizer',
    category: 'Debugging',
    def: 'Host utility converting raw hex memory addresses in crash tombstones into exact C++ source file names and line numbers.',
    simpleDef: 'A developer tool that translates incomprehensible hexadecimal crash numbers (e.g. 0x7fa289c) into readable C++ filenames and line numbers.',
    analogy: 'Like a GPS translator that converts raw latitude/longitude coordinates (37.422, -122.084) into "Googleplex Main Building, Room 101".',
  },
  {
    term: 'Perfetto',
    full: 'Perfetto Tracing Platform',
    category: 'Debugging',
    def: 'The unified system-wide performance profiling tool for Android capturing thread scheduling, Binder IPC, and graphics frames.',
    simpleDef: 'The unified system performance analyzer for Android that displays CPU thread scheduling, Binder transactions, and dropped frames on a visual timeline.',
    analogy: 'Like an advanced heart monitor in an ICU displaying blood pressure, heart rate, and oxygen levels simultaneously on one synchronized graph.',
  },
  {
    term: 'tombstone',
    full: 'Tombstone (Crash Dump)',
    category: 'Debugging',
    def: 'Post-mortem crash dump file in /data/tombstones/ written by debuggerd containing CPU registers, backtraces, and memory maps.',
    simpleDef: 'A detailed post-mortem crash report saved when a native C/C++ program dies, recording CPU registers, backtrace stacks, and memory states.',
    analogy: 'Like a coroner autopsy report explaining exactly when, where, and why a process stopped breathing.',
  },
];

// Sort alphabetically by default
const DEFAULT_SORTED = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
const CATEGORIES = [...new Set(GLOSSARY.map((g) => g.category))].sort();

export default function Glossary() {
  const [mode, setMode] = useState('list'); // 'list' or 'flashcard'
  const [styleMode, setStyleMode] = useState('technical'); // 'technical' or 'simple'
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
          g.def.toLowerCase().includes(lower) ||
          (g.simpleDef && g.simpleDef.toLowerCase().includes(lower)),
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
      {/* Mode Switcher Tabs */}
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

        {/* Language Style Switcher */}
        <div style={{marginLeft: 'auto', display: 'flex', gap: '0.35rem'}}>
          <button
            type="button"
            className={clsx(
              'button button--sm',
              styleMode === 'technical' ? 'button--primary' : 'button--secondary',
            )}
            onClick={() => setStyleMode('technical')}
            title="Technical AOSP engineering definitions">
            📖 Technical View
          </button>
          <button
            type="button"
            className={clsx(
              'button button--sm',
              styleMode === 'simple' ? 'button--primary' : 'button--secondary',
            )}
            onClick={() => setStyleMode('simple')}
            title="Clean, plain English definitions and real-world analogies">
            💡 Plain English &amp; Analogies
          </button>
        </div>
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
                {styleMode === 'simple' ? (
                  <dd className={styles.def}>
                    <p style={{margin: '0 0 0.35rem', fontWeight: 500}}>
                      {g.simpleDef || g.def}
                    </p>
                    {g.analogy && (
                      <p style={{margin: 0, fontStyle: 'italic', color: 'var(--ifm-color-emphasis-700)', fontSize: '0.88rem'}}>
                        <strong>💡 Everyday Analogy:</strong> {g.analogy}
                      </p>
                    )}
                  </dd>
                ) : (
                  <dd className={styles.def}>{g.def}</dd>
                )}
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
                  <div className={styles.cardHint}>Tap card or press [Space] to reveal definition</div>
                </div>

                {/* Back of card */}
                <div className={styles.cardBack}>
                  <div className={styles.cardBadge}>{currentCard.category}</div>
                  <div className={styles.cardTermSmall}>{currentCard.term}</div>
                  <div className={styles.cardFullName}>{currentCard.full}</div>
                  {styleMode === 'simple' ? (
                    <div>
                      <p className={styles.cardDefinition} style={{marginBottom: '0.5rem'}}>
                        {currentCard.simpleDef || currentCard.def}
                      </p>
                      {currentCard.analogy && (
                        <p style={{fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-700)', fontStyle: 'italic', margin: 0}}>
                          <strong>💡 Analogy:</strong> {currentCard.analogy}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className={styles.cardDefinition}>{currentCard.def}</div>
                  )}
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
