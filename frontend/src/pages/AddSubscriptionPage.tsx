import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import SubscriptionForm from '@/components/ui/SubscriptionForm'
import type { CreateSubscriptionDto } from '@/types/subscription'
import styles from './FormPage.module.css'

export default function AddSubscriptionPage() {
  const { create } = useSubscriptions()
  const navigate = useNavigate()

  const handleSubmit = async (dto: CreateSubscriptionDto) => {
    try {
      await create(dto)
      navigate('/subscriptions')
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        throw new Error('Cannot reach the server. Make sure the backend API is running.')
      }
      throw new Error('Failed to save subscription. Please try again.')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Add subscription</h1>
        <p className={styles.subtitle}>Track a new recurring payment</p>
      </header>
      <SubscriptionForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="Save subscription"
      />
    </div>
  )
}
