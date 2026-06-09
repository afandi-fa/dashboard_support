import { useEffect, useMemo, useState } from 'react'
import {
  MoreVertical,
  ExternalLink,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { fetchDatabases, Database, getDatabaseTypeIcon } from '@/lib/databases'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DatabaseExpiringSoon from './DatabaseExpiringSoon'
import DatabaseSummaryCards from './DatabaseSummaryCards'

function getDaysUntilExpire(expireDate: string): number {
  const today = new Date('2026-06-05')
  const expire = new Date(expireDate)
  const diff = expire.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadge(status: Database['status']) {
  const labels: Record<Database['status'], string> = {
    online: 'Online',
    maintenance: 'Maintenance',
    offline: 'Offline',
  }

  const className =
    status === 'online'
      ? 'bg-green-100 text-green-700 hover:bg-green-100'
      : status === 'maintenance'
        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
        : 'bg-red-100 text-red-700 hover:bg-red-100'

  return (
    <Badge variant='outline' className={className}>
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

function MobileDatabaseCard({ db }: { db: Database }) {
  const daysLeft = getDaysUntilExpire(db.expireDate)
  const daysColor =
    daysLeft < 30
      ? 'text-red-600'
      : daysLeft < 90
        ? 'text-amber-600'
        : 'text-green-600'

  return (
    <Card className='md:hidden'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>{getDatabaseTypeIcon(db.type)}</span>
            <div>
              <div className='font-medium'>{db.name}</div>
              <div className='text-xs text-muted-foreground'>
                {db.type} {db.version}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
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

        <div className='mt-3 flex items-center justify-between'>
          {getStatusBadge(db.status)}
          <div className='text-xs text-muted-foreground'>
            {db.connections} / {db.maxConnections} connections
          </div>
        </div>

        <div className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted'>
          <div
            className={`h-full rounded-full ${
              Math.round((db.connections / db.maxConnections) * 100) > 70
                ? 'bg-amber-500'
                : 'bg-green-500'
            }`}
            style={{
              width: `${Math.round((db.connections / db.maxConnections) * 100)}%`,
            }}
          />
        </div>

        <div className='mt-3 flex items-center justify-between text-xs'>
          <div className='text-muted-foreground'>
            Expire:{' '}
            {new Date(db.expireDate).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className={daysColor}>({daysLeft} hari lagi)</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DatabasesPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [databases, setDatabases] = useState<Database[]>([])

  const pageSize = 8

  useEffect(() => {
    fetchDatabases().then(setDatabases)
  }, [])

  const filtered = useMemo(() => {
    return databases.filter((db) => {
      const q = query.trim().toLowerCase()
      if (q && !db.name.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && db.status !== statusFilter) return false
      return true
    })
  }, [databases, query, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  function handleReset() {
    setQuery('')
    setStatusFilter('all')
    setPage(1)
  }

  return (
    <div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Database Management
          </h1>
        </div>
      </div>

      <div className='space-y-4'>
        <DatabaseSummaryCards databases={databases} />

        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Main content */}
          <div className='flex-1 space-y-4'>
            <Card>
              <CardHeader>
                <div className='flex w-full flex-col gap-3 xl:flex-row xl:items-center'>
                  <Input
                    placeholder='Search databases...'
                    className='w-full xl:flex-1'
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setPage(1)
                    }}
                  />

                  <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                      setStatusFilter(v)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger size='sm' className='w-full xl:w-[180px]'>
                      <SelectValue placeholder='Semua Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Status</SelectItem>
                      <SelectItem value='online'>Online</SelectItem>
                      <SelectItem value='maintenance'>Maintenance</SelectItem>
                      <SelectItem value='offline'>Offline</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full xl:w-auto'
                    onClick={handleReset}
                  >
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Reset
                  </Button>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Desktop Table */}
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
                        {pageItems.map((db) => {
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
                                    <span className='font-medium'>
                                      {db.name}
                                    </span>
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
                                    {new Date(db.expireDate).toLocaleDateString(
                                      'id-ID',
                                      {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      }
                                    )}
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
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0'
                                  >
                                    <ExternalLink className='h-4 w-4' />
                                    <span className='sr-only'>
                                      Open database
                                    </span>
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        className='h-8 w-8 p-0'
                                      >
                                        <MoreVertical className='h-4 w-4' />
                                        <span className='sr-only'>
                                          Open menu
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                      <DropdownMenuItem>
                                        View Detail
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Edit Database
                                      </DropdownMenuItem>
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
                      <TableCaption>
                        Menampilkan {pageItems.length} dari {filtered.length}{' '}
                        database
                      </TableCaption>
                    </Table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className='space-y-3 md:hidden'>
                  {pageItems.map((db) => (
                    <MobileDatabaseCard key={db.id} db={db} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 pt-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={p === page ? 'default' : 'outline'}
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      )
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='w-full shrink-0 space-y-4 lg:w-[320px]'>
            <DatabaseExpiringSoon databases={databases} />
          </div>
        </div>
      </div>
    </div>
  )
}
