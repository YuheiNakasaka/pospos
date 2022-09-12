import {
  Colors,
  FormGroup,
  InputGroup,
  NumericInput,
  Button
} from '@blueprintjs/core'
import { FormEvent, useState } from 'react'
import { useConnectionConfigsMutators } from '../../states/connectionConfigState'

const Content = () => {
  const [connectionName, setConnectionName] = useState('')
  const [host, setHost] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [database, setDatabase] = useState('')
  const [port, setPort] = useState(5432)
  const { addConnectionConfig } = useConnectionConfigsMutators()
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
  const onClickConnect = () => {
    addConnectionConfig({
      name: connectionName,
      host: host,
      user: user,
      password: password,
      database: database,
      port: port
    })
  }

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
        <Button onClick={onClickConnect}>Connect</Button>
      </section>
    </div>
  )
}

export default Content
