import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";

import { AvailableOptions } from "./available-options";
import { EnabledConnections } from "./enabled-connections";

const GAME_STUDIOS_TABS = [
  { label: "Available Options", value: "available_options" },
  { label: "Enabled Connections", value: "enabled_connections" },
];

export const GameStudiosTabs = () => {
  const [currentTab, setCurrentTab] = useState("available_options");

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const renderTabs = GAME_STUDIOS_TABS.map((tab) => (
    <Tab key={tab.value} label={tab.label} value={tab.value} />
  ));

  const renderTabContent = (
    <>
      {currentTab === "available_options" && <AvailableOptions />}
      {currentTab === "enabled_connections" && <EnabledConnections />}
    </>
  );

  return (
    <Box>
      <Box sx={{ mt: -1 }}>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {renderTabs}
        </Tabs>
        <Divider />
      </Box>
      <Box>
        {renderTabContent}
      </Box>
    </Box>
  );
};
