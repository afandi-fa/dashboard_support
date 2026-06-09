import type { ReactNode } from 'react'
import { Globe, CheckCircle2, Clock, XCircle, PauseCircle } from 'lucide-react'
import { Domain, DomainStatus } from '@/lib/domains'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DomainSummaryCards({ domains }: { domains: Domain[] }) {
  const total = domains.length
  const active = domains.filter((d) => d.status === 'active').length
  const pendingRenewal = domains.filter(
    (d) => d.status === 'pending-renewal'
  ).length
  const expired = domains.filter((d) => d.status === 'expired').length
  const suspended = domains.filter((d) => d.status === 'suspended').length

  const activePercent = total > 0 ? ((active / total) * 100).toFixed(1) : '0'
  const pendingPercent =
    total > 0 ? ((pendingRenewal / total) * 100).toFixed(1) : '0'
  const expiredPercent = total > 0 ? ((expired / total) * 100).toFixed(1) : '0'
  const suspendedPercent =
    total > 0 ? ((suspended / total) * 100).toFixed(1) : '0'

  const cards: {
    title: string
    value: number
    subtitle: string
    icon: ReactNode
    status: DomainStatus | 'total'
  }[] = [
    {
      title: 'Total Domain',
      value: total,
      subtitle: '+3 dari bulan lalu',
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
          <Globe className='h-4 w-4' />
        </div>
      ),
      status: 'total',
    },
    {
      title: 'Active',
      value: active,
      subtitle: `${activePercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600'>
          <CheckCircle2 className='h-4 w-4' />
        </div>
      ),
      status: 'active',
    },
    {
      title: 'Pending Renewal',
      value: pendingRenewal,
      subtitle: `${pendingPercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
          <Clock className='h-4 w-4' />
        </div>
      ),
      status: 'pending-renewal',
    },
    {
      title: 'Expired',
      value: expired,
      subtitle: `${expiredPercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600'>
          <XCircle className='h-4 w-4' />
        </div>
      ),
      status: 'expired',
    },
    {
      title: 'Suspended',
      value: suspended,
      subtitle: `${suspendedPercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600'>
          <PauseCircle className='h-4 w-4' />
        </div>
      ),
      status: 'suspended',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{card.value}</div>
            <p className='text-xs text-muted-foreground'>{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
