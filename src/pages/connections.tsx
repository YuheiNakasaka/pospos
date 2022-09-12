import { NextPage } from 'next'
import Sidebar from '../components/connections/SideBar'
import Content from '../components/connections/Content'

const Connections: NextPage = () => {
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

export default Connections
