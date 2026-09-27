/**
 * @file shm_producer.c
 * @brief Phase 1 IPC: POSIX Shared Memory Producer
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
#include <semaphore.h>

#define SHM_NAME "/aosp_mastery_shm"
#define SEM_MUTEX "/aosp_sem_mutex"
#define SHM_SIZE 4096

struct ShmPayload {
    uint32_t sequence_id;
    char message[256];
};

int main(void) {
    printf("[Producer] Opening shared memory region: %s\n", SHM_NAME);

    // 1. Create or open shared memory
    int shm_fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0660);
    if (shm_fd == -1) {
        perror("shm_open failed");
        return 1;
    }

    // 2. Set the size of the shared memory region
    if (ftruncate(shm_fd, SHM_SIZE) == -1) {
        perror("ftruncate failed");
        close(shm_fd);
        return 1;
    }

    // 3. Map shared memory into process address space
    struct ShmPayload *shm_ptr = mmap(NULL, sizeof(struct ShmPayload),
                                      PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    if (shm_ptr == MAP_FAILED) {
        perror("mmap failed");
        close(shm_fd);
        return 1;
    }

    // 4. Open named semaphore for synchronization
    sem_t *sem = sem_open(SEM_MUTEX, O_CREAT, 0660, 1);
    if (sem == SEM_FAILED) {
        perror("sem_open failed");
        munmap(shm_ptr, sizeof(struct ShmPayload));
        close(shm_fd);
        return 1;
    }

    // 5. Write data with lock
    sem_wait(sem);
    shm_ptr->sequence_id = 1001;
    snprintf(shm_ptr->message, sizeof(shm_ptr->message), "Hello from AOSP IPC producer!");
    printf("[Producer] Wrote sequence %u: '%s'\n", shm_ptr->sequence_id, shm_ptr->message);
    sem_post(sem);

    // Cleanup resources
    sem_close(sem);
    munmap(shm_ptr, sizeof(struct ShmPayload));
    close(shm_fd);
    return 0;
}
