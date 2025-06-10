import { useState } from 'react';
import { Box, Tab, Tabs, Container } from '@mui/material';
import { Login } from './Login';
import { Register } from './Register';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function AuthPage() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
      <Box className="flex flex-col items-center justify-center min-h-screen">
      <Container component="main" maxWidth="xs">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="auth tabs" centered>
          <Tab label="Sign In" id="auth-tab-0" aria-controls="auth-tabpanel-0" />
          <Tab label="Sign Up" id="auth-tab-1" aria-controls="auth-tabpanel-1" />
        </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
        <Login />
        </TabPanel>
        <TabPanel value={value} index={1}>
        <Register />
        </TabPanel>
      </Container>
      </Box>
  );
}
