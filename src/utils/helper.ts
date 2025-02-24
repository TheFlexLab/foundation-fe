export const isWebview = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  // Common webview identifiers or patterns
  const webviewIdentifiers = [
    'wv', // Common abbreviation for webview
    'webview', // Webview identifier
    'fbav', // Facebook App WebView
    'instagram', // Instagram WebView
    'twitter', // Twitter WebView
  ];

  // Check if any of the webview identifiers exist in the userAgent string
  return webviewIdentifiers.some((identifier) => userAgent.includes(identifier));
};
