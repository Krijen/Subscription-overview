import { useState, useRef, useEffect } from 'react'
import { BillingCycle } from '@/types/subscription'
import type { CreateSubscriptionDto } from '@/types/subscription'
import styles from './SubscriptionForm.module.css'

const CATEGORIES = ['Entertainment', 'Music', 'Software', 'News', 'Fitness', 'Education', 'Gaming', 'Other']

const PLATFORMS = [
  { name: 'Netflix',               category: 'Entertainment', domain: 'netflix.com' },
  { name: 'Disney+',               category: 'Entertainment', domain: 'disneyplus.com' },
  { name: 'Max',                   category: 'Entertainment', domain: 'max.com' },
  { name: 'Amazon Prime Video',    category: 'Entertainment', domain: 'primevideo.com' },
  { name: 'Apple TV+',             category: 'Entertainment', domain: 'tv.apple.com' },
  { name: 'Hulu',                  category: 'Entertainment', domain: 'hulu.com' },
  { name: 'Paramount+',            category: 'Entertainment', domain: 'paramountplus.com' },
  { name: 'Peacock',               category: 'Entertainment', domain: 'peacocktv.com' },
  { name: 'Crunchyroll',           category: 'Entertainment', domain: 'crunchyroll.com' },
  { name: 'Viaplay',               category: 'Entertainment', domain: 'viaplay.com' },
  { name: 'Discovery+',            category: 'Entertainment', domain: 'discoveryplus.com' },
  { name: 'Spotify',               category: 'Music',         domain: 'spotify.com' },
  { name: 'Apple Music',           category: 'Music',         domain: 'apple.com' },
  { name: 'Tidal',                 category: 'Music',         domain: 'tidal.com' },
  { name: 'Deezer',                category: 'Music',         domain: 'deezer.com' },
  { name: 'YouTube Music',         category: 'Music',         domain: 'youtube.com' },
  { name: 'SoundCloud',            category: 'Music',         domain: 'soundcloud.com' },
  { name: 'Xbox Game Pass',        category: 'Gaming',        domain: 'xbox.com' },
  { name: 'PlayStation Plus',      category: 'Gaming',        domain: 'playstation.com' },
  { name: 'Nintendo Switch Online',category: 'Gaming',        domain: 'nintendo.com' },
  { name: 'EA Play',               category: 'Gaming',        domain: 'ea.com' },
  { name: 'GeForce Now',           category: 'Gaming',        domain: 'nvidia.com' },
  { name: 'Adobe Creative Cloud',  category: 'Software',      domain: 'adobe.com' },
  { name: 'Microsoft 365',         category: 'Software',      domain: 'microsoft.com' },
  { name: 'Dropbox',               category: 'Software',      domain: 'dropbox.com' },
  { name: 'Google One',            category: 'Software',      domain: 'google.com' },
  { name: 'iCloud+',               category: 'Software',      domain: 'icloud.com' },
  { name: 'Notion',                category: 'Software',      domain: 'notion.so' },
  { name: '1Password',             category: 'Software',      domain: '1password.com' },
  { name: 'LastPass',              category: 'Software',      domain: 'lastpass.com' },
  { name: 'GitHub',                category: 'Software',      domain: 'github.com' },
  { name: 'Duolingo',              category: 'Education',     domain: 'duolingo.com' },
  { name: 'Coursera',              category: 'Education',     domain: 'coursera.org' },
  { name: 'Skillshare',            category: 'Education',     domain: 'skillshare.com' },
  { name: 'MasterClass',           category: 'Education',     domain: 'masterclass.com' },
  { name: 'LinkedIn Learning',     category: 'Education',     domain: 'linkedin.com' },
  { name: 'Peloton',               category: 'Fitness',       domain: 'onepeloton.com' },
  { name: 'Strava',                category: 'Fitness',       domain: 'strava.com' },
  { name: 'Whoop',                 category: 'Fitness',       domain: 'whoop.com' },
  { name: 'The New York Times',    category: 'News',          domain: 'nytimes.com' },
  { name: 'The Wall Street Journal',category: 'News',         domain: 'wsj.com' },
  { name: 'The Guardian',          category: 'News',          domain: 'theguardian.com' },
]

// Given a day-of-month (1–31), return the next date that day falls on
function nextDateForDay(day: number): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  // Try this month first
  const candidate = new Date(year, month, day)
  if (candidate >= today) {
    return candidate.toISOString().split('T')[0]
  }
  // Otherwise next month
  const next = new Date(year, month + 1, day)
  return next.toISOString().split('T')[0]
}

export interface SubscriptionFormValues extends Omit<CreateSubscriptionDto, 'nextPaymentDate'> {
  paymentDayOfMonth: number
}

interface Props {
  initial?: Partial<SubscriptionFormValues & { isActive: boolean }>
  onSubmit: (dto: CreateSubscriptionDto & { isActive?: boolean }) => Promise<void>
  onCancel: () => void
  submitLabel: string
  showIsActive?: boolean
}

export default function SubscriptionForm({ initial, onSubmit, onCancel, submitLabel, showIsActive }: Props) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<SubscriptionFormValues & { isActive: boolean }>({
    name: initial?.name ?? '',
    description: initial?.description,
    price: initial?.price ?? 0,
    currency: initial?.currency ?? 'NOK',
    billingCycle: initial?.billingCycle ?? BillingCycle.Monthly,
    startDate: initial?.startDate ?? today,
    endDate: initial?.endDate,
    paymentDayOfMonth: initial?.paymentDayOfMonth ?? new Date().getDate(),
    logoUrl: initial?.logoUrl,
    category: initial?.category,
    isActive: initial?.isActive ?? true,
  })

  const [priceDisplay, setPriceDisplay] = useState(
    initial?.price != null && initial.price !== 0 ? String(initial.price) : ''
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const nameWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (nameWrapperRef.current && !nameWrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredPlatforms = PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(form.name.toLowerCase())
  )

  const selectPlatform = (platform: typeof PLATFORMS[0]) => {
    set('name', platform.name)
    set('category', platform.category)
    set('logoUrl', `https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128`)
    setShowSuggestions(false)
  }

  const set = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const nextPaymentDate = nextDateForDay(form.paymentDayOfMonth)
      const dto: CreateSubscriptionDto & { isActive?: boolean } = {
        name: form.name,
        description: form.description?.trim() || undefined,
        price: form.price,
        currency: form.currency,
        billingCycle: form.billingCycle,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        nextPaymentDate,
        logoUrl: form.logoUrl?.trim() || undefined,
        category: form.category?.trim() || undefined,
        isActive: form.isActive,
      }
      await onSubmit(dto)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.nameField} ref={nameWrapperRef}>
          <label className={styles.label}>Name *</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Search Netflix, Spotify…"
            required
            autoComplete="off"
            value={form.name}
            onChange={e => { set('name', e.target.value); setShowSuggestions(true) }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && filteredPlatforms.length > 0 && (
            <div className={styles.suggestions}>
              {filteredPlatforms.slice(0, 7).map(platform => (
                <button
                  key={platform.name}
                  type="button"
                  className={styles.suggestion}
                  onMouseDown={e => { e.preventDefault(); selectPlatform(platform) }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${platform.domain}&sz=128`}
                    alt=""
                    className={styles.suggestionLogo}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className={styles.suggestionName}>{platform.name}</span>
                  <span className={styles.suggestionCategory}>{platform.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.input}
            value={form.category ?? ''}
            onChange={e => set('category', e.target.value || undefined)}
          >
            <option value="">No category</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description <span className={styles.optional}>(optional)</span></label>
        <input
          className={styles.input}
          type="text"
          placeholder="Optional description"
          value={form.description ?? ''}
          onChange={e => set('description', e.target.value || undefined)}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Price *</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            required
            value={priceDisplay}
            onFocus={() => { if (form.price === 0) setPriceDisplay('') }}
            onBlur={() => { if (priceDisplay === '') { setPriceDisplay('0'); set('price', 0) } }}
            onChange={e => {
              setPriceDisplay(e.target.value)
              set('price', parseFloat(e.target.value) || 0)
            }}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Currency</label>
          <select className={styles.input} value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="NOK">NOK</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="SEK">SEK</option>
            <option value="DKK">DKK</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Billing cycle</label>
          <select
            className={styles.input}
            value={form.billingCycle}
            onChange={e => set('billingCycle', parseInt(e.target.value) as BillingCycle)}
          >
            <option value={BillingCycle.Weekly}>Weekly</option>
            <option value={BillingCycle.Monthly}>Monthly</option>
            <option value={BillingCycle.Quarterly}>Quarterly</option>
            <option value={BillingCycle.Yearly}>Yearly</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Payment day of month *</label>
          <input
            className={styles.input}
            type="number"
            min="1"
            max="31"
            required
            value={form.paymentDayOfMonth}
            onChange={e => set('paymentDayOfMonth', Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
          />
          <span className={styles.hint}>
            Next payment: {nextDateForDay(form.paymentDayOfMonth)}
          </span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Start date *</label>
          <input
            className={styles.input}
            type="date"
            required
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>End date <span className={styles.optional}>(optional)</span></label>
          <input
            className={styles.input}
            type="date"
            value={form.endDate ?? ''}
            onChange={e => set('endDate', e.target.value || undefined)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Logo URL <span className={styles.optional}>(optional)</span></label>
        <input
          className={styles.input}
          type="url"
          placeholder="https://example.com/logo.png"
          value={form.logoUrl ?? ''}
          onChange={e => set('logoUrl', e.target.value || undefined)}
        />
      </div>

      {showIsActive && (
        <div className={styles.checkboxField}>
          <input
            id="isActive"
            type="checkbox"
            className={styles.checkbox}
            checked={form.isActive}
            onChange={e => set('isActive', e.target.checked)}
          />
          <label htmlFor="isActive" className={styles.checkboxLabel}>Active subscription</label>
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <strong>Could not save</strong>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
