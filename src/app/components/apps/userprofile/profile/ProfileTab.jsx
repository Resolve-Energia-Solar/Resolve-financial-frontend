'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { IconUserCircle } from '@tabler/icons-react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';

const ProfileTab = () => {
  const location = usePathname();
  const { username } = useParams();
  const [value, setValue] = React.useState(location);
  const handleChange = (event, newValue) => setValue(newValue);

  const ProfileTabs = [
    {
      label: 'Perfil',
      icon: <IconUserCircle size="20" />,
      to: `/apps/user-profile/${username}`,
    },
    {
      label: 'Colegas',
      icon: <IconUserCircle size="20" />,
      to: `/apps/user-profile/${username}/friends`,
    }
  ];

  return (
    <Box mt={1} sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}>
      <Box display="flex" justifyContent="end" sx={{ maxWidth: { xs: 320, sm: '100%' } }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Tabs do perfil"
        >
          {ProfileTabs.map((tab) => (
            <Tab
              key={tab.label}
              iconPosition="start"
              label={tab.label}
              icon={tab.icon}
              component={Link}
              href={tab.to}
              value={tab.to}
              sx={{ minHeight: '50px' }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  );
};

export default ProfileTab;
