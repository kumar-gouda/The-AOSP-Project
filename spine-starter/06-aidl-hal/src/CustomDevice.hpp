#pragma once

#include <aidl/android/hardware/custom/BnCustomDevice.h>

namespace aidl::android::hardware::custom {

class CustomDevice : public BnCustomDevice {
public:
    CustomDevice();
    virtual ~CustomDevice() = default;

    ::ndk::ScopedAStatus getSensorValue(int32_t* _aidl_return) override;
    ::ndk::ScopedAStatus setPowerMode(int32_t in_mode) override;

private:
    int32_t m_current_mode;
    int32_t m_sensor_counter;
};

} // namespace aidl::android::hardware::custom
