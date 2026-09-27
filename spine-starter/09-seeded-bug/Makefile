CXX ?= g++
CXXFLAGS ?= -Wall -Wextra -std=c++17 -O1 -g -fsanitize=address,undefined -fno-omit-frame-pointer

all: uaf_target

uaf_target: src/uaf_target.cpp
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -f uaf_target *.o

.PHONY: all clean
