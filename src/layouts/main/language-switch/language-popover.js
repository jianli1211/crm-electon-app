import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { tokens } from 'src/locales/tokens';

const languageOptions = {
  en: {
    icon: '/assets/flags/flag-uk.png',
    label: 'English',
    code: 'UK',
  },
  de: {
    icon: '/assets/flags/flag-de.png',
    label: 'German',
    code: 'DE',
  },
  es: {
    icon: '/assets/flags/flag-es.png',
    label: 'Spanish',
    code: 'ES'
  },
  it: {
    icon: '/assets/flags/flag-it.png',
    label: 'Italian',
    code: 'IT'
  },
  ru: {
    icon: '/assets/flags/flag-ru.png',
    label: 'Russian',
    code: 'RU'
  },
  nl: {
    icon: '/assets/flags/flag-nl.png',
    label: 'Dutch',
    code: 'NL'
  },
};

export const LanguagePopover = (props) => {
  const { anchorEl, onClose, open = false, ...other } = props;
  const { i18n, t } = useTranslation();

  const handleChange = useCallback(async (language) => {
    onClose?.();
    await i18n.changeLanguage(language);
    const message = t(tokens.common.languageChanged);
    toast.success(message);
  }, [onClose, i18n, t]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom'
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 140 } }}
      {...other}>
      {Object.keys(languageOptions).map((language) => {
        const option = languageOptions[language];

        return (
          <MenuItem
            onClick={() => handleChange(language)}
            key={language}
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', py: 1, gap: 2 }}
          >
            <Box
              sx={{
                width: 28,
                '& img': {
                  width: '100%'
                },
                display: 'flex', flexDirection: 'row', alignItems: 'center',
              }}
            >
              <img
                alt={option.label}
                src={option.icon}
              />
            </Box>
            <ListItemText
              primary={(
                <Typography variant="subtitle2">
                  {option.label}
                </Typography>
              )}
            />
          </MenuItem>
        );
      })}
    </Popover>
  );
};

LanguagePopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
