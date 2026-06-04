import React, { useEffect, useMemo, useState } from 'react'
import { fetchServices, restartService, Service } from '@/lib/services'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
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
            <Card>
              <CardHeader>
                <div className='flex w-full flex-col gap-3 xl:flex-row xl:items-center'>
                  <Input
                    placeholder='Search services...'
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
                      <SelectValue>
                        {statusFilter === 'all' ? 'Semua Status' : statusFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Semua Status</SelectItem>
                      <SelectItem value='running'>Running</SelectItem>
                      <SelectItem value='warning'>Warning</SelectItem>
                      <SelectItem value='stopped'>Stopped</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={categoryFilter}
                    onValueChange={(v) => {
                      setCategoryFilter(v)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger size='sm' className='w-full xl:w-[200px]'>
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

                  <Button
                    variant='outline'
                    className='w-full xl:w-auto'
                    onClick={handleReset}
                  >
                    Reset Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className='hidden md:block'>
                  <div className='overflow-x-auto rounded-md border border-border'>
                    <div className='min-w-[700px]'>
                      <ServiceTable
                        services={pageItems}
                        onRestart={handleRestart}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Cards */}
                <div className='space-y-4 md:hidden'>
                  {pageItems.map((service) => (
                    <Card
                      key={service.id}
                      className='cursor-pointer border transition hover:shadow-sm'
                    >
                      <CardContent className='space-y-4 pt-4'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='min-w-0'>
                            <p className='text-sm font-semibold text-primary'>
                              {service.name}
                            </p>

                            <p className='text-xs text-muted-foreground'>
                              {service.category}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              service.status === 'running'
                                ? 'bg-green-100 text-green-700'
                                : service.status === 'warning'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {service.status}
                          </span>
                        </div>

                        <div className='grid gap-2 text-sm'>
                          <div className='flex justify-between'>
                            <span className='text-muted-foreground'>
                              Category
                            </span>
                            <span>{service.category}</span>
                          </div>
                        </div>

                        <div className='flex gap-2'>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleRestart(service.id)}
                          >
                            Restart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      ›
                    </button>
                  </nav>
                </div>

                <div className='mt-6'>
                  <ServiceLogs />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
