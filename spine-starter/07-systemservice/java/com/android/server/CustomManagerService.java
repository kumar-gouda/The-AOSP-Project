package com.android.server;

import android.content.Context;
import android.os.Binder;
import android.os.ICustomManager;
import android.util.Slog;

/**
 * System Service implementation running inside system_server.
 * Enforces calling permissions before delegating to HAL layer.
 */
public class CustomManagerService extends ICustomManager.Stub {
    private static final String TAG = "CustomManagerService";
    private static final String PERMISSION_ACCESS = "android.permission.HARDWARE_TEST";

    private final Context mContext;
    private int mCalibrationCount = 0;

    public CustomManagerService(Context context) {
        mContext = context;
        Slog.i(TAG, "CustomManagerService initialized in system_server");
    }

    @Override
    public int getStatus() {
        enforceCallingPermission();
        return 1; // 1 = OPERATIONAL
    }

    @Override
    public void triggerCalibration() {
        enforceCallingPermission();
        final long ident = Binder.clearCallingIdentity();
        try {
            mCalibrationCount++;
            Slog.i(TAG, "Triggered hardware calibration (count=" + mCalibrationCount + ")");
        } finally {
            Binder.restoreCallingIdentity(ident);
        }
    }

    private void enforceCallingPermission() {
        mContext.enforceCallingOrSelfPermission(
            PERMISSION_ACCESS,
            "Must hold " + PERMISSION_ACCESS + " to interact with CustomManagerService"
        );
    }
}
