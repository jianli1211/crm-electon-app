import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import { useCallback, useEffect, useState } from "react";

import { Seo } from "src/components/seo";
import { useAuth } from "src/hooks/use-auth";
import { usePageView } from "src/hooks/use-page-view";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import { Logo } from "src/components/logos/logo";
import { useSettings } from "src/hooks/use-settings";
import { TwoFactorModal } from "./two-factor-modal";
import { getAPIUrl } from "src/config";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { companies, signIn, signOut } = useAuth();
  const settings = useSettings();

  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [companyWithOtp, setCompanyWithOtp] = useState(null);

  usePageView();

  const selectCompany = useCallback(async (company, account) => {
    if (company?.company?.otp_enabled || account?.otp_enabled) {
      setCompanyWithOtp(company?.company?.id);
      setOpenOtpModal(true);
    } else {
      await signIn(company);
    }

    let redirect = '#';
    const lastPage = localStorage.getItem("last_page");

    if (account?.affiliate) {
      if (account?.aff_acc_leads) {
        redirect = paths.dashboard.lead.status.index;
      } else if (account?.aff_acc_affiliates) {
        redirect = paths.dashboard.lead.affiliate.index;
      } else if (account?.aff_acc_brands) {
        redirect = paths.dashboard.lead.brands.index;
      } else if (account?.aff_acc_inject) {
        redirect = paths.dashboard.lead.injection.index;
      } else if (account?.aff_acc_offers) {
        redirect = paths.dashboard.lead.offers.index;
      } else {
        await signOut();
        router.push(paths.auth.jwt.login);
        return;
      }

      router.push(redirect);
      return;
    }

    if (account?.acc?.acc_v_overview === true || undefined) {
      redirect = paths.dashboard.index;
    } else if (account?.acc?.acc_v_client === true || undefined) {
      redirect = paths.dashboard.customers.index;
    } else if (account?.acc?.acc_v_agents === true || undefined) {
      redirect = paths.dashboard.agents;
    } else if (account?.acc?.acc_v_chat === true || undefined) {
      redirect = paths.dashboard.internalChat;
    } else if (account?.acc?.acc_v_lm_leads === true || undefined) {
      redirect = paths.dashboard.lead.status.index;
    } else if (account?.acc?.acc_v_lm_aff === true || undefined) {
      redirect = paths.dashboard.lead.affiliate.index;
    } else if (account?.acc?.acc_v_lm_brand === true || undefined) {
      redirect = paths.dashboard.lead.brands.index;
    } else if (account?.acc_v_lm_list === true || undefined) {
      redirect = paths.dashboard.lead.injection.index;
    } else if (account?.acc?.acc_v_lm_offer === true || undefined) {
      redirect = paths.dashboard.lead.offers.index;
    } else if (account?.acc?.acc_v_risk_management === true || undefined) {
      redirect = paths.dashboard.risk.positions;
    } else if (account?.acc?.acc_v_logs === true || undefined) {
      redirect = paths.dashboard.log;
    } else if (account?.acc?.acc_v_audit_merchant === true || undefined) {
      redirect = paths.dashboard.paymentAudit.merchant.index;
    } else if (account?.acc?.acc_v_audit_bank === true || undefined) {
      redirect = paths.dashboard.paymentAudit.bankProvider.index;
    } else if (account?.acc?.acc_v_audit_payment_type === true || undefined) {
      redirect = paths.dashboard.paymentAudit.paymentType.index;
    } else if (account?.acc?.acc_v_audit_tasks === true || undefined) {
      redirect = paths.dashboard.paymentAudit.validationRules.index;
    } else if (account?.acc?.acc_v_audit_data === true || undefined) {
      redirect = paths.dashboard.paymentAudit.dataEntry.index;
    } else if (account?.acc?.acc_v_article === true || undefined) {
      redirect = paths.dashboard.article.index;
    } else if (account?.acc?.acc_v_settings === true || undefined) {
      redirect = paths.dashboard.settings;
    } else if (account?.acc?.acc_v_reports === true || undefined) {
      redirect = paths.dashboard.reports;
    } else {
      redirect = paths.dashboard.index;
    }

    if (lastPage) redirect = lastPage;

    if (!company?.company?.otp_enabled && !account?.otp_enabled) {
      router.push(redirect);
    }
  }, []);

  useEffect(() => {
    if (companies === undefined) {
      toast.error("There is no company for this account!");
      setTimeout(() => {
        router.push(paths.auth.jwt.login);
      }, 1000);
    }
  }, [companies]);

  return (
    <>
      <Seo title="Company select" />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0 }} title="Select company" />
          <CardContent>
            <Table sx={{ minWidth: 300 }}>
              <TableBody>
                {companies?.map((company) => {
                  const { company: companyObj, account } = company;
                  return (
                    <TableRow
                      hover
                      key={companyObj.id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => selectCompany(company, account)}
                    >
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {companyObj.avatar ? (
                              <Box
                                sx={{
                                  alignItems: "center",
                                  backgroundColor: "neutral.50",
                                  backgroundImage: `url(${companyObj.avatar ? companyObj.avatar?.includes('http') ? companyObj.avatar : `${getAPIUrl()}/${companyObj.avatar}` : ""})`,
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                  borderRadius: 1,
                                  display: "flex",
                                  height: 80,
                                  width: 80,
                                  justifyContent: "center",
                                  overflow: "hidden",
                                }}
                              />
                            ) : (
                              <Stack
                                sx={{
                                  height: 80,
                                  width: 80,
                                }}
                                justifyContent="center"
                                alignItems="center"
                              >
                                <SvgIcon sx={{ height: 70, width: 70 }}>
                                  <Logo color={settings?.colorPreset} />
                                </SvgIcon>
                              </Stack>
                            )}
                            <div>
                              <Typography variant="subtitle2">
                                {companyObj.name}
                              </Typography>
                            </div>
                          </Stack>
                          {companyObj?.otp_enabled || account?.otp_enabled ? (
                            <Stack>
                              <Typography variant="h6" color="green">2FA</Typography>
                            </Stack>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TwoFactorModal
        companyId={companyWithOtp}
        open={openOtpModal}
        onClose={() => {
          setOpenOtpModal(false);
          setCompanyWithOtp(null);
        }}
      />
    </>
  );
};

export default Page;
