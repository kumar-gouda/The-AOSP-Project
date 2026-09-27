/**
 * @file abi_probe.c
 * @brief Systems-C ABI Prober: Demonstrating struct packing, endianness,
 *        alignment, container_of, and volatile hardware semantics.
 */

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

/* Linux kernel container_of macro definition */
#ifndef container_of
#define container_of(ptr, type, member) ({                      \
        const __typeof__( ((type *)0)->member ) *__mptr = (ptr); \
        (type *)( (char *)__mptr - offsetof(type,member) );})
#endif

/* Unaligned natural struct */
struct NaturalLayout {
    uint8_t  flag;
    uint32_t val32;
    uint16_t val16;
    uint64_t val64;
};

/* Packed struct (e.g. over-the-wire IPC header or hardware register map) */
struct __attribute__((packed)) PackedLayout {
    uint8_t  flag;
    uint32_t val32;
    uint16_t val16;
    uint64_t val64;
};

/* Container struct demonstrating container_of */
struct KernelListHead {
    struct KernelListHead *next, *prev;
};

struct DriverNode {
    int device_id;
    char name[32];
    struct KernelListHead list;
};

static void probe_endianness(void) {
    uint32_t test_val = 0x01020304;
    uint8_t *byte_ptr = (uint8_t *)&test_val;

    printf("=== 1. Endianness Probe ===\n");
    if (byte_ptr[0] == 0x04) {
        printf("  Architecture: Little-Endian (Standard x86_64 / ARM64 Android)\n");
    } else if (byte_ptr[0] == 0x01) {
        printf("  Architecture: Big-Endian\n");
    } else {
        printf("  Architecture: Unknown / Mixed Endian\n");
    }
}

static void probe_struct_alignment(void) {
    printf("\n=== 2. Struct Alignment & Padding Probe ===\n");
    printf("  NaturalLayout sizeof: %zu bytes\n", sizeof(struct NaturalLayout));
    printf("    offsetof(flag):  %zu\n", offsetof(struct NaturalLayout, flag));
    printf("    offsetof(val32): %zu\n", offsetof(struct NaturalLayout, val32));
    printf("    offsetof(val16): %zu\n", offsetof(struct NaturalLayout, val16));
    printf("    offsetof(val64): %zu\n", offsetof(struct NaturalLayout, val64));

    printf("  PackedLayout sizeof:  %zu bytes\n", sizeof(struct PackedLayout));
    printf("    offsetof(flag):  %zu\n", offsetof(struct PackedLayout, flag));
    printf("    offsetof(val32): %zu\n", offsetof(struct PackedLayout, val32));
    printf("    offsetof(val16): %zu\n", offsetof(struct PackedLayout, val16));
    printf("    offsetof(val64): %zu\n", offsetof(struct PackedLayout, val64));
}

static void probe_container_of(void) {
    printf("\n=== 3. Linux Kernel container_of() Probe ===\n");
    struct DriverNode node = {
        .device_id = 42,
        .name = "binder_allocator",
        .list = { NULL, NULL }
    };

    struct KernelListHead *list_ptr = &node.list;
    // Recover enclosing DriverNode from embedded list head
    struct DriverNode *recovered = container_of(list_ptr, struct DriverNode, list);

    printf("  Original struct address:  %p\n", (void *)&node);
    printf("  Embedded list address:    %p (offset: %zu)\n", (void *)list_ptr, offsetof(struct DriverNode, list));
    printf("  Recovered struct address: %p\n", (void *)recovered);
    printf("  Recovered device_id:      %d (%s)\n", recovered->device_id,
           (recovered->device_id == 42) ? "SUCCESS" : "CORRUPT");
}

int main(void) {
    printf("====================================================\n");
    printf(" AOSP Mastery: Systems-C ABI & Memory Layout Probe\n");
    printf("====================================================\n");

    probe_endianness();
    probe_struct_alignment();
    probe_container_of();

    return 0;
}
