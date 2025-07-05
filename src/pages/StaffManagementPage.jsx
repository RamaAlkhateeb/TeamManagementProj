import {
  Box, Grid, Typography, Avatar,
  Button, Snackbar, Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditEmployeeDialog from '../components/EditEmployeeDialog';
import RegisterUser from '../components/AddEmployeeSection';
import { jwtDecode } from 'jwt-decode';

const API_BASE = 'https://ramialzend.bsite.net/api/Employees';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default function StaffManagement() {
  const [employees, setEmployees] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentEmployeeId(decoded?.Employee_Id);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (currentEmployeeId) {
      fetchEmployees();
    }
  }, [currentEmployeeId]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_BASE);
      const all = res.data.data;
      const filtered = all.filter(emp =>
        emp.id !== parseInt(currentEmployeeId) && emp.id !== 18
      );
      setEmployees(filtered);
    } catch {
      setSnack({ open: true, message: 'Failed to load employees', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        setSnack({ open: true, message: 'Employee deleted successfully', severity: 'info' });
        fetchEmployees();
      } catch {
        setSnack({ open: true, message: 'Failed to delete employee', severity: 'error' });
      }
    }
  };

  const handleEditEmployee = (emp) => {
    const [firstName, ...lastNameParts] = emp.fullName?.split(' ') || [];
    const lastName = lastNameParts.join(' ');

    setEditing({
      id: emp.id,
      firstName,
      lastName,
      email: emp.email || '',
      phone: emp.phone || '',
      address: emp.address || '',
      birthDate: emp.birthDate ? emp.birthDate.split('T')[0] : '',
      hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
      nationalIdentificationNumber: emp.nationalIdentificationNumber || '',
    });

    setFormOpen(true);
  };

  const handleEditSave = async () => {
    if (!editing?.id) {
      setSnack({ open: true, message: 'Employee ID is missing', severity: 'error' });
      return;
    }

    try {
      const payload = {
        ...editing,
        birthDate: editing.birthDate,
        hireDate: editing.hireDate
      };

      await axios.put(`${API_BASE}/${editing.id}`, payload);
      setSnack({ open: true, message: 'Employee updated successfully', severity: 'success' });
      setFormOpen(false);
      setEditing(null);
      fetchEmployees();
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update employee', severity: 'error' });
    }
  };

  return (
    <Box sx={{ px: 4, py: 5, background: '#f4f6f8', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{ background: '#0d47a1', color: '#fff', '&:hover': { background: '#1565c0' } }}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add Employee
        </Button>
      </Box>

      <Grid container spacing={3}>
        {employees.map(emp => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
            <Box
              sx={{
                background: '#fff',
                border: '2px solid #0d47a1',
                borderRadius: 3,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: '0.3s',
                p: 2,
                '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.2)' }
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={emp.imagePath || `https://api.dicebear.com/7.x/initials/svg?seed=${emp.fullName}`}
                  alt={emp.fullName}
                  sx={{ width: 80, height: 80 }}
                />
                <Box flex={1}>
                  <Typography variant="h6">{emp.fullName}</Typography>
                  {emp.roles?.length > 0 && (
                    <Box mt={0.5} display="flex" flexWrap="wrap" gap={1}>
                      {emp.roles.map((r, i) => (
                        <Box key={i} sx={{
                          background: '#4caf50', color: '#fff', px: 1.5, py: 0.5,
                          borderRadius: 1, fontSize: 12
                        }}>{r}</Box>
                      ))}
                    </Box>
                  )}
                  {emp.departments?.length > 0 && (
                    <Box mt={0.5} display="flex" flexWrap="wrap" gap={1}>
                      {emp.departments.map((d, i) => (
                        <Box key={i} sx={{
                          background: '#e0e0e0', px: 1.5, py: 0.5,
                          borderRadius: 1, fontSize: 12
                        }}>{d}</Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
              <Box mt={2} px={1}>
                <Typography variant="body2">🔐 {emp.nationalIdentificationNumber || 'N/A'}</Typography>
                <Typography variant="body2">📅 {emp.birthDate ? new Date(emp.birthDate).toLocaleDateString('en-GB') : 'N/A'}</Typography>
                <Typography variant="body2">📞 {emp.phone || 'N/A'}</Typography>
                <Typography variant="body2">✉️ {emp.email || 'N/A'}</Typography>
              </Box>
              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleEditEmployee(emp); }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleDelete(emp.id); }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {formOpen && (
        editing ? (
          <EditEmployeeDialog
            open={formOpen}
            editing={editing}
            onClose={() => { setFormOpen(false); setEditing(null); }}
            onChange={(e) => setEditing(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            onSave={handleEditSave}
          />
        ) : (
          <RegisterUser
            handleClose={() => setFormOpen(false)}
            onRegister={() => {
              fetchEmployees();
              setFormOpen(false);
            }}
            showSnack={(msg, severity) => setSnack({ open: true, message: msg, severity })}
          />
        )
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
