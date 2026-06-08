import { KeyRound, CheckCircle2, XCircle, BarChart3 } from 'lucide-react'
import { ApiKey } from '@/lib/api-keys'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApiKeySummaryCards({ apiKeys }: { apiKeys: ApiKey[] }) {
  const total = apiKeys.length
  const active = apiKeys.filter((k) => k.status === 'active').length
  const blocked = apiKeys.filter((k) => k.status === 'blocked').length
  const totalUsage = apiKeys.reduce((sum, k) => sum + k.usage, 0)

  const activePercent = total > 0 ? ((active / total) * 100).toFixed(1) : '0'
  const blockedPercent = total > 0 ? ((blocked / total) * 100).toFixed(1) : '0'

  const cards = [
    {
      title: 'Total API Keys',
      value: total,
      subtitle: '+3 dari bulan lalu',
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
          <KeyRound className='h-4 w-4' />
        </div>
      ),
    },
    {
      title: 'Active Keys',
      value: active,
      subtitle: `${activePercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600'>
          <CheckCircle2 className='h-4 w-4' />
        </div>
      ),
    },
    {
      title: 'Blocked Keys',
      value: blocked,
      subtitle: `${blockedPercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
          <XCircle className='h-4 w-4' />
        </div>
      ),
    },
    {
      title: 'Total Usage (Bulan Ini)',
      value: `$${totalUsage.toFixed(2)}`,
      subtitle: '+18.6% dari bulan lalu',
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600'>
          <BarChart3 className='h-4 w-4' />
        </div>
      ),
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
