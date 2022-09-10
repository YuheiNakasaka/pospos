import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useDb } from '../components/contexts/db'

function App() {
  const [host, setHost] = useState('localhost')
  const [dbName, setDbName] = useState('your_db_name')
  const { connectDb } = useDb()
  const [db, setDb] = useState(null)
  const [queryResult, setQueryResult] = useState('')

  async function select() {
    const result = await db.select('SELECT * FROM clients LIMIT 1')
    setQueryResult(JSON.stringify(result))
  }

  const connect = async () => {
    const db = await connectDb(`postgres://postgres:@${host}/${dbName}`)
    setDb(db)
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!!</h1>
      <div className="row">
        <div>
          <label>Host</label>
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div>
          <label>DB Name</label>
          <input
            type="text"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div>
          <button type="button" onClick={() => connect()}>
            Connect
          </button>
        </div>
      </div>
      {db && (
        <>
          <div className="row">
            <div>
              <button type="button" onClick={() => select()}>
                Query
              </button>
            </div>
          </div>
          <div className="row">
            <textarea
              value={queryResult}
              readOnly
              style={{
                width: '300px',
                height: '150px'
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
