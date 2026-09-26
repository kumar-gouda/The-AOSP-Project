import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Do → Why → Prove',
    Svg: require('@site/static/img/feature_terminal.svg').default,
    description: (
      <>
        Every unit opens with a real command and closes with a visible proof.
        No theory before the task that needs it.
      </>
    ),
  },
  {
    title: 'Verified, not remembered',
    Svg: require('@site/static/img/feature_verified.svg').default,
    description: (
      <>
        Every external fact is checked against source.android.com or explicitly
        marked to verify. The plan audits itself so it does not rot.
      </>
    ),
  },
  {
    title: 'One continuous Spine',
    Svg: require('@site/static/img/feature_spine.svg').default,
    description: (
      <>
        You build one feature from kernel to app across all phases — and finish
        with a public, verifiable capstone on your own fork.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

