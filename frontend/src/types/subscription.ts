export enum BillingCycle {
  Weekly = 0,
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
}

export const BillingCycleLabel: Record<BillingCycle, string> = {
  [BillingCycle.Weekly]: 'Weekly',
  [BillingCycle.Monthly]: 'Monthly',
  [BillingCycle.Quarterly]: 'Quarterly',
  [BillingCycle.Yearly]: 'Yearly',
}

export interface Subscription {
  id: number
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  endDate?: string
  nextPaymentDate: string
  logoUrl?: string
  category?: string
  isActive: boolean
  daysUntilNextPayment: number
  yearlyEquivalent: number
}

export interface CreateSubscriptionDto {
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  endDate?: string
  nextPaymentDate: string
  logoUrl?: string
  category?: string
}

export interface UpdateSubscriptionDto extends CreateSubscriptionDto {
  isActive: boolean
}
