import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { subscriptionService } from '@/services/subscriptionService'
import SubscriptionForm from '@/components/ui/SubscriptionForm'
import type { CreateSubscriptionDto, Subscription, UpdateSubscriptionDto } from '@/types/subscription'
import styles from './FormPage.module.css'

export default function EditSubscriptionPage() {
  const { id } = useParams<{ id: string }>()
  const { update } = useSubscriptions()
  const navigate = useNavigate()

  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    subscriptionService.getById(Number(id))
      .then(setSubscription)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (dto: CreateSubscriptionDto & { isActive?: boolean }) => {
    try {
      const updateDto: UpdateSubscriptionDto = { ...dto, isActive: dto.isActive ?? true }
      await update(Number(id), updateDto)
      navigate('/subscriptions')
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        throw new Error('Cannot reach the server. Make sure the backend API is running.')
      }
      throw new Error('Failed to update subscription. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    )
  }

  if (notFound || !subscription) {
    return (
      <div className={styles.centered}>
        <p className={styles.error}>Subscription not found.</p>
      </div>
    )
  }

  // Derive the payment day from the stored nextPaymentDate
  const paymentDayOfMonth = new Date(subscription.nextPaymentDate).getDate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit subscription</h1>
        <p className={styles.subtitle}>{subscription.name}</p>
      </header>
      <SubscriptionForm
        initial={{
          name: subscription.name,
          description: subscription.description,
          price: subscription.price,
          currency: subscription.currency,
          billingCycle: subscription.billingCycle,
          startDate: subscription.startDate.split('T')[0],
          endDate: subscription.endDate?.split('T')[0],
          paymentDayOfMonth,
          logoUrl: subscription.logoUrl,
          category: subscription.category,
          isActive: subscription.isActive,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Save changes"
        showIsActive
      />
    </div>
  )
}
