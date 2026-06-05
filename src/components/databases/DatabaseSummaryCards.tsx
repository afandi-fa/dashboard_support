import type { ReactNode } from 'react'
import { DatabaseIcon, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { Database, DatabaseStatus } from '@/lib/databases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DatabaseSummaryCards({
  databases,
}: {
  databases: Database[]
}) {
  const total = databases.length
  const online = databases.filter((d) => d.status === 'online').length
  const maintenance = databases.filter((d) => d.status === 'maintenance').length
  const offline = databases.filter((d) => d.status === 'offline').length

  const onlinePercent = total > 0 ? ((online / total) * 100).toFixed(1) : '0'
  const maintenancePercent =
    total > 0 ? ((maintenance / total) * 100).toFixed(1) : '0'
  const offlinePercent = total > 0 ? ((offline / total) * 100).toFixed(1) : '0'

  const cards: {
    title: string
    value: number
    subtitle: string
    icon: ReactNode
    status: DatabaseStatus | 'total'
  }[] = [
    {
      title: 'Total Databases',
      value: total,
      subtitle: '+2 dari bulan lalu',
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
          <DatabaseIcon className='h-4 w-4' />
        </div>
      ),
      status: 'total',
    },
    {
      title: 'Online',
      value: online,
      subtitle: `${onlinePercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600'>
          <CheckCircle2 className='h-4 w-4' />
        </div>
      ),
      status: 'online',
    },
    {
      title: 'Maintenance',
      value: maintenance,
      subtitle: `${maintenancePercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
          <AlertCircle className='h-4 w-4' />
        </div>
      ),
      status: 'maintenance',
    },
    {
      title: 'Offline',
      value: offline,
      subtitle: `${offlinePercent}% dari total`,
      icon: (
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600'>
          <XCircle className='h-4 w-4' />
        </div>
      ),
      status: 'offline',
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
