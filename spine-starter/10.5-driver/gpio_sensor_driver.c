/**
 * @file gpio_sensor_driver.c
 * @brief Phase 10.5: Linux Platform Driver with Device Tree matching and sysfs attributes.
 */

#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/platform_device.h>
#include <linux/of.h>
#include <linux/mutex.h>
#include <linux/sysfs.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("AOSP Mastery Student");
MODULE_DESCRIPTION("Platform Device Driver for Custom AOSP Sensor");

struct sensor_dev {
    struct mutex lock;
    int sensor_val;
};

static ssize_t sensor_val_show(struct device *dev, struct device_attribute *attr, char *buf) {
    struct sensor_dev *sdev = dev_get_drvdata(dev);
    int val;

    mutex_lock(&sdev->lock);
    val = sdev->sensor_val;
    mutex_unlock(&sdev->lock);

    return sysfs_emit(buf, "%d\n", val);
}

static ssize_t sensor_val_store(struct device *dev, struct device_attribute *attr, const char *buf, size_t count) {
    struct sensor_dev *sdev = dev_get_drvdata(dev);
    int val, ret;

    ret = kstrtoint(buf, 10, &val);
    if (ret < 0) return ret;

    mutex_lock(&sdev->lock);
    sdev->sensor_val = val;
    mutex_unlock(&sdev->lock);

    return count;
}

static DEVICE_ATTR_RW(sensor_val);

static struct attribute *sensor_attrs[] = {
    &dev_attr_sensor_val.attr,
    NULL,
};
ATTRIBUTE_GROUPS(sensor);

static int sensor_probe(struct platform_device *pdev) {
    struct sensor_dev *sdev;
    pr_info("sensor_driver: Probing platform device: %s\n", pdev->name);

    sdev = devm_kzalloc(&pdev->dev, sizeof(*sdev), GFP_KERNEL);
    if (!sdev) return -ENOMEM;

    mutex_init(&sdev->lock);
    sdev->sensor_val = 1234; // Initial baseline value

    platform_set_drvdata(pdev, sdev);
    pr_info("sensor_driver: Probe succeeded!\n");
    return 0;
}

static int sensor_remove(struct platform_device *pdev) {
    pr_info("sensor_driver: Removing platform device: %s\n", pdev->name);
    return 0;
}

static const struct of_device_id sensor_of_match[] = {
    { .compatible = "aosp,custom-sensor-v1", },
    { /* sentinel */ }
};
MODULE_DEVICE_TABLE(of, sensor_of_match);

static struct platform_driver sensor_platform_driver = {
    .probe = sensor_probe,
    .remove = sensor_remove,
    .driver = {
        .name = "aosp_custom_sensor",
        .of_match_table = sensor_of_match,
        .dev_groups = sensor_groups,
    },
};

module_platform_driver(sensor_platform_driver);
