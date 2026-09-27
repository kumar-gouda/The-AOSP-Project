#pragma once

#include <cstddef>
#include <vector>
#include <mutex>
#include <optional>
#include <memory>
#include <utility>

namespace aosp::mastery {

/**
 * @brief Thread-safe fixed-capacity Circular Ring Buffer.
 * Demonstrates C++17 RAII, Move Semantics, std::optional, and Smart Pointers.
 * Used across AOSP audio flinger, sensor event queues, and binder buffer rings.
 */
template <typename T>
class RingBuffer {
public:
    explicit RingBuffer(std::size_t capacity)
        : m_capacity(capacity),
          m_head(0),
          m_tail(0),
          m_count(0),
          m_storage(capacity) {}

    // Disable copy semantics to prevent expensive accidental buffer duplications (RAII principle)
    RingBuffer(const RingBuffer&) = delete;
    RingBuffer& operator=(const RingBuffer&) = delete;

    // Enable move semantics (efficient transfer of buffer ownership)
    RingBuffer(RingBuffer&& other) noexcept {
        std::unique_lock<std::mutex> lock(other.m_mutex);
        m_capacity = other.m_capacity;
        m_head = other.m_head;
        m_tail = other.m_tail;
        m_count = other.m_count;
        m_storage = std::move(other.m_storage);
        other.m_count = 0;
    }

    RingBuffer& operator=(RingBuffer&& other) noexcept {
        if (this != &other) {
            std::scoped_lock lock(m_mutex, other.m_mutex);
            m_capacity = other.m_capacity;
            m_head = other.m_head;
            m_tail = other.m_tail;
            m_count = other.m_count;
            m_storage = std::move(other.m_storage);
            other.m_count = 0;
        }
        return *this;
    }

    ~RingBuffer() = default;

    /**
     * @brief Pushes an item by copy into the circular buffer.
     * @return true if successful, false if buffer is full.
     */
    bool push(const T& item) {
        std::unique_lock<std::mutex> lock(m_mutex);
        if (m_count >= m_capacity) {
            return false;
        }
        // TODO: Store item into m_storage at m_head, update m_head circularly, increment m_count
        m_storage[m_head] = item;
        m_head = (m_head + 1) % m_capacity;
        m_count++;
        return true;
    }

    /**
     * @brief Pushes an item by move into the circular buffer (zero-copy).
     */
    bool push(T&& item) {
        std::unique_lock<std::mutex> lock(m_mutex);
        if (m_count >= m_capacity) {
            return false;
        }
        // TODO: Move item into m_storage at m_head, update m_head circularly, increment m_count
        m_storage[m_head] = std::move(item);
        m_head = (m_head + 1) % m_capacity;
        m_count++;
        return true;
    }

    /**
     * @brief Pops an item from the buffer if available.
     * @return std::optional containing the popped item, or std::nullopt if empty.
     */
    std::optional<T> pop() {
        std::unique_lock<std::mutex> lock(m_mutex);
        if (m_count == 0) {
            return std::nullopt;
        }
        // TODO: Retrieve item at m_tail using std::move, update m_tail circularly, decrement m_count
        T item = std::move(m_storage[m_tail]);
        m_tail = (m_tail + 1) % m_capacity;
        m_count--;
        return item;
    }

    [[nodiscard]] std::size_t size() const noexcept {
        std::unique_lock<std::mutex> lock(m_mutex);
        return m_count;
    }

    [[nodiscard]] std::size_t capacity() const noexcept {
        return m_capacity;
    }

    [[nodiscard]] bool empty() const noexcept {
        std::unique_lock<std::mutex> lock(m_mutex);
        return m_count == 0;
    }

    [[nodiscard]] bool full() const noexcept {
        std::unique_lock<std::mutex> lock(m_mutex);
        return m_count == m_capacity;
    }

private:
    std::size_t m_capacity;
    std::size_t m_head;
    std::size_t m_tail;
    std::size_t m_count;
    std::vector<T> m_storage;
    mutable std::mutex m_mutex;
};

} // namespace aosp::mastery
