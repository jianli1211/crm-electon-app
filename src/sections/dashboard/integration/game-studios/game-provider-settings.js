import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Unstable_Grid2";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { Iconify } from 'src/components/iconify';
import { integrationApi } from 'src/api/integration';

export const GameProviderSettings = ({ provider, handleProviderGet }) => {
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [providerDefault, setProviderDefault] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [maxBetLimit, setMaxBetLimit] = useState(0);
  const [maxBetLimitError, setMaxBetLimitError] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(0);
  const [sessionTimeoutError, setSessionTimeoutError] = useState("");
  
  const [merchantKey, setMerchantKey] = useState("");
  const [merchantKeyError, setMerchantKeyError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [merchantIdError, setMerchantIdError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState("");
  const [signKey, setSignKey] = useState("");
  const [signKeyError, setSignKeyError] = useState("");

  useEffect(() => {
    handleProviderGet();
  }, []);

  useEffect(() => {
    if (provider) {
      setProviderEnabled(provider?.enabled);
      setProviderDefault(provider?.is_default);
      setMaxBetLimit(provider?.settings?.max_bet_limit || 0);
      setSessionTimeout(provider?.settings?.session_timeout || 0);
      
      setMerchantKey(provider?.credentials?.merchant_key || "");
      setPassword(provider?.credentials?.password || "");
      setMerchantId(provider?.credentials?.merchant_id || "");
      setApiKey(provider?.credentials?.api_key || "");
      setSignKey(provider?.credentials?.sign_key || "");
      
      setEnabled(true);
    }
  }, [provider]);

  const handleMaxBetLimitChange = useCallback((e) => {
    setMaxBetLimit(e.target.value);
  }, []);

  const handleSessionTimeoutChange = useCallback((e) => {
    setSessionTimeout(e.target.value);
  }, []);

  const handleMerchantKeyChange = useCallback((e) => {
    setMerchantKey(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleMerchantIdChange = useCallback((e) => {
    setMerchantId(e.target.value);
  }, []);

  const handleApiKeyChange = useCallback((e) => {
    setApiKey(e.target.value);
  }, []);

  const handleSignKeyChange = useCallback((e) => {
    setSignKey(e.target.value);
  }, []);
  
  const handleProviderUpdate = useCallback(async (data) => {
    await integrationApi.updateGameStudioProvider(provider?.id, data);
    toast.success("Payment provider successfully updated!");
    setTimeout(() => {
      handleProviderGet();
    }, 1000);
  }, []);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = name;
      handleProviderUpdate({
        gaming_provider: id,
        enabled: !providerEnabled,
        is_default: provider?.is_default ?? false,
      });
      setProviderEnabled(!providerEnabled);
    },
    [providerEnabled, handleProviderUpdate, provider]
  );

  const handleProviderDefaultChange = useCallback(
    async () => {
      setProviderDefault(true);
      await integrationApi.updateGameStudioProvider(provider?.id, { is_default: true });
      toast.success("Payment provider successfully set as default!");
      setTimeout(() => {
        handleProviderGet();
      }, 1000);
    },
    [provider, handleProviderGet]
  );


  const handleSettingsSave = useCallback(async () => {
    let hasError = false;

    if (!maxBetLimit || isNaN(maxBetLimit) || maxBetLimit <= 0) {
      setMaxBetLimitError("Max bet limit must be a positive number");
      hasError = true;
    } else {
      setMaxBetLimitError("");
    }

    if (!sessionTimeout || isNaN(sessionTimeout) || sessionTimeout <= 0) {
      setSessionTimeoutError("Session timeout must be a positive number");
      hasError = true;
    } else {
      setSessionTimeoutError("");
    }

    if (!hasError) {
      await handleProviderUpdate({ 
        enabled: providerEnabled,
        settings: { 
          max_bet_limit: parseInt(maxBetLimit), 
          session_timeout: parseInt(sessionTimeout) 
        } 
      });
    }
  }, [maxBetLimit, sessionTimeout, providerEnabled, handleProviderUpdate]);

  const handleCredentialsSave = useCallback(async () => {
    let hasError = false;
    const providerType = provider?.provider_type?.toLowerCase();

    if (providerType === 'interio') {
      if (!merchantKey.trim()) {
        setMerchantKeyError("Merchant key is required");
        hasError = true;
      } else {
        setMerchantKeyError("");
      }

      if (!password.trim()) {
        setPasswordError("Password is required");
        hasError = true;
      } else {
        setPasswordError("");
      }

      if (!hasError) {
        await handleProviderUpdate({ 
          credentials: { 
            merchant_key: merchantKey, 
            password: password 
          } 
        });
      }
    } else if (providerType === 'paypros' || providerType === 'pay_pros') {
      if (!merchantId.trim()) {
        setMerchantIdError("Merchant ID is required");
        hasError = true;
      } else {
        setMerchantIdError("");
      }

      if (!apiKey.trim()) {
        setApiKeyError("API key is required");
        hasError = true;
      } else {
        setApiKeyError("");
      }

      if (!signKey.trim()) {
        setSignKeyError("Sign key is required");
        hasError = true;
      } else {
        setSignKeyError("");
      }

      if (!hasError) {
        await handleProviderUpdate({ 
          credentials: { 
            merchant_id: merchantId, 
            api_key: apiKey, 
            sign_key: signKey 
          } 
        });
      }
    }
  }, [merchantKey, password, merchantId, apiKey, signKey, provider, handleProviderUpdate]);

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
                <Typography variant="h6">Payment provider enabled:</Typography>
                <Switch
                  disabled={!enabled}
                  checked={providerEnabled}
                  onChange={() => handleProviderEnableChange(provider?.provider_type)}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mt: 3 }}
              >
                <Typography variant="h6">Default payment provider:</Typography>
                {providerDefault ? (
                  <Chip label="Default" />
                ) : (
                  <Button
                    disabled={!enabled}
                    variant="contained"
                    onClick={() => handleProviderDefaultChange(provider?.id)}
                  >
                    Make default
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


      <Card>
        <CardHeader title="Settings" />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={12} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h6">Max Bet Limit:</Typography>
                  <OutlinedInput
                    fullWidth
                    name="max_bet_limit"
                    onChange={handleMaxBetLimitChange}
                    value={maxBetLimit}
                    placeholder="Maximum bet limit"
                    type="number"
                    error={!!maxBetLimitError}
                  />
                  {maxBetLimitError && (
                    <Typography color="error" variant="caption">
                      {maxBetLimitError}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="h6">Session Timeout (seconds):</Typography>
                  <OutlinedInput
                    fullWidth
                    name="session_timeout"
                    onChange={handleSessionTimeoutChange}
                    value={sessionTimeout}
                    placeholder="Session timeout in seconds"
                    type="number"
                    error={!!sessionTimeoutError}
                  />
                  {sessionTimeoutError && (
                    <Typography color="error" variant="caption">
                      {sessionTimeoutError}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" justifyContent="flex-end">
                  <Button variant="contained" onClick={handleSettingsSave}>
                    Save Settings
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {(provider?.provider_type?.toLowerCase() === 'interio' || provider?.provider_type?.toLowerCase() === 'paypros' || provider?.provider_type?.toLowerCase() === 'pay_pros') && (
        <Card>
          <CardHeader title="Credentials" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={12} sx={{ mt: 3 }}>
                <Stack spacing={3}>
                  {provider?.provider_type?.toLowerCase() === 'interio' && (
                    <>
                      <Stack spacing={1}>
                        <Typography variant="h6">Merchant Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="merchant_key"
                          onChange={handleMerchantKeyChange}
                          value={merchantKey}
                          placeholder="Enter merchant key"
                          error={!!merchantKeyError}
                        />
                        {merchantKeyError && (
                          <Typography color="error" variant="caption">
                            {merchantKeyError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">Password:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="password"
                          type="password"
                          onChange={handlePasswordChange}
                          value={password}
                          placeholder="Enter password"
                          error={!!passwordError}
                        />
                        {passwordError && (
                          <Typography color="error" variant="caption">
                            {passwordError}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}

                  {(provider?.provider_type?.toLowerCase() === 'paypros' || provider?.provider_type?.toLowerCase() === 'pay_pros') && (
                    <>
                      <Stack spacing={1}>
                        <Typography variant="h6">Merchant ID:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="merchant_id"
                          onChange={handleMerchantIdChange}
                          value={merchantId}
                          placeholder="Enter merchant ID"
                          error={!!merchantIdError}
                        />
                        {merchantIdError && (
                          <Typography color="error" variant="caption">
                            {merchantIdError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">API Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="api_key"
                          onChange={handleApiKeyChange}
                          value={apiKey}
                          placeholder="Enter API key"
                          error={!!apiKeyError}
                        />
                        {apiKeyError && (
                          <Typography color="error" variant="caption">
                            {apiKeyError}
                          </Typography>
                        )}
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="h6">Sign Key:</Typography>
                        <OutlinedInput
                          fullWidth
                          name="sign_key"
                          onChange={handleSignKeyChange}
                          value={signKey}
                          placeholder="Enter sign key"
                          error={!!signKeyError}
                        />
                        {signKeyError && (
                          <Typography color="error" variant="caption">
                            {signKeyError}
                          </Typography>
                        )}
                      </Stack>
                    </>
                  )}

                  <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" onClick={handleCredentialsSave}>
                      Save Credentials
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};
