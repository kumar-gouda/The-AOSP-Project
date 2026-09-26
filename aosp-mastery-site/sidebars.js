// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * The AOSP Mastery curriculum sidebar. Phases are added here as content is
 * written; the platform code is never touched to add a phase.
 *
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  curriculumSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Phase -1 - Foundation',
      collapsed: false,
      items: ['phase-minus-1-foundation'],
    },
    {
      type: 'category',
      label: 'Phase 0 - Basecamp',
      collapsed: false,
      items: ['phase-0-basecamp'],
    },
    {
      type: 'category',
      label: 'Phase 1 - Systems Foundations',
      collapsed: false,
      items: ['phase-1-systems'],
    },
    {
      type: 'category',
      label: 'Phase 2 - Build System',
      collapsed: false,
      items: ['phase-2-build-system'],
    },
    {
      type: 'category',
      label: 'Phase 3 - Boot & Init',
      collapsed: true,
      items: ['phase-3-boot-init'],
    },
    {
      type: 'category',
      label: 'Phase 4 - Kernel Foundations',
      collapsed: true,
      items: ['phase-4-kernel-foundations'],
    },
    {
      type: 'category',
      label: 'Phase 5 - Native Userspace & Runtime',
      collapsed: true,
      items: ['phase-5-native-runtime'],
    },
    {
      type: 'category',
      label: 'Phase 6 - HAL, Treble & Binder',
      collapsed: true,
      items: ['phase-6-hal-binder'],
    },
    {
      type: 'category',
      label: 'Phase 7 - Framework Layer',
      collapsed: true,
      items: ['phase-7-framework-layer'],
    },
    {
      type: 'category',
      label: 'Phase 8 - Security Model',
      collapsed: true,
      items: ['phase-8-security-model'],
    },
    {
      type: 'category',
      label: 'Phase 9 - Debugging & Performance',
      collapsed: true,
      items: ['phase-9-debugging-performance'],
    },
    {
      type: 'category',
      label: 'Phase 10 - Kernel Mastery',
      collapsed: true,
      items: ['phase-10-kernel-mastery'],
    },
    {
      type: 'category',
      label: 'Phase 10.5 - Kernel Subsystems & Drivers',
      collapsed: true,
      items: ['phase-10-5-drivers'],
    },
    {
      type: 'category',
      label: 'Phase 11 - Real Device Fundamentals',
      collapsed: true,
      items: ['phase-11-real-device'],
    },
    {
      type: 'category',
      label: 'Phase 12 - Pixel Bring-Up Workshop (elective)',
      collapsed: true,
      items: ['phase-12-pixel-bringup'],
    },
    {
      type: 'category',
      label: 'Phase 13 - Production Readiness Extras',
      collapsed: true,
      items: ['phase-13-production-readiness'],
    },
    {
      type: 'category',
      label: 'Phase 14 - Contribution Workflow',
      collapsed: true,
      items: ['phase-14-contribution'],
    },
    {
      type: 'category',
      label: 'Phase 15 - Capstone',
      collapsed: true,
      items: ['phase-15-capstone'],
    },
    {
      type: 'category',
      label: 'Reference & Updates',
      collapsed: false,
      items: ['glossary', 'changelog'],
    },
  ],
};

export default sidebars;