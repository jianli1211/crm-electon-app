import React from 'react';
import { useSelector } from "react-redux";

import { FilterMultiSelect } from "src/components/customize/filter-multi-select";
import { useAuth } from "src/hooks/use-auth";
import { useGetCustomerAgents } from "src/api-swr/customer";

export const FtdOwnerFilter = ({ updateFilters }) => {
  const filters = useSelector((state) => state.customers.customerFilters);

  const { user } = useAuth();
  const { agentList } = useGetCustomerAgents({ desk_ids: user?.desk_ids, per_page: 10000, non_account_ids: [], q : "*"});

  return (
    <FilterMultiSelect
      label="FTD Owner"
      withSearch
      placeholder="FTD Owner..."
      options={agentList ?? []}
      onChange={(val) => {
        updateFilters({ ftd_owner_ids: val });
      }}
      value={filters?.ftd_owner_ids}
      isExclude
      onChangeNon={(val) => {
        updateFilters({ non_ftd_owner_ids: val });
      }}
      valueNon={filters?.non_ftd_owner_ids}
    />
  )
}
