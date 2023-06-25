import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { Auth0Provider } from "@auth0/auth0-react"

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById('root'))
const domain = 'https://okta-cic-pointbase.cic-demo-platform.auth0app.com'
const clientid = 'Fwu6QCmc7YYNpCQINXwx2IkIDjuQNiE6'
const audience = 'https://oktavisor.api'
const scope = 'update:user_metadata'


root.render(
  <Router>
    <Auth0Provider domain={domain} clientId={clientid} redirectUri={window.location.origin} audience={audience} scope={scope}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </Router>
)
