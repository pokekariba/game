import React from 'react';
import { Outlet } from 'react-router-dom';

const SideBar: React.FC = () => {
  return (
    <div>
      <p>Hello! I am the SideBar page</p>
      <Outlet/>
    </div>
  );
};

export default SideBar;
