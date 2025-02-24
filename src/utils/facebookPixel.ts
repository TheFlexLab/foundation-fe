import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '559414460877702';

export const initFacebookPixel = () => {
  ReactPixel.init(PIXEL_ID);
  ReactPixel.pageView(); // Optional: Track the initial page view
};
