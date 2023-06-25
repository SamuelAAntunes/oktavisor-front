import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import { useQuery } from 'react-query'
import axios from 'axios'
import useStore from './Store'

import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'

import UserCollection from './Okta/userCollection'
import GroupsCollection from './Okta/groupsCollection'

const EnvironmentPage = () => {
  const environments = useStore(state => state.environments)
  const history = useHistory()
  //the store cannot be empty and the component must be invoked from the / route
  if(!environments.length) history.push('/')

  //Get pointer to current environment
  const {id} = useParams()
  const currentEnvironment = environments.find(item => item.name === id)

  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  const fetchAccessToken = async () => {

    const widgetConfig = {
      language: 'en',
      i18n: {
        // Overriding English properties
        'en': {
          'primaryauth.title': 'Sign in to ' + currentEnvironment.name,
        },
      },

      baseUrl: 'https://' + currentEnvironment.issuer,
      issuer: 'https://' + currentEnvironment.issuer,
      clientId: currentEnvironment.clientid,
      redirectUri: window.location.origin + '/environment/callback',
      authParams: {
        pkce: true,
        responseType: ['token'],
        scopes: [
          'okta.users.read', 'okta.users.read.self', 'okta.groups.read',
          'okta.appGrants.read', 'okta.apps.read', 
          'okta.authenticators.read', 
          'okta.authorizationServers.read',
          'okta.clients.read', 
          'okta.factors.read', 
          //'okta.brands.read', 
          //'okta.captchas.read', 'okta.certificateAuthorities.read', 
          //'okta.deviceAssurance.read', 'okta.devices.read', 
          //'okta.domains.read', 'okta.emailDomains.read', 
          //'okta.inlineHooks.read', 
          //'okta.eventHooks.read', 
          //'okta.events.read',
          //'okta.features.read', 
          'okta.linkedObjects.read', 
          'okta.myAccount.email.read', 'okta.myAccount.phone.read', 'okta.myAccount.profile.read', 
          'okta.networkZones.read',
          'okta.policies.read', 
          'okta.profileMappings.read',
          'okta.roles.read', 
          'okta.schemas.read',
          'okta.sessions.read',
          //'okta.templates.read', 'okta.threatInsights.read', 'okta.trustedOrigins.read', 
          //'okta.uischemas.read', 'okta.userTypes.read', 'okta.reports.read', 'okta.logs.read', 
          //'okta.idps.read', 
          //'okta.riskProviders.read', 
          //'okta.oauthIntegrations.read', 
          //'okta.logStreams.read', 
          //'okta.governance.accessCertifications.read', 
          //'okta.rateLimits.read', 
          //'okta.principalRateLimits.read', 
        ]
      }
    }

    const widget = new OktaSignIn(widgetConfig)
  
    return new Promise((resolve, reject) => {
      //CHF : some states may be used/changed here to make sure nothing is displayed while authn is undergoing
      setIsWidgetLoaded(true)

      widget.renderEl({ el: '#widget-container' }, (res) => {

        if (res.status === 'SUCCESS') {
          //console.info({Token : res.tokens.accessToken})
          //console.info(res.tokens.accessToken.scopes.includes('okta.users.read'))
          resolve(res.tokens.accessToken)
          widget.remove()
          setIsWidgetLoaded(false)
        }
      }, 
      (err) => {
        reject(err)
      })
    })
  }

  const handleBackToEnvironments = () => {
    history.push('/')
  }

  const mykey = currentEnvironment.issuer + '.token'
  //const { data: token, isLoading, isError, error } = useQuery(mykey, fetchAccessToken, {
  const { data: token, isError, error } = useQuery(mykey, fetchAccessToken, {
    staleTime: 1000 * 60 * 60,        // 60 minutes - consider this with the actual expiration of the token (1h)
    cacheTime: 1000 * 60 * 60 ,       // sensible amount considering your use case
    retry: 1                          // number of retry attempts when the fetch fails
  })


  const [currentChild, setCurrentChild] = useState('users')

  //build link to current environment's admin UI
  async function buildAdminUiUrl(issuer) {
    let parts = issuer.split(".")

    const response = await axios.get(`https://${issuer}/oauth2/.well-known/oauth-authorization-server`)
      
    if (response.status === 200) {
      const config = response.data
      console.info(config)
      //return config
    }
    else 
      throw new Error(`Failed to retrieve authorization server configuration. Status: ${response.status}`)

    parts[0] += "-admin"
    return parts.join(".")
  }


  return (
    <div className='container'>

      {!isWidgetLoaded &&
        <h4>
          Environment {id} 
          <button type="button" className="btn btn-primary btn-sm" style={{marginRight: 1 + 'em', marginLeft: 1 + 'em'}} onClick={handleBackToEnvironments} >Back to environments</button>

          {token && 

            <>
              <a className="btn btn-outline-primary btn-sm" style={{marginRight: 1 + 'em'}} 
                  href={'https://' + buildAdminUiUrl(currentEnvironment.issuer)} target="_blank" rel="noopener noreferrer">Okta Admin UI</a>

              <div className="btn-group btn-group-sm">
                <button className={currentChild === 'users' ? 'btn btn-outline-primary active' : 'btn btn-outline-primary'} onClick={() => setCurrentChild('users')} aria-current="page">Users</button>
                <button className={currentChild === 'groups' ? 'btn btn-outline-primary active' : 'btn btn-outline-primary'} onClick={() => setCurrentChild('groups')} aria-current="page">Groups</button>
                <button className="btn btn-outline-primary">Others</button>
              </div>
            </>
          }
        </h4>
      }

      {isError && <div>An error occurred: {error.message}</div>}

      {!isWidgetLoaded && token && token.accessToken &&
        <div style={{marginTop: '1.5rem'}}>
          {currentChild === 'users' && <UserCollection data={ token }/>}
          {currentChild === 'groups' && <GroupsCollection data={ token } />}
        </div>
      }

      {isWidgetLoaded &&
        <div className='text-center' style={{marginTop: 1 + 'em'}}>
          <h5>Loading ...</h5>
          <button type="button" className="btn btn-primary btn-sm" style={{marginTop: 1 + 'em'}} onClick={handleBackToEnvironments} >Back to environments</button>
        </div>
      }
      <div id="widget-container"></div>
    </div>    
  );
}

export default withAuthenticationRequired(EnvironmentPage)