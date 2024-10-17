## Backend
```
project-root/
│
├── src/
│   ├── controllers/
│   │   └── expenseController.js
│   │   └── incomeController.js
│   │
│   ├── models/
│   │   └── expenseModel.js
│   │   └── incomeModel.js
│   │
│   ├── routes/
│   │   └── expenseRoutes.js
│   │   └── incomeRoutes.js
│   │
│   ├── middlewares/
│   │   ├── validations/
│   │   │   └── expenseValidation.js
│   │   │   └── incomeValidation.js
│   │   └── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── services/
│   │   └── expenseService.js
│   │   └── incomeService.js
│   │
│   ├── utils/
│   │   └── logger.js
│   │   └── helper.js
│   │
│   ├── config/
│   │   └── dbConfig.js
│   │   └── appConfig.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── expense.test.js
│   └── income.test.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Frontend
``` 
project-root/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   └── Expense/
│   │       └── ExpenseForm.js
│   │       └── ExpenseList.js
│   │       └── ExpenseItem.js
│   │   └── Income/
│   │       └── IncomeForm.js
│   │       └── IncomeList.js
│   │       └── IncomeItem.js
│   │   └── common/
│   │       └── Header.js
│   │       └── Footer.js
│   │       └── Navbar.js
│   │
│   ├── pages/
│   │   └── HomePage.js
│   │   └── ExpensePage.js
│   │   └── IncomePage.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── hooks/
│   │   └── useFetch.js
│   │
│   ├── context/
│   │   └── ExpenseContext.js
│   │   └── IncomeContext.js
│   │
│   ├── redux/
│   │   ├── slices/
│   │   │   └── expenseSlice.js
│   │   │   └── incomeSlice.js
│   │   ├── store.js
│   │   └── selectors.js
│   │
│   ├── styles/
│   │   └── App.css
│   │   └── Expense.css
│   │   └── Income.css
│   │
│   ├── App.js
│   ├── index.js
│   └── reportWebVitals.js
│
├── .env
├── .gitignore
├── package.json
└── README.md

```
