import { MoreVertical, ExternalLink } from 'lucide-react'
import { ApiKey } from '@/lib/api-keys'
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
  limit,
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

export default function ApiKeyTable({ apiKeys }: { apiKeys: ApiKey[] }) {
  return (
    <div className='overflow-x-auto rounded-md border border-border'>
      <div className='min-w-[1000px]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
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
            {apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='text-lg'>{key.providerIcon}</span>
                    <span className='font-medium'>{key.provider}</span>
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
                    <span className='text-sm text-muted-foreground'>-</span>
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
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <ExternalLink className='h-4 w-4' />
                      <span className='sr-only'>Open</span>
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
                        <DropdownMenuItem>Edit Key</DropdownMenuItem>
                        <DropdownMenuItem className='text-red-600'>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>Menampilkan {apiKeys.length} API keys</TableCaption>
        </Table>
      </div>
    </div>
  )
}
