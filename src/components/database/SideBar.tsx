import { Colors, AnchorButton, Button } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'

const Sidebar = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()

  useEffect(() => {
    const query = async () => {
      if (router.query.key) {
        const key = router.query.key as string
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          const client = await connectionSet.session.select(
            'SELECT * FROM clients LIMIT 1'
          )
          console.log(JSON.stringify(client))
        }
      }
    }
    query()
  }, [connectionRegistryState])

  return (
    <aside
      style={{
        width: '230px',
        backgroundColor: Colors.LIGHT_GRAY2
      }}
    >
      <h1
        style={{
          margin: '0.5rem',
          padding: 0,
          fontSize: '1rem',
          color: Colors.GRAY1
        }}
      >
        Connections
      </h1>
      <ul
        style={{
          listStyle: 'none',
          paddingLeft: 0
        }}
      ></ul>
    </aside>
  )
}

export default Sidebar
