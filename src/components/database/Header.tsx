import { Colors, HTMLSelect, Tabs, Tab } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HeaderNavigationType } from '../../models/HeaderNavigation'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  useHeaderNavigationMutators,
  useHeaderNavigationState
} from '../../states/headerNavigationState'
import {
  useMainTableMutators,
  useMainTableState
} from '../../states/mainTableState'
import { fetchAllSchemas } from '../../utils/database'

const Header = () => {
  const router = useRouter()
  const mainTableState = useMainTableState()
  const headerNavationState = useHeaderNavigationState()
  const { updateHeaderNavigation } = useHeaderNavigationMutators()
  const { updateMainTableSchema } = useMainTableMutators()
  const connectionRegistryState = useConnectionRegistryState()
  const [schemas, setSchemas] = useState<string[]>([])

  const onChangeSchema = async (e) => {
    updateMainTableSchema(e.target.value)
  }

  const onChangeTab = async (tabId) => {
    updateHeaderNavigation({ currentIndex: tabId })
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
        display: 'flex',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 10px'
        }}
      >
        <HTMLSelect onChange={onChangeSchema} fill={true}>
          {schemas.map((schema) => (
            <option
              value={schema}
              selected={mainTableState.tableSchema == schema}
            >
              {schema}
            </option>
          ))}
        </HTMLSelect>
        <div
          style={{
            width: '60px'
          }}
        ></div>
        <Tabs
          animate={false}
          large={true}
          onChange={onChangeTab}
          selectedTabId={headerNavationState.currentIndex}
        >
          <Tab id={HeaderNavigationType.content} title="Content" />
          <Tab id={HeaderNavigationType.query} title="Query" />
        </Tabs>
      </div>
    </header>
  )
}

export default Header
