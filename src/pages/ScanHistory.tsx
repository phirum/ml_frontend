import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, CircularProgress,
  TablePagination
} from '@mui/material';
import AdminLayout from '../layouts/AdminLayout';
import api from '../utils/axiosConfig';

interface ScanRecord {
  filename: string;
  result: string;
  threat_type?: string;
  confidence: number;
  created_at: string;
}

const ScanHistory: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/scan/history');
        setScans(res.data.scans);
      } catch (err) {
        console.error('Error fetching scan history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedScans = scans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <AdminLayout>
      <Box sx={{ mt: 4, px: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>📜 Scan History</Typography>

        {loading ? (
          <CircularProgress />
        ) : scans.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No scan history available.
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Filename / URL</strong></TableCell>
                    <TableCell><strong>Result</strong></TableCell>
                    <TableCell><strong>Threat Type</strong></TableCell>
                    <TableCell><strong>Confidence</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedScans.map((scan, index) => (
                    <TableRow key={index}>
                      <TableCell>{scan.filename}</TableCell>
                      <TableCell>{scan.result}</TableCell>
                      <TableCell>{scan.threat_type || 'N/A'}</TableCell>
                      <TableCell>{(scan.confidence * 100).toFixed(2)}%</TableCell>
                      <TableCell>{new Date(scan.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={scans.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Box>
    </AdminLayout>
  );
};

export default ScanHistory;
