import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function RecentSales() {
  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/01.png' alt='Avatar' />
          <AvatarFallback>TB</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Thomas Brown</p>
            <p className='text-sm text-muted-foreground'>
              thomas.brown@email.com
            </p>
          </div>
          <div className='font-medium'>+$3,200</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/02.png' alt='Avatar' />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Alya Moore</p>
            <p className='text-sm text-muted-foreground'>
              alya.moore@email.com
            </p>
          </div>
          <div className='font-medium'>+$980</div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Avatar className='h-9 w-9'>
          <AvatarImage src='/avatars/03.png' alt='Avatar' />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className='flex flex-1 flex-wrap items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm leading-none font-medium'>Rina Kartika</p>
            <p className='text-sm text-muted-foreground'>
              rina.kartika@email.com
            </p>
          </div>
          <div className='font-medium'>+$1,250</div>
        </div>
      </div>
    </div>
  )
}
