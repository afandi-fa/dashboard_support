import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ApiKey } from '@/lib/api-keys'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#94a3b8']

export default function ApiKeyUsagePanel({ apiKeys }: { apiKeys: ApiKey[] }) {
  const providerUsage = useMemo(() => {
    const map: Record<string, number> = {}
    apiKeys.forEach((k) => {
      map[k.provider] = (map[k.provider] || 0) + k.usage
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
  }, [apiKeys])

  const totalUsage = providerUsage.reduce((s, [, v]) => s + v, 0)

  const chartData = providerUsage.map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }))

  const topKeys = useMemo(() => {
    return [...apiKeys].sort((a, b) => b.usage - a.usage).slice(0, 3)
  }, [apiKeys])

  const activeCount = apiKeys.filter((k) => k.status === 'active').length
  const blockedCount = apiKeys.filter((k) => k.status === 'blocked').length
  const total = apiKeys.length

  return (
    <div className='space-y-4'>
      {/* Usage Donut */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base font-semibold'>
            Usage (Bulan Ini)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-4'>
            <div className='h-[140px] w-[140px] shrink-0'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey='value'
                    stroke='none'
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='min-w-0 flex-1 space-y-2'>
              {providerUsage.map(([name, value], i) => {
                const percent =
                  totalUsage > 0 ? ((value / totalUsage) * 100).toFixed(0) : '0'
                return (
                  <div key={name} className='flex items-center gap-2'>
                    <span
                      className='h-2.5 w-2.5 shrink-0 rounded-full'
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className='min-w-0 flex-1 truncate text-sm'>
                      {name}
                    </span>
                    <span className='shrink-0 text-sm font-medium'>
                      ${value.toFixed(2)} ({percent}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Usage Keys */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base font-semibold'>
            Top Usage Keys
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {topKeys.map((key, i) => (
            <div key={key.id}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium'>
                    {i + 1}
                  </span>
                  <span className='text-sm font-medium'>{key.name}</span>
                </div>
                <span className='text-sm font-medium'>
                  ${key.usage.toFixed(2)}
                </span>
              </div>
              <div className='mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-green-500 transition-all'
                  style={{ width: `${Math.min(key.usagePercent, 100)}%` }}
                />
              </div>
              <div className='mt-0.5 text-right text-xs text-muted-foreground'>
                {key.usagePercent.toFixed(1)}%
              </div>
            </div>
          ))}
          <button className='flex items-center gap-1 pt-1 text-xs font-medium text-blue-600 hover:text-blue-700'>
            Lihat semua
            <ChevronRight className='h-3 w-3' />
          </button>
        </CardContent>
      </Card>

      {/* Status Keys */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base font-semibold'>Status Keys</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 rounded-full bg-green-500' />
            <span className='text-sm'>Active</span>
            <span className='ml-auto text-sm font-medium'>
              {activeCount} (
              {total > 0 ? ((activeCount / total) * 100).toFixed(1) : '0'}%)
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='h-2.5 w-2.5 rounded-full bg-red-500' />
            <span className='text-sm'>Blocked</span>
            <span className='ml-auto text-sm font-medium'>
              {blockedCount} (
              {total > 0 ? ((blockedCount / total) * 100).toFixed(1) : '0'}%)
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
