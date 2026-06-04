import React, { useEffect, useMemo, useState } from 'react'
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
        <div className='flex w-full items-center justify-between'>
          <CardTitle>Service Logs</CardTitle>
          <div className='flex items-center gap-2'>
            <Select
              value={sourceFilter}
              onValueChange={(v) => setSourceFilter(v)}
            >
              <SelectTrigger size='sm'>
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
              <SelectTrigger size='sm'>
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
              onClick={() => fetchServiceLogs().then(setLogs)}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <table className='w-full text-sm'>
            <thead className='text-left text-xs text-muted-foreground'>
              <tr>
                <th>Waktu</th>
                <th>Level</th>
                <th>Sumber</th>
                <th>Pesan</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((l: any) => (
                <tr key={l.id} className='border-t'>
                  <td className='py-2'>{l.time}</td>
                  <td className='py-2'>
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
                  </td>
                  <td className='py-2'>{l.source || '-'}</td>
                  <td className='py-2'>{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
