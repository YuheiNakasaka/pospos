import { Colors, AnchorButton } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import { useMainTableMutators } from '../../states/mainTableState'

const Footer = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const { reloadMainTable } = useMainTableMutators()

  const onClickReloadButton = async () => {
    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          reloadMainTable(connectionSet.session)
        }
      }
    }
  }

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: '230px',
        right: 0,
        width: '100%',
        height: '30px',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    >
      <AnchorButton
        icon="reset"
        minimal={true}
        fill={true}
        alignText="left"
        onClick={() => onClickReloadButton()}
        small={true}
        style={{ width: '30px', height: '30px' }}
      />
    </footer>
  )
}

export default Footer
