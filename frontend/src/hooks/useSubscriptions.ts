import { useCallback, useEffect, useState } from 'react'
import { subscriptionService } from '@/services/subscriptionService'
import type { CreateSubscriptionDto, Subscription, UpdateSubscriptionDto } from '@/types/subscription'

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await subscriptionService.getAll()
      setSubscriptions(data)
    } catch {
      setError('Failed to load subscriptions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const create = async (dto: CreateSubscriptionDto) => {
    const created = await subscriptionService.create(dto)
    setSubscriptions(prev => [...prev, created])
    return created
  }

  const update = async (id: number, dto: UpdateSubscriptionDto) => {
    const updated = await subscriptionService.update(id, dto)
    setSubscriptions(prev => prev.map(s => (s.id === id ? updated : s)))
    return updated
  }

  const remove = async (id: number) => {
    await subscriptionService.delete(id)
    setSubscriptions(prev => prev.filter(s => s.id !== id))
  }

  const totalMonthly = subscriptions
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + s.yearlyEquivalent / 12, 0)

  const totalYearly = subscriptions
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + s.yearlyEquivalent, 0)

  const upcomingPayments = [...subscriptions]
    .filter(s => s.isActive && s.daysUntilNextPayment >= 0)
    .sort((a, b) => a.daysUntilNextPayment - b.daysUntilNextPayment)
    .slice(0, 5)

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchAll,
    create,
    update,
    remove,
    totalMonthly,
    totalYearly,
    upcomingPayments,
  }
}
