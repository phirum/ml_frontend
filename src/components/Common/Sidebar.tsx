import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Typography, Box
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LanIcon from '@mui/icons-material/Lan';
import GroupIcon from '@mui/icons-material/Group';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAuth } from '../../contexts/AuthContext';
import { Description } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const { user } = useAuth() as { user: { role: 'admin' | 'user' } | null };
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#444' }}>
          🔒 Analyst Panel
        </Typography>
      </Box>
      <List>
        {user.role === 'admin' && (
          <ListItemButton onClick={() => navigate('/admin')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Admin Dashboard" />
          </ListItemButton>
        )}
        {user.role === 'user' && (
          <>
          <ListItemButton onClick={() => navigate('/user')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="User Dashboard" />
          </ListItemButton>
          <Divider sx={{ my: 1 }} />

          <ListItemButton onClick={() => navigate('/scan/pdf')}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="PDF Scanner" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/scan/url')}>
            <ListItemIcon><LanguageIcon /></ListItemIcon>
            <ListItemText primary="URL Scanner" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/scan/qr')}>
            <ListItemIcon><QrCodeScannerIcon /></ListItemIcon>
            <ListItemText primary="QR/Invoice Scanner" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/scan/logs')}>
            <ListItemIcon><LanIcon /></ListItemIcon>
            <ListItemText primary="Network Logs" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/scan/history')}>
            <ListItemIcon><Description/></ListItemIcon>
            <ListItemText primary="Scan History" />
          </ListItemButton>

          </>
        )}

        

        {user.role === 'admin' && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={() => navigate('/admin/users')}>
              <ListItemIcon><GroupIcon /></ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate('/admin/retrain')}>
              <ListItemIcon><ReplayIcon /></ListItemIcon>
              <ListItemText primary="Model Retraining" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
