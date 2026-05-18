import { useEffect, useState, memo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../ReduxToolkit/store";
import { fetchExpenseType, deleteExpenseType } from '../../ReduxToolkit/slices/expenseTypeSlice';


// Define the columns
const columns = [
  { id: 'slNo', label: 'Sl.No.', },
  { id: 'type', label: 'Type', },
  { id: 'categories', label: 'Categories', },
  { id: 'createdAt', label: 'Created At', },
  { id: 'action', label: 'Action', },
];

// Define the typeItemTable component
const ExpenseTypeTable = ({ onEdit = null }: any) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const dispatch:AppDispatch = useDispatch();
  const {expenseTypes, fetchLoading, deleteLoading} = useSelector((state:RootState)=>state.expenseTypeReducer)
  // Check if screen width is less than 600px
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Format createdAt date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (typeItem: any) => {
    if (onEdit) {
      onEdit(typeItem);
    }
  };

  const handleDeleteClick = (typeItem: any) => {
    setDeleteTarget(typeItem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      dispatch(deleteExpenseType(deleteTarget._id));
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

 const userId = localStorage.getItem('userId');
  useEffect(()=>{
    dispatch(fetchExpenseType(userId));
  }, [dispatch]);

  return (
    <Paper style={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer style={{ maxHeight: 440 }}>
        {fetchLoading && <LinearProgress />}
        <Table
          stickyHeader
          aria-label="customized table"
          sx={{
            '& .MuiTableCell-root': {
              fontSize: isMobile ? '10px' : '14px',
              padding: isMobile ? '4px' : '10px',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{}}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseTypes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((typeItem: any, index: number) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={typeItem._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{typeItem.type}</TableCell>
                  <TableCell>
                    {typeItem.categories.map((category: any) => category.name).join(', ')}
                  </TableCell>
                  <TableCell>{formatDate(typeItem.createdAt)}</TableCell>
                  <TableCell align="left">
                    <IconButton aria-label="edit" size={isMobile ? 'small' : 'medium'} onClick={() => handleEdit(typeItem)}>
                      <EditIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                    <IconButton aria-label="delete" size={isMobile ? 'small' : 'medium'} onClick={() => handleDeleteClick(typeItem)}>
                      <DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={expenseTypes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '10px' : '14px',
          },
          '& .MuiTablePagination-input': {
            fontSize: isMobile ? '10px' : '14px',
          },
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the expense type "{deleteTarget?.type}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default memo(ExpenseTypeTable);
