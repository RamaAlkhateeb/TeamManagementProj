
import EditEmployeeDialog from './EditEmployeeDialog';
import axios from 'axios';

export default function EditEmployeeSection({ editing, setEditing, open, onClose, onUpdated, showSnack }) {
  const handleEdit = async () => {
  const required = ['firstName', 'lastName', 'email', 'nationalIdentificationNumber'];
  if (required.some(f => !editing?.[f] || editing[f].toString().trim() === '')) {
    showSnack('Please fill in required fields', 'warning');
    return;
  }

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split('T')[0] + 'T00:00:00' : null;

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
  console.log("Saving employee with ID:", editing.id);

  try {
    console.log("Sending PUT for ID:", editing.id);
    console.log("Payload:", updatePayload);

    await axios.put(
      `https://ramialzend.bsite.net/api/Employees/${editing.id}`,
      updatePayload,
      
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      
    );
    
    showSnack('Employee updated successfully', 'success');
    onUpdated();
    onClose();
  } catch (err) {
    console.error('Error while updating employee:', err.response?.data || err.message);
    showSnack('Error updating employee', 'error');
  }
};

  return (
    <EditEmployeeDialog
      open={open}
      onClose={onClose}
      editing={editing}
      onChange={(e) =>
  setEditing(prev => ({ ...(prev || {}), [e.target.name]: e.target.value }))
}
      onSave={handleEdit}
    />
  );
}
