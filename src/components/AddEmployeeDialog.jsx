import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText
} from '@mui/material';

export default function AddEmployeeDialog({ open, onClose, onChange, onSave, form, departments = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ target: { name, value } });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Username" name="userName" value={form.userName} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="National ID" name="nationalIdentificationNumber" value={form.nationalIdentificationNumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Birth Date" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Hire Date" type="date" name="hireDate" value={form.hireDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Image URL" name="imagePath" value={form.imagePath} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" name="address" value={form.address} onChange={handleChange} />
          </Grid>

         
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="departments-label">Departments</InputLabel>
              <Select
                labelId="departments-label"
                multiple
                name="departmentIds"
                value={form.departmentIds || []}
                onChange={handleChange}
                renderValue={(selected) =>
                  selected
                    .map(id => {
                      const dep = departments.find(d => d.id === id);
                      return dep ? dep.name : id;
                    })
                    .join(', ')
                }
              >
                {departments.map(dep => (
                  <MenuItem key={dep.id} value={dep.id}>
                    <Checkbox checked={form.departmentIds?.includes(dep.id)} />
                    <ListItemText primary={dep.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}


