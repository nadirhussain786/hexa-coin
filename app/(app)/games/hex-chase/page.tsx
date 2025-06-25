import React from "react";
import HexaChaseGame from "./components/HexaChaseGame";

const page = () => {
  return (
    <div className="flex justify-center flex-1 w-full max-w-[1800px] mx-auto relative z-10 overflow-hidden">
      <HexaChaseGame />
    </div>
  );
};

export default page;
