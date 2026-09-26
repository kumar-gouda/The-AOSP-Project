// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import {loadCompetencyMap} from './data/load-competency-map.mjs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// The competency map (plan section 9) is the single source of truth. It is
// read and validated at build time here, then exposed to pages via customFields.
const competencyMap = loadCompetencyMap();

// Locally, a broken link is a warning (fast iteration). In CI, set
// STRICT_LINKS=1 to turn it into a hard failure so dangling links cannot ship.
// See .github/workflows/ci.yml.
const onBrokenLinks = process.env.STRICT_LINKS === '1' ? 'throw' : 'warn';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AOSP Mastery',
  tagline: 'From C++17 and systems fundamentals to production-grade AOSP, kernel, and real-device development.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    // Enable @docusaurus/faster (a declared dependency). In Docusaurus 3.10 the
    // key is `faster` (the old `experimental_faster` is now rejected). `true`
    // turns on the SWC loaders/minimizers, Lightning CSS, the rspack bundler,
    // SSG worker threads, and the persistent build cache.
    faster: true,
  },

  // Local-first: works on localhost:3000 out of the box. Set to your
  // GitHub Pages URL before deploying.
  url: 'http://localhost:3000',
  // For GitHub Pages project sites this is often '/<projectName>/'.
  baseUrl: '/',

  // GitHub pages deployment config (fill in before `npm run deploy`).
  organizationName: 'aosp-mastery',
  projectName: 'aosp-mastery',
  onBrokenLinks,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Remove this to remove the "edit this page" links, or point it at your repo.
          editUrl: 'https://github.com/aosp-mastery/aosp-mastery/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: '/docs',
      }),
    ],
  ],

  // Expose the validated competency map (plan section 9) to client pages.
  // customFields is the documented way to pass build-time data to the client.
  customFields: {
    competencyMap,
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'AOSP Mastery',
        logo: {
          alt: 'AOSP Mastery Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'curriculumSidebar',
            position: 'left',
            label: 'Curriculum',
          },
          {
            to: '/roadmap',
            label: 'Roadmap',
            position: 'left',
          },
          {
            to: '/competency-map',
            label: 'Competency Map',
            position: 'left',
          },
          {
            to: '/docs/glossary',
            label: 'Glossary',
            position: 'left',
          },
          {
            type: 'custom-progress',
            position: 'right',
          },
          {
            href: 'https://source.android.com',
            label: 'Source.android.com',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Start here',
                to: '/docs/intro',
              },
              {
                label: 'Phase 0 — Basecamp',
                to: '/docs/phase-0-basecamp',
              },
            ],
          },
          {
            title: 'Official sources',
            items: [
              {
                label: 'source.android.com',
                href: 'https://source.android.com',
              },
              {
                label: 'Android Code Search',
                href: 'https://cs.android.com',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/aosp-mastery/aosp-mastery',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AOSP Mastery. Content verified against source.android.com.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: [
          'bash',
          'diff',
          'json',
          'c',
          'cpp',
          'java',
          'kotlin',
          'rust',
          'makefile',
          'yaml',
          'ini',
        ],
      },
    }),
};

export default config;



