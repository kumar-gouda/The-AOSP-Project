package android.hardware.custom;

/**
 * AIDL HAL Interface for Custom Hardware Peripheral.
 * VINTF-stable interface providing vendor hardware access to system server.
 */
@VintfStability
interface ICustomDevice {
    /**
     * Read current hardware telemetry counter.
     */
    int getSensorValue();

    /**
     * Configure operating power mode.
     */
    void setPowerMode(in int mode);
}
