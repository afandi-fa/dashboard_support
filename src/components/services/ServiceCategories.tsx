import React from 'react'
import { Service } from '@/lib/services'

export default function ServiceCategories({
  services,
  category,
  onChange,
}: {
  services: Service[]
  category: string
  onChange: (c: string) => void
}) {
  const counts: Record<string, number> = {}
  services.forEach((s) => (counts[s.category] = (counts[s.category] || 0) + 1))

  return (
    <aside className='w-64'>
      <div className='space-y-2 rounded-lg border border-border bg-secondary p-4'>
        <h3 className='text-sm font-semibold'>Kategori Layanan</h3>
        <ul className='mt-3 space-y-2'>
          <li
            className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-2 transition-colors ${category === 'All' ? 'bg-muted/50 font-medium' : 'hover:bg-accent/5'}`}
            onClick={() => onChange('All')}
          >
            <span>Semua Layanan</span>
            <span className='text-xs text-muted-foreground'>
              {services.length}
            </span>
          </li>
          {Object.entries(counts).map(([k, v]) => (
            <li
              key={k}
              className={`flex cursor-pointer items-center justify-between rounded-md px-2 py-2 transition-colors ${category === k ? 'bg-muted/50 font-medium' : 'hover:bg-accent/5'}`}
              onClick={() => onChange(k)}
            >
              <span>{k}</span>
              <span className='text-xs text-muted-foreground'>{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
