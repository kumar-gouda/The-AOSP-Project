import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Roadmap from '@site/src/components/Roadmap';

export default function RoadmapPage() {
  return (
    <Layout
      title="Visual Learning Roadmap"
      description="Interactive curriculum map showing the full learning path from C++17 systems fundamentals to kernel mastery and real hardware bring-up.">
      <main className="container margin-vert--lg">
        <Heading as="h1">Curriculum Roadmap</Heading>
        <p>
          The single continuous Project Spine, mapped across 18 progressive phases.
          Track your personal progress, earned XP, and milestone deliverables across each tier.
        </p>
        <BrowserOnly fallback={<p>Loading roadmap…</p>}>
          {() => <Roadmap />}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
