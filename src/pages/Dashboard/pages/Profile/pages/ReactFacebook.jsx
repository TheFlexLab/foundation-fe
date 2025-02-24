/* eslint-disable camelcase */
/**
 *
 * LoginSocialFacebook
 *
 */
import React, { memo, useCallback, useEffect } from 'react';
import axios from 'axios';
// import { IResolveParams, objectType } from '../';

// interface Props {
//   state?: string;
//   scope?: string;
//   client_id: string;
//   className?: string;
//   redirect_uri: string;
//   client_secret: string;
//   response_type?: string;
//   isOnlyGetCode?: boolean;
//   isOnlyGetToken?: boolean;
//   children?: React.ReactNode;
//   onLoginStart?: () => void;
//   onReject: (reject: string | objectType) => void;
//   onResolve: ({ provider, data }: IResolveParams) => void;
// }

const FACEBOOK_URL = 'https://www.facebook.com/v12.0/dialog/oauth';
const FACEBOOK_API_URL = 'https://graph.facebook.com/v12.0';
const PREVENT_CORS_URL = 'https://cors.bridged.cc';
const PASS_CORS_KEY = '875c0462-6309-4ddf-9889-5227b1acc82c';

export const LoginSocialFacebook = ({
  state = '',
  scope = 'email,public_profile',
  client_id,
  client_secret,
  className = '',
  redirect_uri,
  response_type = 'code',
  isOnlyGetCode = false,
  isOnlyGetToken = false,
  children,
  onLoginStart,
  onReject,
  onResolve,
}) => {
  const popupWindowURL = new URL(window.location.href);
  const code = popupWindowURL.searchParams.get('code');
  const statePopup = popupWindowURL.searchParams.get('state');
  useEffect(() => {
    if (statePopup?.includes('_facebook') && code) {
      localStorage.setItem('facebook', code);
      window.close();
    }
  }, [popupWindowURL, code, statePopup]);

  const getAccessToken = useCallback(
    (code) => {
      if (isOnlyGetCode) onResolve({ provider: 'facebook', data: { code } });
      else {
        const params = {
          code,
          grant_type: 'authorization_code',
          redirect_uri,
          client_id,
          client_secret,
        };

        fetch(`${import.meta.env.VITE_API_URL}/user/getFacebookUserInfo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        })
          .then((response) => response.json())
          .then((response) => {
            onResolve({ provider: 'facebook', data: response });
          })
          .catch((err) => {
            onReject(err);
          });
      }
    },
    [onReject, onResolve, client_id, redirect_uri, client_secret, isOnlyGetCode],
  );

  const handlePostMessage = useCallback(
    async ({ type, code, provider }) => type === 'code' && provider === 'facebook' && code && getAccessToken(code),
    [getAccessToken],
  );

  const onChangeLocalStorage = useCallback(() => {
    const code = localStorage.getItem('facebook');
    if (code) {
      handlePostMessage({ provider: 'facebook', type: 'code', code });
      localStorage.removeItem('facebook');
    }
  }, [handlePostMessage]);

  useEffect(() => {
    window.addEventListener('storage', onChangeLocalStorage);
    return () => {
      window.removeEventListener('storage', onChangeLocalStorage);
    };
  }, [onChangeLocalStorage]);

  const onLogin = useCallback(() => {
    onLoginStart && onLoginStart();
    const oauthUrl = `${FACEBOOK_URL}?response_type=${response_type}&client_id=${client_id}&scope=${scope}&state=${state + '_facebook'
      }&redirect_uri=${redirect_uri}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      oauthUrl,
      'Facebook',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' +
      width +
      ', height=' +
      height +
      ', top=' +
      top +
      ', left=' +
      left,
    );
  }, [onLoginStart, response_type, client_id, scope, state, redirect_uri]);

  return (
    <div className={className} onClick={onLogin}>
      {children}
    </div>
  );
};

export default memo(LoginSocialFacebook);
