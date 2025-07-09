import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  color: active ? '#2196F3' : 'rgba(255, 255, 255, 0.8)',
  margin: theme.spacing(0, 1),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: active ? 'translateX(-50%)' : 'translateX(-50%) scaleX(0)',
    width: '80%',
    height: '2px',
    backgroundColor: '#2196F3',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    '&::after': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
}));

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'About', path: '/about' },
    { text: 'Team', path: '/contributors' },
    { text: 'Find By Century', path: '/slider' },
    { text: 'Find By Years', path: '/years' },
  ];

  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'rgba(0, 0, 0, 0.9)' }}>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? '#2196F3' : 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <LogoContainer>
            <img src="/pic/logo.png" alt="Logo" style={{ height: '40px' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#2196F3',
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Beyond Timelines
            </Typography>
          </LogoContainer>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  active={location.pathname === item.path ? 1 : 0}
                >
                  {item.text}
                </NavButton>
              ))}
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Toolbar /> {/* This creates space below the fixed header */}
    </>
  );
};

export default Header;