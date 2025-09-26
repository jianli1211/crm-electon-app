import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Unstable_Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import LoadingButton from '@mui/lab/LoadingButton';
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { settingsApi } from "src/api/settings";
import { useMounted } from "src/hooks/use-mounted";
import { useDebounce } from "src/hooks/use-debounce";
import { SmsFrom } from "../sms-from";
import { getAPIUrl } from "src/config";
import { useAuth } from "src/hooks/use-auth";
import { useCompany } from "../../settings/platform/settings-platform";
import { Iconify } from 'src/components/iconify';

const NAME_TO_ID = {
  twilio: 1,
  coperato: 2,
  voiso: 3,
  "cypbx": 4,
  squaretalk: 5,
  commpeak: 6,
  mmdsmart: 7,
  "prime_voip": 8,
  voicespin: 9,
  didglobal: 10,
};

const useMembers = () => {
  const isMounted = useMounted();
  const [members, setMembers] = useState([]);

  const handleMembersGet = useCallback(async (q = "*") => {
    const members = await settingsApi.getMembers([], q, { per_page: 1000 });

    if (isMounted()) {
      setMembers(members?.accounts);
    }
  }, []);

  useEffect(() => {
    handleMembersGet();
  }, []);

  return {
    members,
    handleMembersGet,
  };
};

export const CallProviderSettings = ({ profile, handleProfileGet }) => {
  const { updateCompany } = useAuth();
  const { company, handleCompanyGet } = useCompany();
  const [isOTPLoading, setIsOTPLoading] = useState(false);
  const [isSMSLoading, setIsSMSLoading] = useState(false);
  const { members, handleMembersGet } = useMembers();
  const [serverUrl, setServerUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiCallToken, setApiCallToken] = useState("");
  const [senderId, setSenderId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [agents, setAgents] = useState([]);
  const [providerEnabled, setProviderEnabled] = useState(null);
  const [providerDefault, setProviderDefault] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("");
  const [smsFrom, setSmsFrom] = useState([]);
  const [crmId, setCrmId] = useState("");
  const [clientId, setClientId] = useState("");
  const [login, setLogin] = useState("");
  const [accountId, setAccountId] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileNameError, setProfileNameError] = useState("");
  const [apiCallTokenError, setApiCallTokenError] = useState("");
  const [crmIdError, setCrmIdError] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const query = useDebounce(search, 300);

  useEffect(() => {
    handleProfileGet();
  }, []);

  useEffect(() => {
    if (profile?.settings) {
      setEnabled(true);
    }
    if (profile?.name) {
      setProfileName(profile.name);
    }
    if (profile?.settings?.login) {
      setLogin(profile?.settings?.login);
    }
    if (profile?.settings?.account_id) {
      setAccountId(profile?.settings?.account_id);
    }
    if (profile?.settings?.api_key) {
      setApiKey(profile?.settings?.api_key);
    }
    if (profile?.settings?.access_token) {
      setAccessToken(profile?.settings?.access_token);
    }
    if (profile?.settings?.crm_id) {
      setCrmId(profile.settings.crm_id);
    }
    if (profile?.settings?.api_call_token) {
      setApiCallToken(profile?.settings?.api_call_token);
    }
    if (profile?.settings?.sender_id) {
      setSenderId(profile?.settings?.sender_id);
    }
    if (profile?.settings?.campaign_id) {
      setCampaignId(profile?.settings?.campaign_id);
    }
    if (profile?.settings?.client_id) {
      setClientId(profile?.settings?.client_id);
    }
    if (profile?.settings?.sms_from) {
      setSmsFrom(profile.settings.sms_from);
    }
    if (profile?.settings?.server_url)
      setServerUrl(profile.settings.server_url);
    if (profile) {
      setProviderDefault(profile?.is_default);
      setProviderEnabled(profile?.enabled);
    }
  }, [profile]);

  useEffect(() => {
    handleMembersGet(query);
  }, [query]);

  useEffect(() => {
    if (profile?.settings?.agent_ids) {
      setAgents(
        members?.map((member) => {
          const settingId = profile?.settings?.agent_ids[member?.id];

          return {
            id: member?.id,
            name: member?.first_name
              ? `${member?.first_name} ${member?.last_name}`
              : member?.email,
            avatar: member?.avatar,
            settingId: settingId ? settingId : "",
          };
        })
      );
    } else {
      setAgents(
        members.map((member) => ({
          id: member?.id,
          name: member?.first_name
            ? `${member?.first_name} ${member?.last_name}`
            : member?.email,
          avatar: member?.avatar,
          settingId: "",
        }))
      );
    }
  }, [members, profile]);

  useEffect(() => {
    if (profile?.provider_type === "commpeak" && providerEnabled) {
      setProfileNameError(!profileName ? "Profile name is required" : "");
      setApiCallTokenError(!apiCallToken ? "API Call Token is required" : "");
      setCrmIdError(!crmId ? "CRM ID is required" : "");
      setApiKeyError(!apiKey ? "SMS API Key is required" : "");
    } else {
      setProfileNameError("");
      setApiCallTokenError("");
      setCrmIdError("");
      setApiKeyError("");
    }
  }, [profile?.provider_type, providerEnabled, profileName, apiCallToken, crmId, apiKey]);

  const handleServerUrlChange = useCallback((event) => {
    const { value } = event?.target;
    setServerUrl(value);
  }, []);

  const handleApiKeyChange = useCallback((event) => {
    const { value } = event?.target;
    setApiKey(value);
  }, []);

  const handleCrmIdChange = useCallback((event) => {
    const { value } = event?.target;
    setCrmId(value);
  }, []);

  const handleClientIdChange = useCallback((event) => {
    const { value } = event?.target;
    setClientId(value);
  }, []);

  const handleApiCallTokenChange = useCallback((event) => {
    const { value } = event?.target;
    setApiCallToken(value);
  }, []);

  const handleSenderIdChange = useCallback((event) => {
    const { value } = event?.target;
    setSenderId(value);
  }, []);

  const handleCampaignIdChange = useCallback((event) => {
    const { value } = event?.target;
    setCampaignId(value);
  }, []);

  const handleLoginChange = useCallback((event) => {
    const { value } = event?.target;
    setLogin(value);
  }, []);

  const handleAccountIdChange = useCallback((event) => {
    const { value } = event?.target;
    setAccountId(value);
  }, []);

  const handleProfileNameChange = useCallback((event) => {
    const { value } = event?.target;
    setProfileName(value);
  }, []);

  const handleAccessTokenChange = useCallback((event) => {
    const { value } = event?.target;
    setAccessToken(value);
  }, []);

  const handleAgentIdChange = useCallback(
    (event, id) => {
      const { value } = event?.target;

      setAgents((prevState) => {
        const updatedState = prevState.map((agent) => {
          if (agent.id === id) {
            return {
              ...agent,
              settingId: value,
            };
          } else {
            return agent;
          }
        });
        return updatedState;
      });
    },
    [agents]
  );

  const handleSettingSave = useCallback(
    async (numbers = []) => {
      // const id = NAME_TO_ID[profile?.provider_type];
      const agentIds = agents.reduce((acc, { id, settingId }) => {
        acc[id] = settingId;
        return acc;
      }, {});

      const setting = {
        agent_ids: { ...profile?.settings?.agent_ids, ...agentIds },
      };

      if (profile?.provider_type !== "commpeak" && profile?.provider_type !== "mmdsmart") {
        setting.server_url = serverUrl;
      }

      if (profile?.provider_type === "mmdsmart" && login) {
        setting.login = login;
      }

      if (profile?.provider_type === "mmdsmart" && accountId) {
        setting.account_id = accountId;
      }

      if (profile?.provider_type === "squaretalk") {
        setting.sender_id = senderId ?? "";
        setting.campaign_id = campaignId ?? "";
      }

      if (profile?.provider_type === "commpeak") {
        setting.sender_id = senderId ?? "";
      }

      if (
        profile?.provider_type === "voiso" ||
        profile?.provider_type === "squaretalk" ||
        profile?.provider_type === "coperato" ||
        profile?.provider_type === "commpeak"
      ) {
        setting.api_key = apiKey;
      }

      if (numbers?.length > 0) {
        setting.sms_from = numbers;
      } else if (smsFrom) {
        setting.sms_from = smsFrom;
      }

      if (profile?.provider_type === "didglobal") {
        setting.access_token = accessToken;
      }

      if (profile?.provider_type === "commpeak" && crmId) {
        setting.crm_id = crmId;
      }

      if (profile?.provider_type === "commpeak" && clientId) {
        setting.client_id = clientId;
      }

      if ((profile?.provider_type === "commpeak" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "didglobal") && apiCallToken) {
        setting.api_call_token = apiCallToken;
      }

      await settingsApi.updateCallProfile(profile?.id, {
        provider_type: profile?.provider_type,
        is_default: profile?.is_default === null ? false : profile?.is_default,
        settings: JSON.stringify(setting),
        name: profileName
      });
      setEnabled(true);
      handleProfileGet();
      toast("Call profile settings saved!");
    },
    [
      agents,
      profile,
      serverUrl,
      accountId,
      apiKey,
      handleProfileGet,
      crmId,
      clientId,
      apiCallToken,
      login,
      senderId,
      campaignId,
      smsFrom,
      profileName,
      accessToken,
    ]
  );

  const handleProviderUpdate = useCallback(async (data) => {
    try {
      await settingsApi.updateCallProfile(profile?.id, data);
      toast.success("Call profile successfully updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = NAME_TO_ID[name];
      handleProviderUpdate({
        call_system: id,
        enabled: !providerEnabled,
        is_default: profile?.is_default ?? false,
      });
      setProviderEnabled(!providerEnabled);
    },
    [providerEnabled, handleProviderUpdate, profile]
  );

  const handleProviderDefaultChange = useCallback(
    async () => {
      setProviderDefault(true);
      await settingsApi.updateCallProfile(profile?.id, { is_default: true });
      toast.success("Call profile successfully set as default!");
      setTimeout(() => {
        handleProfileGet();
      }, 1000);
    },
    [profile, handleProfileGet]
  );

  const hanldeEnableOTPSms = async () => {
    setIsOTPLoading(true);
    try {
      if(profile?.provider_type === "commpeak" || profile?.provider_type === "coperato") {
        await settingsApi.updateCompany({ id: company?.id, data: { verification_message: profile?.provider_type === "coperato"? 1 : 2 } });
        toast.success('OTP SMS successfully enabled!');
        updateCompany({...company, verification_message: profile?.provider_type === "coperato"? 1 : 2 });
      }
    } catch (error) {
      console.error('error: ', error);
    }
    setIsOTPLoading(false);
  };

  const hanldeEnableSmsMessage = async () => {
    setIsSMSLoading(true);
    try {
      if (profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "squaretalk") {
        await settingsApi.updateCompany({ id: company?.id, data: { sms_provider : profile?.id} });
        toast.success('SMS message successfully enabled!');
        updateCompany({...company, sms_provider : profile?.id });
        setTimeout(() => {
          handleCompanyGet();
        }, 1000);
      }
    } catch (error) {
      console.error('error: ', error);
    }
    setIsSMSLoading(false);
  };

  return (
    <Stack spacing={4} mb={2}>
      <Card>
        <CardHeader
          title="General"
          action={
            !enabled && (
              <Tooltip title="You have to update setting first!">
                <Iconify icon="mdi:error-outline" width={24} color="error.main" />
              </Tooltip>
            )
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Call profile enabled:</Typography>
                <Switch
                  disabled={!enabled}
                  checked={providerEnabled}
                  onChange={() => handleProviderEnableChange(profile?.provider_type)}
                />
              </Stack>

              {profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" || profile?.provider_type === "mmdsmart" ||  profile?.provider_type === "squaretalk" ?
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 3 }}
                >
                  <Typography variant="h6">Use this provider for sending SMS messages to clients:</Typography>
                  {company?.sms_provider == profile?.id ? (
                    <Chip label="Enabled" />
                  ) : (
                    <LoadingButton
                      loading={isSMSLoading}
                      variant="contained"
                      onClick={() => hanldeEnableSmsMessage()}
                    >
                      Enable
                    </LoadingButton>
                  )}
                </Stack>
              : null}

              {profile?.provider_type === "commpeak" || profile?.provider_type === "coperato" ?
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 3 }}
                >
                  <Typography variant="h6">Use this call provider to send OTP SMS messages to users for secure verification:</Typography>
                  {(profile?.provider_type === "coperato" && company?.verification_message == 1) || (profile?.provider_type === "commpeak" && company?.verification_message == 2) ? (
                    <Chip label="Enabled" />
                  ) : (
                    <LoadingButton
                      loading={isOTPLoading}
                      variant="contained"
                      onClick={() => hanldeEnableOTPSms()}
                    >
                      Enable
                    </LoadingButton>
                  )}
                </Stack>
              : null}

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Default call profile:</Typography>
                {providerDefault ? (
                  <Chip label="Default" />
                ) : (
                  <Button
                    disabled={!enabled}
                    variant="contained"
                    onClick={() => handleProviderDefaultChange(profile?.id)}
                  >
                    Make default
                  </Button>
                )}
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Your server IP address:</Typography>
                <Chip variant="soft" label={company?.server_ip ?? "n/a"} />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Profile Name" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack
                spacing={3}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <OutlinedInput
                    fullWidth
                    name="profile_name"
                    onChange={handleProfileNameChange}
                    value={profileName}
                    placeholder="Profile Name"
                    error={!!profileNameError}
                  />
                  {profileNameError && (
                    <Typography color="error" variant="caption">
                      {profileNameError}
                    </Typography>
                  )}
                </Stack>
                <Button onClick={handleSettingSave} variant="contained">
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {profile?.provider_type === "mmdsmart" ? (
        <Card>
          <CardHeader title="Login" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="login"
                    onChange={handleLoginChange}
                    value={login}
                    placeholder="Login"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "mmdsmart" ? (
        <Card>
          <CardHeader title="Company Account ID" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="accountId"
                    onChange={handleAccountIdChange}
                    value={accountId}
                    placeholder="Account ID"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type !== "commpeak" && profile?.provider_type !== "mmdsmart" ? (
        <Card>
          <CardHeader title="Server url" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="server_url"
                    onChange={handleServerUrlChange}
                    value={serverUrl}
                    placeholder="Server url"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "commpeak" || profile?.provider_type === "mmdsmart" || profile?.provider_type === "didglobal" ? (
        <Card>
          <CardHeader title="API Call Token" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <OutlinedInput
                      fullWidth
                      name="api_call_token"
                      value={apiCallToken}
                      onChange={handleApiCallTokenChange}
                      placeholder="API Call Token"
                      error={!!apiCallTokenError}
                    />
                    {apiCallTokenError && (
                      <Typography color="error" variant="caption">
                        {apiCallTokenError}
                      </Typography>
                    )}
                  </Stack>
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "commpeak" ? (
        <Card>
          <CardHeader title="CRM ID" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <OutlinedInput
                      fullWidth
                      name="crm_id"
                      value={crmId}
                      onChange={handleCrmIdChange}
                      placeholder="CRM ID"
                      error={!!crmIdError}
                    />
                    {crmIdError && (
                      <Typography color="error" variant="caption">
                        {crmIdError}
                      </Typography>
                    )}
                  </Stack>
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "voiso" ||
        profile?.provider_type === "squaretalk" ||
        profile?.provider_type === "coperato" ||
        profile?.provider_type === "commpeak" ? (
        <Card>
          <CardHeader
            title={profile?.provider_type === "voiso" || profile?.provider_type === "squaretalk" ? "API key" : "SMS API key"}
            avatar={
              !enabled && (
                <Tooltip title="You have to update setting first!">
                  <Iconify icon="mdi:error-outline" width={24} color="error.main" />
                </Tooltip>
              )
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack spacing={1} sx={{ width: '100%' }}>
                    <OutlinedInput
                      disabled={!enabled}
                      fullWidth
                      name="api_key"
                      onChange={handleApiKeyChange}
                      value={apiKey}
                      placeholder={profile?.provider_type === "voiso" || profile?.provider_type === "squaretalk" ? "API key" : "SMS API key"}
                      error={!!apiKeyError}
                    />
                    {apiKeyError && (
                      <Typography color="error" variant="caption">
                        {apiKeyError}
                      </Typography>
                    )}
                  </Stack>
                  <Button
                    disabled={!enabled}
                    onClick={handleSettingSave}
                    variant="contained"
                  >
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}


      {profile?.provider_type === "squaretalk" || profile?.provider_type === "commpeak" ? (
        <Card>
          <CardHeader title="Sender Id" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="api_call_token"
                    value={senderId}
                    onChange={handleSenderIdChange}
                    placeholder="Sender Id"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "didglobal" ? (
        <Card>
          <CardHeader title="Access Token" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="access_token"
                    value={accessToken}
                    onChange={handleAccessTokenChange}
                    placeholder="Access Token"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "squaretalk" ? (
        <Card>
          <CardHeader title="Campaign Id" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="api_call_token"
                    value={campaignId}
                    onChange={handleCampaignIdChange}
                    placeholder="Campaign Id"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "commpeak" ? (
        <Card>
          <CardHeader title="Client ID" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack
                  spacing={3}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <OutlinedInput
                    fullWidth
                    name="client_id"
                    onChange={handleClientIdChange}
                    value={clientId}
                    placeholder="Client ID"
                  />
                  <Button onClick={handleSettingSave} variant="contained">
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : null}

      {profile?.provider_type === "coperato" ? (
        <SmsFrom
          smsFrom={smsFrom}
          onSave={(data) => {
            setSmsFrom(data);
            handleSettingSave(data);
          }}
        />
      ) : null}

      <Card>
        <CardHeader title="Assign setting ID to agents" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="lucide:search" color="text.secondary" width={24} />
                    </InputAdornment>
                  ),
                }}
                label="Search"
                onChange={(e) => setSearch(e?.target?.value)}
                placeholder="Search members..."
                value={search}
              />
              <Stack spacing={3} direction="column" sx={{ mt: 5 }}>
                {agents?.map((agent) => (
                  <Stack
                    key={agent.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ 
                      px: { xs: 1, sm: 5 },
                      py: { xs: 2, sm: 1 }
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 2, sm: 0 } }}>
                      <Avatar
                        src={agent?.avatar ? agent?.avatar?.includes('http') ? agent?.avatar : `${getAPIUrl()}/${agent?.avatar}` : ""}
                        alt="agent avatar" />
                      <Typography noWrap sx={{ maxWidth: { xs: '180px', sm: '250px' } }}>{agent?.name}</Typography>
                    </Stack>

                    {/* Mobile layout - Save button above input */}
                    {(agent?.settingId && (!profile?.settings?.agent_ids || agent?.settingId !== profile?.settings?.agent_ids[agent?.id])) && (
                      <Button 
                        variant="outlined" 
                        onClick={handleSettingSave}
                        size="small"
                        sx={{ 
                          display: { xs: 'flex', sm: 'none' },
                          mb: 1,
                          alignSelf: 'flex-start'
                        }}
                      >
                        Save
                      </Button>
                    )}

                    <Stack 
                      direction="row"
                      alignItems="center" 
                      spacing={1}
                      sx={{ 
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      {/* Desktop layout - Save button to the left of input */}
                      {(agent?.settingId && (!profile?.settings?.agent_ids || agent?.settingId !== profile?.settings?.agent_ids[agent?.id])) && (
                        <Button 
                          variant="outlined" 
                          onClick={handleSettingSave}
                          size="small"
                          sx={{ 
                            display: { xs: 'none', sm: 'flex' },
                            height: '40px',
                            my: 0
                          }}
                        >
                          Save
                        </Button>
                      )}
                      <OutlinedInput
                        sx={{ 
                          width: { xs: '100%', sm: '250px' },
                          my: 0
                        }}
                        value={agent?.settingId}
                        placeholder="Call profile user id..."
                        onChange={(event) =>
                          handleAgentIdChange(event, agent?.id)
                        }
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>

        <Typography variant="body1" sx={{ pl: 3, pb: 3 }}>
          Note: Put id's for agents from your call profile to let call system
          work.
        </Typography>
      </Card>
    </Stack>
  );
};
