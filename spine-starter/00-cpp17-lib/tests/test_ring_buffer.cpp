#include <gtest/gtest.h>
#include "ring_buffer.hpp"
#include <string>
#include <memory>
#include <thread>
#include <vector>

using namespace aosp::mastery;

TEST(RingBufferTest, BasicPushPop) {
    RingBuffer<int> buf(3);
    EXPECT_TRUE(buf.empty());
    EXPECT_EQ(buf.size(), 0);

    EXPECT_TRUE(buf.push(10));
    EXPECT_TRUE(buf.push(20));
    EXPECT_TRUE(buf.push(30));
    EXPECT_TRUE(buf.full());
    EXPECT_FALSE(buf.push(40)); // Capacity is 3, should fail

    auto val1 = buf.pop();
    ASSERT_TRUE(val1.has_value());
    EXPECT_EQ(val1.value(), 10);

    auto val2 = buf.pop();
    ASSERT_TRUE(val2.has_value());
    EXPECT_EQ(val2.value(), 20);

    auto val3 = buf.pop();
    ASSERT_TRUE(val3.has_value());
    EXPECT_EQ(val3.value(), 30);

    EXPECT_TRUE(buf.empty());
    auto val4 = buf.pop();
    EXPECT_FALSE(val4.has_value());
}

TEST(RingBufferTest, MoveOnlyTypes) {
    RingBuffer<std::unique_ptr<std::string>> buf(2);
    auto p1 = std::make_unique<std::string>("SensorPacket1");
    auto p2 = std::make_unique<std::string>("SensorPacket2");

    EXPECT_TRUE(buf.push(std::move(p1)));
    EXPECT_TRUE(buf.push(std::move(p2)));

    auto popped1 = buf.pop();
    ASSERT_TRUE(popped1.has_value());
    EXPECT_EQ(*popped1.value(), "SensorPacket1");
}

TEST(RingBufferTest, MultiThreadedProducerConsumer) {
    RingBuffer<int> buf(100);
    const int num_items = 1000;

    std::thread producer([&]() {
        for (int i = 0; i < num_items; ++i) {
            while (!buf.push(i)) {
                std::this_thread::yield();
            }
        }
    });

    std::vector<int> consumed;
    std::thread consumer([&]() {
        while (consumed.size() < num_items) {
            auto val = buf.pop();
            if (val.has_value()) {
                consumed.push_back(val.value());
            } else {
                std::this_thread::yield();
            }
        }
    });

    producer.join();
    consumer.join();

    EXPECT_EQ(consumed.size(), num_items);
    for (int i = 0; i < num_items; ++i) {
        EXPECT_EQ(consumed[i], i);
    }
}
