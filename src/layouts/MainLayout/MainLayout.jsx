import { memo } from "react";
import { Outlet } from "react-router-dom";

import NavHeader from "../../components/NavHeader/NavHeader";

function MainLayoutInner() {
  
  return (
    <div className="bg-background">
    <NavHeader/>
      {/* <Header /> */}
      {/* {children} */}
      <Outlet />
    </div>
  );
}

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
