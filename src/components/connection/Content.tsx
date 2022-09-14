import {
  Colors,
  FormGroup,
  InputGroup,
  NumericInput,
  Button,
  Toaster,
  Position,
  Intent
} from '@blueprintjs/core'
import { FormEvent, useEffect, useState } from 'react'
import { useConnectionConfigsMutators } from '../../states/connectionConfigState'
import {
  useConnectionDetailMutators,
  useConnectionDetailState
} from '../../states/connectionDetailState'

const Content = () => {
  const connectionDetailState = useConnectionDetailState()
  const { resetConnectionDetail } = useConnectionDetailMutators()
  const [connectionName, setConnectionName] = useState('')
  const [host, setHost] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [database, setDatabase] = useState('')
  const [port, setPort] = useState(5432)
  const [connecting, setConnecting] = useState(false)
  const { updateConnectionConfig, deleteConnectionConfig } =
    useConnectionConfigsMutators()
  const onChangeConnectionName = (e: FormEvent<HTMLElement>) => {
    setConnectionName((e.target as HTMLInputElement).value)
  }
  const onChangeHost = (e: FormEvent<HTMLElement>) => {
    setHost((e.target as HTMLInputElement).value)
  }
  const onChangeUser = (e: FormEvent<HTMLElement>) => {
    setUser((e.target as HTMLInputElement).value)
  }
  const onChangePassword = (e: FormEvent<HTMLElement>) => {
    setPassword((e.target as HTMLInputElement).value)
  }
  const onChangeDatabase = (e: FormEvent<HTMLElement>) => {
    setDatabase((e.target as HTMLInputElement).value)
  }
  const onChangePort = (
    valueAsNumber: number,
    _: string,
    __: HTMLInputElement
  ) => {
    setPort(valueAsNumber)
  }
  const onClickUpdate = async () => {
    setConnecting(true)

    const result = await updateConnectionConfig(
      {
        name: connectionName,
        host: host,
        user: user,
        password: password,
        database: database,
        port: port
      },
      connectionDetailState
    )
    if (isEmptyConnectionDetail) {
      resetLocalState()
    }

    if (result) {
      Toaster.create({
        position: Position.BOTTOM_RIGHT
      }).show({ message: 'Connection updated', intent: Intent.SUCCESS })
    } else {
      Toaster.create({
        position: Position.BOTTOM_RIGHT
      }).show({ message: 'Failed to update', intent: Intent.DANGER })
    }
    setConnecting(false)
  }
  const onClickDelete = async () => {
    setConnecting(true)
    await deleteConnectionConfig(connectionDetailState)
    await resetConnectionDetail()
    setConnecting(false)
  }
  const onClickConnect = async () => {
    setConnecting(true)
    alert('Connect!')
    setConnecting(false)
  }
  const isEmptyConnectionDetail = connectionDetailState === null
  const resetLocalState = () => {
    setConnectionName('')
    setHost('')
    setUser('')
    setPassword('')
    setDatabase('')
    setPort(5432)
  }

  useEffect(() => {
    if (connectionDetailState) {
      setConnectionName(connectionDetailState.name)
      setHost(connectionDetailState.host)
      setUser(connectionDetailState.user)
      setPassword(connectionDetailState.password)
      setDatabase(connectionDetailState.database)
      setPort(connectionDetailState.port)
    } else {
      resetLocalState()
    }
  }, [connectionDetailState])

  return (
    <div
      style={{
        flexGrow: 1,
        backgroundColor: Colors.LIGHT_GRAY5
      }}
    >
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '0.5rem 2.5rem'
        }}
      >
        <div
          style={{
            width: '100%'
          }}
        >
          <h1
            style={{
              padding: 0,
              fontSize: '1rem',
              color: Colors.GRAY1
            }}
          >
            Connection Detail
          </h1>
        </div>
        <FormGroup
          label="Connection Name"
          labelInfo="(required)"
          style={{
            width: '100%'
          }}
        >
          <InputGroup
            placeholder="For dev env"
            value={connectionName}
            onChange={onChangeConnectionName}
          />
        </FormGroup>
        <FormGroup
          label="Host"
          labelInfo="(required)"
          style={{
            width: '100%'
          }}
        >
          <InputGroup
            placeholder="127.0.0.1"
            value={host}
            onChange={onChangeHost}
          />
        </FormGroup>
        <FormGroup
          label="User"
          labelInfo="(required)"
          style={{
            width: '100%'
          }}
        >
          <InputGroup
            placeholder="postgres"
            value={user}
            onChange={onChangeUser}
          />
        </FormGroup>
        <FormGroup
          label="Password"
          style={{
            width: '100%'
          }}
        >
          <InputGroup
            placeholder="password"
            value={password}
            onChange={onChangePassword}
          />
        </FormGroup>
        <FormGroup
          label="Database Name"
          labelInfo="(required)"
          style={{
            width: '100%'
          }}
        >
          <InputGroup
            placeholder="my_db"
            value={database}
            onChange={onChangeDatabase}
          />
        </FormGroup>
        <FormGroup
          label="Port"
          style={{
            width: '100%'
          }}
        >
          <NumericInput
            placeholder="5432"
            value={port}
            onValueChange={onChangePort}
          />
        </FormGroup>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          <div>
            {!isEmptyConnectionDetail && (
              <Button
                onClick={onClickDelete}
                loading={connecting}
                intent="danger"
                style={{ marginRight: '1rem' }}
                text={'Delete'}
              />
            )}
            <Button
              onClick={onClickUpdate}
              loading={connecting}
              text={!isEmptyConnectionDetail ? 'Update' : 'Save'}
            />
          </div>
          <Button
            onClick={onClickConnect}
            loading={connecting}
            text={'Connect'}
          />
        </div>
      </section>
    </div>
  )
}

export default Content
