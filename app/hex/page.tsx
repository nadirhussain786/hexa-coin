import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { HexDashboardComponent } from "./components/HexDashboardComponent";

const page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HexDashboardComponent />
    </Suspense>
  );
};

export default page;
