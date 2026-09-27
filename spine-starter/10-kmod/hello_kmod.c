/**
 * @file hello_kmod.c
 * @brief Phase 10: Out-of-tree Linux Kernel Module with miscdevice interface.
 */

#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/miscdevice.h>
#include <linux/uaccess.h>
#include <linux/spinlock.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("AOSP Mastery Student");
MODULE_DESCRIPTION("Sample AOSP Kernel Module with Misc Device");
MODULE_VERSION("1.0");

static DEFINE_SPINLOCK(kmod_lock);
static int read_count = 0;

static ssize_t kmod_read(struct file *file, char __user *buf, size_t count, loff_t *ppos) {
    char message[64];
    int len;
    unsigned long flags;

    spin_lock_irqsave(&kmod_lock, flags);
    read_count++;
    len = snprintf(message, sizeof(message), "AOSP kmod alive! Read count: %d\n", read_count);
    spin_unlock_irqrestore(&kmod_lock, flags);

    return simple_read_from_buffer(buf, count, ppos, message, len);
}

static const struct file_operations kmod_fops = {
    .owner = THIS_MODULE,
    .read  = kmod_read,
};

static struct miscdevice kmod_device = {
    .minor = MISC_DYNAMIC_MINOR,
    .name  = "hello_kmod",
    .fops  = &kmod_fops,
    .mode  = 0666,
};

static int __init hello_kmod_init(void) {
    int ret = misc_register(&kmod_device);
    if (ret) {
        pr_err("hello_kmod: Failed to register misc device: %d\n", ret);
        return ret;
    }
    pr_info("hello_kmod: Registered /dev/hello_kmod (minor: %d)\n", kmod_device.minor);
    return 0;
}

static void __exit hello_kmod_exit(void) {
    misc_deregister(&kmod_device);
    pr_info("hello_kmod: Deregistered /dev/hello_kmod. Goodbye!\n");
}

module_init(hello_kmod_init);
module_exit(hello_kmod_exit);
