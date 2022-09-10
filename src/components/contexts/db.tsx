import { FC, createContext, ReactNode, useContext } from 'react'
import Database from 'tauri-plugin-sql-api'

type Props = {
  children: ReactNode
}

type DbContextType = {
  connectDb: (string) => Promise<Database | null>
}

type UseDb = {
  connectDb: (string) => Promise<Database | null>
}

const DbContext = createContext<DbContextType | undefined>(undefined)

export const DbProvider: FC<Props> = ({ children }) => {
  const connectDb = async (url: string) => {
    const db = await Database.load(url)
    return db
  }
  return (
    <DbContext.Provider value={{ connectDb }}>{children}</DbContext.Provider>
  )
}

export const useDb = (): UseDb => {
  const dbContext = useContext(DbContext)
  if (!dbContext) {
    return {
      connectDb: async () => null
    }
  }
  return {
    connectDb: dbContext.connectDb
  }
}
