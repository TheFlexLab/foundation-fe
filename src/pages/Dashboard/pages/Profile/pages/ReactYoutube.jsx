/* eslint-disable camelcase */
/**
 *
 * LoginSocialYoutube
 *
 */
// import { PASS_CORS_KEY } from 'helper/constants';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// import { objectType, IResolveParams } from '../';

// interface Props {
//   scope?: string;
//   prompt?: string;
//   ux_mode?: string;
//   client_id: string;
//   className?: string;
//   login_hint?: string;
//   access_type?: string;
//   auto_select?: boolean;
//   redirect_uri?: string;
//   cookie_policy?: string;
//   hosted_domain?: string;
//   discoveryDocs?: string;
//   children?: React.ReactNode;
//   onLoginStart?: () => void;
//   isOnlyGetToken?: boolean;
//   typeResponse?: 'idToken' | 'accessToken';
//   onReject: (reject: string | objectType) => void;
//   fetch_basic_profile?: boolean;
//   onResolve: ({ provider, data }: IResolveParams) => void;
// }

// const SCOPE = ''
// const JS_SRC = 'https://apis.google.com/js/api.js'
const JS_SRC = 'https://accounts.google.com/gsi/client';
const SCRIPT_ID = 'google-login';
const PREVENT_CORS_URL = 'https://cors.bridged.cc';
const _window = window;
const PASS_CORS_KEY = '875c0462-6309-4ddf-9889-5227b1acc82c';

export const LoginSocialYoutube = ({
  client_id,
  scope = 'https://www.googleapis.com/auth/userinfo.profile',
  prompt = 'select_account',
  typeResponse = 'accessToken',
  ux_mode,
  className = '',
  login_hint = '',
  access_type = 'online',
  onLoginStart,
  onReject,
  onResolve,
  redirect_uri = '/',
  auto_select = false,
  isOnlyGetToken = false,
  cookie_policy = 'single_host_origin',
  hosted_domain = '',
  discoveryDocs = '',
  children,
  fetch_basic_profile = true,
}) => {
  const scriptNodeRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    !isSdkLoaded && load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSdkLoaded]);

  useEffect(
    () => () => {
      if (scriptNodeRef.current) scriptNodeRef.current.remove();
    },
    [],
  );

  const checkIsExistsSDKScript = useCallback(() => {
    return !!document.getElementById(SCRIPT_ID);
  }, []);

  const insertScriptGoogle = useCallback((d, s = 'script', id, jsSrc, cb) => {
    const ggScriptTag = d.createElement(s);
    ggScriptTag.id = id;
    ggScriptTag.src = jsSrc;
    ggScriptTag.async = true;
    ggScriptTag.defer = true;
    const scriptNode = document.getElementsByTagName('script')[0];
    scriptNodeRef.current = ggScriptTag;
    scriptNode && scriptNode.parentNode && scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode);
    ggScriptTag.onload = cb;
  }, []);

  const onGetMe = useCallback(
    (res) => {
      if (typeResponse === 'accessToken') {
        const headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-cors-grida-api-key': PASS_CORS_KEY,
          Authorization: 'Bearer ' + res.access_token,
        });

        fetch(
          //   `${PREVENT_CORS_URL}/https://www.googleapis.com/oauth2/v3/userinfo?alt=json`,
          // part: 'snippet',
          //   mine: true,
          `${PREVENT_CORS_URL}/https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`,
          {
            method: 'GET',
            headers,
          },
        )
          .then((response) => response.json())
          .then((response) => {
            const data = { ...res, ...response };
            onResolve({
              provider: 'google',
              data,
            });
          })
          .catch((err) => {
            onReject(err);
          });
      } else {
        fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${res.credential}`, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((response) => {
            const data = { ...res, ...response };
            onResolve({
              provider: 'google',
              data,
            });
          })
          .catch((err) => {
            onReject(err);
          });
      }
    },
    [typeResponse, onReject, onResolve],
  );

  const handleResponse = useCallback(
    (res) => {
      if (res && access_type === 'offline')
        onResolve({
          provider: 'google',
          data: res,
        });
      else {
        if (res?.access_token) {
          if (isOnlyGetToken)
            onResolve({
              provider: 'google',
              data: res,
            });
          else onGetMe(res);
        } else {
          const data = res;
          if (isOnlyGetToken)
            onResolve({
              provider: 'google',
              data,
            });
          else onGetMe(res);
        }
      }
    },
    [access_type, isOnlyGetToken, onGetMe, onResolve],
  );

  const handleError = useCallback(
    (res) => {
      onReject({
        provider: 'google',
        data: res,
      });
    },
    [onReject],
  );

  const load = useCallback(() => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertScriptGoogle(document, 'script', SCRIPT_ID, JS_SRC, () => {
        const params = {
          client_id,
          ux_mode,
        };
        var client = null;
        if (typeResponse === 'idToken') {
          _window.google.accounts.id.initialize({
            ...params,
            auto_select,
            prompt: 'select_account',
            login_uri: redirect_uri,
            callback: handleResponse,
            native_callback: handleResponse,
            error_callback: handleError,
          });
        } else {
          const payload = {
            ...params,
            scope,
            prompt,
            login_hint,
            access_type,
            hosted_domain,
            redirect_uri,
            cookie_policy,
            discoveryDocs,
            immediate: true,
            fetch_basic_profile,
            callback: handleResponse,
            error_callback: handleError,
          };
          if (access_type === 'offline') client = _window.google.accounts.oauth2.initCodeClient(payload);
          else client = _window.google.accounts.oauth2.initTokenClient(payload);
        }
        if (client) setInstance(client);
        setIsSdkLoaded(true);
      });
    }
  }, [
    scope,
    prompt,
    ux_mode,
    client_id,
    login_hint,
    auto_select,
    access_type,
    redirect_uri,
    typeResponse,
    discoveryDocs,
    cookie_policy,
    hosted_domain,
    handleResponse,
    handleError,
    fetch_basic_profile,
    insertScriptGoogle,
    checkIsExistsSDKScript,
  ]);

  const loginGoogle = useCallback(() => {
    if (!isSdkLoaded) return;
    if (!_window.google) {
      load();
      onReject("Google SDK isn't loaded!");
    } else {
      onLoginStart && onLoginStart();
      if (instance) access_type === 'offline' ? instance.requestCode() : instance.requestAccessToken();
      else _window.google.accounts.id.prompt();
    }
  }, [access_type, instance, isSdkLoaded, load, onLoginStart, onReject]);

  return (
    <div className={className} onClick={loginGoogle}>
      {children}
    </div>
  );
};

export default memo(LoginSocialYoutube);
