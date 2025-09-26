import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Stack from "@mui/material/Stack";
import { useCallback } from "react";
import Rating from '@mui/material/Rating';
import Badge from '@mui/material/Badge';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { useSettings } from "src/hooks/use-settings";
import { getAssetPath } from 'src/utils/asset-path';

const NAME_TO_LOGO_LIGHT = {
  payretailers:   getAssetPath("/assets/icons/payment/payretailers.png"),
  pay_pros: getAssetPath("/assets/icons/payment/pay-pros.png"),
  awesomepayments: getAssetPath("/assets/icons/payment/awp.png"),
  fintech_pay: getAssetPath("/assets/icons/payment/fintech-pay.webp"),
  gateway_pay: getAssetPath("/assets/icons/payment/gateway-pay.jpeg"),
  paycashio: getAssetPath("/assets/icons/payment/paycashio-pay.png"),
  sky_chain: getAssetPath("/assets/icons/payment/skychain-pay.jpeg"),
  simple_psp: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  atlas24: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  interio: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
};

const NAME_TO_LOGO_DARK = {
  payretailers: getAssetPath("/assets/icons/payment/payretailers.png"),
  pay_pros: getAssetPath("/assets/icons/payment/pay-pros.png"),
  awesomepayments: getAssetPath("/assets/icons/payment/awp.png"),
  fintech_pay: getAssetPath("/assets/icons/payment/fintech-pay.webp"),
  gateway_pay: getAssetPath("/assets/icons/payment/gateway-pay.jpeg"),
  paycashio: getAssetPath("/assets/icons/payment/paycashio-pay.png"),
  sky_chain: getAssetPath("/assets/icons/payment/skychain-pay.jpeg"),
  simple_psp: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  atlas24: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
  interio: getAssetPath("/assets/icons/payment/visa-mastercard.png"),
};

export const PaymentProviderItem = ({ provider, pageInfo }) => {
  const settings = useSettings();
  const router = useRouter();
  
  const handleSettingsOpen = useCallback(
    () => {
      router.push(`${paths.dashboard.integration.paymentProviderSettings}/${provider?.id}?pageInfo=${pageInfo}`);
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
        src={settings?.paletteMode === "light" ? NAME_TO_LOGO_LIGHT[provider?.provider_type] : NAME_TO_LOGO_DARK[provider?.provider_type]}
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
        <Rating 
          name="half-rating"
          defaultValue={provider?.rating ?? 0}
          precision={0.5}
          size="small"
          readOnly 
          sx={{ 
            '& .MuiRating-iconFilled': {
              color: 'primary.main'
            }
          }}
        />
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

PaymentProviderItem.propTypes = {
  provider: PropTypes.object.isRequired,
};
