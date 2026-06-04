export type ServiceStatus = 'running' | 'warning' | 'stopped' | 'unknown'

export interface Service {
  id: string
  name: string
  category: string
  status: ServiceStatus
  expireDate?: string
  uptime?: number
  icon?: string
}

export interface ServiceLog {
  id: string
  time: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  source?: string
}

const SERVICES: Service[] = [
  {
    id: '1',
    name: 'n8n',
    category: 'Automation',
    status: 'running',
    expireDate: '2025-06-20',
    uptime: 99.9,
  },
  {
    id: '2',
    name: 'Gowa',
    category: 'Messaging',
    status: 'running',
    expireDate: '2025-07-18',
    uptime: 99.8,
  },
  {
    id: '3',
    name: 'Waha',
    category: 'Messaging',
    status: 'warning',
    expireDate: '2025-06-05',
    uptime: 97.1,
  },
  {
    id: '4',
    name: '9router',
    category: 'Routing',
    status: 'running',
    expireDate: '2025-07-25',
    uptime: 99.9,
  },
  {
    id: '5',
    name: 'PostgreSQL',
    category: 'Database',
    status: 'running',
    expireDate: '2025-08-30',
    uptime: 100,
  },
  {
    id: '6',
    name: 'Redis',
    category: 'Database',
    status: 'stopped',
    expireDate: '2025-06-01',
    uptime: 0,
  },
  {
    id: '7',
    name: 'OpenAI API',
    category: 'AI / Integration',
    status: 'running',
    expireDate: '2025-09-22',
    uptime: 99.7,
  },
  {
    id: '8',
    name: 'Prometheus',
    category: 'Monitoring',
    status: 'running',
    expireDate: '2025-10-10',
    uptime: 99.9,
  },
]

const LOGS: ServiceLog[] = [
  {
    id: 'l1',
    time: '22 Mei 2025 14:32:21',
    level: 'INFO',
    message: 'Workflow execution completed successfully - ID: 12345',
    source: 'n8n',
  },
  {
    id: 'l2',
    time: '22 Mei 2025 14:31:58',
    level: 'INFO',
    message: 'Webhook received from external source - /webhook/abc123',
    source: 'Gowa',
  },
  {
    id: 'l3',
    time: '22 Mei 2025 14:31:45',
    level: 'WARN',
    message: 'Execution took longer than expected (5.2s)',
    source: 'Waha',
  },
  {
    id: 'l4',
    time: '22 Mei 2025 14:30:12',
    level: 'ERROR',
    message: 'Failed to connect to external API - Timeout',
    source: 'OpenAI API',
  },
  {
    id: 'l5',
    time: '22 Mei 2025 14:29:33',
    level: 'INFO',
    message: 'Workflow started - Trigger: Schedule',
    source: 'n8n',
  },
]

export async function fetchServices(): Promise<Service[]> {
  await new Promise((r) => setTimeout(r, 120))
  return SERVICES
}

export async function fetchServiceLogs(): Promise<ServiceLog[]> {
  await new Promise((r) => setTimeout(r, 80))
  return LOGS
}

export async function restartService(id: string) {
  await new Promise((r) => setTimeout(r, 250))
  return { ok: true }
}
