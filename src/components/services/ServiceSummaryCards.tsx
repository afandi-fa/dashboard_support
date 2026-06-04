import { Service } from '@/lib/services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ServiceSummaryCards({
  services,
}: {
  services: Service[]
}) {
  const total = services.length
  const running = services.filter((s) => s.status === 'running').length
  const warning = services.filter((s) => s.status === 'warning').length
  const stopped = services.filter((s) => s.status === 'stopped').length

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
          <p className='text-xs text-muted-foreground'>Semua layanan</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 rounded-full bg-green-500' />
            <CardTitle className='text-sm font-medium'>Running</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{running}</div>
          <p className='text-xs text-muted-foreground'>dari total services</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 rounded-full bg-amber-500' />
            <CardTitle className='text-sm font-medium'>Warning</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{warning}</div>
          <p className='text-xs text-muted-foreground'>dari total services</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-500' />
            <CardTitle className='text-sm font-medium'>Stopped</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stopped}</div>
          <p className='text-xs text-muted-foreground'>dari total services</p>
        </CardContent>
      </Card>
    </div>
  )
}
