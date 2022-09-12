import { Colors, AnchorButton } from '@blueprintjs/core'

const Sidebar = () => {
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
        <li>
          <AnchorButton
            text={'Databases'}
            icon="database"
            minimal={true}
            fill={true}
            alignText="left"
            onClick={() => console.log('clicked')}
          ></AnchorButton>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
