package android.os;

/**
 * System Server AIDL interface exposed to Android Apps and Framework clients.
 * {@hide}
 */
interface ICustomManager {
    int getStatus();
    void triggerCalibration();
}
