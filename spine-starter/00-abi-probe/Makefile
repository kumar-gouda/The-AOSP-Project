CC ?= gcc
CFLAGS ?= -Wall -Wextra -std=c11 -O2

all: abi_probe

abi_probe: abi_probe.c
	$(CC) $(CFLAGS) $< -o $@

clean:
	rm -f abi_probe *.o

.PHONY: all clean
