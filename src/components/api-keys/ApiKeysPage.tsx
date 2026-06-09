import { useEffect, useMemo, useState } from 'react'
import {
  MoreVertical,
  ExternalLink,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { fetchApiKeys, ApiKey } from '@/lib/api-keys'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import ApiKeySummaryCards from './ApiKeySummaryCards'
import ApiKeyUsagePanel from './ApiKeyUsagePanel'

function getStatusBadge(status: ApiKey['status']) {
  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 hover:bg-green-100'
      : 'bg-red-100 text-red-700 hover:bg-red-100'

  return (
    <Badge variant='outline' className={className}>
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === 'active' ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      {status === 'active' ? 'Active' : 'Blocked'}
    </Badge>
  )
}

function UsageBar({
  usage,
  percent,
}: {
  usage: number
  limit: number
  percent: number
}) {
  let barColor = 'bg-green-500'
  if (percent > 70) barColor = 'bg-amber-500'
  if (percent >= 100) barColor = 'bg-red-500'

  return (
    <div className='w-full max-w-[160px]'>
      <div className='mb-1 text-sm font-medium'>${usage.toFixed(2)}</div>
      <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className='mt-0.5 text-xs text-muted-foreground'>
        {percent.toFixed(1)}%
      </div>
    </div>
  )
}

function MobileApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <Card className='md:hidden'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>{apiKey.providerIcon}</span>
            <div>
              <div className='font-medium'>{apiKey.name}</div>
              <div className='text-xs text-muted-foreground'>
                {apiKey.keyMasked}
              </div>
            </div>
          </div>
          {getStatusBadge(apiKey.status)}
        </div>

        <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
          <div>
            <span className='text-muted-foreground'>Model:</span> {apiKey.model}
          </div>
          <div>
            <span className='text-muted-foreground'>Limit:</span> $
            {apiKey.limitPerMonth.toFixed(2)}
          </div>
        </div>

        <div className='mt-2'>
          <UsageBar
            usage={apiKey.usage}
            limit={apiKey.limitPerMonth}
            percent={apiKey.usagePercent}
          />
        </div>

        <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
          <span>Dibuat: {apiKey.createdAt}</span>
          {apiKey.resetInDays !== null && (
            <span
              className={
                apiKey.resetInDays < 7
                  ? 'text-red-600'
                  : apiKey.resetInDays < 14
                    ? 'text-amber-600'
                    : 'text-green-600'
              }
            >
              Reset: {apiKey.resetInDays} hari lagi
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ApiKeysPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])

  const pageSize = 8

  useEffect(() => {
    fetchApiKeys().then(setApiKeys)
  }, [])

  const providers = useMemo(() => {
    const set = new Set(apiKeys.map((k) => k.provider))
    return Array.from(set)
  }, [apiKeys])

  const filtered = useMemo(() => {
    return apiKeys.filter((k) => {
      const q = query.trim().toLowerCase()
      if (q && !k.name.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && k.status !== statusFilter) return false
      if (providerFilter !== 'all' && k.provider !== providerFilter)
        return false
      return true
    })
  }, [apiKeys, query, statusFilter, providerFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  function handleReset() {
    setQuery('')
    setStatusFilter('all')
    setProviderFilter('all')
    setPage(1)
  }

  return (
    <div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            API Key Management
          </h1>
        </div>
      </div>

      <div className='space-y-4'>
        <ApiKeySummaryCards apiKeys={apiKeys} />

        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Main content */}
          <div className='flex-1 space-y-4'>
            <Card>
              <CardHeader>
                <div className='flex w-full flex-col gap-3 xl:flex-row xl:items-center'>
                  <Input
                    placeholder='Search API keys...'
                    className='w-full xl:flex-1'
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setPage(1)
                    }}
                  />

                  <Select
                    value={providerFilter}
                    onValueChange={(v) => {
                      setProviderFilter(v)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger size='sm' className='w-full xl:w-[180px]'>
                      <SelectValue placeholder='Semua Provider' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Provider</SelectItem>
                      {providers.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='blocked'>Blocked</SelectItem>
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
                  <div className='min-w-[1000px]'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Providear</TableHead>
                          <TableHead>Nama Key</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Limit / Bulan</TableHead>
                          <TableHead>Usage</TableHead>
                          <TableHead>Reset In</TableHead>
                          <TableHead>Dibuat</TableHead>
                          <TableHead className='text-end'>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pageItems.map((key) => (
                          <TableRow key={key.id}>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <span className='text-lg'>
                                  {key.providerIcon}
                                </span>
                                <span className='font-medium'>
                                  {key.provider}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className='flex flex-col'>
                                <span className='font-medium'>{key.name}</span>
                                <span className='text-xs text-muted-foreground'>
                                  {key.keyMasked}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{key.model}</TableCell>
                            <TableCell>{getStatusBadge(key.status)}</TableCell>
                            <TableCell className='font-medium'>
                              ${key.limitPerMonth.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <UsageBar
                                usage={key.usage}
                                limit={key.limitPerMonth}
                                percent={key.usagePercent}
                              />
                            </TableCell>
                            <TableCell>
                              {key.resetInDays !== null ? (
                                <span
                                  className={`text-sm font-medium ${
                                    key.resetInDays < 7
                                      ? 'text-red-600'
                                      : key.resetInDays < 14
                                        ? 'text-amber-600'
                                        : 'text-green-600'
                                  }`}
                                >
                                  {key.resetInDays} hari lagi
                                </span>
                              ) : (
                                <span className='text-sm text-muted-foreground'>
                                  -
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className='flex flex-col'>
                                <span>{key.createdAt}</span>
                                <span className='text-xs text-muted-foreground'>
                                  {key.createdTime}
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
                                  <span className='sr-only'>Open</span>
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='h-8 w-8 p-0'
                                >
                                  <MoreVertical className='h-4 w-4' />
                                  <span className='sr-only'>Menu</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableCaption>
                        Menampilkan {pageItems.length} dari {filtered.length}{' '}
                        API keys
                      </TableCaption>
                    </Table>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className='space-y-3 md:hidden'>
                  {pageItems.map((key) => (
                    <MobileApiKeyCard key={key.id} apiKey={key} />
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
            <ApiKeyUsagePanel apiKeys={apiKeys} />
          </div>
        </div>
      </div>
    </div>
  )
}
