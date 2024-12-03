import { memo } from "react";
import { Outlet } from "react-router-dom";

import NavHeader from "../../components/NavHeader/NavHeader";
import Sidebar from "../../components/SideBar/SideBar";

function SideBarLayoutInner() {
  return (
    <div className="bg-background ">
      <NavHeader />
      <div className="flex my-2 flex-grow">
      <Sidebar />
      {/* <Header /> */}
      {/* {children} */}
      <Outlet/>
      </div>
    </div>
  );
}

const SideBarLayout = memo(SideBarLayoutInner);

export default SideBarLayout;
