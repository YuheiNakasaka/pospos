import { Colors, AnchorButton, NumericInput, Button } from '@blueprintjs/core'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { MainTableStatus } from '../../models/MainTable'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import { useMainTableMutators } from '../../states/mainTableState'

const Footer = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const { reloadMainTable, updateMainTableStatus } = useMainTableMutators()
  const [limit, setLimit] = useState<number>(1000)
  const [offset, setOffset] = useState<number>(0)

  const onClickReloadButton = async (limit: number, offset: number) => {
    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          updateMainTableStatus(MainTableStatus.LOADING)
          await reloadMainTable(connectionSet.session, limit, offset)
          updateMainTableStatus(MainTableStatus.LOADED)
        }
      }
    }
  }

  const onValueChangeLimit = (
    valueAsNumber: number,
    _: string,
    __: HTMLInputElement
  ) => {
    setLimit(valueAsNumber)
  }

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: '230px',
        right: 0,
        width: 'calc(100% - 230px)',
        height: '40px',
        padding: '5px',
        backgroundColor: Colors.LIGHT_GRAY4
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row'
        }}
      >
        <AnchorButton
          icon="reset"
          minimal={true}
          fill={true}
          alignText="left"
          onClick={() => onClickReloadButton(limit, offset)}
          small={true}
          style={{ width: '25px', height: '30px' }}
        />
        <div
          style={{
            display: 'flex'
          }}
        >
          <Button
            icon="caret-left"
            style={{ marginRight: '2px' }}
            disabled={offset - limit < 0}
            onClick={() => {
              const diff = offset - limit
              if (diff >= 0) {
                setOffset(diff)
                onClickReloadButton(limit, diff)
              }
            }}
          />
          <NumericInput
            placeholder="limit"
            min={1000}
            max={10001}
            defaultValue={1000}
            stepSize={1000}
            majorStepSize={1000}
            onValueChange={onValueChangeLimit}
            style={{ width: '80px', height: '30px' }}
          />
          <Button
            icon="caret-right"
            style={{ marginLeft: '2px' }}
            onClick={() => {
              const diff = offset + limit
              setOffset(diff)
              onClickReloadButton(limit, diff)
            }}
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
