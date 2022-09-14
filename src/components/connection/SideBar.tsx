import { Colors, AnchorButton, Button } from '@blueprintjs/core'
import { ConnectionConfig } from '../../models/ConnectionConfig'
import { useConnectionConfigsState } from '../../states/connectionConfigState'
import { useConnectionDetailMutators } from '../../states/connectionDetailState'

const Sidebar = () => {
  const connectionConfigsState = useConnectionConfigsState()
  const { addConnectionDetail, resetConnectionDetail } =
    useConnectionDetailMutators()
  const onClickConnectionConfig = (connectionConfig: ConnectionConfig) => {
    addConnectionDetail(connectionConfig)
  }
  const onClickAdd = () => {
    resetConnectionDetail()
  }
  return (
    <div
      style={{
        width: '230px',
        backgroundColor: Colors.LIGHT_GRAY4
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
        {connectionConfigsState.map((connectionConfig) => (
          <li>
            <AnchorButton
              text={connectionConfig.name}
              icon="database"
              minimal={true}
              fill={true}
              alignText="left"
              onClick={() => onClickConnectionConfig(connectionConfig)}
            />
          </li>
        ))}
      </ul>
      <div
        style={{
          position: 'fixed',
          left: '1rem',
          bottom: '1rem'
        }}
      >
        <Button icon="add" text="Add connection" onClick={onClickAdd} />
      </div>
    </div>
  )
}

export default Sidebar
