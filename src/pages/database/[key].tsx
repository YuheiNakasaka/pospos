import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useConnectionRegistryMutators } from '../../states/connectionRegistryState'
import Sidebar from '../../components/database/SideBar'
import Content from '../../components/database/Content'
import Header from '../../components/database/Header'
import Footer from '../../components/database/Footer'

const DatabasePage: NextPage = () => {
  const router = useRouter()
  const { setupConnectionRegistry } = useConnectionRegistryMutators()

  useEffect(() => {
    if (router.query.key) {
      const key = router.query.key as string
      setupConnectionRegistry(key)
    }
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1
        }}
      >
        <Sidebar />
        <Content />
      </div>
      <Footer />
    </div>
  )
}

export default DatabasePage