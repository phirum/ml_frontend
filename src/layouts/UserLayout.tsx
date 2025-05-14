import React from 'react';
import Navbar from '../components/Common/Navbar';
import Sidebar from '../components/Common/Sidebar';
import { Box, Toolbar } from '@mui/material';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Box component="main" sx={{ marginLeft: 30, padding: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </>
  );
};

export default UserLayout;
