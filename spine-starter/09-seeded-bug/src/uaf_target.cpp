/**
 * @file uaf_target.cpp
 * @brief Seeded bug scenario: Use-After-Free in asynchronous sensor callback.
 * Run with ASan to observe crash report: AddressSanitizer: heap-use-after-free.
 */

#include <iostream>
#include <string>
#include <thread>
#include <chrono>

struct SensorListener {
    int id;
    std::string name;

    void onData(int value) {
        std::cout << "Listener [" << name << " #" << id << "] received sensor data: " << value << std::endl;
    }
};

void trigger_vulnerability() {
    SensorListener* listener = new SensorListener{101, "AccelSensor"};

    // Thread 1 deletes listener early (simulating premature deallocation)
    std::thread worker([&]() {
        std::this_thread::sleep_for(std::chrono::milliseconds(20));
        std::cout << "[Worker] Prematurely deleting listener..." << std::endl;
        delete listener;
    });

    // Main thread attempts to access deleted pointer (Use-After-Free)
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
    std::cout << "[Main] Accessing listener after worker deletion..." << std::endl;
    listener->onData(980); // <--- BOOM: ASan catches heap-use-after-free here!

    worker.join();
}

int main(int argc, char** argv) {
    std::cout << "=== Phase 9: Seeded Bug Diagnostics Sandbox ===" << std::endl;
    std::cout << "Compile with ASan: g++ -fsanitize=address -g src/uaf_target.cpp" << std::endl;
    if (argc > 1 && std::string(argv[1]) == "--trigger") {
        trigger_vulnerability();
    } else {
        std::cout << "Run with '--trigger' to reproduce the Use-After-Free crash." << std::endl;
    }
    return 0;
}
