# MongoDB Setup for Fees Management

## 📋 Overview
This document explains the complete MongoDB setup for the School ERP Fees Management system.

## 🗄️ Database Models

### 1. Fee Structure Model (`feeStructure.js`)
**Collection**: `fees`

**Schema**:
```javascript
{
  SessionYear: String (required), // e.g., "2024-2025"
  Class: String (required),       // e.g., "1st", "2nd", "3rd"
  FeesBreakDown: [{
    title: String,    // e.g., "Tuition Fee"
    amount: String    // e.g., "5000"
  }],
  InstallmentBreakDown: [{
    installment: String,  // e.g., "1st Installment"
    amount: String,       // e.g., "2900"
    dueDate: Date        // e.g., "2024-04-01"
  }],
  timestamps: true
}
```

### 2. Transaction Model (`transactionModel.js`)
**Collection**: `transactions`

**Schema**:
```javascript
{
  studentId: String (required),    // Student ID
  sessionYear: String,             // Academic year
  amount: Number (required),       // Payment amount
  amountMode: String,              // Payment method
  feesType: String,                // Type of fee
  transactionId: String,           // Transaction reference
  receiptId: String,               // Receipt number
  date: Date (required),           // Payment date
  time: String,                    // Payment time
  timestamps: true
}
```

## 🚀 Setup Instructions

### 1. Environment Variables
Create a `.env` file in the backend directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Database
```bash
# Setup database with indexes and sample data
npm run setup-db

# Or just seed sample data
npm run seed-fees
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📊 Database Indexes

The following indexes are automatically created for optimal performance:

### Fee Structures
- `{ SessionYear: 1, Class: 1 }` - Compound index for class-specific queries
- `{ SessionYear: 1 }` - Index for academic year queries

### Transactions
- `{ studentId: 1, sessionYear: 1 }` - Compound index for student fee queries
- `{ sessionYear: 1 }` - Index for academic year queries
- `{ date: -1 }` - Descending index for recent transactions

## 🔌 API Endpoints

### Fee Structure Endpoints
```
GET    /api/fees                           # Get all fee structures
GET    /api/fees?sessionYear=2024-2025     # Filter by academic year
GET    /api/fees/:id                       # Get fee structure by ID
GET    /api/fees/class/:class/:sessionYear # Get fee structure by class
POST   /api/fees                           # Create new fee structure
PATCH  /api/fees/:id                       # Update fee structure
DELETE /api/fees/:id                       # Delete fee structure
```

### Transaction Endpoints
```
GET    /api/transactions                           # Get all transactions
GET    /api/transactions?sessionYear=2024-2025     # Filter by academic year
GET    /api/transactions?studentId=123             # Filter by student
GET    /api/transactions/student/:studentId        # Get student transactions
GET    /api/transactions/student/:studentId/summary # Get student fee summary
GET    /api/transactions/:id                       # Get transaction by ID
POST   /api/transactions                           # Create new transaction
PATCH  /api/transactions/:id                       # Update transaction
DELETE /api/transactions/:id                       # Delete transaction
```

## 📝 Sample Data

The seeder creates sample data for:

### Fee Structures
- Class 1st: ₹5,800 total (2 installments of ₹2,900)
- Class 2nd: ₹6,500 total (2 installments of ₹3,250)
- Class 3rd: ₹7,000 total (2 installments of ₹3,500)

### Sample Transactions
- Student 1: ₹2,900 payment (Cash)
- Student 2: ₹3,250 payment (Online Transfer)

## 🔧 Database Operations

### Create Fee Structure
```javascript
const feeStructure = {
  SessionYear: "2024-2025",
  Class: "4th",
  FeesBreakDown: [
    { title: "Tuition Fee", amount: "6500" },
    { title: "Library Fee", amount: "500" }
  ],
  InstallmentBreakDown: [
    { installment: "1st Installment", amount: "3500", dueDate: "2024-04-01" },
    { installment: "2nd Installment", amount: "3500", dueDate: "2024-07-01" }
  ]
};
```

### Create Transaction
```javascript
const transaction = {
  studentId: "123",
  sessionYear: "2024-2025",
  amount: 3500,
  amountMode: "UPI",
  feesType: "Tuition Fee",
  transactionId: "TXN123",
  receiptId: "RCP123",
  date: "2024-01-15"
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Error**: Check your MongoDB URI and network connectivity
2. **Index Creation Failed**: Ensure you have proper database permissions
3. **Seeding Failed**: Check if collections already exist and clear them first

### Reset Database
```bash
# Clear all data and reseed
npm run setup-db
```

## 📈 Performance Tips

1. **Use Indexes**: All queries are optimized with proper indexes
2. **Limit Results**: Use pagination for large datasets
3. **Filter Early**: Use query parameters to filter data at database level
4. **Cache Frequently**: Cache fee structures as they don't change often

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Access**: Use read-only users for frontend queries
3. **Input Validation**: All inputs are validated before database operations
4. **Rate Limiting**: API endpoints are rate-limited to prevent abuse

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
