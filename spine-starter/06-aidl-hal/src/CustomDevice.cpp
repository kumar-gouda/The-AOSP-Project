#include "CustomDevice.hpp"
#include <android-base/logging.h>

namespace aidl::android::hardware::custom {

CustomDevice::CustomDevice() : m_current_mode(0), m_sensor_counter(100) {}

::ndk::ScopedAStatus CustomDevice::getSensorValue(int32_t* _aidl_return) {
    if (!_aidl_return) {
        return ::ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    }
    // TODO: Read from sysfs /dev/custom_sensor node in real hardware bringup
    *_aidl_return = ++m_sensor_counter;
    LOG(INFO) << "CustomDevice HAL: getSensorValue returning " << *_aidl_return;
    return ::ndk::ScopedAStatus::ok();
}

::ndk::ScopedAStatus CustomDevice::setPowerMode(int32_t in_mode) {
    // TODO: Validate mode bounds (0 = STANDBY, 1 = ACTIVE, 2 = TURBO)
    m_current_mode = in_mode;
    LOG(INFO) << "CustomDevice HAL: power mode updated to " << m_current_mode;
    return ::ndk::ScopedAStatus::ok();
}

} // namespace aidl::android::hardware::custom
