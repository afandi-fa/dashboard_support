import {
  AudioWaveform,
  Database,
  Globe,
  KeyRound,
  LayoutDashboard,
  Server,
  Layers,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'VPS',
          url: '/vps',
          icon: Server,
        },
        {
          title: 'Services',
          url: '/services',
          icon: Layers,
        },
        {
          title: 'Databases',
          url: '/databases',
          icon: Database,
        },
        {
          title: 'API Keys',
          url: '/api-keys',
          icon: KeyRound,
        },
        {
          title: 'Domains',
          url: '/domains',
          icon: Globe,
        },
      ],
    },
  ],
}
