const isElectron = typeof window !== 'undefined' && window.location.protocol === 'file:';

export const getAssetUrl = (path) => {
  if (!path) return path;
  
  if (isElectron && path.startsWith('/assets/')) {
    return `.${path}`;
  }
  
  return path;
};

export const processAssetPaths = (obj) => {
  if (typeof obj === 'string') {
    return getAssetUrl(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(processAssetPaths);
  }
  
  if (obj && typeof obj === 'object') {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'src' || key === 'image' || key === 'logo' || key === 'icon') {
        processed[key] = getAssetUrl(value);
      } else {
        processed[key] = processAssetPaths(value);
      }
    }
    return processed;
  }
  
  return obj;
};
