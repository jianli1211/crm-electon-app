import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { DataEntryCreate } from 'src/sections/dashboard/payment-audit/data-entry/create';
import { paths } from 'src/paths';
import { useAuth } from 'src/hooks/use-auth';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { getAssetPath } from 'src/utils/asset-path';

const Page = () => {
  usePageView();

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.acc?.acc_v_audit_data === false && !user?.affiliate) {
      router?.push(paths.notFound);
    }
  }, [user])

  return (
    <>
      <Seo title={`Create Data Entry`} />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexGrow: 1
        }}
      >
        <Grid
          container
          sx={{ flexGrow: 1 }}
        >
          <Grid
            xs={12}
            sm={4}
            sx={{
              backgroundImage: `url(${getAssetPath("/assets/people-talking.png")})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              display: {
                xs: 'none',
                md: 'block'
              }
            }}
          />
          <Grid
            xs={12}
            md={8}
            sx={{
              p: {
                xs: 4,
                sm: 6,
                md: 8
              }
            }}
          >
            <Stack
              maxWidth="sm"
              spacing={3}
            >
              <Typography variant="h4">
                Create Data Entry
              </Typography>
              <DataEntryCreate />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
