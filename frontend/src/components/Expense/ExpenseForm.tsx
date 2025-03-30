import { memo, useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import ButtonComp from '../Common/ButtonComp';
import { AppDispatch, RootState } from '../../ReduxToolkit/store'
import { useDispatch, useSelector } from 'react-redux';
import { addExpense } from "../../ReduxToolkit/slices/expenseSlice";
import { fetchExpenseType } from '../../ReduxToolkit/slices/expenseTypeSlice';



export const ExpenseForm = memo(({
    isSmallScreen,
    theme,
    formInitialState
}: any) => {
    const dispatch: AppDispatch = useDispatch();
    const { addLoading } = useSelector((state: RootState) => state.expenseReducer);
    const { expenseTypes, fetchLoading } = useSelector((state: RootState) => state.expenseTypeReducer);
    const [formData, setFormData] = useState(formInitialState);

    function handleAddExpense(e: any) {
        const { name, value } = e.target;
        //User change types then need to remove category that stored prev
        if (name === 'type') {
            setFormData((formData: any) => ({ ...formData, ['category']: '' }));
        }
        setFormData((formData: any) => ({ ...formData, [name]: value }));
    }

    function handleSubmit() {
        dispatch(addExpense(formData))
    }

    useEffect(() => {
        dispatch(fetchExpenseType(localStorage.getItem('userId')));
    }, []);
    // Filter categories based on the selected type
    const selectedConfig = expenseTypes.find((item: any) => item.type === formData.type);
    const availableCategories = selectedConfig ? selectedConfig.categories : [];

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: isSmallScreen ? 2 : 3,
                p: isSmallScreen ? 2 : 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                boxShadow: theme.shadows[3],
            }}
        >
            {/* Type Field */}
            {fetchLoading ?
                <LinearProgress />
                :
                <FormControl fullWidth>
                    <InputLabel
                        id="type-label"
                        sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
                    >
                        Type
                    </InputLabel>
                    <Select
                        labelId="type-label"
                        id="type"
                        label="Type"
                        name="type"
                        value={formData.type}
                        onChange={handleAddExpense}
                        sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
                    >
                        {expenseTypes.map((item: any) => (
                            <MenuItem key={item._id} value={item.type}>
                                {item.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }


            {/* Category Field */}
            <FormControl fullWidth>
                <InputLabel
                    id="category-label"
                    sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
                >
                    Category
                </InputLabel>
                <Select
                    labelId="category-label"
                    id="category"
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleAddExpense}
                    sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
                >
                    {availableCategories.map((category: any) => (
                        <MenuItem key={category._id} value={category.name}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Item */}
            <TextField
                id="item"
                label="Item"
                type="item"
                name="item"
                value={formData.item}
                onChange={handleAddExpense}
                fullWidth
                InputLabelProps={{
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" },
                }}
                inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }}
            />

            {/* Price Field */}
            <TextField
                id="price"
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleAddExpense}
                fullWidth
                inputProps={{ min: 0, style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }}
                InputLabelProps={{
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" },
                }}
            />

            {/* Date Field */}
            <TextField
                id="date"
                label="Date"
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleAddExpense}
                InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" },
                }}
                fullWidth
                inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }}
            />

            {/* Submit Button */}
            <ButtonComp
                title="Submit"
                variant="contained"
                color="primary"
                size={isSmallScreen ? "small" : "medium"}
                onClick={handleSubmit}
                loading={addLoading}
            />
        </Box>
    )
});
