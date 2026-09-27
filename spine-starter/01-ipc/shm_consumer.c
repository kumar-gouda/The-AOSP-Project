/**
 * @file shm_consumer.c
 * @brief Phase 1 IPC: POSIX Shared Memory Consumer
 */

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
#include <semaphore.h>

#define SHM_NAME "/aosp_mastery_shm"
#define SEM_MUTEX "/aosp_sem_mutex"

struct ShmPayload {
    uint32_t sequence_id;
    char message[256];
};

int main(void) {
    printf("[Consumer] Connecting to shared memory: %s\n", SHM_NAME);

    int shm_fd = shm_open(SHM_NAME, O_RDWR, 0660);
    if (shm_fd == -1) {
        perror("shm_open failed. Ensure producer has run first");
        return 1;
    }

    struct ShmPayload *shm_ptr = mmap(NULL, sizeof(struct ShmPayload),
                                      PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
    if (shm_ptr == MAP_FAILED) {
        perror("mmap failed");
        close(shm_fd);
        return 1;
    }

    sem_t *sem = sem_open(SEM_MUTEX, 0);
    if (sem == SEM_FAILED) {
        perror("sem_open failed");
        munmap(shm_ptr, sizeof(struct ShmPayload));
        close(shm_fd);
        return 1;
    }

    sem_wait(sem);
    printf("[Consumer] Read sequence %u: '%s'\n", shm_ptr->sequence_id, shm_ptr->message);
    sem_post(sem);

    sem_close(sem);
    munmap(shm_ptr, sizeof(struct ShmPayload));
    close(shm_fd);

    // Optional: Unlink if finished
    // shm_unlink(SHM_NAME);
    // sem_unlink(SEM_MUTEX);
    return 0;
}
