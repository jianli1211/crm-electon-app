import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export const UnauthorizedScreen = ({ onRetry }) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push(paths.auth.jwt.login);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'background.default',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            textAlign: 'center',
            p: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'error.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:shield-cross-bold"
                  width={40}
                  sx={{ color: 'error.main' }}
                />
              </Box>

              <Stack spacing={1}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  Session Expired
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary', maxWidth: 400 }}
                >
                  Your session has expired. Please log in again to continue using the application.
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ width: '100%', maxWidth: 400 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginRedirect}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Go to Login
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleRetry}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Retry
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

UnauthorizedScreen.propTypes = {
  onRetry: PropTypes.func,
};
