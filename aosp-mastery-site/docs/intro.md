---
id: intro
title: Start Here
sidebar_position: 1
slug: /intro
---

# AOSP Mastery

A free, gamified, project-based path from **C++17 and systems fundamentals** to
**production-grade AOSP, kernel, and real-device development**.

This site is the course. It is a **Docusaurus static site**: it runs locally on
your machine and opens in Chrome or Firefox with no special flags.

## Who this is for

- You know **Java, Kotlin, Python**, and **basic C++**.
- You have **no** systems-programming or Android-internals background.
- You want structure and momentum, not a reference manual to assemble yourself.
- You are willing to run builds on your own machine or VM.

## How to read a unit

Every unit follows the same shape, so you never re-orient:

| Field | What it means |
|-------|---------------|
| **Hook** | Why the unit matters, in plain stakes |
| **Outcome** | The single thing you build by the end |
| **Prerequisites** | Exact tools and prior units assumed |
| **Do This** | Numbered steps with exact commands |
| **Output** | The command and its expected / real terminal output (the TestRunner block) |
| **Why It Worked** | A short, just-in-time explanation |
| **Break It** | A real failure: symptom -> cause -> fix |
| **Checkpoint** | An instant-feedback quick check |
| **Reward** | XP and badge progress |
| **Next Mission** | A link deeper into the skill tree |

## Verified against the official docs

Every external fact in this course is either verified against
[source.android.com](https://source.android.com) or explicitly marked
`[VERIFY]`. Nothing is stated from memory.

## Learning Tools & Navigation

- **[Visual Roadmap](/roadmap)**: See all 18 phases, track progress milestones, and inspect XP tiers at a glance.
- **[Competency Map](/competency-map)**: The single source of truth for all 22 competencies and verified evidence criteria.
- **[Interactive ADB Terminal Sandbox](/terminal)**: Practice running real `adb` and `fastboot` commands against a simulated Android 15 / Linux 6.1 GKI device directly in your browser.
- **[AOSP Glossary & Flashcards](./glossary)**: Instant lookup for 50+ Android, kernel, and build system acronyms with interactive 3D active-recall flashcard mode.
- **Companion Workspace (`spine-starter/`)**: Pre-structured coding exercises with CMake, Android.bp, and Makefiles for all 18 phases located in the repository root.
- **[Changelog](./changelog)**: Documentation and verification updates pinned to Android 17 / ACK 6.18.

## Where to go next

Start with **[Phase -1 — Foundation](./phase-minus-1-foundation)**: build the C++17
and systems-C skills you will use in every later phase.

Then continue to **[Phase 0 — Basecamp](./phase-0-basecamp)**: set up mission
control before the first mission.

