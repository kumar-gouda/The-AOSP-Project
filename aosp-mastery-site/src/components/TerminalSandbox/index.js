import React, {useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Interactive In-Browser Mock ADB / Fastboot Terminal Sandbox.
 * Simulates an Android developer workstation connected to an AOSP Cuttlefish/Pixel target.
 */

const DEFAULT_PROPERTIES = {
  'ro.build.version.release': '15',
  'ro.build.version.sdk': '35',
  'ro.product.model': 'Cuttlefish x86_64 phone',
  'ro.product.manufacturer': 'Google',
  'ro.product.device': 'vsoc_x86_64',
  'ro.boot.verifiedbootstate': 'green',
  'ro.boot.slot_suffix': '_a',
  'sys.boot_completed': '1',
  'init.svc.my_daemon': 'running',
  'init.svc.servicemanager': 'running',
  'init.svc.surfaceflinger': 'running',
  'vendor.custom.power_mode': '1',
};

const INITIAL_HISTORY = [
  {
    type: 'banner',
    text: [
      '=========================================================================',
      '  AOSP Mastery: In-Browser Mock ADB & Fastboot Sandbox',
      '  Connected Target: cuttlefish-cvd-01 (Android 15 / Linux 6.1 GKI)',
      '  Type "help" to see available commands, or click quick buttons below.',
      '=========================================================================',
    ],
  },
];

const PRESET_COMMANDS = [
  'adb devices',
  'adb root',
  'adb shell getenforce',
  'adb shell getprop ro.build.version.release',
  'adb shell service list',
  'adb shell lshal',
  'adb shell cat /dev/hello_kmod',
  'adb shell logcat -d -b events',
  'adb shell ps -A',
  'fastboot devices',
];

export default function TerminalSandbox() {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isRoot, setIsRoot] = useState(false);
  const [selinuxEnforcing, setSelinuxEnforcing] = useState(true);
  const [properties, setProperties] = useState(DEFAULT_PROPERTIES);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [history]);

  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Add to command history
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputLines = [];

    if (mainCmd === 'clear' || mainCmd === 'cls') {
      setHistory([]);
      return;
    }

    if (mainCmd === 'help' || mainCmd === '?') {
      outputLines = [
        'Available Mock Commands:',
        '  adb devices                     - List connected Android targets',
        '  adb root                        - Restart adbd with root UID 0 permissions',
        '  adb shell getenforce            - Check SELinux status (Enforcing / Permissive)',
        '  adb shell setenforce <0|1>      - Switch SELinux enforcing state',
        '  adb shell getprop [key]         - Query system properties',
        '  adb shell setprop <key> <val>   - Set system property',
        '  adb shell service list          - List registered Binder services',
        '  adb shell lshal                 - List Treble/AIDL HAL interfaces',
        '  adb shell ps -A                 - Display running userspace processes',
        '  adb shell cat /dev/hello_kmod   - Read from Phase 10 kernel module device node',
        '  adb shell cat /proc/version     - Display Linux GKI kernel version info',
        '  adb shell logcat -d             - Dump system log buffer',
        '  fastboot devices                - List devices in bootloader mode',
        '  fastboot getvar all             - Inspect bootloader / partition variables',
        '  clear                           - Clear the terminal screen',
      ];
    } else if (mainCmd === 'adb') {
      const sub = args[0];
      if (sub === 'devices') {
        outputLines = [
          'List of devices attached',
          'cuttlefish-cvd-01      device product:vsoc_x86_64 model:Cuttlefish_phone device:vsoc_x86_64 transport_id:1',
          'emulator-5554          device product:sdk_gphone64_x86_64 model:Android_SDK_built_for_x86_64 device:emulator64_x86_64 transport_id:2',
        ];
      } else if (sub === 'root') {
        setIsRoot(true);
        outputLines = [
          'restarting adbd as root',
          'adbd is now running as root (UID 0)',
        ];
      } else if (sub === 'shell') {
        const shellCmd = args[1];
        const shellArgs = args.slice(2);

        if (!shellCmd) {
          outputLines = ['Interactive adb shell session simulated. Type full "adb shell <command>".'];
        } else if (shellCmd === 'getenforce') {
          outputLines = [selinuxEnforcing ? 'Enforcing' : 'Permissive'];
        } else if (shellCmd === 'setenforce') {
          if (!isRoot) {
            outputLines = ['setenforce: Operation not permitted (run "adb root" first)'];
          } else {
            const val = shellArgs[0];
            if (val === '0' || val?.toLowerCase() === 'permissive') {
              setSelinuxEnforcing(false);
              outputLines = ['SELinux mode set to Permissive.'];
            } else if (val === '1' || val?.toLowerCase() === 'enforcing') {
              setSelinuxEnforcing(true);
              outputLines = ['SELinux mode set to Enforcing.'];
            } else {
              outputLines = ['Usage: adb shell setenforce [0|1]'];
            }
          }
        } else if (shellCmd === 'getprop') {
          const key = shellArgs[0];
          if (key) {
            outputLines = [properties[key] || ''];
          } else {
            outputLines = Object.entries(properties).map(([k, v]) => `[${k}]: [${v}]`);
          }
        } else if (shellCmd === 'setprop') {
          const key = shellArgs[0];
          const val = shellArgs.slice(1).join(' ');
          if (key && val) {
            setProperties((prev) => ({...prev, [key]: val}));
            outputLines = [`Property [${key}] set to [${val}]`];
          } else {
            outputLines = ['Usage: adb shell setprop <key> <value>'];
          }
        } else if (shellCmd === 'service') {
          const action = shellArgs[0];
          if (action === 'list') {
            outputLines = [
              'Found 9 services:',
              '0\tandroid.hardware.custom: [android.hardware.custom.ICustomDevice]',
              '1\tcustom_manager: [android.os.ICustomManager]',
              '2\tactivity: [android.app.IActivityManager]',
              '3\tpackage: [android.content.pm.IPackageManager]',
              '4\tsurfaceflinger: [android.ui.ISurfaceComposer]',
              '5\tsensorservice: [android.gui.SensorServer]',
              '6\tpower: [android.os.IPowerManager]',
              '7\tinput: [android.hardware.input.IInputManager]',
              '8\twindow: [android.view.IWindowManager]',
            ];
          } else {
            outputLines = ['Usage: adb shell service list'];
          }
        } else if (shellCmd === 'lshal') {
          outputLines = [
            'All declared HAL interfaces on cuttlefish-cvd-01 (VINTF matrix matched):',
            'Interface                                   Transport   Arch    Server PID',
            'android.hardware.custom/default             aidl        64      842 (/vendor/bin/hw/android.hardware.custom-service)',
            'android.hardware.graphics.allocator-V2/default aidl     64      520 (/vendor/bin/hw/android.hardware.graphics.allocator-service)',
            'android.hardware.graphics.composer-V2/default  aidl     64      528 (/vendor/bin/hw/android.hardware.graphics.composer-service)',
            'android.hardware.health-V2/default          aidl        64      412 (/vendor/bin/hw/android.hardware.health-service)',
            'android.hardware.vibrator-V2/default        aidl        64      610 (/vendor/bin/hw/android.hardware.vibrator-service)',
          ];
        } else if (shellCmd === 'ps') {
          outputLines = [
            'USER           PID  PPID     VSZ    RSS WCHAN            ADDR S NAME',
            'root             1     0   22304   4320 0                   0 S init',
            'system         412     1   18420   3100 binder_thread_read  0 S android.hardware.health-service',
            'system         842     1   24512   4210 binder_thread_read  0 S android.hardware.custom-service',
            'root          1002     1   12400   2100 hr_timer_nanosleep  0 S my_daemon',
            'root          1205     1 3918204 112340 poll_schedule       0 S zygote64',
            'system        1520  1205 4812392 284512 epoll_wait          0 S system_server',
          ];
        } else if (shellCmd === 'cat') {
          const targetPath = shellArgs[0];
          if (targetPath === '/dev/hello_kmod') {
            outputLines = [
              'AOSP kmod alive! Read count: 1',
              '[Kernel Misc Device: minor dynamic node /dev/hello_kmod functioning]',
            ];
          } else if (targetPath === '/proc/version') {
            outputLines = [
              'Linux version 6.1.75-android15-gki-g9a38f (toolchain Clang 18.0.1) #1 SMP PREEMPT Wed Feb 14 01:23:45 UTC 2026',
            ];
          } else if (targetPath === '/proc/cmdline') {
            outputLines = [
              'console=ttyS0 androidboot.hardware=cutf_cvd androidboot.verifiedbootstate=green androidboot.slot_suffix=_a firmware_class.path=/vendor/firmware init=/init',
            ];
          } else {
            outputLines = [`cat: ${targetPath}: No such file or directory`];
          }
        } else if (shellCmd === 'logcat') {
          outputLines = [
            '--------- beginning of system',
            '09-27 05:42:01.102  1520  1520 I SystemServer: Starting CustomManagerService...',
            '09-27 05:42:01.105  1520  1520 I CustomManagerService: CustomManagerService initialized in system_server',
            '09-27 05:42:01.120   842   842 I CustomDevice: CustomDevice AIDL HAL started with instance: android.hardware.custom.ICustomDevice/default',
            '09-27 05:42:01.135  1002  1002 I my_daemon: Initializing with PID: 1002, capability NET_ADMIN verified',
            '--------- beginning of events',
            '09-27 05:42:02.001  1520  1530 I boot_progress_enable_screen: 2410',
          ];
        } else {
          outputLines = [`${shellCmd}: command not found in simulated AOSP userspace`];
        }
      } else {
        outputLines = [`Unknown adb subcommand: ${sub}. Type "help" for syntax.`];
      }
    } else if (mainCmd === 'fastboot') {
      const sub = args[0];
      if (sub === 'devices') {
        outputLines = [
          '28041FDH3004TK        fastboot',
        ];
      } else if (sub === 'getvar') {
        const varName = args[1];
        if (varName === 'all') {
          outputLines = [
            '(bootloader) version: 0.5',
            '(bootloader) version-bootloader: slider-1.2-10823912',
            '(bootloader) version-baseband: g5300g-230302-230508-B-101',
            '(bootloader) product: panther',
            '(bootloader) secure: yes',
            '(bootloader) unlocked: yes',
            '(bootloader) is-userspace: no',
            '(bootloader) current-slot: a',
            '(bootloader) slot-count: 2',
            '(bootloader) slot-successful:a: yes',
            '(bootloader) slot-unbootable:a: no',
            '(bootloader) partition-type:super: raw',
            'all: Done',
          ];
        } else {
          outputLines = [`(bootloader) ${varName}: val`, 'Finished. Total time: 0.002s'];
        }
      } else {
        outputLines = [`Unknown fastboot command: ${sub}`];
      }
    } else {
      outputLines = [`bash: ${mainCmd}: command not found. Type 'help' for available commands.`];
    }

    setHistory((prev) => [
      ...prev,
      {type: 'cmd', text: trimmed, prompt: isRoot ? 'root@cuttlefish:#' : 'user@workstation:~$'},
      {type: 'output', text: outputLines},
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    executeCommand(inputVal);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(cmdHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    }
  };

  return (
    <div className={styles.terminalWrapper}>
      {/* Terminal Title Bar */}
      <div className={styles.terminalHeader}>
        <div className={styles.windowControls}>
          <span className={clsx(styles.dot, styles.dotRed)} />
          <span className={clsx(styles.dot, styles.dotYellow)} />
          <span className={clsx(styles.dot, styles.dotGreen)} />
        </div>
        <div className={styles.terminalTitle}>
          adb shell &mdash; cuttlefish-cvd-01 {isRoot ? '(root)' : '(shell)'}
        </div>
        <div className={styles.headerBadges}>
          <span className={clsx(styles.statusBadge, isRoot ? styles.badgeRoot : styles.badgeUser)}>
            {isRoot ? 'ROOT # ' : 'SHELL $ '}
          </span>
          <span className={clsx(styles.statusBadge, selinuxEnforcing ? styles.badgeEnforcing : styles.badgePermissive)}>
            SELinux: {selinuxEnforcing ? 'Enforcing' : 'Permissive'}
          </span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        className={styles.terminalBody}
        onClick={() => inputRef.current?.focus()}>
        {history.map((entry, idx) => {
          if (entry.type === 'banner') {
            return (
              <div key={idx} className={styles.bannerBlock}>
                {entry.text.map((line, lIdx) => (
                  <div key={lIdx} className={styles.bannerLine}>{line}</div>
                ))}
              </div>
            );
          }
          if (entry.type === 'cmd') {
            return (
              <div key={idx} className={styles.cmdLine}>
                <span className={styles.prompt}>{entry.prompt} </span>
                <span className={styles.cmdEntered}>{entry.text}</span>
              </div>
            );
          }
          return (
            <div key={idx} className={styles.outputBlock}>
              {entry.text.map((line, lIdx) => (
                <div key={lIdx} className={styles.outputLine}>{line}</div>
              ))}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Form */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <span className={styles.prompt}>
          {isRoot ? 'root@cuttlefish:#' : 'user@workstation:~$'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.terminalInput}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder="Type an adb / fastboot command..."
        />
      </form>

      {/* Quick Action Pills */}
      <div className={styles.quickCommands}>
        <span className={styles.quickLabel}>Quick Run:</span>
        <div className={styles.pillsList}>
          {PRESET_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className={styles.pill}
              onClick={() => executeCommand(cmd)}>
              {cmd}
            </button>
          ))}
          <button
            type="button"
            className={clsx(styles.pill, styles.pillClear)}
            onClick={() => setHistory([])}>
            clear
          </button>
        </div>
      </div>
    </div>
  );
}
