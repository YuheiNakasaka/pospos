import { Colors } from '@blueprintjs/core'
import { HeaderNavigationType } from '../../models/HeaderNavigation'
import { useHeaderNavigationState } from '../../states/headerNavigationState'
import Footer from './Footer'
import MainTable from './MainTable'
import QueryEditor from './QueryEdtitor'

const Content = () => {
  const headerNavationState = useHeaderNavigationState()
  return (
    <>
      <main
        style={{
          marginTop: '60px',
          width: 'calc(100% - 230px)',
          height: 'calc(100vh - 60px - 40px)',
          overflow: 'scroll',
          flexGrow: 1,
          backgroundColor: Colors.LIGHT_GRAY5
        }}
      >
        {headerNavationState &&
        headerNavationState.currentIndex == HeaderNavigationType.content ? (
          <>
            <MainTable />
            <Footer />
          </>
        ) : (
          <QueryEditor />
        )}
      </main>
    </>
  )
}

export default Content
