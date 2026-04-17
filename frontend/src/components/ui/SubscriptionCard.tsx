import { useNavigate } from 'react-router-dom'
import type { Subscription } from '@/types/subscription'
import { BillingCycleLabel } from '@/types/subscription'
import styles from './SubscriptionCard.module.css'

interface Props {
  subscription: Subscription
  onDelete?: (id: number) => void
}

export default function SubscriptionCard({ subscription, onDelete }: Props) {
  const navigate = useNavigate()
  const isUrgent = subscription.daysUntilNextPayment <= 3
  const isSoon = subscription.daysUntilNextPayment <= 7

  const daysLabel =
    subscription.daysUntilNextPayment === 0
      ? 'Today'
      : subscription.daysUntilNextPayment === 1
      ? 'Tomorrow'
      : `${subscription.daysUntilNextPayment}d`

  return (
    <div className={`${styles.card} ${!subscription.isActive ? styles.inactive : ''}`}>
      <div className={styles.header}>
        <div className={styles.identity}>
          {subscription.logoUrl ? (
            <img src={subscription.logoUrl} alt={subscription.name} className={styles.logo} />
          ) : (
            <div className={styles.logoFallback}>
              {subscription.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className={styles.name}>{subscription.name}</h3>
            {subscription.category && (
              <span className={styles.category}>{subscription.category}</span>
            )}
          </div>
        </div>
        <div className={styles.price}>
          <span className={styles.amount}>
            {subscription.price.toLocaleString('nb-NO', { minimumFractionDigits: 0 })}
          </span>
          <span className={styles.currency}>{subscription.currency}</span>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.cycle}>
          {BillingCycleLabel[subscription.billingCycle]}
        </span>
        <span
          className={`${styles.nextPayment} ${
            isUrgent ? styles.urgent : isSoon ? styles.soon : ''
          }`}
        >
          Next: {daysLabel}
        </span>
      </div>

      <div className={styles.footer}>
        <span className={styles.yearly}>
          ≈ {subscription.yearlyEquivalent.toLocaleString('nb-NO')} {subscription.currency}/yr
        </span>
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => navigate(`/subscriptions/${subscription.id}/edit`)}
            aria-label={`Edit ${subscription.name}`}
          >
            Edit
          </button>
          {onDelete && (
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(subscription.id)}
              aria-label={`Delete ${subscription.name}`}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
