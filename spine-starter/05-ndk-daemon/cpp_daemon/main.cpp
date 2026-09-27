#include <android/binder_ibinder.h>
#include <android/binder_manager.h>
#include <android/binder_process.h>
#include <android-base/logging.h>
#include <iostream>

int main() {
    LOG(INFO) << "Starting Native NDK Binder Daemon...";

    // Configure thread pool for incoming binder calls
    ABinderProcess_setThreadPoolMaxThreadCount(4);
    ABinderProcess_startThreadPool();

    LOG(INFO) << "NDK Thread pool ready. Entering join loop.";
    ABinderProcess_joinThreadPool();

    return 0;
}
