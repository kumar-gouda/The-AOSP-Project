import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CompetencyMap from '@site/src/components/CompetencyMap';

export default function CompetencyMapPage() {
  return (
    <Layout
      title="Competency Map"
      description="The single source of truth for what AOSP Mastery proves, how it is tested, and when it is mastered.">
      <main className="container margin-vert--lg">
        <Heading as="h1">Competency Map</Heading>
        <p>
          Every competency the program proves, mapped to a tier and to a real,
          checkable artifact. This page is rendered directly from{' '}
          <code>data/competency-map.yaml</code> at build time — the file is the
          single source of truth (see the plan, section 9).
        </p>
        <CompetencyMap />
      </main>
    </Layout>
  );
}
