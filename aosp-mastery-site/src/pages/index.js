import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import {ProgressPanel} from '@site/src/components/Progress';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
            style={{marginRight: '0.75rem'}}>
            Start the Course
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/roadmap">
            Explore Roadmap
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A free, verifiable, project-based path from C++17 and systems fundamentals to production-grade AOSP, kernel, and real-device development.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className="container margin-vert--lg">
          <Heading as="h2">Your progress</Heading>
          <p>
            Progress is saved in your browser only. Export it to a JSON file to
            back it up or move it to another machine.
          </p>
          <BrowserOnly fallback={<p>Loading progress…</p>}>
            {() => <ProgressPanel />}
          </BrowserOnly>
        </section>
      </main>
    </Layout>
  );
}
