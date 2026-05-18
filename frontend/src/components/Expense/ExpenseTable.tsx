import { memo, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { RootState, AppDispatch } from "../../ReduxToolkit/store";
import { useSelector, useDispatch } from 'react-redux';
import { expenseDelete, expenseUpdate, fetchExpense } from '../../ReduxToolkit/slices/expenseSlice';
import { addExpenseType, fetchExpenseType, updateExpenseType } from '../../ReduxToolkit/slices/expenseTypeSlice';

const columns = [
  { id: 'slNo', label: 'Sl.No.' },
  { id: 'date', label: 'Date' },
  {id: 'merchant', label: 'Merchant'},
  { id: 'type', label: 'Type' },
  { id: 'category', label: 'Category' },
  { id: 'item', label: 'Item' },
  { id: 'confidence', label: 'Review' },
  { id: 'price', label: 'Price' },
  { id: 'payBack', label: 'Payback' },
  { id: 'action', label: 'Action' },
];

const emptyEditForm = {
  type: '',
  category: '',
  item: '',
  price: 0,
  createdAt: '',
  payBack: {
    isPayback: false,
    amount: 0,
  },
};

function toDateInputValue(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().slice(0, 10);
}

function getConfidenceMeta(expense: any) {
  const confidence = Number(expense.confidence ?? 1);
  if (confidence < 0.6) {
    return {
      label: 'Needs review',
      color: 'warning' as const,
      rowSx: { backgroundColor: '#fff7ed', '&:hover': { backgroundColor: '#ffedd5' } },
    };
  }
  if (confidence < 0.85) {
    return {
      label: 'Review',
      color: 'info' as const,
      rowSx: { backgroundColor: '#fffbeb', '&:hover': { backgroundColor: '#fef3c7' } },
    };
  }

  return {
    label: expense.classificationSource === 'user-rule' ? 'Confirmed' : 'Auto',
    color: expense.classificationSource === 'user-rule' ? 'success' as const : 'default' as const,
    rowSx: {},
  };
}

function toCategoryPayload(category: any) {
  return {
    name: category.name,
    description: category.description || '',
    isActive: category.isActive ?? true,
  };
}

const CustomTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editExpense, setEditExpense] = useState<any | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<any | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [newTypeName, setNewTypeName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const { fetchLoading, expenses, updateLoading, deleteLoading } = useSelector((state: RootState) => state.expenseReducer);
  const { expenseTypes } = useSelector((state: RootState) => state.expenseTypeReducer);
  const isMobile = useMediaQuery('(max-width:600px)');
  const userId = localStorage.getItem('userId');

  const availableCategories = useMemo(() => {
    const selectedConfig = expenseTypes.find((item: any) => item.type === editForm.type);
    return selectedConfig ? selectedConfig.categories : [];
  }, [editForm.type, expenseTypes]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openEditDialog = (expense: any) => {
    setEditExpense(expense);
    setNewTypeName('');
    setNewCategoryName('');
    setEditForm({
      type: expense.type || '',
      category: expense.category || '',
      item: expense.item || '',
      price: expense.price || 0,
      createdAt: toDateInputValue(expense.createdAt),
      payBack: {
        isPayback: Boolean(expense.payBack?.isPayback),
        amount: expense.payBack?.amount || 0,
      },
    });
  };

  const handleEditChange = (event: any) => {
    const { name, value } = event.target;
    if (name === 'type') {
      setEditForm((prev) => ({ ...prev, type: value, category: '' }));
      return;
    }
    if (name === 'payBackAmount') {
      setEditForm((prev) => ({
        ...prev,
        payBack: { ...prev.payBack, amount: Number(value) },
      }));
      return;
    }
    if (name === 'payBackStatus') {
      setEditForm((prev) => ({
        ...prev,
        payBack: { ...prev.payBack, isPayback: value === 'true' },
      }));
      return;
    }
    setEditForm((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSaveEdit = async () => {
    if (!editExpense?._id) return;

    await dispatch(expenseUpdate({
      id: editExpense._id,
      body: {
        ...editForm,
        item: editForm.item || editForm.category,
      },
    }));
    setEditExpense(null);
  };

  const handleAddType = async () => {
    const typeName = newTypeName.trim();
    if (!typeName) return;

    const fallbackCategory = newCategoryName.trim() || 'General';
    const result = await dispatch(addExpenseType({
      userId,
      type: typeName,
      categories: [{ name: fallbackCategory, description: '', isActive: true }],
    }));

    if (addExpenseType.fulfilled.match(result)) {
      setEditForm((prev) => ({ ...prev, type: typeName, category: fallbackCategory }));
      setNewTypeName('');
      setNewCategoryName('');
    }
  };

  const handleAddCategory = async () => {
    const categoryName = newCategoryName.trim();
    if (!categoryName || !editForm.type) return;

    const selectedType = expenseTypes.find((item: any) => item.type === editForm.type);
    if (!selectedType) return;

    const categoryExists = selectedType.categories.some(
      (category: any) => category.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (categoryExists) {
      const existingCategory = selectedType.categories.find(
        (category: any) => category.name.toLowerCase() === categoryName.toLowerCase()
      );
      setEditForm((prev) => ({ ...prev, category: existingCategory.name }));
      setNewCategoryName('');
      return;
    }

    const result = await dispatch(updateExpenseType({
      id: selectedType._id,
      formData: {
        userId,
        type: selectedType.type,
        categories: [
          ...selectedType.categories.map(toCategoryPayload),
          { name: categoryName, description: '', isActive: true },
        ],
      },
    }));

    if (updateExpenseType.fulfilled.match(result)) {
      setEditForm((prev) => ({ ...prev, category: categoryName }));
      setNewCategoryName('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteExpense?._id) return;
    await dispatch(expenseDelete(deleteExpense._id));
    setDeleteExpense(null);
  };

  useEffect(() => {
    dispatch(fetchExpense(userId));
    dispatch(fetchExpenseType(userId));
  }, [dispatch, userId]);

  return (
    <>
      <Paper style={{ width: '99%', overflowX: 'auto' }}>
        <TableContainer style={{ maxHeight: 520 }}>
          {fetchLoading && <LinearProgress />}
          <Table
            stickyHeader
            aria-label="expense table"
            sx={{
              '& .MuiTableCell-root': {
                fontSize: isMobile ? '8px' : '12px',
                padding: isMobile ? '3px' : '9px',
              },
            }}
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align="left">
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((expense: any, index: number) => {
                  const confidenceMeta = getConfidenceMeta(expense);
                  return (
                    <TableRow hover tabIndex={-1} key={expense._id} sx={confidenceMeta.rowSx}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{formatDate(expense.createdAt)}</TableCell>
                      <TableCell>{expense.merchant}</TableCell>
                      <TableCell>{expense.type}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.item}</TableCell>
                      <TableCell>
                        <Tooltip title={`Confidence: ${Math.round(Number(expense.confidence ?? 1) * 100)}%`}>
                          <Chip
                            label={confidenceMeta.label}
                            size="small"
                            color={confidenceMeta.color}
                            variant={confidenceMeta.color === 'default' ? 'outlined' : 'filled'}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">₹{expense.price}</TableCell>
                      <TableCell align="left">
                        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                          <IconButton sx={{ cursor: "default" }}>
                            {expense.payBack?.isPayback ? <ThumbUpOffAltIcon color="success" fontSize={isMobile ? 'small' : 'medium'} />
                              : <ThumbDownOffAltIcon color="info" fontSize={isMobile ? 'small' : 'medium'} />}
                          </IconButton>
                          ₹{expense.payBack?.amount || 0}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <IconButton aria-label="edit" size={isMobile ? 'small' : 'medium'} onClick={() => openEditDialog(expense)}>
                          <EditIcon color="info" fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                        <IconButton aria-label="delete" size={isMobile ? 'small' : 'medium'} onClick={() => setDeleteExpense(expense)}>
                          <DeleteIcon color="warning" fontSize={isMobile ? 'small' : 'medium'} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={expenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_event, newPage) => setPage(newPage)}
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
      </Paper>

      <Dialog open={Boolean(editExpense)} onClose={() => setEditExpense(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 1 }}>
              <TextField
                label="New type"
                value={newTypeName}
                onChange={(event) => setNewTypeName(event.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddType}
                disabled={!newTypeName.trim()}
              >
                Add Type
              </Button>
            </Box>
            <FormControl fullWidth>
              <InputLabel id="edit-type-label">Type</InputLabel>
              <Select labelId="edit-type-label" name="type" label="Type" value={editForm.type} onChange={handleEditChange}>
                {expenseTypes.map((item: any) => (
                  <MenuItem key={item._id} value={item.type}>{item.type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 1 }}>
              <TextField
                label="New category"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || !editForm.type}
              >
                Add Category
              </Button>
            </Box>
            <FormControl fullWidth>
              <InputLabel id="edit-category-label">Category</InputLabel>
              <Select labelId="edit-category-label" name="category" label="Category" value={editForm.category} onChange={handleEditChange}>
                {availableCategories.map((category: any) => (
                  <MenuItem key={category._id || category.name} value={category.name}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Item" name="item" value={editForm.item} onChange={handleEditChange} fullWidth />
            <TextField label="Price" name="price" type="number" value={editForm.price} onChange={handleEditChange} fullWidth />
            <TextField
              label="Date"
              name="createdAt"
              type="date"
              value={editForm.createdAt}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="payback-status-label">Payback</InputLabel>
              <Select
                labelId="payback-status-label"
                name="payBackStatus"
                label="Payback"
                value={String(editForm.payBack.isPayback)}
                onChange={handleEditChange}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Payback Amount"
              name="payBackAmount"
              type="number"
              value={editForm.payBack.amount}
              onChange={handleEditChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditExpense(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={updateLoading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteExpense)} onClose={() => setDeleteExpense(null)} fullWidth maxWidth="xs">
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography>
            Delete ₹{deleteExpense?.price} expense for {deleteExpense?.merchant || deleteExpense?.item}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteExpense(null)}>Cancel</Button>
          <Button color="warning" variant="contained" onClick={handleConfirmDelete} disabled={deleteLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(CustomTable);
