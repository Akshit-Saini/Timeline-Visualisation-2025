import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => (
  <AppBar position="static" style={{ background: '#111' }}>
    <Toolbar>
      <img src="/pic/logo.png" alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
      <Typography variant="h6" style={{ flexGrow: 1, color: '#D1C72E', fontWeight: 'bold' }}>Beyond Timelines</Typography>
      <Button color="inherit" component={Link} to="/">Home</Button>
      <Button color="inherit" component={Link} to="/about">About</Button>
      <Button color="inherit" component={Link} to="/contributors">Team</Button>
      <Button color="inherit" component={Link} to="/slider">Find By Century</Button>
      <Button color="inherit" component={Link} to="/years">Find By Years</Button>
    </Toolbar>
  </AppBar>
);

export default Header;