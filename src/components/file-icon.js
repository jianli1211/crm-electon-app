import PropTypes from 'prop-types';
import { getAssetPath } from 'src/utils/asset-path';

const icons = {
  jpeg: '/assets/icons/icon-jpg.svg',
  jpg: '/assets/icons/icon-jpg.svg',
  mp4: '/assets/icons/icon-mp4.svg',
  pdf: '/assets/icons/icon-pdf.svg',
  png: '/assets/icons/icon-png.svg',
  svg: '/assets/icons/icon-svg.svg'
};

export const FileIcon = (props) => {
  const { extension } = props;

  let icon;

  if (!extension) {
    icon = '/assets/icons/icon-other.svg';
  } else {
    icon = icons[extension] || '/assets/icons/icon-other.svg';
  }

  return <img src={getAssetPath(icon)} />;
};

FileIcon.propTypes = {
  extension: PropTypes.string
};
