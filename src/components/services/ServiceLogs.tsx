import { useEffect, useMemo, useState } from 'react'
import { fetchServiceLogs } from '@/lib/services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ServiceLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [sourceFilter, setSourceFilter] = useState('All')
  const [timeRange, setTimeRange] = useState('24h')

  useEffect(() => {
    fetchServiceLogs().then(setLogs)
  }, [])

  const sources = useMemo(() => {
    const s = Array.from(new Set(logs.map((l) => l.source).filter(Boolean)))
    return s
  }, [logs])

  const displayed = useMemo(() => {
    let out = logs.slice().reverse() // newest first
    if (sourceFilter !== 'All')
      out = out.filter((l) => l.source === sourceFilter)
    // simple time-range heuristic: limit number of rows shown
    if (timeRange === '1h') out = out.slice(0, 2)
    else if (timeRange === '24h') out = out.slice(0, 5)
    else if (timeRange === '7d') out = out.slice(0, 20)
    return out
  }, [logs, sourceFilter, timeRange])

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle>Service Logs</CardTitle>

          <div className='flex flex-col gap-3 sm:flex-row lg:items-center'>
            <Select
              value={sourceFilter}
              onValueChange={(v) => setSourceFilter(v)}
            >
              <SelectTrigger size='sm' className='w-full sm:w-[180px]'>
                <SelectValue>
                  {sourceFilter === 'All' ? 'Semua Sumber' : sourceFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>Semua Sumber</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeRange} onValueChange={(v) => setTimeRange(v)}>
              <SelectTrigger size='sm' className='w-full sm:w-[180px]'>
                <SelectValue>
                  {timeRange === '1h'
                    ? '1 Jam'
                    : timeRange === '24h'
                      ? '24 Jam'
                      : '7 Hari'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1h'>1 Jam Terakhir</SelectItem>
                <SelectItem value='24h'>24 Jam Terakhir</SelectItem>
                <SelectItem value='7d'>7 Hari</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant='ghost'
              className='w-full sm:w-auto'
              onClick={() => fetchServiceLogs().then(setLogs)}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto rounded-md border border-border'>
          <div className='min-w-[600px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead>Pesan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayed.map((l: any) => (
                  <TableRow key={l.id}>
                    <TableCell className='whitespace-nowrap'>
                      {l.time}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          l.level === 'ERROR'
                            ? 'destructive'
                            : l.level === 'WARN'
                              ? 'secondary'
                              : ('default' as any)
                        }
                      >
                        {l.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{l.source || '-'}</TableCell>
                    <TableCell className='max-w-[300px] truncate'>
                      {l.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
