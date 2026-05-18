import {
    Box, TextField, Chip
} from '@mui/material';
import ButtonComp from '../Common/ButtonComp';
import { useState, memo, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../ReduxToolkit/store";
import { addExpenseType, updateExpenseType } from '../../ReduxToolkit/slices/expenseTypeSlice';

const formInitialState = {
        type: '',
        categories: [],
        userId: ''
    }

export const ExpenseTypeForm = memo(({
    isSmallScreen,
    theme,
    editData = null,
    onEditComplete = () => {}
}: any) => {
    const [categories, setCategories] = useState<string[]>([]); // State for categories
    const [categoryInput, setCategoryInput] = useState<string>(''); // State for input field
    const [formData, setFormData] = useState(formInitialState); 
    const {addLoading, updateLoading} = useSelector((state:RootState)=>state.expenseTypeReducer);
    const dispatch:AppDispatch = useDispatch();

    // Initialize form with edit data if provided
    useEffect(() => {
        if (editData) {
            setFormData({
                type: editData.type,
                categories: editData.categories,
                userId: editData.userId
            });
            setCategories(editData.categories.map((cat: any) => cat.name));
        }
    }, [editData]);

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
        setFormData((prev: any) => ({
            ...prev,
            categories: prev.categories.filter((cat: any) => cat.name !== categoryToRemove)
        }));
    };


    function handleType(e:any) {
        const { name, value } = e.target;
        setFormData((formData:any) => ({ ...formData, [name]: value }));
    }
    

    function handleSubmit(){
        // Read userId at submit time to avoid module-load timing issues
        const currentUserId = localStorage.getItem('userId') || formData.userId || '';
        
        // Clean categories to remove _id field
        const cleanedCategories = formData.categories.map((cat: any) => ({
            name: cat.name,
            description: cat.description || '',
            isActive: cat.isActive !== undefined ? cat.isActive : true
        }));
        
        const payload = { ...formData, userId: currentUserId, categories: cleanedCategories };
        
        if (editData) {
            // Update mode
            dispatch(updateExpenseType({ id: editData._id, formData: payload })).then(() => {
                onEditComplete();
                resetForm(currentUserId);
            });
        } else {
            // Add mode
            dispatch(addExpenseType(payload));
            resetForm(currentUserId);
        }
    }

    function resetForm(userId: string) {
        setFormData({ ...formInitialState, userId });
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
                    title={editData ? "Update" : "Submit"}
                    variant="contained"
                    color="primary"
                    size={isSmallScreen ? "small" : "medium"}
                    event={handleSubmit}
                    loading = {editData ? updateLoading : addLoading}
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
