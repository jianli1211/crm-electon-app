import { useState, useEffect, useCallback } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useSettings } from "src/hooks/use-settings";
import { useInternalBrands } from 'src/hooks/custom/use-brand';
import { integrationApi } from "src/api/integration";
import { PaymentProviderInfoDialog } from './payment-provider-info-dialog';

const NAME_TO_LOGO_LIGHT = {
  payretailers: "/assets/icons/payment/payretailers.png",
  pay_pros: "/assets/icons/payment/pay-pros.png",
  awesomepayments: "/assets/icons/payment/awp.png",
  fintech_pay: "/assets/icons/payment/fintech-pay.webp",
  gateway_pay: "/assets/icons/payment/gateway-pay.jpeg",
  paycashio: "/assets/icons/payment/paycashio-pay.png",
  sky_chain: "/assets/icons/payment/skychain-pay.jpeg",
  simple_psp: "/assets/icons/payment/visa-mastercard.png",
  atlas24: "/assets/icons/payment/visa-mastercard.png",
  interio: "/assets/icons/payment/visa-mastercard.png",
};

const NAME_TO_LOGO_DARK = {
  payretailers: "/assets/icons/payment/payretailers.png",
  pay_pros: "/assets/icons/payment/pay-pros.png",
  awesomepayments: "/assets/icons/payment/awp.png",
  fintech_pay: "/assets/icons/payment/fintech-pay.webp",
  gateway_pay: "/assets/icons/payment/gateway-pay.jpeg",
  paycashio: "/assets/icons/payment/paycashio-pay.png",
  sky_chain: "/assets/icons/payment/skychain-pay.jpeg",
  simple_psp: "/assets/icons/payment/visa-mastercard.png",
  atlas24: "/assets/icons/payment/visa-mastercard.png",
  interio: "/assets/icons/payment/visa-mastercard.png",
};

export const AvailableOptions = () => {
  const settings = useSettings();
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentProviders, setPaymentProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentProviders = useCallback(async () => {
    if (!selectedBrandId) {
      setPaymentProviders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await integrationApi.getPaymentProviderTypes({ 
        internal_brand_id: selectedBrandId 
      });
      setPaymentProviders(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch payment providers:', error);
      setError('Failed to load payment providers');
      setPaymentProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    if (!isBrandsLoading && internalBrandsList.length > 0 && !selectedBrandId) {
      setSelectedBrandId(internalBrandsList[0].value);
    }
  }, [isBrandsLoading, internalBrandsList, selectedBrandId]);

  useEffect(() => {
    fetchPaymentProviders();
  }, [fetchPaymentProviders]);

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
          <Stack
            spacing={3}
            sx={{ mb: 4 }}
          >
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2
              }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Internal Brand</InputLabel>
                  <Select
                    value={selectedBrandId}
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    label="Internal Brand"
                    disabled={isBrandsLoading}
                  >
                    <MenuItem value="">
                      <em>Select Brand</em>
                    </MenuItem>
                    {internalBrandsList.map((brand) => (
                      <MenuItem key={brand.value} value={brand.value}>
                        {brand.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          
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
            {isLoading ? (
              <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <CircularProgress />
                  <Typography color="text.secondary">Loading payment providers...</Typography>
                </Stack>
              </Grid>
            ) : error ? (
              <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <Typography color="error">{error}</Typography>
                  <Button variant="outlined" onClick={fetchPaymentProviders}>
                    Retry
                  </Button>
                </Stack>
              </Grid>
            ) : paymentProviders?.length === 0 ? (
              <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography color="text.secondary">No payment providers available</Typography>
              </Grid>
            ) : (
              paymentProviders?.map((provider) => {
                const logoMap = settings?.paletteMode === 'light' ? NAME_TO_LOGO_LIGHT : NAME_TO_LOGO_DARK;
                const logoPath = logoMap[provider?.provider_type];

                return (
                  <Grid key={provider.provider_type} xs={12} sm={6} md={4} lg={3}>
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
                          alt={provider.display_name}
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
                            {provider.display_name}
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
                          {provider.display_name}
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
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        </Container>
      </Stack>

      <PaymentProviderInfoDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        provider={selectedProvider}
        internalBrandId={selectedBrandId}
      />
    </>
  );
};
