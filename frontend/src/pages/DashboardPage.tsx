import { Link } from 'react-router-dom'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import StatCard from '@/components/ui/StatCard'
import SubscriptionCard from '@/components/ui/SubscriptionCard'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { subscriptions, loading, error, totalMonthly, totalYearly, upcomingPayments, remove } =
    useSubscriptions()

  const activeCount = subscriptions.filter(s => s.isActive).length

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Loading your subscriptions…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            You have <strong>{activeCount}</strong> active subscription{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/subscriptions/add" className={styles.addBtn}>
          + Add subscription
        </Link>
      </header>

      <section className={styles.stats}>
        <StatCard
          label="Monthly spend"
          value={`${totalMonthly.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} NOK`}
          sub="across all active subscriptions"
          accent
        />
        <StatCard
          label="Yearly spend"
          value={`${totalYearly.toLocaleString('nb-NO', { maximumFractionDigits: 0 })} NOK`}
          sub="projected annual total"
        />
        <StatCard
          label="Active"
          value={String(activeCount)}
          sub={`of ${subscriptions.length} total`}
        />
      </section>

      {upcomingPayments.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming payments</h2>
          <div className={styles.grid}>
            {upcomingPayments.map(sub => (
              <SubscriptionCard key={sub.id} subscription={sub} onDelete={remove} />
            ))}
          </div>
        </section>
      )}

      {subscriptions.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No subscriptions yet.</p>
          <Link to="/subscriptions/add" className={styles.addBtn}>
            Add your first one
          </Link>
        </div>
      )}
    </div>
  )
}
