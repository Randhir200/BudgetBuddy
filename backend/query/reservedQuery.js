

// collect monthly data in descending order by date and sum of price that is not equal savings

db.Expense.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new ISODate("2024-10-01T00:00:00Z"),
        $lt: new ISODate("2024-11-01T00:00:00Z")
      },
      userId: "6638bbb72ee0057ac3f3e21a" // Filter by userId
    }
  },
  {
    $sort: { "createdAt": -1 } // Sort by createdAt in descending order (latest first)
  },
  {
    $group: {
      _id: "$userId",
      documents: { $push: "$$ROOT" } // Store all documents in an array
    }
  },
  {
    $project: {
      _id: 1,
      documents: 1,
      filteredDocuments: {
        $filter: {
          input: "$documents",
          as: "doc",
          cond: {
            $and: [
              { $ne: ["$$doc.type", "Savings"] },
              { $ne: ["$$doc.type", "Sainvg"] },
              { $ne: ["$$doc.type", "savings"] },
              { $ne: ["$$doc.type", "saving"] }
            ]
          }
        }
      },
      totalAmount: {
        $sum: {
          $filter: {
            input: "$documents",
            as: "doc",
            cond: {
              $and: [
                { $ne: ["$$doc.type", "Savings"] },
                { $ne: ["$$doc.type", "Sainvg"] },
                { $ne: ["$$doc.type", "savings"] },
                { $ne: ["$$doc.type", "saving"] }
              ]
            }
          }
        }
      }
    }
  },
  {
    $project: {
      _id: 1,
      totalAmount: {
        $sum: "$filteredDocuments.price" // Sum prices only for filtered documents
      },
      documents: 1,
      filteredDocuments: 1,
    }
  }
]);


///



//   Step 1: Identify Duplicates and Collect IDs to Delete
// This command will identify duplicate records and collect their IDs into an array, skipping the first occurrence for each duplicate.

// javascript
// Copy code
const duplicates = db.expensetypes.aggregate([
  {
    $group: {
      _id: { userId: "$userId", type: "$type" },
      count: { $sum: 1 },
      ids: { $push: "$_id" }
    }
  },
  {
    $match: {
      count: { $gt: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      ids: { $slice: ["$ids", 1, { $subtract: ["$count", 1] }] } // Skip the first occurrence
    }
  }
]).toArray();


// Step 2: Delete Duplicates
// Now that we have an array of IDs to delete, we can loop through it and delete the records:

// javascript
// Copy code

duplicates.forEach(doc => {
  db.expensetypes.deleteMany({ _id: { $in: doc.ids } });
});


// type based expenses

db.Expense.aggregate([
  {
    $match: {
      createdAt: {
        $gte: ISODate('2024-10-01T00:00:00.000Z'),
        $lte: ISODate('2024-10-31T23:59:59.999Z')
      }
    }
  },
  {
    $group: {
      _id: '$type',
      totalExpenseType: { $sum: 1 },
      totalExpense: { $sum: '$price' },
    },
    $group : {
        _id: '$category',
         totalCat : {$sum : 1},
         totalCatAmount: {$sum : '$category'}           
    },
  }]);

  //


  //optimized

  db.Expense.aggregate([
    {
      $match: {
        createdAt: {
          $gte: ISODate('2024-10-01T00:00:00.000Z'),
          $lte: ISODate('2024-10-31T23:59:59.999Z')
        }
      }
    },
    // Step 1: Group by type and category to get totalCat and totalCatAmount for each category
    {
      $group: {
        _id: { type: "$type", category: "$category" },
        totalCat: { $sum: 1 },
        totalCatAmount: { $sum: "$price" }
      }
    },
    // Step 2: Regroup by type and create an array of categories
    {
      $group: {
        _id: "$_id.type",
        categories: {
          $push: {
            category: "$_id.category",
            totalCat: "$totalCat",
            totalCatAmount: "$totalCatAmount"
          }
        },
        totalTypeAmount: { $sum: "$totalCatAmount" }
      }
    },
    // Optional: Rename _id field to type for clarity
    {
      $project: {
        type: "$_id",
        categories: 1,
        totalTypeAmount: 1,
        _id: 0
      }
    }
  ]);
  


  ///
  db.Expense.aggregate([
    {
      $match: {
        createdAt: {
          $gte: ISODate('2024-10-01T00:00:00.000Z'),
          $lte: ISODate('2024-10-31T23:59:59.999Z')
        }
      }
    },
    // Step 1: Group by type and category to get totalCat and totalCatAmount for each category
    {
      $group: {
        _id: { type: "$type", category: "$category" },
        totalCat: { $sum: 1 },
        totalCatAmount: { $sum: "$price" }
      }
    },
    {
      $group: {
        _id: "$_id.type",
        categories: {
          $push: {
            category: "$_id.category",
            totalCat: "$totalCat",
            totalCatAmount: "$totalCatAmount"
          }
        },
        totalTypeAmount: { $sum: "$totalCatAmount" }
      }
    },
  ]);


  // 


const totalExpense = db.Expense.aggregate([
  { $match: { userId: ObjectId('6638bbb72ee0057ac3f3e21a') } },
  { $group: { _id: null, totalPrice: { $sum: "$price" } } }
]).toArray();

const expenseTotal = totalExpense[0]?.totalPrice || 0;

db.Balance.updateOne(
  { userId: ObjectId('6638bbb72ee0057ac3f3e21a')  },
  { $inc: { currentBalance: -expenseTotal } }
);


///



db.Expense.aggregate([
  {
    $match: {
      userId: '6638bbb72ee0057ac3f3e21a', // Match specific user if needed
      createdAt: {
        $gte: ISODate("2024-11-01T00:00:00.000Z"),  // Start date
        $lte: ISODate("2024-11-31T23:59:59.999Z")   // End date
      }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by unique date
      totalExpense: { $sum: "$price" },     // Sum of all prices for that date
      expenses: { $push: "$$ROOT" }         // Array of all expense docs for that date
    }
  },
  {
    $sort: { "_id": 1 }  // Sort by date in ascending order; use -1 for descending
  }
]);


//


db.ExpenseType.updateOne(
  {
    _id: ObjectId("671d1872f0c2afc6720eee9a"),   // Document identifier
    "categories.0": { $exists: true }            // Checks if categories array has at least one element
  },
  {
    $push: {
      categories: {
        name: "Faimly care",
        description: "",
        isActive: true,
        _id: ObjectId()  // Generates a new ObjectId for the new category
      }
    }
  }
);

///