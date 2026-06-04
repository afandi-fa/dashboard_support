import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MoreVertical, Eye, RotateCcw, Power, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const sampleInstances = [
  {
    id: '1',
    name: 'web-01.production',
    client: 'Client: PT. Maju Bersama',
    ip: '103.168.1.22',
    status: 'Running',
    badgeVariant: 'default',
    expire: '12 Jun 2025',
    expireInfo: '29 hari lagi',
    daysLeft: 29,
    vcpu: 4,
    ramTotal: 8,
    storageTotal: 100,
    os: 'Ubuntu 22.04 LTS',
    lastReboot: '12 Mei 2025 03:21',
    uptime: '14 hari 06 jam',
    ramUsed: 3.6,
    diskUsed: 67,
    diskTotal: 100,
    usage: { cpu: 32, ram: 45, disk: 67 },
  },
  {
    id: '2',
    name: 'api-02.staging',
    client: 'Client: CV. Solusi Digital',
    ip: '103.168.1.23',
    status: 'Running',
    badgeVariant: 'default',
    expire: '05 Jun 2025',
    expireInfo: '22 hari lagi',
    daysLeft: 22,
    vcpu: 2,
    ramTotal: 4,
    storageTotal: 80,
    os: 'Debian 12',
    lastReboot: '28 Mei 2025 18:45',
    uptime: '6 hari 09 jam',
    ramUsed: 1.8,
    diskUsed: 41,
    diskTotal: 80,
    usage: { cpu: 18, ram: 28, disk: 41 },
  },
  {
    id: '3',
    name: 'db-01.production',
    client: 'Client: PT. Data Prima',
    ip: '103.168.1.24',
    status: 'Starting',
    badgeVariant: 'secondary',
    expire: '20 May 2025',
    expireInfo: '6 hari lagi',
    daysLeft: 6,
    vcpu: 8,
    ramTotal: 16,
    storageTotal: 220,
    os: 'CentOS 7',
    lastReboot: '01 Mei 2025 23:12',
    uptime: '3 hari 11 jam',
    ramUsed: 5.8,
    diskUsed: 55,
    diskTotal: 220,
    usage: { cpu: 12, ram: 36, disk: 55 },
  },
  {
    id: '4',
    name: 'backup-01.production',
    client: 'Client: PT. Aman Teknologi',
    ip: '103.168.1.25',
    status: 'Stopped',
    badgeVariant: 'outline',
    expire: '15 Apr 2025',
    expireInfo: 'Expired 15 hari',
    daysLeft: -15,
    vcpu: 4,
    ramTotal: 8,
    storageTotal: 200,
    os: 'Ubuntu 20.04 LTS',
    lastReboot: '10 Apr 2025 01:25',
    uptime: '0 hari 00 jam',
    ramUsed: 0,
    diskUsed: 0,
    diskTotal: 200,
    usage: { cpu: 0, ram: 0, disk: 0 },
  },
  {
    id: '5',
    name: 'cache-01.staging',
    client: 'Client: CV. Inovasi Tech',
    ip: '103.168.1.26',
    status: 'Rebooting',
    badgeVariant: 'destructive',
    expire: '25 May 2025',
    expireInfo: '11 hari lagi',
    daysLeft: 11,
    vcpu: 6,
    ramTotal: 12,
    storageTotal: 150,
    os: 'Ubuntu 22.04 LTS',
    lastReboot: '30 Mei 2025 07:04',
    uptime: '5 hari 13 jam',
    ramUsed: 8.5,
    diskUsed: 82,
    diskTotal: 150,
    usage: { cpu: 67, ram: 71, disk: 82 },
  },
]

function UsageBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className='flex flex-col'>
      <div className='mb-1 text-xs text-muted-foreground'>{label}</div>
      <div className='h-2.5 w-40 rounded-full bg-muted'>
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className='mt-1 text-xs font-medium'>{value}%</div>
    </div>
  )
}

function VPSDetailDrawer({
  instance,
  isOpen,
  onClose,
}: {
  instance: (typeof sampleInstances)[number] | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!instance) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='h-[calc(100vh-4rem)] w-full overflow-y-auto sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{instance.name}</SheetTitle>
          <SheetDescription>{instance.client}</SheetDescription>
        </SheetHeader>
        <div className='flex-1 overflow-y-auto px-6 pb-6'>
          <div className='space-y-6 py-6'>
            <div className='grid gap-4'>
              <div className='rounded-lg border border-border bg-secondary p-4'>
                <h3 className='text-sm font-semibold'>Informasi Dasar</h3>
                <div className='mt-3 grid gap-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Nama VPS</span>
                    <span className='font-medium'>{instance.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Client</span>
                    <span className='font-medium'>{instance.client}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Public IP</span>
                    <span className='font-medium'>{instance.ip}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Status</span>
                    <Badge variant={instance.badgeVariant as any}>
                      {instance.status}
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Expire Date</span>
                    <span className='font-medium'>{instance.expire}</span>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-border bg-secondary p-4'>
                <h3 className='text-sm font-semibold'>Spesifikasi</h3>
                <div className='mt-3 grid gap-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>vCPU</span>
                    <span className='font-medium'>{instance.vcpu}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>RAM Total</span>
                    <span className='font-medium'>{instance.ramTotal} GB</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Storage Total</span>
                    <span className='font-medium'>
                      {instance.storageTotal} GB
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>OS</span>
                    <span className='font-medium'>{instance.os}</span>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-border bg-secondary p-4'>
                <h3 className='text-sm font-semibold'>Resource Usage</h3>
                <div className='mt-4 space-y-4 text-sm'>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>CPU</span>
                      <span className='font-medium'>{instance.usage.cpu}%</span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div
                        className='h-2 rounded-full bg-green-500'
                        style={{ width: `${instance.usage.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>RAM</span>
                      <span className='font-medium'>
                        {instance.ramUsed} GB / {instance.ramTotal} GB
                      </span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div
                        className='h-2 rounded-full bg-green-500'
                        style={{ width: `${instance.usage.ram}%` }}
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Disk</span>
                      <span className='font-medium'>
                        {instance.diskUsed} GB / {instance.diskTotal} GB
                      </span>
                    </div>
                    <div className='h-2 rounded-full bg-muted'>
                      <div
                        className='h-2 rounded-full bg-amber-500'
                        style={{ width: `${instance.usage.disk}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border border-border bg-secondary p-4'>
                <h3 className='text-sm font-semibold'>Activity</h3>
                <div className='mt-3 grid gap-3 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Last Reboot</span>
                    <span className='font-medium'>{instance.lastReboot}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Uptime</span>
                    <span className='font-medium'>{instance.uptime}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-semibold'>Quick Actions</h3>
              <div className='space-y-2'>
                {instance.status === 'Running' && (
                  <>
                    <Button className='w-full' variant='outline' size='sm'>
                      <RotateCcw className='mr-2 h-4 w-4' />
                      Reboot
                    </Button>
                    <Button className='w-full' variant='outline' size='sm'>
                      <Power className='mr-2 h-4 w-4' />
                      Stop
                    </Button>
                  </>
                )}
                {instance.status === 'Stopped' && (
                  <Button className='w-full' variant='outline' size='sm'>
                    <Power className='mr-2 h-4 w-4' />
                    Start
                  </Button>
                )}
                <Button className='w-full' variant='destructive' size='sm'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Overview() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expireFilter, setExpireFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedVPS, setSelectedVPS] = useState<
    (typeof sampleInstances)[number] | null
  >(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const pageSize = 5

  const filtered = useMemo(() => {
    return sampleInstances.filter((it) => {
      const q = query.trim().toLowerCase()
      if (q) {
        const found = `${it.name} ${it.ip}`.toLowerCase().includes(q)
        if (!found) return false
      }
      if (statusFilter !== 'all' && it.status.toLowerCase() !== statusFilter)
        return false
      if (expireFilter === '7') {
        if (!(it.daysLeft >= 0 && it.daysLeft < 7)) return false
      } else if (expireFilter === '30') {
        if (!(it.daysLeft >= 0 && it.daysLeft < 30)) return false
      } else if (expireFilter === 'expired') {
        if (!(it.daysLeft < 0)) return false
      }
      return true
    })
  }, [query, statusFilter, expireFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>VPS Management </h1>
        </div>

        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total VPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>128</div>
                <p className='text-xs text-muted-foreground'>Semua Instance</p>
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
                <div className='text-2xl font-bold'>96</div>
                <p className='text-xs text-muted-foreground'>75% dari total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <div className='size-2 rounded-full bg-gray-500' />
                  <CardTitle className='text-sm font-medium'>Stopped</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>18</div>
                <p className='text-xs text-muted-foreground'>14% dari total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-orange-500' />
                  <CardTitle className='text-sm font-medium'>
                    Expiring Soon
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>14</div>
                <p className='text-xs text-muted-foreground'>
                  Akan expired &lt; 7 hari
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                  <span className='h-2.5 w-2.5 rounded-full bg-red-500' />
                  <CardTitle className='text-sm font-medium'>Expired</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>5</div>
                <p className='text-xs text-muted-foreground'>Sudah expired</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div className='flex w-full items-center gap-3'>
                <Input
                  placeholder='Cari berdasarkan nama atau IP...'
                  className='me-auto'
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
                  <SelectTrigger size='sm'>
                    <SelectValue>
                      {statusFilter === 'all' ? 'Semua Status' : statusFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Status</SelectItem>
                    <SelectItem value='running'>Running</SelectItem>
                    <SelectItem value='starting'>Starting</SelectItem>
                    <SelectItem value='stopped'>Stopped</SelectItem>
                    <SelectItem value='rebooting'>Rebooting</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={expireFilter}
                  onValueChange={(v) => {
                    setExpireFilter(v)
                    setPage(1)
                  }}
                >
                  <SelectTrigger size='sm'>
                    <SelectValue>
                      {expireFilter === 'all'
                        ? 'Semua Expire Date'
                        : expireFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Semua Expire Date</SelectItem>
                    <SelectItem value='7'>&lt; 7 hari</SelectItem>
                    <SelectItem value='30'>&lt; 30 hari</SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  className='btn ms-auto rounded-md border px-3 py-2 text-sm'
                  onClick={() => {
                    setQuery('')
                    setStatusFilter('all')
                    setExpireFilter('all')
                    setPage(1)
                  }}
                >
                  Reset Filter
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 md:hidden'>
                {pageItems.map((it) => (
                  <Card
                    key={it.id}
                    className='cursor-pointer border transition hover:shadow-sm'
                    onClick={() => {
                      setSelectedVPS(it)
                      setIsDetailOpen(true)
                    }}
                  >
                    <CardContent className='space-y-4'>
                      <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-primary'>
                            {it.name}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {it.client}
                          </p>
                          <p className='mt-2 text-sm'>{it.ip}</p>
                        </div>
                        <Badge variant={it.badgeVariant as any}>
                          {it.status}
                        </Badge>
                      </div>
                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div className='space-y-1 text-sm'>
                          <p className='text-muted-foreground'>Expire</p>
                          <p className='font-medium'>{it.expire}</p>
                        </div>
                        <div className='space-y-1 text-sm'>
                          <p className='text-muted-foreground'>Uptime</p>
                          <p className='font-medium'>{it.uptime}</p>
                        </div>
                      </div>
                      <div className='space-y-3'>
                        <UsageBar
                          label='CPU'
                          value={it.usage.cpu}
                          color='bg-green-500'
                        />
                        <UsageBar
                          label='RAM'
                          value={it.usage.ram}
                          color='bg-green-500'
                        />
                        <UsageBar
                          label='Disk'
                          value={it.usage.disk}
                          color='bg-amber-500'
                        />
                      </div>
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <span>{it.expireInfo}</span>
                        <span className='font-medium'>Tap untuk detail</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className='hidden md:block'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-10'>
                        <Checkbox />
                      </TableHead>
                      <TableHead>Instance Name</TableHead>
                      <TableHead>IP Public</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expire Date</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead className='text-end'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((it) => (
                      <TableRow key={it.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='font-medium'>{it.name}</span>
                            <span className='text-xs text-muted-foreground'>
                              {it.client}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{it.ip}</TableCell>
                        <TableCell>
                          <Badge variant={it.badgeVariant as any}>
                            {it.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className='font-medium'>{it.expire}</div>
                          <div className='text-xs text-muted-foreground'>
                            {it.expireInfo}
                          </div>
                        </TableCell>
                        <TableCell className='w-80'>
                          <div className='grid grid-cols-3 items-center gap-3'>
                            <UsageBar
                              label='CPU'
                              value={it.usage.cpu}
                              color='bg-green-500'
                            />
                            <UsageBar
                              label='RAM'
                              value={it.usage.ram}
                              color='bg-green-500'
                            />
                            <UsageBar
                              label='Disk'
                              value={it.usage.disk}
                              color='bg-amber-500'
                            />
                          </div>
                        </TableCell>
                        <TableCell className='text-end'>
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
                                onClick={() => {
                                  setSelectedVPS(it)
                                  setIsDetailOpen(true)
                                }}
                              >
                                <Eye className='mr-2 h-4 w-4' />
                                View Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RotateCcw className='mr-2 h-4 w-4' />
                                Reboot
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Power className='mr-2 h-4 w-4' />
                                Stop
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-destructive'>
                                <Trash2 className='mr-2 h-4 w-4' />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Menampilkan{' '}
                    {filtered.length
                      ? `${(page - 1) * pageSize + 1} - ${Math.min(
                          page * pageSize,
                          filtered.length
                        )} dari ${filtered.length} VPS`
                      : '0 VPS'}
                  </TableCaption>
                </Table>
              </div>
              <div className='mt-4 flex items-center justify-end gap-2'>
                <nav className='inline-flex items-center gap-1'>
                  <button
                    className='rounded-md border px-3 py-1'
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages })
                    .slice(0, 5)
                    .map((_, i) => {
                      const p = i + 1
                      return (
                        <button
                          key={p}
                          className={`rounded-md border px-3 py-1 ${
                            p === page ? 'bg-primary text-white' : ''
                          }`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    })}
                  <button
                    className='rounded-md border px-3 py-1'
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    ›
                  </button>
                </nav>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>

      <VPSDetailDrawer
        instance={selectedVPS}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedVPS(null)
        }}
      />
    </>
  )
}

export const Route = createFileRoute('/_authenticated/vps/')({
  component: Overview,
})
