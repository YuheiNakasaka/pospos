import { Button, Colors } from '@blueprintjs/core'
import {
  Cell,
  Column,
  ColumnHeaderCell2,
  Table2,
  TableLoadingOption
} from '@blueprintjs/table'
import { useRouter } from 'next/router'
import { createRef, useState } from 'react'
import { QueryTableStatus } from '../../models/QueryTable'
import { useConnectionRegistryState } from '../../states/connectionRegistryState'
import {
  useQueryTableMutators,
  useQueryTableState
} from '../../states/queryTableState'
import { sqlValueToJsValidValue } from '../../utils/valueConverter'

const QueryEditor = () => {
  const router = useRouter()
  const connectionRegistryState = useConnectionRegistryState()
  const queryTableState = useQueryTableState()
  const { addQueryTable } = useQueryTableMutators()
  const [query, setQuery] = useState('')
  let textareaRef = createRef<HTMLTextAreaElement>()

  const onChangeTextArea = (e) => {
    setQuery(e.target.value)
  }

  const onClickRunButton = async () => {
    let textarea = textareaRef.current
    let queryText = query

    if (
      textarea &&
      textarea.value &&
      textarea.selectionStart != null &&
      textarea.selectionEnd != null &&
      textarea.selectionStart !== textarea.selectionEnd
    ) {
      queryText = queryText
        .toString()
        .substring(textarea.selectionStart, textarea.selectionEnd)
    }

    if (router.query.key) {
      const key = router.query.key as string
      if (connectionRegistryState) {
        const connectionSet = connectionRegistryState[key]
        if (connectionSet && connectionSet.session) {
          await addQueryTable(connectionSet.session, queryText)
        }
      }
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <textarea
        ref={textareaRef}
        value={query}
        onChange={onChangeTextArea}
        style={{ minHeight: '150px' }}
      />
      <section
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '4px',
          backgroundColor: Colors.LIGHT_GRAY4
        }}
      >
        <Button
          text={'Run'}
          icon="caret-right"
          fill={false}
          small={true}
          alignText="left"
          onClick={onClickRunButton}
        />
      </section>
      <section>
        {queryTableState && (
          <Table2
            numRows={queryTableState.records.length}
            enableRowHeader={false}
            enableMultipleSelection={false}
            loadingOptions={
              queryTableState &&
              queryTableState.status === QueryTableStatus.LOADING
                ? [TableLoadingOption.CELLS]
                : []
            }
          >
            {queryTableState.columns.map((columnName, index) => (
              <Column
                key={index}
                columnHeaderCellRenderer={(_: number) => (
                  <ColumnHeaderCell2 name={columnName} />
                )}
                cellRenderer={(rowIndex: number, _: number) => {
                  return (
                    <Cell>
                      {sqlValueToJsValidValue(
                        queryTableState.records[rowIndex][columnName]
                      )}
                    </Cell>
                  )
                }}
              />
            ))}
          </Table2>
        )}
      </section>
    </div>
  )
}

export default QueryEditor
