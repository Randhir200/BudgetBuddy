import {
    Box, FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import ButtonComp from './ButtonComp'


// interface FormData {
//     type: string;
//     category: string;
//     item: string;
//     price: number;
//     createdAt: string
//   }

export const AddExpenseForm = ({ isSmallScreen,
    theme,
    setFormData,
    addExpense,
    formData}: any) => {

    function handleAddExpense(e:any) {
        const { name, value } = e.target;
        setFormData((formData:any) => ({ ...formData, [name]: value }));
        console.log(formData);
    }
    
    function handleSubmit(){
        addExpense();
    }

    return (
        <Box
            component="form"
            sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                gap: isSmallScreen ? 2 : 3, // Smaller gaps for small screens
                p: isSmallScreen ? 2 : 3, // Smaller padding for small screens
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                boxShadow: theme.shadows[3],
            }}
        >
            {/* Type Field */}
            <FormControl fullWidth>
                <InputLabel
                    id="type-label"
                    sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller label font size
                >
                    Type
                </InputLabel>
                <Select
                    labelId="type-label"
                    id="type"
                    label="Type"
                    defaultValue=""
                    name="type"
                    value={formData.type}
                    onChange={handleAddExpense}
                    sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }} // Smaller input font size
                >
                    <MenuItem value="Needs">Needs</MenuItem>
                    <MenuItem value="Wants">Wants</MenuItem>
                    <MenuItem value="Savings">Savings</MenuItem>
                </Select>
            </FormControl>

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
                    defaultValue=""
                    name="category"
                    value={formData.category}
                    onChange={handleAddExpense}
                    sx={{ fontSize: isSmallScreen ? "0.8rem" : "1rem" }}
                >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Bills">Bills</MenuItem>
                    <MenuItem value="Grocery">Grocery</MenuItem>
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
                defaultValue=""
                fullWidth
                InputLabelProps={{
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
                }}
                inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font
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
                inputProps={{ min: 0, style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font size
                InputLabelProps={{
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
                }}
            />

            {/* Date Field */}
            <TextField
                id="date"
                label="Date"
                type="date"
                defaultValue=""
                name="createdAt"
                value={formData.createdAt}
                onChange={handleAddExpense}                
                InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: isSmallScreen ? "0.8rem" : "1rem" }, // Smaller label font size
                }}
                fullWidth
                inputProps={{ style: { fontSize: isSmallScreen ? "0.8rem" : "1rem" } }} // Smaller input font size
            />

            {/* Submit Button */}
            <ButtonComp
                title="Submit"
                variant="contained"
                color="primary"
                size={isSmallScreen ? "small" : "medium"} // Adjust button size for small screens
                event={handleSubmit}
            />
        </Box>
    )
}