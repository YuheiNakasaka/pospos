import { Colors } from '@blueprintjs/core'
import {
  Column,
  ColumnHeaderCell2,
  EditableCell2,
  Table2,
  TableLoadingOption
} from '@blueprintjs/table'
import { useRouter } from 'next/router'
import { MainTableStatus } from '../../models/MainTable'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  useMainTableMutators,
  useMainTableState
} from '../../states/mainTableState'
import { updateRecord } from '../../utils/database'
import { sqlValueToJsValidValue } from '../../utils/valueConverter'
import Footer from './Footer'

const Content = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const mainTableState = useMainTableState()
  const { updateMainTableStatus, reloadMainTable } = useMainTableMutators()

  const onConfirmUpdateColumn = async (columnName, newValue, rowIndex) => {
    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (
          connectionSet &&
          connectionSet.session &&
          mainTableState.records[rowIndex][columnName] !== newValue
        ) {
          updateMainTableStatus(MainTableStatus.LOADING)
          await updateRecord(
            connectionSet.session,
            mainTableState.tableName,
            mainTableState.tableSchema,
            columnName,
            newValue,
            typeof mainTableState.records[rowIndex][columnName],
            mainTableState.records[rowIndex]
          )
          await reloadMainTable(
            connectionSet.session,
            mainTableState.limit,
            mainTableState.offset
          )
          updateMainTableStatus(MainTableStatus.LOADED)
        }
      }
    }
  }

  return (
    <>
      <main
        style={{
          marginTop: '60px',
          width: 'calc(100% - 230px)',
          height: 'calc(100vh - 60px - 40px)',
          overflow: 'scroll',
          flexGrow: 1,
          backgroundColor: Colors.LIGHT_GRAY5
        }}
      >
        <Table2
          numRows={mainTableState.records.length}
          enableRowHeader={false}
          enableMultipleSelection={false}
          loadingOptions={
            mainTableState && mainTableState.status === MainTableStatus.LOADING
              ? [TableLoadingOption.CELLS]
              : []
          }
        >
          {mainTableState.columns.map((columnName, index) => (
            <Column
              key={index}
              columnHeaderCellRenderer={(_: number) => (
                <ColumnHeaderCell2 name={columnName} />
              )}
              cellRenderer={(rowIndex: number, _: number) => {
                return (
                  <EditableCell2
                    value={sqlValueToJsValidValue(
                      mainTableState.records[rowIndex][columnName]
                    )}
                    onConfirm={(newValue) =>
                      onConfirmUpdateColumn(columnName, newValue, rowIndex)
                    }
                  />
                )
              }}
            />
          ))}
        </Table2>
        <Footer />
      </main>
    </>
  )
}

export default Content
