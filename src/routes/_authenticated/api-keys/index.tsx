import { createFileRoute } from '@tanstack/react-router'
import ApiKeysPage from '@/components/api-keys/ApiKeysPage'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function ApiKeysOverview() {
  return (
    <>
      <Header fixed>
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main>
        <ApiKeysPage />
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/api-keys/')({
  component: ApiKeysOverview,
})
