import { useMemo } from 'react';
import { getAssetPath } from '../utils/asset-path';

export const useAssetPath = (path) => {
  return useMemo(() => getAssetPath(path), [path]);
};
