import { useEffect, useMemo, useState } from 'react'
import {
  MoreVertical,
  ExternalLink,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Globe,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import {
  fetchDomains,
  Domain,
  getRegistrarColor,
  getDnsProviderColor,
} from '@/lib/domains'
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
import DomainExpiringSoon from './DomainExpiringSoon'
import DomainSummaryCards from './DomainSummaryCards'

function getDaysUntilExpire(expireDate: string): number {
  const today = new Date('2026-06-09')
  const expire = new Date(expireDate)
  const diff = expire.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getStatusBadge(status: Domain['status']) {
  const labels: Record<Domain['status'], string> = {
    active: 'Active',
    'pending-renewal': 'Pending Renewal',
    expired: 'Expired',
    suspended: 'Suspended',
  }

  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 hover:bg-green-100'
      : status === 'pending-renewal'
        ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
        : status === 'expired'
          ? 'bg-red-100 text-red-700 hover:bg-red-100'
          : 'bg-purple-100 text-purple-700 hover:bg-purple-100'

  const dotColor =
    status === 'active'
      ? 'bg-green-500'
      : status === 'pending-renewal'
        ? 'bg-amber-500'
        : status === 'expired'
          ? 'bg-red-500'
          : 'bg-purple-500'

  return (
    <Badge variant='outline' className={className}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {labels[status]}
    </Badge>
  )
}

function MobileDomainCard({ domain }: { domain: Domain }) {
  const daysLeft = getDaysUntilExpire(domain.expireDate)
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
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
              <Globe className='h-4 w-4' />
            </div>
            <div>
              <div className='font-medium'>{domain.name}</div>
              {domain.isPrimary && (
                <span className='text-xs font-medium text-green-600'>
                  Primary
                </span>
              )}
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
              <DropdownMenuItem>Edit Domain</DropdownMenuItem>
              <DropdownMenuItem className='text-red-600'>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='mt-3 flex items-center justify-between'>
          {getStatusBadge(domain.status)}
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            {domain.autoRenew ? (
              <>
                <CheckCircle2 className='h-3 w-3 text-green-500' />
                Enabled
              </>
            ) : (
              <>
                <XCircle className='h-3 w-3 text-gray-400' />
                Disabled
              </>
            )}
          </div>
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
          <div>
            <div className='text-muted-foreground'>Registrar</div>
            <div className='font-medium'>{domain.registrar}</div>
          </div>
          <div>
            <div className='text-muted-foreground'>DNS Provider</div>
            <div className='font-medium'>{domain.dnsProvider}</div>
          </div>
        </div>

        <div className='mt-3 flex items-center justify-between text-xs'>
          <div className='text-muted-foreground'>
            Expire:{' '}
            {new Date(domain.expireDate).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className={daysColor}>
            {daysLeft < 0
              ? `${Math.abs(daysLeft)} hari lalu`
              : `${daysLeft} hari lagi`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DomainsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [registrarFilter, setRegistrarFilter] = useState('all')
  const [dnsFilter, setDnsFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [domains, setDomains] = useState<Domain[]>([])

  const pageSize = 5

  useEffect(() => {
    fetchDomains().then(setDomains)
  }, [])

  const filtered = useMemo(() => {
    return domains.filter((domain) => {
      const q = query.trim().toLowerCase()
      if (q && !domain.name.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && domain.status !== statusFilter) return false
      if (registrarFilter !== 'all' && domain.registrar !== registrarFilter)
        return false
      if (dnsFilter !== 'all' && domain.dnsProvider !== dnsFilter) return false
      return true
    })
  }, [domains, query, statusFilter, registrarFilter, dnsFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  function handleReset() {
    setQuery('')
    setStatusFilter('all')
    setRegistrarFilter('all')
    setDnsFilter('all')
    setPage(1)
  }

  const uniqueRegistrars = useMemo(() => {
    return Array.from(new Set(domains.map((d) => d.registrar)))
  }, [domains])

  const uniqueDnsProviders = useMemo(() => {
    return Array.from(new Set(domains.map((d) => d.dnsProvider)))
  }, [domains])

  return (
    <div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Domain Management
          </h1>
        </div>
      </div>

      <div className='space-y-4'>
        <DomainSummaryCards domains={domains} />

        <div className='flex-1 space-y-4'>
          <Card>
            <CardHeader>
              <div className='flex w-full flex-col gap-3 xl:flex-row xl:items-center'>
                <Input
                  placeholder='Search domains...'
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
                  <SelectTrigger size='sm' className='w-full xl:w-[160px]'>
                    <SelectValue placeholder='Semua Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Status</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='pending-renewal'>
                      Pending Renewal
                    </SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                    <SelectItem value='suspended'>Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={registrarFilter}
                  onValueChange={(v) => {
                    setRegistrarFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger size='sm' className='w-full xl:w-[160px]'>
                    <SelectValue placeholder='Semua Registrar' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Registrar</SelectItem>
                    {uniqueRegistrars.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={dnsFilter}
                  onValueChange={(v) => {
                    setDnsFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger size='sm' className='w-full xl:w-[160px]'>
                    <SelectValue placeholder='Semua DNS Provider' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua DNS Provider</SelectItem>
                    {uniqueDnsProviders.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
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
                        <TableHead>Domain</TableHead>
                        <TableHead>Registrar</TableHead>
                        <TableHead>DNS Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Expire Date</TableHead>
                        <TableHead>Auto Renew</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead className='text-end'>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageItems.map((domain) => {
                        const daysLeft = getDaysUntilExpire(domain.expireDate)
                        const daysColor =
                          daysLeft < 30
                            ? 'text-red-600'
                            : daysLeft < 90
                              ? 'text-amber-600'
                              : 'text-green-600'

                        return (
                          <TableRow key={domain.id}>
                            <TableCell>
                              <div className='flex items-center gap-3'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                  <Globe className='h-4 w-4' />
                                </div>
                                <div className='flex flex-col'>
                                  <span className='font-medium'>
                                    {domain.name}
                                  </span>
                                  {domain.isPrimary && (
                                    <span className='flex items-center gap-1 text-xs font-medium text-green-600'>
                                      <CheckCircle2 className='h-3 w-3' />
                                      Primary
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getRegistrarColor(domain.registrar)}`}
                              >
                                {domain.registrar}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getDnsProviderColor(domain.dnsProvider)}`}
                              >
                                {domain.dnsProvider}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(domain.status)}
                            </TableCell>
                            <TableCell>
                              <div className='flex flex-col'>
                                <span className='font-medium'>
                                  {new Date(
                                    domain.expireDate
                                  ).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className={`text-xs ${daysColor}`}>
                                  {daysLeft < 0
                                    ? `(${Math.abs(daysLeft)} hari lalu)`
                                    : `(${daysLeft} hari lagi)`}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex items-center gap-1.5'>
                                {domain.autoRenew ? (
                                  <>
                                    <CheckCircle2 className='h-4 w-4 text-green-500' />
                                    <span className='text-sm'>Enabled</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className='h-4 w-4 text-gray-400' />
                                    <span className='text-sm text-muted-foreground'>
                                      Disabled
                                    </span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className='text-sm'>
                                {domain.createdAt}
                              </span>
                            </TableCell>
                            <TableCell className='text-end'>
                              <div className='flex items-center justify-end gap-1'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                  onClick={() =>
                                    console.log('Open domain:', domain.name)
                                  }
                                >
                                  <ExternalLink className='h-4 w-4' />
                                  <span className='sr-only'>Open domain</span>
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
                                    <DropdownMenuItem
                                      onClick={() =>
                                        console.log('View detail:', domain.name)
                                      }
                                    >
                                      View Detail
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        console.log('Edit domain:', domain.name)
                                      }
                                    >
                                      Edit Domain
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className='text-red-600'
                                      onClick={() =>
                                        console.log(
                                          'Delete domain:',
                                          domain.name
                                        )
                                      }
                                    >
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
                      domain
                    </TableCaption>
                  </Table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className='space-y-3 md:hidden'>
                {pageItems.map((domain) => (
                  <MobileDomainCard key={domain.id} domain={domain} />
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Akan Expired Section */}
          <DomainExpiringSoon domains={domains} />
        </div>
      </div>
    </div>
  )
}
