

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
  