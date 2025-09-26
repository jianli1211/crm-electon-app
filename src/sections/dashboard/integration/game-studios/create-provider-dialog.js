import { useState, useEffect, useCallback } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Chip,
  Autocomplete,
  InputAdornment,
  IconButton,
  Collapse
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';

import { integrationApi } from 'src/api/integration';

const createValidationSchema = (selectedProviderType) => {
  const baseSchema = {
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    provider_type: yup.string().required('Provider type is required'),
    enabled: yup.boolean(),
    is_default: yup.boolean(),
    supported_currencies: yup.array().min(1, 'At least one currency must be selected'),
    supported_languages: yup.array().min(1, 'At least one language must be selected'),
  };

  if (selectedProviderType?.required_credentials) {
    const credentialsSchema = {};
    selectedProviderType.required_credentials.forEach(credential => {
      if (credential === 'api_url') {
        credentialsSchema[credential] = yup.string().url('Must be a valid URL').required(`${credential.replace('_', ' ').toUpperCase()} is required`);
      } else {
        credentialsSchema[credential] = yup.string().required(`${credential.replace('_', ' ').toUpperCase()} is required`);
      }
    });
    baseSchema.credentials = yup.object(credentialsSchema);
  }

  return yup.object(baseSchema);
};

const ProviderTypeCard = ({ provider, isSelected, onSelect }) => {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        borderRadius: 2,
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        boxShadow: isSelected ? (theme) => theme.shadows[4] : (theme) => theme.shadows[1],
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: 'primary.main',
        },
      }}
      onClick={() => {
        onSelect(provider);
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: 'primary.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon 
                icon="cil:casino" 
                width={24} 
                height={24} 
                style={{ color: '#1976d2' }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={600}>
                {provider.display_name || provider.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.provider_type || provider.type}
              </Typography>
            </Stack>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
            {provider.description}
          </Typography>
          
          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Supported Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {provider.supported_features?.slice(0, 4).map((feature) => (
                <Chip
                  key={feature}
                  label={feature}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {provider.supported_features?.length > 4 && (
                <Chip
                  label={`+${provider.supported_features.length - 4} more`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const StepIcon = ({ active, completed, icon }) => {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: completed ? 'primary.main' : active ? 'primary.main' : 'grey.300',
        color: completed || active ? 'white' : 'grey.600',
        fontWeight: 600,
        fontSize: '0.875rem'
      }}
    >
      {icon}
    </Box>
  );
};

const LANGUAGE_NAMES = {
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'pl': 'Polish',
  'tr': 'Turkish',
  'cs': 'Czech',
};

export const GameStudioProviderCreateDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  preselectedProvider,
  internalBrandId
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [providerTypes, setProviderTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedProviderType, setSelectedProviderType] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);

  const getDefaultCredentials = (providerType) => {
    if (!providerType?.required_credentials) return {};
    const credentials = {};
    providerType.required_credentials.forEach(credential => {
      credentials[credential] = '';
    });
    return credentials;
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(createValidationSchema(selectedProviderType)),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: preselectedProvider?.name || '',
      description: preselectedProvider?.description || '',
      provider_type: preselectedProvider?.provider_type || '',
      enabled: true,
      is_default: false,
      credentials: getDefaultCredentials(selectedProviderType),
      supported_currencies: [],
      supported_languages: [],
    },
  });



  const fetchProviderTypes = useCallback(async () => {
    if (!internalBrandId) {
      setProviderTypes([]);
      setIsLoadingTypes(false);
      return;
    }

    setIsLoadingTypes(true);
    try {
      const response = await integrationApi.getGameStudioProviderTypes({ 
        internal_brand_id: internalBrandId 
      });
      setProviderTypes(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch provider types:', error);
      setProviderTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  }, [internalBrandId]);

  useEffect(() => {
    if (open) {
      fetchProviderTypes();
      setSelectedProviderType(null);
    } else {
      reset();
      setActiveStep(0);
      setSelectedProviderType(null);
      setShowCredentials(false);
    }
  }, [open, reset, fetchProviderTypes]);

  useEffect(() => {
    if (open && preselectedProvider) {
      const defaultValues = {
        name: preselectedProvider?.name || '',
        description: preselectedProvider?.description || '',
        provider_type: preselectedProvider?.type || '',
        enabled: true,
        is_default: false,
        credentials: {},
        supported_currencies: [],
        supported_languages: [],
      };
      reset(defaultValues);
    }
  }, [open, preselectedProvider, reset]);

  useEffect(() => {
    if (preselectedProvider && providerTypes.length > 0) {
      const matchingProvider = providerTypes.find(
        (provider) => provider.type === preselectedProvider.type
      );
      if (matchingProvider) {
        setSelectedProviderType(matchingProvider);
        setValue('provider_type', matchingProvider?.type);
        setValue('name', preselectedProvider.name || '');
        setValue('description', preselectedProvider.description || '');
        
        const newCredentials = getDefaultCredentials(matchingProvider);
        setValue('credentials', newCredentials);
        
        setActiveStep(1);
      }
    }
  }, [preselectedProvider, providerTypes, setValue]);

  const handleProviderTypeSelect = (provider) => {
    setSelectedProviderType(provider);
    setValue('provider_type', provider.type);
    
    const newCredentials = getDefaultCredentials(provider);
    setValue('credentials', newCredentials);
    
    if (provider.supported_currencies) {
      setValue('supported_currencies', []);
    }
    if (provider.supported_languages) {
      setValue('supported_languages', []);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedProviderType) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setActiveStep(0);
    } else if (activeStep === 2) {
      setActiveStep(1);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = {
        name: data.name,
        description: data.description,
        provider_type: data.provider_type,
        enabled: data.enabled,
        credentials: data.credentials,
        supported_currencies: data.supported_currencies,
        supported_languages: data.supported_languages.map(lang => lang.code),
        internal_brand_id: internalBrandId
      };

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const steps = [
    {
      label: 'Select Provider Type',
      content: (
        <Stack spacing={3}>
          {isLoadingTypes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Loading provider types...</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {providerTypes.map((provider) => {
                // More explicit comparison - check if the selected provider matches this provider
                let isSelected = false;
                if (selectedProviderType) {
                  if (selectedProviderType.type && provider.type) {
                    isSelected = selectedProviderType.type === provider.type;
                  } else if (selectedProviderType.id && provider.id) {
                    isSelected = selectedProviderType.id === provider.id;
                  }
                }
                
                return (
                  <Grid item xs={12} md={6} key={provider.type}>
                    <ProviderTypeCard
                      provider={provider}
                      isSelected={isSelected}
                      onSelect={handleProviderTypeSelect}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!selectedProviderType}
              endIcon={<Icon icon="mdi:arrow-right" />}
            >
              Next
            </Button>
          </Box>
        </Stack>
      ),
    },
    {
      label: 'Provider Details',
      content: (
        <Stack spacing={3}>
          {selectedProviderType && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Icon 
                  icon="cil:casino" 
                  width={24} 
                  height={24} 
                  style={{ color: '#1976d2' }}
                />
                <Stack>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {selectedProviderType.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedProviderType.description}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}

          <TextField
            {...register('name')}
            label="Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register('description')}
            label="Description"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              onClick={handleBack}
              startIcon={<Icon icon="mdi:arrow-left" />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<Icon icon="mdi:arrow-right" />}
            >
              Next
            </Button>
          </Box>
        </Stack>
      ),
    },
    {
      label: 'Configuration',
      content: (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3}>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Icon icon="mdi:key-variant" width={20} height={20} />
                <Typography variant="subtitle2" fontWeight={600}>
                  API Credentials
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowCredentials(!showCredentials)}
                  sx={{ ml: 'auto' }}
                >
                  <Icon icon={showCredentials ? 'mdi:chevron-up' : 'mdi:chevron-down'} width={20} height={20} />
                </IconButton>
              </Stack>
              
              <Collapse in={showCredentials}>
                <Stack spacing={2}>
                  {selectedProviderType?.required_credentials?.map((credential) => (
                    <TextField
                      key={credential}
                      {...register(`credentials.${credential}`)}
                      label={credential.replace('_', ' ').toUpperCase()}
                      fullWidth
                      type={credential.includes('key') || credential.includes('secret') || credential.includes('token') ? 'password' : 'text'}
                      error={!!errors.credentials?.[credential]}
                      helperText={errors.credentials?.[credential]?.message}
                      placeholder={
                        credential === 'api_url' 
                          ? 'https://api.example.com/' 
                          : `Enter ${credential.replace('_', ' ')}`
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon 
                              icon={
                                credential.includes('url') 
                                  ? 'mdi:link' 
                                  : credential.includes('key') || credential.includes('secret') || credential.includes('token')
                                  ? 'mdi:key'
                                  : 'mdi:form-textbox'
                              } 
                              width={20} 
                              height={20} 
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  ))}
                </Stack>
              </Collapse>
            </Box>

            <Controller
              name="supported_currencies"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={selectedProviderType?.supported_currencies || []}
                  value={field.value}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  disabled={!selectedProviderType}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supported Currencies"
                      error={!!errors.supported_currencies}
                      helperText={
                        !selectedProviderType 
                          ? 'Please select a provider type first'
                          : errors.supported_currencies?.message
                      }
                      placeholder={
                        !selectedProviderType 
                          ? 'Select a provider type first...'
                          : 'Select currencies...'
                      }
                    />
                  )}
                />
              )}
            />

            <Controller
              name="supported_languages"
              control={control}
              render={({ field }) => {
                const languageOptions = selectedProviderType?.supported_languages?.map(code => ({
                  code,
                  name: LANGUAGE_NAMES[code] || code.toUpperCase()
                })) || [];
                
                return (
                  <Autocomplete
                    multiple
                    options={languageOptions}
                    getOptionLabel={(option) => `${option.name} (${option.code})`}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    value={field.value}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    disabled={!selectedProviderType}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={`${option.name} (${option.code})`}
                          {...getTagProps({ index })}
                          key={option.code}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Supported Languages"
                        error={!!errors.supported_languages}
                        helperText={
                          !selectedProviderType 
                            ? 'Please select a provider type first'
                            : errors.supported_languages?.message
                        }
                        placeholder={
                          !selectedProviderType 
                            ? 'Select a provider type first...'
                            : 'Select languages...'
                        }
                      />
                    )}
                  />
                );
              }}
            />

            <Stack direction="row" spacing={3}>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Enabled"
                  />
                )}
              />

              <Controller
                name="is_default"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch {...field} checked={field.value} />}
                    label="Set as Default"
                  />
                )}
              />
            </Stack>


            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button
                onClick={handleBack}
                startIcon={<Icon icon="mdi:arrow-left" />}
              >
                Back
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<Icon icon="mdi:check" />}
              >
                Create Provider
              </LoadingButton>
            </Box>
          </Stack>
        </form>
      ),
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: 600,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight={600}>
          Create Game Studio Provider
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            '& .MuiStepConnector-line': {
              borderLeftColor: 'divider',
              borderLeftWidth: 2,
              ml: .5,
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={(props) => <StepIcon {...props} icon={index + 1} />}>
                <Typography variant="overline" fontWeight={600}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent
                sx={{
                  borderLeftColor: 'divider',
                  borderLeftWidth: 2,
                  ml: '16px',
                  pl: 3,
                  py: 2,
                }}
              >
                {step.content}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};
