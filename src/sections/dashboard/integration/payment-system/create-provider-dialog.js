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
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';

import { integrationApi } from 'src/api/integration';
import toast from 'react-hot-toast';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  provider_type: yup.string().required('Provider type is required'),
  enabled: yup.boolean(),
  is_default: yup.boolean(),
  merchant_key: yup.string().when('provider_type', {
    is: 'interio',
    then: (schema) => schema.required('Merchant key is required for Interio'),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup.string().when('provider_type', {
    is: 'interio',
    then: (schema) => schema.required('Password is required for Interio'),
    otherwise: (schema) => schema.notRequired(),
  }),
  merchant_id: yup.string().when('provider_type', {
    is: (val) => val === 'paypros' || val === 'pay_pros',
    then: (schema) => schema.required('Merchant ID is required for PayPros'),
    otherwise: (schema) => schema.notRequired(),
  }),
  api_key: yup.string().when('provider_type', {
    is: (val) => val === 'paypros' || val === 'pay_pros',
    then: (schema) => schema.required('API key is required for PayPros'),
    otherwise: (schema) => schema.notRequired(),
  }),
  sign_key: yup.string().when('provider_type', {
    is: (val) => val === 'paypros' || val === 'pay_pros',
    then: (schema) => schema.required('Sign key is required for PayPros'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

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
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: 'primary.main',
        },
      }}
      onClick={() => onSelect(provider)}
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
                icon="mdi:credit-card" 
                width={24} 
                height={24} 
                style={{ color: '#1976d2' }}
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={600}>
                {provider.display_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {provider.provider_type}
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

export const PaymentProviderCreateDialog = ({ open, onClose, onSubmit, internalBrandId, preselectedProvider }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [providerTypes, setProviderTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedProviderType, setSelectedProviderType] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: preselectedProvider?.display_name || '',
      description: preselectedProvider?.description || '',
      provider_type: preselectedProvider?.provider_type || '',
      enabled: true,
      is_default: false,
      merchant_key: '',
      password: '',
      merchant_id: '',
      api_key: '',
      sign_key: '',
    },
  });

  const watchedProviderType = watch('provider_type');

  const fetchProviderTypes = useCallback(async () => {
    if (!internalBrandId) return;
    
    setIsLoadingTypes(true);
    try {
      const response = await integrationApi.getPaymentProviderTypes({ internal_brand_id: internalBrandId });
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
    } else {
      reset();
      setActiveStep(0);
      setSelectedProviderType(null);
    }
  }, [open, reset, fetchProviderTypes]);

  useEffect(() => {
    if (preselectedProvider && providerTypes.length > 0) {
      const matchingProvider = providerTypes.find(
        (provider) => provider.provider_type === preselectedProvider.provider_type
      );
      if (matchingProvider) {
        setSelectedProviderType(matchingProvider);
        setValue('provider_type', matchingProvider.provider_type);
        setActiveStep(1);
      }
    }
  }, [preselectedProvider, providerTypes, setValue]);

  const handleProviderTypeSelect = (provider) => {
    setSelectedProviderType(provider);
    setValue('provider_type', provider.provider_type);
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedProviderType) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = {
        name: data.name,
        description: data.description,
        provider_type: data.provider_type,
        enabled: data.enabled,
        is_default: data.is_default,
        internal_brand_id: internalBrandId
      };

      // Add credentials based on provider type
      if (data.provider_type?.toLowerCase() === 'interio') {
        formData.credentials = {
          merchant_key: data.merchant_key,
          password: data.password
        };
      } else if (data.provider_type?.toLowerCase() === 'paypros' || data.provider_type?.toLowerCase() === 'pay_pros') {
        formData.credentials = {
          merchant_id: data.merchant_id,
          api_key: data.api_key,
          sign_key: data.sign_key
        };
      }

      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create payment provider');
      throw error;
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
              {providerTypes.map((provider) => (
                <Grid item xs={12} md={6} key={provider.provider_type}>
                  <ProviderTypeCard
                    provider={provider}
                    isSelected={selectedProviderType?.provider_type === provider.provider_type}
                    onSelect={handleProviderTypeSelect}
                  />
                </Grid>
              ))}
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                    icon="mdi:credit-card" 
                    width={24} 
                    height={24} 
                    style={{ color: '#1976d2' }}
                  />
                  <Stack>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {selectedProviderType.display_name}
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


            {(watchedProviderType?.toLowerCase() === 'interio' || watchedProviderType?.toLowerCase() === 'paypros' || watchedProviderType?.toLowerCase() === 'pay_pros') && (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Credentials</Typography>
                
                <Stack spacing={2}>
                  {watchedProviderType?.toLowerCase() === 'interio' && (
                    <>
                      <Controller
                        name="merchant_key"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Merchant Key"
                            fullWidth
                            error={!!errors.merchant_key}
                            helperText={errors.merchant_key?.message}
                          />
                        )}
                      />

                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Password"
                            type="password"
                            fullWidth
                            error={!!errors.password}
                            helperText={errors.password?.message}
                          />
                        )}
                      />
                    </>
                  )}

                  {(watchedProviderType?.toLowerCase() === 'paypros' || watchedProviderType?.toLowerCase() === 'pay_pros') && (
                    <>
                      <Controller
                        name="merchant_id"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Merchant ID"
                            fullWidth
                            error={!!errors.merchant_id}
                            helperText={errors.merchant_id?.message}
                          />
                        )}
                      />

                      <Controller
                        name="api_key"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="API Key"
                            fullWidth
                            error={!!errors.api_key}
                            helperText={errors.api_key?.message}
                          />
                        )}
                      />

                      <Controller
                        name="sign_key"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Sign Key"
                            fullWidth
                            error={!!errors.sign_key}
                            helperText={errors.sign_key?.message}
                          />
                        )}
                      />
                    </>
                  )}
                </Stack>
              </Box>
            )}

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
          Create Payment Provider
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
