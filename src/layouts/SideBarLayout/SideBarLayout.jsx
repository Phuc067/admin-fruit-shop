import { memo } from "react";
import { Outlet } from "react-router-dom";

import NavHeader from "../../components/NavHeader/NavHeader";
import Sidebar from "../../components/SideBar/SideBar";

function SideBarLayoutInner() {
  return (
    <div className="bg-background ">
      <NavHeader />
      <div className="flex flex-grow mt-4">
        <div className="sticky top-0  self-start h-screen">
          <Sidebar />
        </div>
        
          <Outlet />
      </div>
    </div>
  );
}

const SideBarLayout = memo(SideBarLayoutInner);

export default SideBarLayout;
