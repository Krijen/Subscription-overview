import type { CreateSubscriptionDto, Subscription, UpdateSubscriptionDto } from '@/types/subscription'
import { api } from './authService'

export const subscriptionService = {
  getAll: async (): Promise<Subscription[]> => {
    const { data } = await api.get<Subscription[]>('/subscriptions')
    return data
  },

  getById: async (id: number): Promise<Subscription> => {
    const { data } = await api.get<Subscription>(`/subscriptions/${id}`)
    return data
  },

  create: async (dto: CreateSubscriptionDto): Promise<Subscription> => {
    const { data } = await api.post<Subscription>('/subscriptions', dto)
    return data
  },

  update: async (id: number, dto: UpdateSubscriptionDto): Promise<Subscription> => {
    const { data } = await api.put<Subscription>(`/subscriptions/${id}`, dto)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/subscriptions/${id}`)
  },
}
