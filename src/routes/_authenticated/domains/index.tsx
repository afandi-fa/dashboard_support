import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import DomainsPage from '@/components/domains/DomainsPage'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function DomainsOverview() {
  return (
    <>
      <Header fixed>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <DomainsPage />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/domains/')({
  component: DomainsOverview,
})
