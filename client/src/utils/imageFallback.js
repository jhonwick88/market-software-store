export const getProductImage = (media, fallback = '/images/pintarpos_resto.jpg') => {
  if (Array.isArray(media) && media.length > 0) {
    return media[0].url;
  }
  if (typeof media === 'string' && media.trim()) {
    return media;
  }
  return fallback;
};

export const handleImageError = (e, fallback = '/images/pintarpos_resto.jpg') => {
  if (e && e.target) {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = fallback;
  }
};
