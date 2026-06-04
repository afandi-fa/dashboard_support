import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import ServicesPage from '@/components/services/ServicesPage'
import { ThemeSwitch } from '@/components/theme-switch'

export function ServicesOverview() {
  return (
    <>
      <Header fixed>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <ServicesPage />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/services/')({
  component: ServicesOverview,
})
