import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../utils/axiosConfig';

type User = {
  id: string;
  full_name: string;
  username?: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  password?: string;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        showSnackbar('Failed to load users', 'error');
      }
    };
    fetchUsers();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = (user: User | null) => {
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser({
        id: '',
        email: '',
        full_name: '',
        username: '',
        role: 'user',
        status: 'active',
        password: ''
      });
    }
    setConfirmPassword('');
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showSnackbar('User deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    if (editingUser && e.target.name) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!editingUser?.full_name || !editingUser.email || !editingUser.role) {
      showSnackbar('Please fill in all required fields', 'error');
      return false;
    }
    if (!editingUser.id && !editingUser.password) {
      showSnackbar('Password is required', 'error');
      return false;
    }
    if (!editingUser.id && editingUser.password !== confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!editingUser || !validateForm()) return;

    try {
      if (editingUser.id) {
        const { password, ...updateData } = editingUser;
        await api.put(`/users/${editingUser.id}`, updateData);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updateData as User : u)));
        showSnackbar('User updated successfully', 'success');
      } else {
        const res = await api.post('/users/', editingUser);
        setUsers((prev) => [...prev, { ...editingUser, id: res.data.user_id }]);
        showSnackbar('User created successfully', 'success');
      }
      setOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      showSnackbar('Failed to save user', 'error');
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.full_name, user.email, user.username]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <AdminLayout>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>User Management</Typography>
        <TextField
          label="Search Users"
          fullWidth
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button variant="contained" onClick={() => handleEdit(null)} sx={{ mb: 2 }}>
          Create User
        </Button>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}><DeleteIcon color="error" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={2}>
            <FormControl size="small">
              <InputLabel id="page-size-label">Rows per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                label="Rows per page"

                sx={{ minWidth: 120, marginBottom: 1, textAlign:"center" }}
                
              >
                {[5, 10, 20, 50].map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography variant="body2" display="inline" mx={2}>
                Page {currentPage} of {Math.ceil(filteredUsers.length / pageSize)}
              </Typography>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredUsers.length / pageSize)))}
                disabled={currentPage >= Math.ceil(filteredUsers.length / pageSize)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editingUser?.id ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Full Name"
              fullWidth
              required
              name="full_name"
              value={editingUser?.full_name || ''}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              name="username"
              value={editingUser?.username || ''}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Email"
              fullWidth
              required
              name="email"
              value={editingUser?.email || ''}
              onChange={handleChange}
            />
            {!editingUser?.id && (
              <>
                <TextField
                  margin="dense"
                  label="Password"
                  fullWidth
                  required
                  type="password"
                  name="password"
                  value={editingUser?.password || ''}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Confirm Password"
                  fullWidth
                  required
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}
            <FormControl fullWidth margin="dense" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={editingUser?.role || ''}
                onChange={(e) => handleChange(e as any)}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={editingUser?.status === 'active'}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser!,
                      status: e.target.checked ? 'active' : 'inactive',
                    })
                  }
                />
              }
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default UserManagement;
