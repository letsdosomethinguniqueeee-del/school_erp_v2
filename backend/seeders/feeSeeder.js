const mongoose = require('mongoose');
const Fee = require('../models/feeStructure');
const Transaction = require('../models/transactionModel');

// Sample fee structures data
const sampleFeeStructures = [
  {
    SessionYear: '2024-2025',
    Class: '1st',
    FeesBreakDown: [
      { title: 'Tuition Fee', amount: '5000' },
      { title: 'Library Fee', amount: '500' },
      { title: 'Sports Fee', amount: '300' }
    ],
    InstallmentBreakDown: [
      { installment: '1st Installment', amount: '2900', dueDate: new Date('2024-04-01') },
      { installment: '2nd Installment', amount: '2900', dueDate: new Date('2024-07-01') }
    ]
  },
  {
    SessionYear: '2024-2025',
    Class: '2nd',
    FeesBreakDown: [
      { title: 'Tuition Fee', amount: '5500' },
      { title: 'Library Fee', amount: '500' },
      { title: 'Sports Fee', amount: '300' },
      { title: 'Lab Fee', amount: '200' }
    ],
    InstallmentBreakDown: [
      { installment: '1st Installment', amount: '3250', dueDate: new Date('2024-04-01') },
      { installment: '2nd Installment', amount: '3250', dueDate: new Date('2024-07-01') }
    ]
  },
  {
    SessionYear: '2024-2025',
    Class: '3rd',
    FeesBreakDown: [
      { title: 'Tuition Fee', amount: '6000' },
      { title: 'Library Fee', amount: '500' },
      { title: 'Sports Fee', amount: '300' },
      { title: 'Lab Fee', amount: '200' }
    ],
    InstallmentBreakDown: [
      { installment: '1st Installment', amount: '3500', dueDate: new Date('2024-04-01') },
      { installment: '2nd Installment', amount: '3500', dueDate: new Date('2024-07-01') }
    ]
  }
];

// Sample transactions data
const sampleTransactions = [
  {
    studentId: '1',
    sessionYear: '2024-2025',
    amount: 2900,
    amountMode: 'Cash',
    feesType: 'Tuition Fee',
    transactionId: 'TXN001',
    receiptId: 'RCP001',
    date: new Date('2024-01-15')
  },
  {
    studentId: '2',
    sessionYear: '2024-2025',
    amount: 3250,
    amountMode: 'Online Transfer',
    feesType: 'Tuition Fee',
    transactionId: 'TXN002',
    receiptId: 'RCP002',
    date: new Date('2024-01-20')
  }
];

const seedFeeData = async () => {
  try {
    // Clear existing data
    await Fee.deleteMany({});
    await Transaction.deleteMany({});
    
    console.log('Cleared existing fee data...');
    
    // Insert sample fee structures
    const feeStructures = await Fee.insertMany(sampleFeeStructures);
    console.log(`Inserted ${feeStructures.length} fee structures`);
    
    // Insert sample transactions
    const transactions = await Transaction.insertMany(sampleTransactions);
    console.log(`Inserted ${transactions.length} transactions`);
    
    console.log('Fee data seeding completed successfully!');
    
    return {
      feeStructures: feeStructures.length,
      transactions: transactions.length
    };
  } catch (error) {
    console.error('Error seeding fee data:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(async () => {
    console.log('Connected to MongoDB');
    await seedFeeData();
    process.exit(0);
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = { seedFeeData };
