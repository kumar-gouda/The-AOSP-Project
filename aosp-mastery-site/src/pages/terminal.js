import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TerminalSandbox from '@site/src/components/TerminalSandbox';

export default function TerminalPage() {
  return (
    <Layout
      title="Interactive ADB Terminal Sandbox"
      description="Practice real Android Debug Bridge (ADB), Fastboot, and AOSP userspace shell commands directly in your browser.">
      <main className="container margin-vert--lg">
        <Heading as="h1">Interactive ADB Terminal Sandbox</Heading>
        <p>
          Practice interacting with a virtual Android 15 / Linux 6.1 GKI device in real time.
          Inspect running services via <code>adb shell service list</code>, examine declared Treble/AIDL HALs with <code>adb shell lshal</code>, query system properties, toggle SELinux modes, and read simulated kernel driver nodes.
        </p>

        <BrowserOnly fallback={<p>Loading Terminal Sandbox…</p>}>
          {() => <TerminalSandbox />}
        </BrowserOnly>

        <div className="margin-top--md">
          <h3>Suggested Scenarios to Try</h3>
          <ul>
            <li>
              <strong>Query System Properties:</strong> Run <code>adb shell getprop ro.build.version.release</code> to verify Android 15.
            </li>
            <li>
              <strong>Treble &amp; HAL Inspection:</strong> Run <code>adb shell lshal</code> to see the custom AIDL HAL registered under <code>android.hardware.custom/default</code>.
            </li>
            <li>
              <strong>Kernel Module Interaction:</strong> Run <code>adb shell cat /dev/hello_kmod</code> to read directly from the Phase 10 kernel module device node.
            </li>
            <li>
              <strong>SELinux Permissions:</strong> Try running <code>adb shell setenforce 0</code>. Notice it fails until you escalate with <code>adb root</code>!
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}
