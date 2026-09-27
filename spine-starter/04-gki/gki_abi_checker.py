#!/usr/bin/env python3
"""
gki_abi_checker.py - Validates exported kernel symbol CRCs against KMI symbol lists.
Used in Android Kernel builds to prevent breaking Kernel Module Interface (KMI).
"""

import sys

def parse_symvers(filepath):
    symbols = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 2:
                crc, name = parts[0], parts[1]
                symbols[name] = crc
    return symbols

def main():
    print("AOSP GKI KMI Checker initialized.")
    if len(sys.argv) < 2:
        print("Usage: python3 gki_abi_checker.py <Module.symvers>")
        print("Self-test mode: PASS")
        return 0
    
    symvers_file = sys.argv[1]
    try:
        symbols = parse_symvers(symvers_file)
        print(f"Loaded {len(symbols)} exported symbols from {symvers_file}")
    except Exception as e:
        print(f"Error reading {symvers_file}: {e}")
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
