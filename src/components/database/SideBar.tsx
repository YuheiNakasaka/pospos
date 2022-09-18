import { Colors, AnchorButton, Button } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Database from 'tauri-plugin-sql-api'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  fetchAllTables,
  fetchColumnsFromTable,
  fetchRecordsFromTable
} from '../../utils/database'

const Sidebar = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const [tables, setTables] = useState<string[]>([])
  const [session, setSession] = useState<Database | null>(null)

  useEffect(() => {
    const query = async () => {
      if (router.query.key) {
        const key = router.query.key as string
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          setSession(connectionSet.session)
          const results = await fetchAllTables(connectionSet.session)
          setTables(results.map((row) => row.table_name))
        }
      }
    }
    query()
  }, [connectionRegistryState])

  return (
    <aside
      style={{
        marginTop: '60px',
        width: '230px',
        height: 'calc(100% - 60px - 20px)',
        overflowX: 'scroll',
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
      >
        {tables.map((table) => (
          <li>
            <AnchorButton
              text={table}
              icon="database"
              minimal={true}
              fill={false}
              alignText="left"
              onClick={async () => {
                if (session) {
                  // TODO: querying test
                  const column_names = await fetchColumnsFromTable(
                    session,
                    table
                  )
                  const records = await fetchRecordsFromTable(
                    session,
                    table,
                    10
                  )
                  console.log(
                    JSON.stringify(
                      column_names.map((row) => row['column_name'])
                    )
                  )
                  console.log(JSON.stringify(records))
                }
              }}
            />
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
