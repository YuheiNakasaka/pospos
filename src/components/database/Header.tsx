import { Colors, HTMLSelect } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  useMainTableMutators,
  useMainTableState
} from '../../states/mainTableState'
import { fetchAllSchemas } from '../../utils/database'

const Header = () => {
  const router = useRouter()
  const { updateMainTableSchema } = useMainTableMutators()
  const connectionRegistryState = useConnectionRegistryState()
  const [schemas, setSchemas] = useState<string[]>([])

  const onChangeSchema = async (e) => {
    updateMainTableSchema(e.target.value)
  }

  useEffect(() => {
    const query = async () => {
      if (router.query.key) {
        const key = router.query.key as string
        if (connectionRegistryState) {
          const connectionSet = connectionRegistryState[key]
          if (connectionSet && connectionSet.session) {
            const rows = await fetchAllSchemas(connectionSet.session)
            setSchemas(rows.map((row) => row['schema_name']))
          }
        }
      }
    }
    query()
  }, [connectionRegistryState])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    >
      <HTMLSelect onChange={onChangeSchema}>
        {schemas.map((schema) => (
          <option value={schema}>{schema}</option>
        ))}
      </HTMLSelect>
    </header>
  )
}

export default Header
