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

import { CallProviderSettings } from "src/sections/dashboard/integration/call-system-setting/call-provider-settings";
import { Review } from "src/sections/dashboard/integration/review/review";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { SupportChat } from "src/sections/dashboard/integration/support-chat";
import { TwilioSettings } from "src/sections/dashboard/integration/call-system-setting/twilio-settings";
import { paths } from "src/paths";
import { settingsApi } from "src/api/settings";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { useSearchParams } from "src/hooks/use-search-params";
import { DeleteModal } from "src/components/customize/delete-modal";
import { Iconify } from 'src/components/iconify';

const NAME_TO_LOGO = {
  "cypbx": "/assets/call-system/call-pbx.png",
  coperato: "/assets/call-system/call-coperato.png",
  nuvei: "/assets/call-system/call-nuvei.png",
  perfectMoney: "/assets/call-system/call-perfect-money.png",
  twilio: "/assets/call-system/call-twilio.png",
  voiso: "/assets/call-system/call-voiso.png",
  squaretalk: "/assets/call-system/call-squaretalk.png",
  commpeak: "/assets/call-system/call-commpeak.png",
  mmdsmart: "/assets/call-system/call-mmdsmart.svg",
  "prime_voip": "/assets/call-system/call-prime.png",
  voicespin: "/assets/call-system/call-voicespin.svg",
  didglobal: "/assets/call-system/call-didglobal.jpg",
};

const PROVIDER_DETAILS = {
  coperato: "Coperato is a VoIP provider that supports direct calling, click-to-call functionality, and real-time communication between agents and clients.",
  commpeak: "Commpeak is a VoIP communication provider that facilitates call operations, allowing teams to initiate and manage calls through an integrated interface.",
  cypbx: "Cyprus P.B.X offers VoIP services for managing and routing client calls across different departments and regions.",
  didglobal: "DID Global provides VoIP solutions using virtual phone numbers (DIDs), enabling international communication and efficient call management.",
  mmdsmart: "MMD Smart delivers global voice and messaging services, supporting both inbound and outbound call traffic through its VoIP infrastructure.",
  prime_voip: "Primecall is a telecommunications provider tailored for high-volume call centers and global outreach, enabling seamless and stable voice connectivity.",
  squaretalk: "Squaretalk is a cloud-based communication platform that offers VoIP capabilities with features such as smart routing, automation, and analytics.",
  twilio: "Twilio is a cloud communications platform that supports voice, messaging, and other channels for business communication needs.",
  voicespin: "VoiceSpin offers VoIP and communication services for sales and support operations, helping teams manage and monitor calls effectively.",
  voiso: "Voiso is a cloud VoIP solution with global calling support and smart routing features designed to streamline communication processes.",
};

const useCallProfile = (id) => {
  const isMounted = useMounted();
  const [profile, setProfile] = useState({});

  const handleProfileGet = useCallback(async () => {
    const response = await settingsApi.getCallProfile(id);
    if (isMounted()) {
      setProfile(response?.provider_profile);
    }
  }, [isMounted]);

  useEffect(() => {
    handleProfileGet();
  }, [isMounted]);

  return { profile, handleProfileGet };
};

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const providerId = params?.providerId;
  const { profile, handleProfileGet } = useCallProfile(providerId);
  const searchParams = useSearchParams();
  const pageInfo = searchParams.get("pageInfo");

  usePageView();

  const mainTabs = useMemo(() => {
    if (pageInfo === "call-system") {
      return [
        { label: "Details", value: "details" },
        { label: "Settings", value: "settings" },
        { label: "Installation guide", value: "installation" },
        { label: "Support Chat", value: "support_chat" },
        { label: "Review", value: "review" },
      ];
    } else {
      return [
        { label: "Details", value: "details" },
        { label: "Support Chat", value: "support_chat" },
        { label: "Review", value: "review" },
      ];
    }
  }, [pageInfo]);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleDeleteProfile = async () => {
    try {
      await settingsApi.deleteCallProfile(providerId);
      toast.success("Profile successfully deleted!");
      router.push(`${paths.dashboard.integration.index}?tab=call_system`);
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete profile");
    }
  };

  return (
    <>
      <Seo title={`Settings: Call Profile`} />
      <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 6 }}>
        <Container maxWidth="xl" sx={{ flexGrow: 1, height: 1 }}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={`${paths.dashboard.integration.index}`}
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
                  src={NAME_TO_LOGO[profile?.provider_type]}
                  alt="provider logo"
                />
                <Typography variant="h4">{profile?.name}</Typography>
              </Stack>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Profile
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
                    {PROVIDER_DETAILS[profile?.provider_type] || "No specific details available for this provider."}
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          )}
          {currentTab === "settings" && profile?.provider_type !== "twilio" && (
            <CallProviderSettings
              profile={profile}
              handleProfileGet={handleProfileGet}
            />
          )}
          {currentTab === "settings" && profile?.provider_type === "twilio" && (
            <TwilioSettings
              profile={profile}
              handleProfileGet={handleProfileGet}
            />
          )}
          {currentTab === "review" && <Review providerId={providerId} />}
          {currentTab === "support_chat" && (
            <SupportChat pageInfo={pageInfo} providerId={providerId} />
          )}
        </Container>
      </Box>

      <DeleteModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        onDelete={handleDeleteProfile}
        title="Delete Profile"
        description={`Are you sure you want to delete the profile "${profile?.name}"?`}
      />
    </>
  );
};

export default Page;
