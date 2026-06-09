import { ChevronRight, Globe } from 'lucide-react'
import { Domain } from '@/lib/domains'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getDaysUntilExpire(expireDate: string): number {
  const today = new Date('2026-06-09')
  const expire = new Date(expireDate)
  const diff = expire.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function DomainExpiringSoon({ domains }: { domains: Domain[] }) {
  const expiring = domains
    .map((domain) => ({
      ...domain,
      daysLeft: getDaysUntilExpire(domain.expireDate),
    }))
    .filter((domain) => domain.daysLeft <= 365)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 6)

  const getDaysColor = (days: number) => {
    if (days < 30) return 'text-red-600'
    if (days < 90) return 'text-amber-600'
    return 'text-green-600'
  }

  const getDaysText = (days: number) => {
    if (days < 0) return `${Math.abs(days)} hari lalu`
    return `${days} hari lagi`
  }

  const getIconColor = (days: number) => {
    if (days < 30) return 'text-red-500 bg-red-50'
    if (days < 90) return 'text-amber-500 bg-amber-50'
    return 'text-green-500 bg-green-50'
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>Akan Expired</CardTitle>
        <p className='text-xs text-muted-foreground'>
          Domain yang akan segera expired dalam 30 hari ke depan.
        </p>
      </CardHeader>
      <CardContent className='space-y-3'>
        {expiring.map((domain) => (
          <div key={domain.id} className='flex items-center gap-3'>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getIconColor(domain.daysLeft)}`}
            >
              <Globe className='h-3.5 w-3.5' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='truncate text-sm font-medium'>{domain.name}</div>
              <div className='text-xs text-muted-foreground'>
                {new Date(domain.expireDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div
              className={`shrink-0 text-xs font-medium ${getDaysColor(domain.daysLeft)}`}
            >
              {getDaysText(domain.daysLeft)}
            </div>
            <Button
              variant='outline'
              size='sm'
              className='h-7 shrink-0 text-xs'
            >
              Perpanjang
            </Button>
          </div>
        ))}
        <button className='flex items-center gap-1 pt-1 text-xs font-medium text-blue-600 hover:text-blue-700'>
          Lihat semua
          <ChevronRight className='h-3 w-3' />
        </button>
      </CardContent>
    </Card>
  )
}
