#include <iostream>
#include <csignal>
#include <unistd.h>
#include <sys/types.h>

static volatile sig_atomic_t g_running = 1;

static void sigterm_handler(int signum) {
    (void)signum;
    g_running = 0;
}

int main() {
    std::signal(SIGTERM, sigterm_handler);
    std::signal(SIGINT, sigterm_handler);

    std::cout << "[my_daemon] Initializing with PID: " << getpid() << std::endl;

    while (g_running) {
        // Daemon periodic background work
        sleep(2);
    }

    std::cout << "[my_daemon] Received termination signal. Cleaning up gracefully." << std::endl;
    return 0;
}
