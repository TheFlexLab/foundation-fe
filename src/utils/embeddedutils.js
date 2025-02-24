export function extractYouTubeVideoId(url) {
  const patternLong = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const patternShort = /youtu\.be\/([^"&?/ ]{11})/;
  const patternShorts = /youtube\.com\/shorts\/([^"&?/ ]{11})/;

  const matchLong = url.match(patternLong);
  const matchShort = url.match(patternShort);
  const matchShorts = url.match(patternShorts);

  if (matchLong && matchLong[1]) {
    return matchLong[1]; // Full YouTube URL
  } else if (matchShort && matchShort[1]) {
    return matchShort[1]; // Short YouTube URL
  } else if (matchShorts && matchShorts[1]) {
    return matchShorts[1]; // YouTube Shorts URL
  } else {
    return null; // Invalid or unsupported URL
  }
}

export const extractPartFromUrl = (url) => {
  const pattern = /soundcloud.com\/(?:[^\/]+)\/([^/?]+)/;
  const match = url.match(pattern);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

export function isImageUrl(urlArray) {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg']; // Add more if needed
  return urlArray.some((url) => {
    const lowerCaseUrl = url.toLowerCase();
    return imageExtensions.some((extension) => lowerCaseUrl.endsWith(extension) || lowerCaseUrl.includes('giphy'));
  });
}
