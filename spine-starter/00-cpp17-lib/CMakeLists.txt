cmake_minimum_required(VERSION 3.15)
project(AospRingBuffer VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Enable aggressive warnings and sanitizers for system-level safety
if (CMAKE_CXX_COMPILER_ID MATCHES "Clang|GNU")
    add_compile_options(
        -Wall
        -Wextra
        -Wpedantic
        -Wconversion
        -Wsign-conversion
        -Wnon-virtual-dtor
        -Wold-style-cast
    )
endif()

# Header-only or static library
add_library(ring_buffer INTERFACE)
target_include_directories(ring_buffer INTERFACE ${CMAKE_CURRENT_SOURCE_DIR}/include)

# GoogleTest integration
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

add_executable(test_ring_buffer tests/test_ring_buffer.cpp)
target_link_libraries(test_ring_buffer PRIVATE ring_buffer GTest::gtest_main)

include(GoogleTest)
gtest_discover_tests(test_ring_buffer)
