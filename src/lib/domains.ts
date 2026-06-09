export type DomainStatus =
  | 'active'
  | 'pending-renewal'
  | 'expired'
  | 'suspended'

export interface Domain {
  id: string
  name: string
  isPrimary: boolean
  registrar: string
  dnsProvider: string
  status: DomainStatus
  expireDate: string
  autoRenew: boolean
  createdAt: string
}

const DOMAINS: Domain[] = [
  {
    id: '1',
    name: 'shadcn-admin.com',
    isPrimary: true,
    registrar: 'Namecheap',
    dnsProvider: 'Cloudflare',
    status: 'active',
    expireDate: '2026-05-15',
    autoRenew: true,
    createdAt: '15 Mei 2024',
  },
  {
    id: '2',
    name: 'example-app.io',
    isPrimary: false,
    registrar: 'GoDaddy',
    dnsProvider: 'Cloudflare',
    status: 'active',
    expireDate: '2026-04-10',
    autoRenew: true,
    createdAt: '10 Apr 2024',
  },
  {
    id: '3',
    name: 'myproject.dev',
    isPrimary: false,
    registrar: 'Namecheap',
    dnsProvider: 'Cloudflare',
    status: 'pending-renewal',
    expireDate: '2025-06-05',
    autoRenew: true,
    createdAt: '05 Jun 2024',
  },
  {
    id: '4',
    name: 'old-website.net',
    isPrimary: false,
    registrar: 'NameSilo',
    dnsProvider: 'Cloudflare',
    status: 'expired',
    expireDate: '2025-05-01',
    autoRenew: false,
    createdAt: '01 May 2023',
  },
  {
    id: '5',
    name: 'client-portal.com',
    isPrimary: false,
    registrar: 'Namecheap',
    dnsProvider: 'AWS Route 53',
    status: 'active',
    expireDate: '2026-01-20',
    autoRenew: true,
    createdAt: '20 Jan 2024',
  },
  {
    id: '6',
    name: 'test-sandbox.app',
    isPrimary: false,
    registrar: 'Porkbun',
    dnsProvider: 'Cloudflare',
    status: 'suspended',
    expireDate: '2026-04-25',
    autoRenew: false,
    createdAt: '25 Apr 2024',
  },
  {
    id: '7',
    name: 'api-service.xyz',
    isPrimary: false,
    registrar: 'GoDaddy',
    dnsProvider: 'AWS Route 53',
    status: 'pending-renewal',
    expireDate: '2025-07-12',
    autoRenew: true,
    createdAt: '12 Jul 2023',
  },
  {
    id: '8',
    name: 'docs.company.id',
    isPrimary: false,
    registrar: 'IDwebhost',
    dnsProvider: 'Cloudflare',
    status: 'active',
    expireDate: '2025-12-30',
    autoRenew: true,
    createdAt: '30 Dec 2023',
  },
  {
    id: '9',
    name: 'staging-api.dev',
    isPrimary: false,
    registrar: 'Namecheap',
    dnsProvider: 'Cloudflare',
    status: 'active',
    expireDate: '2026-03-18',
    autoRenew: true,
    createdAt: '18 Mar 2024',
  },
  {
    id: '10',
    name: 'legacy-portal.org',
    isPrimary: false,
    registrar: 'GoDaddy',
    dnsProvider: 'AWS Route 53',
    status: 'expired',
    expireDate: '2025-02-28',
    autoRenew: false,
    createdAt: '28 Feb 2023',
  },
]

export function fetchDomains(): Promise<Domain[]> {
  return Promise.resolve([...DOMAINS])
}

export function getRegistrarIcon(registrar: string): string {
  const icons: Record<string, string> = {
    Namecheap: 'N',
    GoDaddy: 'G',
    NameSilo: 'NS',
    Porkbun: 'P',
    IDwebhost: 'ID',
  }
  return icons[registrar] || 'R'
}

export function getRegistrarColor(registrar: string): string {
  const colors: Record<string, string> = {
    Namecheap: 'bg-red-50 text-red-600',
    GoDaddy: 'bg-green-50 text-green-600',
    NameSilo: 'bg-blue-50 text-blue-600',
    Porkbun: 'bg-pink-50 text-pink-600',
    IDwebhost: 'bg-orange-50 text-orange-600',
  }
  return colors[registrar] || 'bg-gray-50 text-gray-600'
}

export function getDnsProviderIcon(dnsProvider: string): string {
  const icons: Record<string, string> = {
    Cloudflare: 'CF',
    'AWS Route 53': 'AWS',
  }
  return icons[dnsProvider] || 'DNS'
}

export function getDnsProviderColor(dnsProvider: string): string {
  const colors: Record<string, string> = {
    Cloudflare: 'bg-orange-50 text-orange-600',
    'AWS Route 53': 'bg-amber-50 text-amber-600',
  }
  return colors[dnsProvider] || 'bg-gray-50 text-gray-600'
}
