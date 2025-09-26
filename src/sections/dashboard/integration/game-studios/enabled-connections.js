import { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import Grid from "@mui/material/Unstable_Grid2";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';

import CallSystemSkeleton from "src/components/skeleton-call-system";
import NoProvider from 'src/components/integration/empty';
import { GameStudioProviderCreateDialog } from './create-provider-dialog';
import { GameStudioProviderItem } from "./game-studio-provider-item";
import { useInternalBrands } from 'src/hooks/custom/use-brand';

import { toast } from 'react-hot-toast';
import { integrationApi } from "src/api/integration";

const useGameStudioProviders = (internalBrandId) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetProfiles = async () => {
    if (!internalBrandId) {
      setProviders([]);
      setIsLoading(false);
      return;
    }

    setProviders([]);
    
    setIsLoading(true);
    try {
      const response = await integrationApi.getGameStudioProviders({ internal_brand_id: internalBrandId });
      setProviders(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch game studio providers:", error);
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetProfiles();
  }, [internalBrandId]);

  return {
    providers,
    isLoading,
    refetch: handleGetProfiles
  };
};

export const EnabledConnections = () => {
  const { internalBrandsList, isLoading: isBrandsLoading } = useInternalBrands();
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const { providers, isLoading, refetch } = useGameStudioProviders(selectedBrandId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!isBrandsLoading && internalBrandsList.length > 0 && !selectedBrandId) {
      setSelectedBrandId(internalBrandsList[0].value);
    }
  }, [isBrandsLoading, internalBrandsList, selectedBrandId]);

  const handleCreateGameStudioProvider = async (data) => {
    try {
      await integrationApi.createGameStudioProvider(data);
      toast.success('Game studio provider created successfully');
      setTimeout(() => {
        refetch();
      }, 1000);
    } catch (error) {
      console.error('Failed to create game studio provider:', error);
      toast.error('Failed to create game studio provider');
      throw error;
    }
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
              justifyContent="space-between"
              alignItems="center"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 2
              }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: {
                      xs: '1.5rem',
                      md: '2rem'
                    },
                    fontWeight: 600
                  }}
                >
                  Game Studio Providers
                </Typography>
              </Stack>
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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsCreateDialogOpen(true)}
                  disabled={!selectedBrandId}
                >
                  Create
                </Button>
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
            {isLoading
              ? [...new Array(4).keys()]?.map((item) => (
                  <CallSystemSkeleton key={item} />
                ))
              : providers?.map((provider) => (
                  <GameStudioProviderItem
                    pageInfo='game-studios'
                    key={provider.id}
                    provider={provider}
                  />
                ))
            }
          </Grid>
        </Container>
        {(!isLoading && !providers?.length) && <NoProvider isGameStudio />}
      </Stack>

      <GameStudioProviderCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateGameStudioProvider}
        internalBrandId={selectedBrandId}
      />
    </>
  );
};
