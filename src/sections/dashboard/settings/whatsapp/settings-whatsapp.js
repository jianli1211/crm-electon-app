import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { SettingSidebar } from "./setting-sidebar";
import { MailContainer } from "../../mail/mail-container";
import { Scrollbar } from "src/components/scrollbar";
import { brandsApi } from "src/api/lead-management/brand";
import { Iconify } from "src/components/iconify";
import { WhatsAppSettingsForm } from "./whatsapp-settings-form";
import { WhatsAppTemplates } from "./whatsapp-templates";

const useSidebar = () => {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [open, setOpen] = useState(mdUp);

  const handleScreenResize = useCallback(() => {
    if (!mdUp) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mdUp]);

  useEffect(() => {
    handleScreenResize();
  }, [mdUp]);

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    handleToggle,
    handleClose,
    open,
  };
};

const useInternalBrands = () => {
  const [internalBrandsList, setInternalBrandsList] = useState([]);
  const [internalBrandsInfo, setInternalBrandsInfo] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getBrands = async () => {
    try {
      setIsLoading(true);
      const res = await brandsApi.getInternalBrands();
      const brandsInfo = res?.internal_brands?.map((brand) => ({
        label: brand?.company_name,
        value: brand?.id,
      }));
      setBrands(res?.internal_brands);
      setInternalBrandsList(brandsInfo);
      setInternalBrandsInfo(res?.internal_brands);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  return { brands, internalBrandsList, internalBrandsInfo, isLoading, getBrands };
};

export const SettingsWhatsApp = () => {
  const rootRef = useRef(null);
  const sidebar = useSidebar();
  const { internalBrandsList, brands, isLoading, getBrands } = useInternalBrands();
  const [currentMenu, setCurrentMenu] = useState("");
  const { control, setValue } = useForm();
  const brandId = useWatch({ control, name: "internal_brand_id" });

  const currentBrand = useMemo(() => {
    if (brands?.length > 0) {
      const current = brands?.find((brand) => brand.id == brandId);
      if (current) {
        return current;
      }
    } else {
      return undefined;
    }
  }, [brandId, brands]);

  useEffect(() => {
    if (brandId && currentMenu === "") {
      setCurrentMenu("whatsapp_settings");
    }
  }, [brandId, currentMenu]);

  useEffect(() => {
    if (!brandId && internalBrandsList?.length > 0) {
      setValue("internal_brand_id", internalBrandsList[0]?.value);
    }
  }, [brandId, internalBrandsList]);

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Box
            component="main"
            sx={{
              backgroundColor: "background.paper",
              flex: "1 1 auto",
              position: "relative",
            }}
          >
            <Box
              ref={rootRef}
              sx={{
                minHeight: 600,
                display: "flex",
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
              }}
            >
              <SettingSidebar
                container={rootRef.current}
                currentLabelId={"currentLabelId"}
                control={control}
                brands={internalBrandsList}
                currentMenu={currentMenu}
                setCurrentMenu={setCurrentMenu}
                onClose={sidebar.handleClose}
                open={sidebar.open}
              />
              <MailContainer open={sidebar.open}>
                <Scrollbar sx={{ height: 1 }}>
                  <Box>
                    <IconButton
                      sx={{ mb: 1, ml: 1 }}
                      onClick={sidebar.handleToggle}
                    >
                      <Iconify icon="lucide:menu" width={24} height={24} />
                    </IconButton>
                    <Divider />
                  </Box>
                  {brandId && currentMenu === "whatsapp_settings" ? (
                    <Stack p={3}>
                      <WhatsAppSettingsForm 
                        brandId={brandId} 
                        currentBrand={currentBrand} 
                        onGetBrand={getBrands}
                      />
                    </Stack>
                  ) : null}
                  {brandId && currentMenu === "whatsapp_templates" ? (
                    <Stack p={3}>
                      <WhatsAppTemplates brandId={brandId} />
                    </Stack>
                  ) : null}
                  {isLoading ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        minHeight: "600px",
                      }}
                    >
                      <CircularProgress
                        size={70}
                        sx={{ alignSelf: "center", justifySelf: "center" }}
                      />
                    </Box>
                  ) : brandId ? null : (
                    <Box
                      sx={{
                        pb: 2,
                        mt: 3,
                        minHeight: 500,
                        maxWidth: 1,
                        alignItems: "center",
                        display: "flex",
                        flexGrow: 1,
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/errors/error-404.png"
                        sx={{
                          height: "auto",
                          maxWidth: 120,
                        }}
                      />
                      <Typography
                        color="text.secondary"
                        sx={{ mt: 2 }}
                        variant="subtitle1"
                      >
                        Select a brand
                      </Typography>
                    </Box>
                  )}
                </Scrollbar>
              </MailContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};
