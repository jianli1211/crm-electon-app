import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import { useCallback } from "react";
import Badge from '@mui/material/Badge';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { getAssetPath } from 'src/utils/asset-path';

const getProviderLogo = (provider) => {
  const logoMap = {
    booming_games: getAssetPath("/assets/icons/gaming/booming_games.jpg"),
    evolution: getAssetPath("/assets/icons/gaming/evolution.png"),
    netent: getAssetPath("/assets/icons/gaming/netent.png"),
    pragmatic_play: getAssetPath("/assets/icons/gaming/pragmatic_play.png"),
  };
  
  return logoMap[provider.provider_type] || null;
};

export const GameStudioProviderItem = ({ provider, pageInfo }) => {
  const router = useRouter();
  
  const handleSettingsOpen = useCallback(
    () => {
      router.push(`${paths.dashboard.integration.gameStudioProviderSettings}/${provider?.id}?pageInfo=${pageInfo}`);
    },
    [router]
  );

  const MainLogo = () => (
    <Stack
      direction="column"
      alignItems="center"
      gap={2}
      sx={{ position: 'relative', width: '100%' }}>
      <img
        style={{ 
          objectFit: "contain",
          width: '100%',
          maxWidth: 170,
          height: 70,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
        src={getProviderLogo(provider)}
        alt={`${provider?.name} logo`}
      />
      <Stack spacing={1} alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            color: 'text.primary',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            whiteSpace: 'nowrap'
          }}
        >
          {provider?.name}
        </Typography>
      </Stack>
    </Stack>
  )

  return (
    <Grid xs={12} md={3}>
      <Card
        elevation={1}
        sx={{
          cursor: "pointer",
          transition: 'all 0.3s ease-in-out',
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.mode === 'light' 
            ? theme.palette.background.paper 
            : theme.palette.neutral[800],
          border: (theme) => theme.palette.mode === 'light' 
            ? `1px solid ${theme.palette.neutral[200]}` 
            : `1px solid ${theme.palette.neutral[700]}`,
          ":hover": {
            transform: 'translateY(-4px)',
            boxShadow: (theme) => theme.shadows[10],
            borderColor: 'primary.main',
            backgroundColor: (theme) => theme.palette.mode === 'light' 
              ? theme.palette.neutral[50] 
              : theme.palette.neutral[700],
          },
        }}
        onClick={handleSettingsOpen}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            alignItems="start"
            justifyContent="center"
            spacing={2}
            sx={{ position: 'relative' }}
          >
            {(provider?.is_default) ? (
              <Badge 
                color="primary"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                badgeContent={'Default'}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    height: 'auto',
                    padding: '4px 8px',
                    borderRadius: 1,
                    mt: 1
                  }
                }}
              >
                <MainLogo />
              </Badge>
            ) : (
              <MainLogo />
            )}
            <PowerSettingsNewIcon 
              color={provider?.enabled ? "success" : "error"}
              sx={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: 20,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

GameStudioProviderItem.propTypes = {
  provider: PropTypes.object.isRequired,
};
