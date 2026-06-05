export type DatabaseStatus = 'online' | 'maintenance' | 'offline'

export interface Database {
  id: string
  name: string
  type: string
  version: string
  status: DatabaseStatus
  connections: number
  maxConnections: number
  expireDate: string
  createdAt: string
  createdTime: string
}

const DATABASES: Database[] = [
  {
    id: '1',
    name: 'shadcn_main',
    type: 'PostgreSQL',
    version: '15',
    status: 'online',
    connections: 18,
    maxConnections: 100,
    expireDate: '2026-08-30',
    createdAt: '01 Mei 2025',
    createdTime: '10:30',
  },
  {
    id: '2',
    name: 'crm_production',
    type: 'MySQL',
    version: '8.0',
    status: 'online',
    connections: 32,
    maxConnections: 200,
    expireDate: '2026-08-18',
    createdAt: '15 Mei 2025',
    createdTime: '14:20',
  },
  {
    id: '3',
    name: 'chat_messages',
    type: 'MongoDB',
    version: '7.0',
    status: 'online',
    connections: 45,
    maxConnections: 300,
    expireDate: '2026-09-05',
    createdAt: '20 Mei 2025',
    createdTime: '09:15',
  },
  {
    id: '4',
    name: 'redis_cache',
    type: 'Redis',
    version: '7',
    status: 'maintenance',
    connections: 5,
    maxConnections: 50,
    expireDate: '2026-08-12',
    createdAt: '28 Apr 2025',
    createdTime: '11:05',
  },
  {
    id: '5',
    name: 'analytics_db',
    type: 'MongoDB',
    version: '7.0',
    status: 'offline',
    connections: 0,
    maxConnections: 100,
    expireDate: '2026-08-01',
    createdAt: '10 Apr 2025',
    createdTime: '16:40',
  },
  {
    id: '6',
    name: 'reporting_db',
    type: 'PostgreSQL',
    version: '15',
    status: 'online',
    connections: 12,
    maxConnections: 100,
    expireDate: '2026-09-25',
    createdAt: '05 Jun 2025',
    createdTime: '08:30',
  },
  {
    id: '7',
    name: 'wa_logs',
    type: 'MySQL',
    version: '8.0',
    status: 'online',
    connections: 8,
    maxConnections: 100,
    expireDate: '2026-09-28',
    createdAt: '12 Jun 2025',
    createdTime: '13:10',
  },
  {
    id: '8',
    name: 'test_staging',
    type: 'PostgreSQL',
    version: '14',
    status: 'online',
    connections: 3,
    maxConnections: 50,
    expireDate: '2026-10-15',
    createdAt: '18 Jun 2025',
    createdTime: '10:00',
  },
  {
    id: '9',
    name: 'user_auth',
    type: 'PostgreSQL',
    version: '16',
    status: 'online',
    connections: 67,
    maxConnections: 150,
    expireDate: '2026-11-20',
    createdAt: '01 Mar 2025',
    createdTime: '08:00',
  },
  {
    id: '10',
    name: 'notification_queue',
    type: 'Redis',
    version: '7.2',
    status: 'online',
    connections: 22,
    maxConnections: 80,
    expireDate: '2026-12-01',
    createdAt: '15 Feb 2025',
    createdTime: '14:30',
  },
  {
    id: '11',
    name: 'search_index',
    type: 'MongoDB',
    version: '7.0',
    status: 'maintenance',
    connections: 0,
    maxConnections: 200,
    expireDate: '2026-07-28',
    createdAt: '20 Jan 2025',
    createdTime: '09:45',
  },
  {
    id: '12',
    name: 'backup_storage',
    type: 'MySQL',
    version: '8.0',
    status: 'offline',
    connections: 0,
    maxConnections: 50,
    expireDate: '2026-07-15',
    createdAt: '05 Dec 2024',
    createdTime: '11:20',
  },
]

export function fetchDatabases(): Promise<Database[]> {
  return Promise.resolve([...DATABASES])
}

export function getDatabaseTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    PostgreSQL: '🐘',
    MySQL: '🐬',
    MongoDB: '🍃',
    Redis: '🔴',
  }
  return icons[type] || '🗄️'
}
