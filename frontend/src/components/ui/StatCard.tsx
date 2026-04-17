import styles from './StatCard.module.css'

interface Props {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div className={`${styles.card} ${accent ? styles.accent : ''}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
      {sub && <p className={styles.sub}>{sub}</p>}
    </div>
  )
}
