# Phase 15 Capstone: Full Vertical Slice Engineering Checklist

The Capstone artifact (`spine/15-full`) represents the culmination of the entire AOSP Mastery journey: a fully integrated, production-grade end-to-end subsystem running from the bare hardware kernel driver through the Android framework to CTS test pass.

---

## The 6-Layer Architecture Stack

```
[ CTS Compatibility Test ]  -> CtsCustomDeviceTestCases (Java / TradeFed)
          │
[ Framework Service ]       -> CustomManagerService.java (system_server, AIDL)
          │
[ SELinux Boundary ]        -> my_daemon.te & file_contexts (type enforcement)
          │
[ Hardware Abstraction ]    -> android.hardware.custom AIDL HAL (libbinder_ndk)
          │
[ Kernel Driver ]           -> gpio_sensor_driver.c (Linux platform driver / sysfs)
          │
[ Physical / QEMU Device ]  -> Device Tree binding & Hardware registers
```

---

## Capstone Verification Checklist

1. [ ] **Kernel Driver Active**: `dmesg | grep custom_sensor` displays probe success.
2. [ ] **Sysfs Exposure**: `/sys/devices/platform/aosp_custom_sensor/sensor_val` is readable.
3. [ ] **AIDL HAL Registered**: `lshal | grep custom` shows `android.hardware.custom/default` declared and serving.
4. [ ] **SELinux Enforcing Mode**: `getenforce` reports `Enforcing`. No `avc: denied` logs for `custom_service` in `logcat -b events`.
5. [ ] **System Service Bound**: `dumpsys custom` prints current telemetry and calibration counter.
6. [ ] **CTS Pass**: `atest CtsCustomDeviceTestCases` passes 100% of test assertions.
