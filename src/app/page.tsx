import styles from './page.module.css';

export default function DashboardPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Weekly Analytics Dashboard</h1>
          <p className={styles.subtitle}>Support &amp; product performance — current week</p>
        </div>
        <span className={styles.demoBadge}>Demo data</span>
      </header>

      <section className={styles.placeholder} aria-label="Dashboard widgets placeholder">
        Dashboard widgets coming soon.
      </section>
    </main>
  );
}
