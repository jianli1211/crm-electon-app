import { useCallback, useEffect, useState, useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useRouter } from "src/hooks/use-router";

import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { paths } from "src/paths";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { DeleteModal } from "src/components/customize/delete-modal";
import { Iconify } from 'src/components/iconify';
import { integrationApi } from 'src/api/integration';
import { GameProviderSettings } from "src/sections/dashboard/integration/game-studios/game-provider-settings";
import { getAssetPath } from 'src/utils/asset-path';

const NAME_TO_LOGO = {
  booming_games: getAssetPath("/assets/icons/gaming/booming_games.jpg"),
  evolution: getAssetPath("/assets/icons/gaming/evolution.png"),
  netent: getAssetPath("/assets/icons/gaming/netent.png"),
  pragmatic_play: getAssetPath("/assets/icons/gaming/pragmatic_play.png"),
};

const useGameProvider = (id) => {
  const isMounted = useMounted();
  const [provider, setProvider] = useState({});

  const handleProviderGet = useCallback(async () => {
    const response = await integrationApi.getGameStudioProvider(id);
    if (isMounted()) {
      setProvider(response?.data);
    }
  }, [isMounted]);

  useEffect(() => {
    handleProviderGet();
  }, [isMounted]);

  return { provider, handleProviderGet };
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const providerId = params?.providerId;
  const { provider, handleProviderGet } = useGameProvider(providerId);

  usePageView();

  const mainTabs = useMemo(() => {
    return [
      { label: "Details", value: "details" },
      { label: "Settings", value: "settings" },
      // { label: "Installation guide", value: "installation" },
      // { label: "Support Chat", value: "support_chat" },
      // { label: "Review", value: "review" },
    ];
  }, []);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleDeleteProfile = async () => {
    try {
      await integrationApi.deleteGameStudioProvider(providerId);
      toast.success("Game provider successfully deleted!");
      router.push(`${paths.dashboard.integration.index}?tab=game_studios`);
    } catch (error) {
      console.error("Error deleting game provider:", error);
      toast.error("Failed to delete game provider");
    }
  };

  return (
    <>
      <Seo title={`Integration: Game Provider`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 6 }}>
        <Container maxWidth="xl" sx={{ flexGrow: 1, height: 1 }}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.integration.index}?tab=game_studios`}
              sx={{
                alignItems: "center",
                display: "inline-flex",
              }}
              underline="hover"
            >
              <Iconify icon="octicon:arrow-left-16" width={24} sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Integrations</Typography>
            </Link>
          </div>
          <Stack spacing={3} sx={{ mb: 1, mt: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{ width: 64, height: 64 }}
                  src={NAME_TO_LOGO[provider?.provider_type]}
                  alt="provider logo"
                />
                <Typography variant="h4">{provider?.name}</Typography>
              </Stack>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Provider
              </Button>
            </Stack>
            <Box>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {mainTabs?.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>
              <Divider />
            </Box>
          </Stack>
          {currentTab === "details" && (
            <Stack spacing={4}>
              <Card>
                <CardHeader title="Provider Details" />
                <CardContent>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {provider?.description || "No specific details available for this provider."}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
          {currentTab === "settings" && provider?.provider_type !== "twilio" && (
            <GameProviderSettings
              provider={provider}
              handleProviderGet={handleProviderGet}
            />
          )}
          {/* {currentTab === "review" && <Review providerId={providerId} />} */}
          {/* {currentTab === "support_chat" && (
            <SupportChat pageInfo={pageInfo} providerId={providerId} />
          )} */}
        </Container>
      </Box>

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={handleDeleteProfile}
        title="Delete Provider"
        description={`Are you sure you want to delete the game provider "${provider?.name}"?`}
      />
    </>
  );
};

export default Page;
