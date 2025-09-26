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
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import { Iconify } from 'src/components/iconify';
import { integrationApi } from 'src/api/integration';

export const PaymentProviderSettings = ({ provider, handleProviderGet }) => {
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [providerDefault, setProviderDefault] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [providerName, setProviderName] = useState("");
  const [providerNameError, setProviderNameError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priority, setPriority] = useState(1);
  const [priorityError, setPriorityError] = useState("");
  const [testMode, setTestMode] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState("");
  const [sessionExpiryError, setSessionExpiryError] = useState("");
  
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
      setProviderName(provider?.name || "");
      setDescription(provider?.description || "");
      setPriority(provider?.priority || 1);
      setTestMode(provider?.settings?.test_mode || false);
      setSessionExpiry(provider?.settings?.session_expiry || "");
      
      setMerchantKey(provider?.credentials?.merchant_key || "");
      setPassword(provider?.credentials?.password || "");
      setMerchantId(provider?.credentials?.merchant_id || "");
      setApiKey(provider?.credentials?.api_key || "");
      setSignKey(provider?.credentials?.sign_key || "");
      
      setEnabled(true);
    }
  }, [provider]);

  const handleProviderNameChange = useCallback((e) => {
    setProviderName(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  const handlePriorityChange = useCallback((e) => {
    setPriority(e.target.value);
  }, []);

  const handleTestModeChange = useCallback((e) => {
    setTestMode(e.target.checked);
  }, []);

  const handleSessionExpiryChange = useCallback((e) => {
    setSessionExpiry(e.target.value);
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
    await integrationApi.updatePaymentProvider(provider?.id, data);
    toast.success("Payment provider successfully updated!");
    setTimeout(() => {
      handleProviderGet();
    }, 1000);
  }, []);

  const handleProviderEnableChange = useCallback(
    (name) => {
      const id = name;
      handleProviderUpdate({
        payment_provider: id,
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
      await integrationApi.updatePaymentProvider(provider?.id, { is_default: true });
      toast.success("Payment provider successfully set as default!");
      setTimeout(() => {
        handleProviderGet();
      }, 1000);
    },
    [provider, handleProviderGet]
  );

  const handleProviderNameSave = useCallback(async () => {
    if (!providerName.trim()) {
      setProviderNameError("Provider name is required");
      return;
    }
    setProviderNameError("");
    await handleProviderUpdate({ name: providerName });
  }, [providerName, handleProviderUpdate]);

  const handleDescriptionSave = useCallback(async () => {
    if (!description.trim()) {
      setDescriptionError("Description is required");
      return;
    }
    setDescriptionError("");
    await handleProviderUpdate({ description });
  }, [description, handleProviderUpdate]);

  const handlePrioritySave = useCallback(async () => {
    if (!priority || priority < 1 || priority > 3) {
      setPriorityError("Priority must be 1, 2, or 3");
      return;
    }
    setPriorityError("");
    await handleProviderUpdate({ priority });
  }, [priority, handleProviderUpdate]);

  const handleSettingsSave = useCallback(async () => {
    if (!sessionExpiry || isNaN(sessionExpiry) || sessionExpiry <= 0) {
      setSessionExpiryError("Session expiry must be a positive number");
      return;
    }
    setSessionExpiryError("");
    await handleProviderUpdate({ 
      settings: { 
        test_mode: testMode, 
        session_expiry: parseInt(sessionExpiry) 
      } 
    });
  }, [testMode, sessionExpiry, handleProviderUpdate]);

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
        <CardHeader title="Provider Name" />
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
                    name="provider_name"
                    onChange={handleProviderNameChange}
                    value={providerName}
                    placeholder="Provider Name"
                    error={!!providerNameError}
                  />
                  {providerNameError && (
                    <Typography color="error" variant="caption">
                      {providerNameError}
                    </Typography>
                  )}
                </Stack>
                <Button variant="contained" onClick={handleProviderNameSave}>
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Description" />
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
                  <TextField
                    fullWidth
                    name="description"
                    onChange={handleDescriptionChange}
                    value={description}
                    placeholder="Provider Description"
                    multiline
                    rows={3}
                    error={!!descriptionError}
                    helperText={descriptionError}
                  />
                </Stack>
                <Button variant="contained" onClick={handleDescriptionSave}>
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Priority" />
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
                  <FormControl fullWidth error={!!priorityError}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={priority}
                      label="Priority"
                      onChange={handlePriorityChange}
                    >
                      <MenuItem value={1}>1 - High Priority</MenuItem>
                      <MenuItem value={2}>2 - Medium Priority</MenuItem>
                      <MenuItem value={3}>3 - Low Priority</MenuItem>
                    </Select>
                  </FormControl>
                  {priorityError && (
                    <Typography color="error" variant="caption">
                      {priorityError}
                    </Typography>
                  )}
                </Stack>
                <Button variant="contained" onClick={handlePrioritySave}>
                  Save
                </Button>
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6">Test Mode:</Typography>
                  <Switch
                    checked={testMode}
                    onChange={handleTestModeChange}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="h6">Session Expiry (minutes):</Typography>
                  <OutlinedInput
                    fullWidth
                    name="session_expiry"
                    onChange={handleSessionExpiryChange}
                    value={sessionExpiry}
                    placeholder="Session expiry in minutes"
                    type="number"
                    error={!!sessionExpiryError}
                  />
                  {sessionExpiryError && (
                    <Typography color="error" variant="caption">
                      {sessionExpiryError}
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
