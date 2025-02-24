/* eslint-disable camelcase */
/**
 *
 * LoginSocialLinkedin
 *
 */
import React, { memo, useCallback, useEffect } from 'react';

const LINKEDIN_URL = 'https://www.linkedin.com/oauth/v2';
const LINKEDIN_API_URL = 'https://api.linkedin.com';
const CLIENT_ID = 'YOUR_LINKEDIN_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_LINKEDIN_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';
const STATE = 'RANDOM_STRING';

export const LoginSocialLinkedin = ({
  state = '',
  scope = 'openid,profile,email',
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
    if (statePopup?.includes('_linkedin') && code) {
      localStorage.setItem('linkedin', code);
      window.close();
    }
  }, [popupWindowURL, code, statePopup]);

  const getProfile = useCallback(
    async (accessToken) => {
      try {
        const response = await fetch(`${LINKEDIN_API_URL}/v2/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const profileData = await response.json();
        onResolve({ provider: 'linkedin', data: profileData });
      } catch (err) {
        onReject(err);
      }
    },
    [onReject, onResolve]
  );

  const getAccessToken = useCallback(
    async (code) => {
      if (isOnlyGetCode) {
        onResolve({ provider: 'linkedin', data: { code } });
      } else {
        try {
          const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            client_id,
            client_secret,
          });
          const response = await fetch(`${LINKEDIN_URL}/accessToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });
          const data = await response.json();
          if (data.access_token) {
            if (isOnlyGetToken) {
              onResolve({ provider: 'linkedin', data });
            } else {
              getProfile(data.access_token);
            }
          } else {
            throw new Error('Failed to get access token');
          }
        } catch (err) {
          onReject(err);
        }
      }
    },
    [onReject, onResolve, client_id, getProfile, redirect_uri, client_secret, isOnlyGetCode, isOnlyGetToken]
  );

  const handlePostMessage = useCallback(
    async ({ type, code, provider }) => type === 'code' && provider === 'linkedin' && code && getAccessToken(code),
    [getAccessToken]
  );

  const onChangeLocalStorage = useCallback(() => {
    const code = localStorage.getItem('linkedin');
    if (code) {
      handlePostMessage({ provider: 'linkedin', type: 'code', code });
      localStorage.removeItem('linkedin');
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
    const oauthUrl = `${LINKEDIN_URL}/authorization?response_type=${response_type}&client_id=${client_id}&scope=${scope}&state=${state + '_linkedin'
      }&redirect_uri=${redirect_uri}`;
    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      oauthUrl,
      'Linkedin',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`
    );

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        const code = localStorage.getItem('linkedin');
        if (!code) {
          onReject({ error: 'Popup closed by user' });
        }
      }
    }, 500);
  }, [onLoginStart, response_type, client_id, scope, state, redirect_uri, onReject]);

  return (
    <div className={className} onClick={onLogin}>
      {children}
    </div>
  );
};

export default memo(LoginSocialLinkedin);
