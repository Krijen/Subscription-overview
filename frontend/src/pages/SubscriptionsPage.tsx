import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import SubscriptionCard from '@/components/ui/SubscriptionCard'
import styles from './SubscriptionsPage.module.css'

export default function SubscriptionsPage() {
  const { subscriptions, loading, error, remove } = useSubscriptions()
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  const filtered = subscriptions.filter(s => {
    const matchesFilter =
      filter === 'all' || (filter === 'active' ? s.isActive : !s.isActive)
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (error) {
    return <div className={styles.centered}><p className={styles.error}>{error}</p></div>
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Subscriptions</h1>
        <Link to="/subscriptions/add" className={styles.addBtn}>
          + Add new
        </Link>
      </header>

      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search subscriptions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No subscriptions found.</p>
          <Link to="/subscriptions/add" className={styles.addBtn}>Add one</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(sub => (
            <SubscriptionCard key={sub.id} subscription={sub} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
