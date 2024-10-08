import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import ButtonComp from './ButtonComp'

export const ExpenseForm = ({ isSmallScreen, theme, setFormData, addExpense, formData, configData }: any) => {

    function handleAddExpense(e: any) {
        const { name, value } = e.target;
        //User change types then need to remove category that stored prev
        if(name==='type'){
            setFormData((formData: any) => ({ ...formData, ['category']: '' }));
        }
        setFormData((formData: any) => ({ ...formData, [name]: value }));
    }
    
    function handleSubmit() {
        addExpense();
    }
    
    // Filter categories based on the selected type
    const selectedConfig = configData.find((item: any) => item.type === formData.type);
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
                    {configData.map((item: any) => (
                        <MenuItem key={item._id} value={item.type}>
                            {item.type}
                        </MenuItem>
                    ))}
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
                event={handleSubmit}
            />
        </Box>
    )
}
