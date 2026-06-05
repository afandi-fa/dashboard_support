import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import DatabasesPage from '@/components/databases/DatabasesPage'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function DatabasesOverview() {
  return (
    <>
      <Header fixed>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <DatabasesPage />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/databases/')({
  component: DatabasesOverview,
})
