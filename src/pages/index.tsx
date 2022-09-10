import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { useDb } from '../components/contexts/db'

function App() {
  const { db } = useDb()

  async function select() {
    console.log('db: ', db)
    const result = await db.select('SELECT * FROM clients LIMIT 1')
    console.log(result)
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!!</h1>
      <div className="row">
        <div>
          <button type="button" onClick={() => select()}>
            Query
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
