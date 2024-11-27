import { memo } from "react";
import { Outlet } from "react-router-dom";

import Footer from "src/components/Footer";
import NavHeader from "../../components/NavHeader/NavHeader";
import Sidebar from "../../components/SideBar/SideBar";

function MainLayoutInner() {
  return (
    <div className="bg-background ">
      <NavHeader />
      <div className="flex mt-2">
      <Sidebar />
      {/* <Header /> */}
      {/* {children} */}
      <Outlet />
      </div>
      <Footer />
    </div>
  );
}

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
