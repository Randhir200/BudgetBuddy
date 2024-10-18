import {
    Box, TextField, Chip
} from '@mui/material';
import ButtonComp from '../Common/ButtonComp';
import { useState } from 'react';

export const ExpenseTypeForm = ({
    isSmallScreen,
    theme,
    addExpenseType,
    setFormData,
    formData,
}: any) => {
    const [categories, setCategories] = useState<string[]>([]); // State for categories
    const [categoryInput, setCategoryInput] = useState<string>(''); // State for input field
    
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
        addExpenseType();
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
                />
            </Box>
                {/* Display added categories as chips */}
                <Box sx={{ mt: 2 }}>
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
};
