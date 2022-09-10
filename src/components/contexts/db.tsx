import {
  FC,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext
} from 'react'
import Database from 'tauri-plugin-sql-api'

type Props = {
  children: ReactNode
}

type DbContextType = {
  db: Database
}

type UseDb = {
  db: Database
}

const DbContext = createContext<DbContextType | undefined>(undefined)

export const DbProvider: FC<Props> = ({ children }) => {
  const [db, setDb] = useState<Database>(null)
  useEffect(() => {
    const init = async () => {
      const db = await Database.load(`postgres://postgres:@localhost/db_name`)
      setDb(db)
    }
    init()
  }, [])
  return <DbContext.Provider value={{ db }}>{children}</DbContext.Provider>
}

export const useDb = (): UseDb => {
  const dbContext = useContext(DbContext)
  if (!dbContext) {
    return {
      db: null
    }
  }
  return {
    db: dbContext.db
  }
}
