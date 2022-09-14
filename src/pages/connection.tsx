import { NextPage } from 'next'
import Sidebar from '../components/connection/SideBar'
import Content from '../components/connection/Content'

const ConnectionPage: NextPage = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <Sidebar />
      <Content />
    </div>
  )
}

export default ConnectionPage
