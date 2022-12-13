import React from "react"
import { Button } from "@mui/material"
import loadScript, { removeScript } from "./loadScript"

export default function useGoogleSignin(props) {

      const {
            onSuccess = () => { },
            onAutoLoadFinished = () => { },
            onFailure = () => { },
            onRequest = () => { },
            onScriptLoadFailure,
            clientId,
            cookiePolicy,
            loginHint,
            hostedDomain,
            autoLoad,
            isSignedIn,
            fetchBasicProfile,
            redirectUri,
            discoveryDocs,
            uxMode,
            scope,
            accessType,
            responseType,
            jsSrc = 'https://accounts.google.com/gsi/client',
            prompt
      } = props;

      const [loaded, setLoaded] = React.useState(false);
      const [client, setClient] = React.useState({});

      function handelSignInSuccess(res) {
            console.log(res);
            onSuccess(res);
      }

      function signIn(e) {
            if (e) e.preventDefault(); // prevent form submit if within HTMLFormElement

            /**
             * Execute Only if script is loaded.
             */
            if (loaded) {
                  try {
                        const accessToken = client.requestAccessToken(true);
                        console.log(accessToken);
                        // console.log(accessToken.getAuthResponse());
                  } catch (err) {
                        console.log(err);
                  }
            }
      }

      React.useEffect(() => {
            let unmounted = false
            const onLoadFailure = onScriptLoadFailure || onFailure
            loadScript(
                  document,
                  'script',
                  'google-login',
                  jsSrc,
                  () => {
                        console.log('google-login script loaded');
                        setLoaded(true);
                        const params = {
                              client_id: clientId,
                              cookie_policy: cookiePolicy,
                              login_hint: loginHint,
                              hosted_domain: hostedDomain,
                              fetch_basic_profile: fetchBasicProfile,
                              discoveryDocs,
                              ux_mode: uxMode,
                              redirect_uri: redirectUri,
                              scope,
                              access_type: accessType,
                              callback: (response) => {
                                    if (!unmounted) {
                                          console.log("response: ", response);
                                          console.log(response.getAuthResponse());
                                    }
                              }
                        }

                        if (responseType === 'code') {
                              params.access_type = 'offline'
                        }

                        const client = window.google.accounts.oauth2.initTokenClient(params)
                        console.log(client);
                        setClient(client);

                        // window.google.accounts.id.initialize(params);
                        // window.google.accounts.id.prompt();
                  },
                  err => {
                        onLoadFailure(err)
                  }
            );

            return () => {
                  unmounted = true
                  removeScript(document, 'google-login')
            }
      }, []);


      return { signIn, loaded }

}