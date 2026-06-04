import { MoreVertical, Eye, RefreshCw, Play, Pause } from 'lucide-react'
import { Service } from '@/lib/services'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

export default function ServiceTable({
  services,
  onRestart,
}: {
  services: Service[]
  onRestart: (id: string) => void
}) {
  return (
    <div className='hidden overflow-x-auto rounded-md border border-border md:block'>
      <div className='min-w-[700px]'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>
                <Checkbox />
              </TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expire Date</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead className='text-end'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((it) => (
              <TableRow key={it.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{it.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {it.category}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{it.category}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className='font-medium'>{it.expireDate}</div>
                </TableCell>
                <TableCell>{it.uptime ? `${it.uptime}%` : '-'}</TableCell>
                <TableCell className='text-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <MoreVertical className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Eye className='mr-2 h-4 w-4' />
                        View Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRestart(it.id)}>
                        <RefreshCw className='mr-2 h-4 w-4' />
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Play className='mr-2 h-4 w-4' />
                        Start
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pause className='mr-2 h-4 w-4' />
                        Stop
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption />
        </Table>
      </div>
    </div>
  )
}
