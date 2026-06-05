import { MoreVertical, ExternalLink } from 'lucide-react'
import { Database, getDatabaseTypeIcon } from '@/lib/databases'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function getDaysUntilExpire(expireDate: string): number {
  const today = new Date('2026-06-05')
  const expire = new Date(expireDate)
  const diff = expire.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadge(status: Database['status']) {
  const variants: Record<
    Database['status'],
    {
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
      className: string
    }
  > = {
    online: {
      variant: 'default',
      className: 'bg-green-100 text-green-700 hover:bg-green-100',
    },
    maintenance: {
      variant: 'secondary',
      className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    },
    offline: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-700 hover:bg-red-100',
    },
  }

  const config = variants[status]
  const labels: Record<Database['status'], string> = {
    online: 'Online',
    maintenance: 'Maintenance',
    offline: 'Offline',
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === 'online'
            ? 'bg-green-500'
            : status === 'maintenance'
              ? 'bg-amber-500'
              : 'bg-red-500'
        }`}
      />
      {labels[status]}
    </Badge>
  )
}

function ConnectionBar({
  connections,
  maxConnections,
}: {
  connections: number
  maxConnections: number
}) {
  const percent = Math.round((connections / maxConnections) * 100)
  let barColor = 'bg-green-500'
  if (percent > 70) barColor = 'bg-amber-500'
  if (percent > 90) barColor = 'bg-red-500'

  return (
    <div className='w-full max-w-[180px]'>
      <div className='mb-1 text-sm font-medium'>
        {connections} / {maxConnections}
      </div>
      <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default function DatabaseTable({
  databases,
}: {
  databases: Database[]
}) {
  return (
    <div className='hidden overflow-x-auto rounded-md border border-border md:block'>
      <div className='min-w-[900px]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Database</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connections</TableHead>
              <TableHead>Expire Date</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='text-end'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {databases.map((db) => {
              const daysLeft = getDaysUntilExpire(db.expireDate)
              const daysColor =
                daysLeft < 30
                  ? 'text-red-600'
                  : daysLeft < 90
                    ? 'text-amber-600'
                    : 'text-green-600'

              return (
                <TableRow key={db.id}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <span className='text-xl' title={db.type}>
                        {getDatabaseTypeIcon(db.type)}
                      </span>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{db.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          {db.type} {db.version}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(db.status)}</TableCell>
                  <TableCell>
                    <ConnectionBar
                      connections={db.connections}
                      maxConnections={db.maxConnections}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {new Date(db.expireDate).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className={`text-xs ${daysColor}`}>
                        ({daysLeft} hari lagi)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex flex-col'>
                      <span>{db.createdAt}</span>
                      <span className='text-xs text-muted-foreground'>
                        {db.createdTime}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-end'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <ExternalLink className='h-4 w-4' />
                        <span className='sr-only'>Open database</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                          >
                            <MoreVertical className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>View Detail</DropdownMenuItem>
                          <DropdownMenuItem>Edit Database</DropdownMenuItem>
                          <DropdownMenuItem className='text-red-600'>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableCaption>Menampilkan {databases.length} database</TableCaption>
        </Table>
      </div>
    </div>
  )
}
