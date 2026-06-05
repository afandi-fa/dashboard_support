import { Clock, ChevronRight } from 'lucide-react'
import { Database } from '@/lib/databases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getDaysUntilExpire(expireDate: string): number {
  const today = new Date('2026-06-05')
  const expire = new Date(expireDate)
  const diff = expire.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function DatabaseExpiringSoon({
  databases,
}: {
  databases: Database[]
}) {
  const expiring = databases
    .map((db) => ({
      ...db,
      daysLeft: getDaysUntilExpire(db.expireDate),
    }))
    .filter((db) => db.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 6)

  const getDaysColor = (days: number) => {
    if (days < 30) return 'text-red-600'
    if (days < 90) return 'text-amber-600'
    return 'text-green-600'
  }

  const getIconColor = (days: number) => {
    if (days < 30) return 'text-red-500 bg-red-50'
    if (days < 90) return 'text-amber-500 bg-amber-50'
    return 'text-green-500 bg-green-50'
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold'>Expiring Soon</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {expiring.map((db) => (
          <div key={db.id} className='flex items-center gap-3'>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getIconColor(db.daysLeft)}`}
            >
              <Clock className='h-3.5 w-3.5' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='text-sm font-medium'>
                {new Date(db.expireDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className='truncate text-xs text-muted-foreground'>
                {db.name} ({db.type} {db.version})
              </div>
            </div>
            <div
              className={`shrink-0 text-xs font-medium ${getDaysColor(db.daysLeft)}`}
            >
              {db.daysLeft} hari lagi
            </div>
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
