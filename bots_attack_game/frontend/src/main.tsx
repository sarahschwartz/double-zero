import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { wagmiConfig } from "./utils/wagmi-config.ts"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
