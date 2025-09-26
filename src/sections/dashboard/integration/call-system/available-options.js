import { useState } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

import { useCallProviders } from 'src/hooks/call-system/useCallProviders';
import { ProviderInfoDialog } from './provider-info-dialog';
import { useSettings } from "src/hooks/use-settings";
import { getAssetPath } from 'src/utils/asset-path';

const NAME_TO_LOGO_LIGHT = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart.svg"),
  "prime voip": getAssetPath("/assets/call-system/call-prime-light.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin.svg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

const NAME_TO_LOGO_DARK = {
  "cyprus bpx": getAssetPath("/assets/call-system/call-pbx.png"),
  coperato: getAssetPath("/assets/call-system/call-coperato.png"),
  nuvei: getAssetPath("/assets/call-system/call-nuvei.png"),
  perfectMoney: getAssetPath("/assets/call-system/call-perfect-money.png"),
  twilio: getAssetPath("/assets/call-system/call-twilio.png"),
  voiso: getAssetPath("/assets/call-system/call-voiso.png"),
  squaretalk: getAssetPath("/assets/call-system/call-squaretalk.png"),
  commpeak: getAssetPath("/assets/call-system/call-commpeak.png"),
  mmdsmart: getAssetPath("/assets/call-system/call-mmdsmart-dark.webp"),
  "prime voip": getAssetPath("/assets/call-system/call-prime.png"),
  voicespin: getAssetPath("/assets/call-system/call-voicespin-light.jpg"),
  didglobal: getAssetPath("/assets/call-system/call-didglobal.jpg"),
};

export const AvailableOptions = () => {
  const providers = useCallProviders();
  const settings = useSettings();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProvider(null);
  };

  return (
    <>
      <Stack
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}>
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
            sx={{
              mt: 2,
              animation: 'fadeIn 0.5s ease-in-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(10px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}>
            {providers?.map((provider) => {
              const logoMap = settings?.paletteMode === 'light' ? NAME_TO_LOGO_LIGHT : NAME_TO_LOGO_DARK;
              const logoPath = logoMap[provider?.name?.toLowerCase()];

              return (
                <Grid key={provider.name} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: (theme) => theme.palette.mode === 'light' 
                        ? theme.palette.background.paper 
                        : theme.palette.neutral[800],
                      border: (theme) => theme.palette.mode === 'light' 
                        ? `1px solid ${theme.palette.neutral[200]}` 
                        : `1px solid ${theme.palette.neutral[700]}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                        backgroundColor: (theme) => theme.palette.mode === 'light' 
                          ? theme.palette.neutral[50] 
                          : theme.palette.neutral[700],
                      }
                    }}
                    onClick={() => handleProviderClick(provider)}
                  >
                    {logoPath ? (
                      <CardMedia
                        component="img"
                        height="140"
                        image={logoPath}
                        alt={provider.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        sx={{
                          objectFit: 'contain',
                          p: 2
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 2,
                          backgroundColor: 'action.hover'
                        }}
                      >
                        <Typography variant="h6" color="text.secondary">
                          {provider.name}
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          textAlign: 'center'
                        }}
                      >
                        {provider.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 1 }}>
                        <Rating 
                          name="provider-rating"
                          value={provider.rating || 0}
                          precision={0.5}
                          size="small"
                          readOnly 
                          sx={{ 
                            '& .MuiRating-iconFilled': {
                              color: 'primary.main'
                            }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({Math.floor(Math.random() * 100) + 1} reviews)
                        </Typography>
                      </Box>
                      {provider.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            textAlign: 'center',
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {provider.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Stack>

      <ProviderInfoDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        provider={selectedProvider}
        providers={providers}
      />
    </>
  );
};
