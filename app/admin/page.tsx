import React from "react";
import { getUsersTableData } from "./actions/getUsersTableData";
import AdminDashboard from "./components/AdminDashboard";
import { getAllPermission } from "./actions/getHexPermissions";
import { getAllWithdrawals } from "./actions/withdrawls/getAllWithdrawals";
import { getDashboardStats } from "./actions/withdrawls/getDashboardStats";

const Page = async () => {
  const result = await getDashboardStats();
  const users = await getUsersTableData();
  const hexPermissions = await getAllPermission();
  const withdrawals = await getAllWithdrawals();

  if (!result.success) {
    return (
      <div className="text-red-500">
        Failed to load dashboard: {result.error}
      </div>
    );
  }
  return (
    <AdminDashboard
      users={users ? users : []}
      hexPermissions={hexPermissions.data || []}
      withdrawals={withdrawals.data || []}
      dashboardStats={result.data}
    />
  );
};

export default Page;
