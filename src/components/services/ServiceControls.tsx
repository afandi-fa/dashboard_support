import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ServiceControls({
  query,
  onQuery,
  status,
  onStatus,
  //   category,
  onCategory,
  //   categories,
  onReset,
}: {
  query: string
  onQuery: (q: string) => void
  status: string
  onStatus: (s: string) => void
  category: string
  onCategory: (c: string) => void
  categories: string[]
  onReset: () => void
}) {
  return (
    <div className='flex w-full flex-col gap-3 md:flex-row md:items-center'>
      <Input
        placeholder='Search services...'
        className='min-w-0 flex-1'
        value={query}
        onChange={(e: any) => onQuery(e.target.value)}
      />
      <div className='flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap md:items-center'>
        <Select value={status} onValueChange={(v) => onStatus(v)}>
          <SelectTrigger size='sm'>
            <SelectValue>
              {status === 'all' ? 'Semua Status' : status}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Status</SelectItem>
            <SelectItem value='running'>Running</SelectItem>
            <SelectItem value='warning'>Warning</SelectItem>
            <SelectItem value='stopped'>Stopped</SelectItem>
          </SelectContent>
        </Select>
        <button
          className='btn w-full rounded-md border px-3 py-2 text-sm md:w-auto'
          onClick={onReset}
        >
          Reset Filter
        </button>
        <Button className='w-full md:w-auto'>+ Tambah Service</Button>
      </div>
    </div>
  )
}
