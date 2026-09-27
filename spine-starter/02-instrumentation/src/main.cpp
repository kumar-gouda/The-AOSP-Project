#include <iostream>
#include <vector>
#include <android-base/logging.h>

int main(int argc, char** argv) {
    android::base::InitLogging(argv, android::base::LogdLogger(android::base::MAIN));
    LOG(INFO) << "Phase 2 Instrumentation: ASan/UBSan build active";

    std::vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    for (int n : numbers) {
        sum += n;
    }

    std::cout << "Computed sum: " << sum << std::endl;
    return 0;
}
