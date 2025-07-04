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
import AddEmployeeDialog from '../components/AddEmployeeDialog';

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
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_BASE);
      setEmployees(res.data.data);
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

  const handleAddOrEdit = async () => {
  const required = ['firstName', 'lastName', 'email', 'nationalIdentificationNumber', 'userName', 'password'];
  if (required.some(f => !editing?.[f] || editing[f].toString().trim() === '')) {
    setSnack({ open: true, message: 'Please fill in required fields', severity: 'warning' });
    return;
  }

  const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0] + 'T00:00:00'; // "YYYY-MM-DDT00:00:00"
};


  try {
    if (editing.id) {
      // تحديث موظف
      const updatePayload = {
        fullName: `${editing.firstName} ${editing.lastName}`,
        email: editing.email,
        phone: editing.phone || '',
        address: editing.address || '',
        birthDate: formatDate(editing.birthDate),
        hireDate: formatDate(editing.hireDate),
        nationalIdentificationNumber: editing.nationalIdentificationNumber,
        departments: []
      };
      await axios.put(`${API_BASE}/${editing.id}`, updatePayload);
      setSnack({ open: true, message: 'Employee updated successfully', severity: 'success' });
    } else {
      // إضافة موظف
      const selectedDepartments = departmentsList.filter(dep =>
  editing.departmentIds.includes(dep.id)
);
const payload = {
  UserName: editing.userName,
  Password: editing.password,
  FirstName: editing.firstName,
  LastName: editing.lastName,
  NationalIdentificationNumber: editing.nationalIdentificationNumber,
  BirthDate: formatDate(editing.birthDate),
 HireDate: formatDate(editing.hireDate),
  Phone: editing.phone || '',
  Email: editing.email,
  ImagePath: editing.imagePath || '',
  Address: editing.address || '',
  DepartmentIds: editing.departmentIds
};

      const token = localStorage.getItem('token');
      console.log('Payload to register:', payload);

      await axios.post('https://ramialzend.bsite.net/User/register', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSnack({ open: true, message: 'Employee added successfully', severity: 'success' });
    }

    fetchEmployees();
    setFormOpen(false);
    setEditing(null);
  } catch (err) {
    console.error('Error while saving employee:', err.response?.data || err);
    setSnack({ open: true, message: 'Error saving employee', severity: 'error' });
  }
};
const [departmentsList, setDepartmentsList] = useState([]);

const fetchDepartments = async () => {
  const res = await axios.get('https://ramialzend.bsite.net/Departments');
  setDepartmentsList(res.data.data);
};

useEffect(() => {
  fetchDepartments();
}, []);

  return (
    <Box sx={{ px: 4, py: 5, background: '#f4f6f8', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{ background: '#0d47a1', color: '#fff', '&:hover': { background: '#1565c0' } }}
          onClick={() => {
            setEditing({
              userName: '',
              password: '',
              firstName: '',
              lastName: '',
              nationalIdentificationNumber: '',
              birthDate: '',
              phone: '',
              email: '',
              address: '',
              departmentIds: [],
              imagePath: ''
            });
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
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); setSelected(emp); }}
                >
                  View
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      {!editing ? null : (
  editing?.id ? (
    <EditEmployeeDialog
      open={formOpen}
      onClose={() => {
        setFormOpen(false);
        setEditing(null);
      }}
      editing={editing}
      onChange={(e) => setEditing({ ...editing, [e.target.name]: e.target.value })}
      onSave={handleAddOrEdit}
    />
  ) : (
        <AddEmployeeDialog
  open={formOpen}
  onClose={() => {
    setFormOpen(false);
    setEditing(null);
  }}
  form={editing}
  onChange={(e) => setEditing({ ...editing, [e.target.name]: e.target.value })}
  onSave={handleAddOrEdit}
  departments={departmentsList} 
/>


  )
)}

    </Box>
  );
}
