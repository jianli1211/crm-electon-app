import { useCallback, useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { format } from "date-fns";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import { Iconify } from "src/components/iconify";
import { usePopover } from "src/hooks/use-popover";
import { NotificationsPopover } from "./notifications-popover";
import { userApi } from "src/api/user";
import { paths } from "src/paths";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { SimpleTaskDrawer } from "src/sections/dashboard/todo/todo-detail-drawer";
import { useGetReminders } from "src/hooks/swr/use-settings";

export const NotificationsButton = () => {
  const popover = usePopover();
  const [lastNotification, setLastNotification] = useState();
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [player, setPlayer] = useState(null);

  const { notifications, mutate } = useGetReminders();

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const setReadNotification = useCallback(async (ids) => {
    try {
      await userApi.setReadNotification({ ids });

      mutate();
    } catch (error) {
      console.error("error: ", error);
    }
  }, []);

  const unread = useMemo(() => {
    const unreadCount = notifications?.filter(
      (item) => item?.seen == false
    )?.length;
    const lastId = notifications?.at(-1)?.id;
    // eslint-disable-next-line no-unused-vars
    const prevLastId = localStorage.getItem("last_notification_id");
    localStorage.setItem("last_notification_id", lastId);
    const notSeenNotification = notifications?.filter(
      (item) => item?.seen == false
    )?.[0];
    if (unreadCount) {
      setLastNotification(notSeenNotification);
      setIsOpen(true);
    } else {
      setLastNotification();
      setIsOpen(false);
    }
    return unreadCount;
  }, [notifications, player]);

  const handleCloseNotification = () => {
    setIsOpen(false);
    setReadNotification([lastNotification?.id]);
  };

  const renderContent = (notification) => {
    const createdAt = format(
      new Date(notification?.created_at),
      "MMM dd, h:mm a"
    );
    const maxLength = 120;
    const isLong = notification.message.length > maxLength;
    const truncatedMessage = isLong
      ? notification.message.slice(0, maxLength) + "..."
      : notification.message;
    return (
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            href={`${paths.dashboard.customers.index}/${notification?.client_id}`}
            underline="hover"
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              cursor: "pointer",
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {notification.client_name}
          </Link>
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              px: 1.2,
              py: 0.2,
              borderRadius: 1,
              bgcolor: "grey.900",
              color: "grey.100",
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: 0.2,
            }}
          >
            {createdAt}
          </Typography>
        </Stack>
        <Tooltip title={notification.message} placement="top-start" arrow disableInteractive={!isLong}>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: notification?.seen ? "text.disabled" : "text.secondary",
              fontSize: 15,
              lineHeight: 1.6,
              wordBreak: "break-word",
              cursor: isLong ? 'pointer' : 'default',
            }}
          >
            {truncatedMessage}
          </Typography>
        </Tooltip>
      </Box>
    );
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={popover.anchorRef}
          onClick={() => {
            popover.handleOpen();
            mutate();
          }}
          sx={{ "&:hover": { color: "primary.main" } }}
        >
          <Badge color="error" badgeContent={unread}>
            <Iconify icon="line-md:bell-loop" width={26} />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        notifications={notifications}
        unread={unread}
        onClose={popover.handleClose}
        setReadNotification={setReadNotification}
        open={popover.open}
        onOpenTask={(id) => {
          popover.handleClose();
          setTimeout(() => {
            setSelectedTaskId(id);
          }, 100);
        }}
      />
      {lastNotification ? (
        <Snackbar
          open={isOpen}
          onClose={handleCloseNotification}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{ top: "88vh" }}
        >
          <Alert severity="info" sx={{ p: 0, minWidth: 320, maxWidth: 480 }}>
            <AlertTitle sx={{ px: 2, pt: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>New notification</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {unread} unread
                </Typography>
              </Stack>
            </AlertTitle>
            <Stack
              sx={{
                alignItems: "flex-start",
                width: 1,
                px: 2,
                pb: 2,
                maxWidth: 440,
                wordBreak: "break-word",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: 1 }}
              >
                <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                  {renderContent(lastNotification)}
                </Box>
                <Stack direction="row" spacing={1}>
                  {unread > 1 && (
                    <Tooltip title="Mark all as read">
                      <IconButton
                        edge="end"
                        onClick={() => setReadNotification(notifications?.filter(item => item?.seen == false)?.map((item) => item?.id))}
                        size="small"
                        color="primary"
                      >
                        <SvgIcon>
                          <ChecklistIcon />
                        </SvgIcon>
                      </IconButton>
                    </Tooltip>
                  )}
                  {lastNotification?.seen ? null : (
                    <Tooltip title="Mark as read">
                      <IconButton
                        edge="end"
                        onClick={() => setReadNotification([lastNotification.id])}
                        size="small"
                        color="primary"
                      >
                        <Iconify icon="iconamoon:close" width={24} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Alert>
        </Snackbar>
      ) : null}

      {selectedTaskId && (
        <SimpleTaskDrawer
          open={!!selectedTaskId}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  );
};
