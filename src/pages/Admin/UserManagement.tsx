import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '../../layouts/AdminLayout';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
};

const mockUsers: User[] = [
  { id: '1', name: 'Alice Doe', email: 'alice@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'John Smith', email: 'john@example.com', role: 'user', status: 'active' },
  { id: '3', name: 'Bob Ray', email: 'bob@example.com', role: 'user', status: 'inactive' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? editingUser : u));
      setOpen(false);
    }
  };

  return (
    <AdminLayout>
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
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
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={editingUser?.name || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            name="email"
            value={editingUser?.email || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Role"
            fullWidth
            name="role"
            value={editingUser?.role || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            name="status"
            value={editingUser?.status || ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AdminLayout>
  );
};

export default UserManagement;
