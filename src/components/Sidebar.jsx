import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupsIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';
import ApartmentIcon from '@mui/icons-material/Apartment';

import {jwtDecode} from 'jwt-decode'; 

export default function Sidebar({ activePage, setActivePage }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const employeeId = decoded['Employee_Id'] || decoded['sub']; // حسب التوكن

        if (employeeId) {
          fetch('https://ramialzend.bsite.net/api/Employees', {
            headers: {
              'Authorization': `Bearer ${token}`, // مهم جدًا إضافة التوكن هنا
            },
          })
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then(response => {
              const employee = response.data.find(emp => emp.id === Number(employeeId));

              if (employee) {
                setUser({
                  name: employee.fullName,
                  email: employee.email,
                  avatar: employee.imagePath || '',
                  role: employee.roles?.[0] || 'Employee',
                });
              } else {
                console.error('Employee not found');
              }
              setLoading(false);
            })
            .catch(err => {
              console.error('Failed to fetch employee data', err);
              setLoading(false);
            });
        } else {
          console.error('Employee_Id not found in token');
          setLoading(false);
        }
      } catch (err) {
        console.error('Invalid token', err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const defaultAvatar = 'https://www.w3schools.com/howto/img_avatar.png';

  const permissions = {
    Admin: ['profile', 'my projects', 'my tasks', 'projects', 'staff', 'reports', 'departement'],
    TeamLeader: ['profile', 'my projects', 'my tasks', 'projects', 'staff', 'time', 'rewards', 'reports'],
    Employee: ['profile', 'my projects', 'my tasks'],
  };

  const renderButton = (label, icon, pageKey) => {
    if (!user || !permissions[user.role]?.includes(pageKey)) return null;

    return (
      <Button
        fullWidth
        startIcon={icon}
        onClick={() => setActivePage(pageKey)}
        variant={activePage === pageKey ? 'contained' : 'outlined'}
        sx={{
          mb: 1,
          color: activePage === pageKey ? '#002855' : '#fff',
          borderColor: '#fff',
          backgroundColor: activePage === pageKey ? '#fff' : 'transparent',
          '&:hover': {
            backgroundColor: '#fff',
            color: '#002855',
            borderColor: '#fff',
          },
          textTransform: 'none',
          borderRadius: 2,
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        width: 260,
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom right, #002855, #023E7D, #0353A4)',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {loading ? (
        <Typography sx={{ color: '#fff' }}>Loading...</Typography>
      ) : user ? (
        <>
          <Avatar
            alt="User Avatar"
            src={user.avatar || defaultAvatar}
            sx={{
              width: 90,
              height: 90,
              mb: 2,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
            {user.email}
          </Typography>

          <Divider sx={{ width: '100%', borderColor: '#334155', mb: 2 }} />

          {renderButton('Profile', <AccountCircleIcon />, 'profile')}
          {renderButton('My Tasks', <CheckCircleOutlineIcon />, 'my tasks')}
          {renderButton('My Projects', <WorkOutlineIcon />, 'my projects')}

          <Divider sx={{ width: '100%', borderColor: '#334155', my: 2 }} />

          {renderButton('Project Management', <FolderSharedIcon />, 'projects')}
          {renderButton('Staff Management', <GroupsIcon />, 'staff')}
          {renderButton('Departement Management',  <ApartmentIcon />, 'departement')}

          <Divider sx={{ width: '100%', borderColor: '#334155', my: 2 }} />

          {renderButton('Reports & Statistics', <InsightsIcon />, 'reports')}

          <Divider sx={{ width: '100%', borderColor: '#334155', my: 2 }} />

          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            variant="outlined"
            sx={{
              mt: 'auto',
              color: '#f87171',
              borderColor: '#f87171',
              '&:hover': {
                backgroundColor: '#dc2626',
                color: '#fff',
                borderColor: '#dc2626',
              },
              textTransform: 'none',
              borderRadius: 2,
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <Typography sx={{ color: '#fff' }}>User not found</Typography>
      )}
    </Box>
  );
}
