import { useEffect } from 'react';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  provider_type: yup.string().required('Provider type is required'),
  enabled: yup.boolean(),
  is_default: yup.boolean(),
});

const PROVIDERS_TO_TYPES = {
  twilio: 'twilio',
  coperato: 'coperato',
  voiso: 'voiso',
  "cyprus bpx": 'cypbx',
  squaretalk: 'squaretalk',
  commpeak: 'commpeak',
  mmdsmart: 'mmdsmart',
  "prime voip": 'prime_voip',
  voicespin: 'voicespin',
  "perfect money": 'perfect_money',
  nuvei: 'nuvei',
  didglobal: 'didglobal',
}

export const CreateProfileDialog = ({ open, onClose, onSubmit, providers = [], preselectedProvider = null }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      provider_type: '',
      enabled: true,
      is_default: false,
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    } else if (preselectedProvider) {
      const providerType = PROVIDERS_TO_TYPES[preselectedProvider.name?.toLowerCase()];
      reset({
        name: '',
        provider_type: providerType || '',
        enabled: true,
        is_default: false,
      });
    }
  }, [open, reset, preselectedProvider]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const providerLabel = "Provider Type";

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create Call System Profile</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
            />

            <Controller
              name="provider_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.provider_type}>
                  <Autocomplete
                    id="provider-type"
                    options={providers}
                    getOptionLabel={(option) => {
                      if(option.name === 'Cyprus BPX') {
                        return 'Cyprus P.B.X';
                      }
                      return option.name || '';
                    }}
                    value={providers.find(provider => PROVIDERS_TO_TYPES[provider.name?.toLowerCase()] === field.value) || null}
                    onChange={(_, newValue) => {
                      field.onChange(PROVIDERS_TO_TYPES[newValue?.name?.toLowerCase()] || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={providerLabel}
                        error={!!errors.provider_type}
                        helperText={errors.provider_type?.message}
                      />
                    )}
                  />
                </FormControl>
              )}
            />

            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Enabled"
                />
              )}
            />

            <Controller
              name="is_default"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Set as Default"
                />
              )}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button onClick={onClose}>Cancel</Button>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Create
              </LoadingButton>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 