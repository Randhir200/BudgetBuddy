MongoDB Schema Design for Expense Management

# Overview

This schema is designed to manage user-specific expense types, categories, and track active month records for budgeting purposes. It includes the \`Expense\` collection for storing individual expense records, tied to users and their custom expense types and categories.  

Key Features:

- User-Specific Expense Types: Users can define their own expense types (e.g., Needs, Wants, Savings).
- Embedded Categories: Categories specific to each expense type are stored within the \`ExpenseType\` document.
- Expenses Tracking: Users can log expenses linked to their custom types and categories.
- Active Month Record: Each user can have a designated active month for tracking current expense data.

# Collections

## 1\. ExpenseType Collection

This collection stores the expense types for each user, along with the associated categories for each type.  

### Example Document

{  
"\_id": ObjectId("expenseTypeId"),  
"userId": ObjectId("userId"), // Reference to the user who owns this expense type  
"type": "Need", // Expense type defined by the user (e.g., "Need", "Want", "Saving")  
"categories": \[  
{  
"name": "Food", // Category name under this type  
"description": "Daily food expenses", // Optional description  
"isActive": true // Flag to determine if the category is currently active  
},  
{  
"name": "Bills",  
"description": "Monthly utility bills",  
"isActive": true  
},  
{  
"name": "Grocery",  
"description": "Groceries and household items",  
"isActive": false  
}  
\],  
"createdAt": ISODate("2024-09-12T10:00:00Z"), // Timestamp when this document was created  
"updatedAt": ISODate("2024-09-12T10:00:00Z") // Timestamp for the last update  
}  

### Fields

- \_id: Unique identifier for the \`ExpenseType\`.
- userId: The ID of the user who owns this expense type.
- type: The name of the expense type (e.g., "Need", "Want", "Saving").
- categories: An array of categories associated with this type.
- createdAt: Timestamp when the document was created.
- updatedAt: Timestamp when the document was last updated.

## 2\. Expense Collection

This collection stores individual expense records for each user, tied to their expense types and categories.  

### Example Document

{  
"\_id": ObjectId("expenseId"),  
"userId": ObjectId("userId"), // Reference to the user who made this expense  
"type": "Need",  
"category": "Food",  
"price": 150, // Price or cost of the expense  
"description": "Lunch at a restaurant", // (Optional) description of the expense  
"createdAt": ISODate("2024-09-12T13:00:00Z"), // Timestamp when this expense was created  
"updatedAt": ISODate("2024-09-12T13:00:00Z") // Timestamp when this expense was last updated  
}  

### Fields

- \_id: Unique identifier for the expense.
- userId: The ID of the user who owns this expense record.
- type: The name of the expense type (e.g., "Need", "Want", "Saving").
- category: The specific category under the expense type (e.g., "Food", "Bills").
- item: A description of the expense (e.g., "Lunch", "Groceries").
- price: The cost or value of the expense.
- description: An optional field to add more details about the expense.
- createdAt: Timestamp when the expense was created.
- updatedAt: Timestamp when the expense was last updated.

## 3\. ActiveMonthRecord Collection

This collection stores the active month for each user to track expenses in the current month.  

### Example Document

{  
"\_id": ObjectId("activeMonthRecordId"),  
"userId": ObjectId("userId"), // Reference to the user who owns this active month record  
"month": "September", // The name of the active month  
"year": 2024, // The year of the active month  
"isActive": true, // Flag indicating whether this is the current active month  
"createdAt": ISODate("2024-09-01T00:00:00Z"), // Timestamp when this record was created  
"updatedAt": ISODate("2024-09-01T00:00:00Z") // Timestamp for the last update  
}  

### Fields

- \_id: Unique identifier for the \`ActiveMonthRecord\`.
- userId: The ID of the user who owns this record.
- month: The name of the active month (e.g., "September").
- year: The year for the active month (e.g., 2024).
- isActive: Boolean flag indicating whether this month is currently active.
- createdAt: Timestamp when the document was created.
- updatedAt: Timestamp when the document was last updated.

## Use Cases

### 1\. Add Expense Type and Categories

When a user wants to add a new expense type and define categories:

- Create a new document in the ExpenseType collection.
- Add categories as an embedded array inside the document.

### 2\. Log an Expense

When a user logs a new expense:

- Create a new document in the Expense collection, linking it to the relevant userId, type, and category.

### 3\. Manage Categories for an Expense Type

Users can activate or deactivate categories within each expense type:

- Update the isActive field within the embedded categories array.

### 4\. Track Active Month Record

To track the expenses for the current month:

- Create or update a document in the ActiveMonthRecord collection with the isActive flag set to true.

### 5\. Querying User's Active Categories

To retrieve all active categories for a user's expense type:

db.ExpenseType.find({  
userId: ObjectId("userId"),  
"categories.isActive": true  
})

### 6\. Querying Active Month Record

To get the current active month for a user:

db.ActiveMonthRecord.findOne({  
userId: ObjectId("userId"),  
isActive: true  
})

### 7\. Fetching Expenses for a User

To retrieve all expenses for a user within the active month:

db.Expense.find({  
userId: ObjectId("userId"),  
createdAt: {  
$gte: ISODate("2024-09-01T00:00:00Z"), // Start of the month  
$lt: ISODate("2024-10-01T00:00:00Z") // End of the month  
}  
})

## Schema Relations

- **ExpenseType ↔ User**: Each ExpenseType is linked to a specific user by the userId field.
- **Categories Embedded in ExpenseType**: Categories are embedded directly within the ExpenseType collection to simplify querying and updating.
- **Expense ↔ User**: Each expense is tied to a specific user by the userId field.
- **Expense ↔ ExpenseType**: Each expense is associated with a type and category, which are part of the ExpenseType collection.
- **ActiveMonthRecord ↔ User**: Each ActiveMonthRecord is tied to a specific user by the userId field.

## Benefits of This Design

- **Simplicity**: By embedding categories directly in the ExpenseType collection, we reduce the complexity of relationships and querying.
- **Performance**: Fewer queries and no need for joins or reference lookups, which improves read performance.
- **Flexibility**: Users can manage their own expense types and categories, with full control over which categories are active or inactive.
- **Scalability**: The schema is designed to scale with multiple users, each having their own unique expense types, categories, and active month records.

## Future Considerations

- If the number of categories becomes too large, we could consider normalizing the categories into their own collection, but this isn't necessary for the current design.
- Additional metadata (e.g., custom category colors, icons) could be added to the categories array in the future if needed.
