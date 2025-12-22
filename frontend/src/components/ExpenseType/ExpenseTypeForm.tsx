import {
    Box, TextField, Chip
} from '@mui/material';
import ButtonComp from '../Common/ButtonComp';
import { useState, memo} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../ReduxToolkit/store";
import { addExpenseType } from '../../ReduxToolkit/slices/expenseTypeSlice';

const formInitialState = {
        type: '',
        categories: [],
        userId: ''
    }

export const ExpenseTypeForm = memo(({
    isSmallScreen,
    theme,
}: any) => {
    const [categories, setCategories] = useState<string[]>([]); // State for categories
    const [categoryInput, setCategoryInput] = useState<string>(''); // State for input field
    const [formData, setFormData] = useState(formInitialState); 
    const {addLoading} = useSelector((state:RootState)=>state.expenseTypeReducer);
    const dispatch:AppDispatch = useDispatch();

    // Handle keypress (Enter) to add categories
    const handleCategoryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && categoryInput.trim() !== '') {
            setCategories((prev) => [...prev, categoryInput.trim()]);
            setFormData((prev:any)=>({...prev, categories:[...prev.categories, {name: categoryInput}]}))
            setCategoryInput(''); // Clear the input after adding
            e.preventDefault(); // Prevent form submission
        }
    };

    // Handle removing a category
    const handleRemoveCategory = (categoryToRemove: string) => {
        setCategories((prev) => prev.filter((category) => category !== categoryToRemove));
    };


    function handleType(e:any) {
        const { name, value } = e.target;
        setFormData((formData:any) => ({ ...formData, [name]: value }));
    }
    

    function handleSubmit(){
        // Read userId at submit time to avoid module-load timing issues
        const currentUserId = localStorage.getItem('userId') || formData.userId || '';
        const payload = { ...formData, userId: currentUserId };
        dispatch(addExpenseType(payload));
        // Reset form; preserve a fresh userId so subsequent submits include it
        setFormData({ ...formInitialState, userId: currentUserId });
        setCategories([]);
    }

    return (
        <>
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

                      <TextField
                            id="type"
                            label="Type"
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleType}
                            fullWidth
                            InputLabelProps={{
                                sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" },
                            }}
                            inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }}
                        />


                        {/* Multiple Category Input */}
                        <TextField
                            id="category"
                            label="Category"
                            type="categiry"
                            name="category"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyPress={handleCategoryKeyPress} // Handle adding category on Enter
                            placeholder="Press Enter to add category"
                            fullWidth
                            InputLabelProps={{
                                sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" },
                            }}
                            inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }}
                        />
                {/* Submit Button */}
                <ButtonComp
                    title="Submit"
                    variant="contained"
                    color="primary"
                    size={isSmallScreen ? "small" : "medium"}
                    event={handleSubmit}
                    loading = {addLoading}
                />
            </Box>
                {/* Display added categories as chips */}
                <Box sx={{ mt: 2, mb: 2 }}>
                            {categories.map((category, index) => (
                                <Chip
                                    key={index}
                                    label={category}
                                    onDelete={() => handleRemoveCategory(category)}
                                    sx={{ m: 0.5 }}
                                />
                            ))}
                        </Box>
        </>
    );
});
