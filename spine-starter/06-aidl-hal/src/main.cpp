#include "CustomDevice.hpp"
#include <android/binder_manager.h>
#include <android/binder_process.h>
#include <android-base/logging.h>

using aidl::android::hardware::custom::CustomDevice;

int main() {
    ABinderProcess_setThreadPoolMaxThreadCount(0);

    std::shared_ptr<CustomDevice> service = ndk::SharedRefBase::make<CustomDevice>();
    const std::string instance = std::string(CustomDevice::descriptor) + "/default";

    binder_status_t status = AServiceManager_addService(service->asBinder().get(), instance.c_str());
    CHECK_EQ(status, STATUS_OK);

    LOG(INFO) << "CustomDevice AIDL HAL started with instance: " << instance;
    ABinderProcess_joinThreadPool();

    return EXIT_FAILURE; // Should not reach here
}
