# Pixel Bring-Up Device Makefile starter
PRODUCT_NAME := aosp_pixel_custom
PRODUCT_DEVICE := custom_pixel
PRODUCT_BRAND := Android
PRODUCT_MODEL := AOSP Pixel Custom Device
PRODUCT_MANUFACTURER := CustomOEM

# Inherit from core AOSP device configurations
$(call inherit-product, $(SRC_TARGET_DIR)/product/core_64_bit.mk)
$(call inherit-product, $(SRC_TARGET_DIR)/product/full_base_telephony.mk)

# Include HAL service binaries and VINTF manifests
PRODUCT_PACKAGES += \
    android.hardware.custom-service

# Device overlays
DEVICE_PACKAGE_OVERLAYS += device/custom/pixel/overlay
