import type { AppProps } from 'next/app'

import '../style.css'
import '../App.css'
import { DbProvider } from '../components/contexts/db'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DbProvider>
      <Component {...pageProps} />
    </DbProvider>
  )
}
