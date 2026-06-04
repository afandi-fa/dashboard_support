import React, { useEffect, useMemo, useState } from 'react'
import { fetchServices, restartService, Service } from '@/lib/services'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ServiceCategories from './ServiceCategories'
import ServiceControls from './ServiceControls'
import ServiceLogs from './ServiceLogs'
import ServiceSummaryCards from './ServiceSummaryCards'
import ServiceTable from './ServiceTable'

export default function ServicesPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [services, setServices] = useState<Service[]>([])

  const pageSize = 8

  useEffect(() => {
    fetchServices().then(setServices)
  }, [])

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    services.forEach(
      (s) => (counts[s.category] = (counts[s.category] || 0) + 1)
    )
    return Object.keys(counts)
  }, [services])

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const q = query.trim().toLowerCase()
      if (q && !s.name.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (categoryFilter !== 'All' && s.category !== categoryFilter)
        return false
      return true
    })
  }, [services, query, statusFilter, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [page, totalPages])

  async function handleRestart(id: string) {
    await restartService(id)
    fetchServices().then(setServices)
  }
  function handleReset() {
    setQuery('')
    setStatusFilter('all')
    setCategoryFilter('All')
    setPage(1)
  }

  return (
    <div>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Services Management
        </h1>
      </div>

      <div className='space-y-4'>
        <ServiceSummaryCards services={services} />

        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='flex-1'>
            {/* Mobile: categories select */}
            <div className='mb-3 md:hidden'>
              <Select
                value={categoryFilter}
                onValueChange={(v) => {
                  setCategoryFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger size='sm'>
                  <SelectValue>
                    {categoryFilter === 'All'
                      ? 'Semua Kategori'
                      : categoryFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>Semua Kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='mb-4'>
              <ServiceControls
                query={query}
                onQuery={(q) => {
                  setQuery(q)
                  setPage(1)
                }}
                status={statusFilter}
                onStatus={(s) => {
                  setStatusFilter(s)
                  setPage(1)
                }}
                category={categoryFilter}
                onCategory={(c) => {
                  setCategoryFilter(c)
                  setPage(1)
                }}
                categories={categories}
                onReset={handleReset}
              />
            </div>

            {/* Mobile: card list */}
            <div className='space-y-4 md:hidden'>
              {pageItems.map((it) => (
                <Card
                  key={it.id}
                  className='cursor-pointer border transition hover:shadow-sm'
                >
                  <CardContent className='space-y-3'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-primary'>
                          {it.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {it.category}
                        </p>
                        <p className='mt-2 text-sm'>{it.expireDate}</p>
                      </div>
                      <Badge
                        variant={
                          it.status === 'running'
                            ? 'default'
                            : it.status === 'stopped'
                              ? 'outline'
                              : ('secondary' as any)
                        }
                      >
                        {it.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <ServiceTable services={pageItems} onRestart={handleRestart} />

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
                        className={`rounded-md border px-3 py-1 ${p === page ? 'bg-primary text-white' : ''}`}
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

            <div className='mt-6'>
              <ServiceLogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
