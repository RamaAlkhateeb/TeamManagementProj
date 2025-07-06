import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import { useState } from 'react';
import StaffManagement from './StaffManagementPage';
import UserProfilePage from './UserProfilePage';
import DepartmentsPage from './DepartmentsPage';
import ProjectsPage from './ProjectsPage';
import MyProjectsPage from './MyProjectPage';
import MyTasksPage from './MyTaskPage';
import TasksPage from './TaskManagementPage';
export default function Dashboard() {
  const [activePage, setActivePage] = useState('profile');

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return <div> <UserProfilePage /></div>;
      case 'projects':
        return <div><ProjectsPage /></div>;
      case 'my projects':
        return <div> <MyProjectsPage /></div>;
      case 'my tasks':
        return <div><MyTasksPage /></div>;
      case 'staff':
        return <StaffManagement />;
      case 'departement':
        return <div>< DepartmentsPage /></div>;
      case 'tasks':
        return <div><TasksPage /></div>;
      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
  <Sidebar activePage={activePage} setActivePage={setActivePage} />
  <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', overflowY: 'auto' }}>
    {renderPage()}
  </Box>
</Box>

  );
}
