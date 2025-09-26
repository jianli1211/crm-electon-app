import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import { Logo } from "src/components/logos/logo";
import { useSettings } from "src/hooks/use-settings";
import { getAPIUrl } from "src/config";

export const TenantPopover = (props) => {
  const {
    anchorEl,
    onChange,
    onClose,
    open = false,
    tenants,
    ...other
  } = props;
  const settings = useSettings();
  const companyId = localStorage.getItem("company_id");

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      disableScrollLock
      transformOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ 
        sx: { 
          width: 262, 
          left: '8px !important',
          p: 0.5,
      }}}
      {...other}
    >
      {tenants.map((tenant, index) => (
        <MenuItem
          key={tenant?.company?.id}
          onClick={() => onChange?.(tenant)}
          selected={tenant?.company?.id == companyId}
          sx={{ borderRadius: 1, mt: index===0? 0: 0.5 }}
        >
          <Stack direction="row" alignItems="center" py={1} spacing={1}>
            {tenant?.company?.avatar ? (
              <Avatar
                src={tenant?.company?.avatar ?
                  tenant?.company?.avatar?.includes("http")
                    ? tenant?.company?.avatar
                    : `${getAPIUrl()}/${tenant?.company?.avatar}` : ""}
                sx={{ width: 25, height: 25 }} />
            ) : (
              <Logo color={settings?.colorPreset} />
            )}
            <Typography>{tenant?.company?.name}</Typography>
          </Stack>
        </MenuItem>
      ))}
    </Popover>
  );
};
