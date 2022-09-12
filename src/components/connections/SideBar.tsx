import { Colors, AnchorButton } from '@blueprintjs/core'
import { useConnectionConfigsState } from '../../states/connectionConfigState'

const Sidebar = () => {
  const connectionConfigsState = useConnectionConfigsState()
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
              onClick={() => console.log(connectionConfig)}
            ></AnchorButton>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
