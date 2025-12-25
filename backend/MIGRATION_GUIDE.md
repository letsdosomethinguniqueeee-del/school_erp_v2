# Student ID Migration Guide

## Overview
This migration updates the student ID format from the old format to the new format: **DPS{YY}{CLASS}{ROLL}**

### New Student ID Format
- **DPS**: School name prefix
- **{YY}**: Last 2 digits of admission year (e.g., 25 for 2025)
- **{CLASS}**: Class code (NUR=Nursery, LKG=LKG, UKG=UKG, 01=1st, 02=2nd, etc.)
- **{ROLL}**: Roll number padded to 3 digits (e.g., 001, 002, 003)

### Examples
- `DPS25NUR001` = DPS + 25 (2025) + NUR (Nursery) + 001 (roll)
- `DPS25LKG001` = DPS + 25 (2025) + LKG (LKG) + 001 (roll)
- `DPS25UKG001` = DPS + 25 (2025) + UKG (UKG) + 001 (roll)
- `DPS2501001` = DPS + 25 (2025) + 01 (1st) + 001 (roll)

## Prerequisites
1. MongoDB must be running
2. Backend server should be accessible
3. Database connection configured properly

## Running the Migration

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Step 2: Run the Migration Script
```bash
cd backend
npm run migrate-students
```

### Step 3: Confirm Migration
The script will:
1. Ask for confirmation before proceeding
2. Clear all existing students and student users
3. Create 10 sample students with the new ID format
4. Create corresponding user accounts

## What the Migration Does

### Deletes:
- All existing student records
- All existing user accounts with role 'student'

### Creates:
- 10 sample students with new ID format
- Corresponding user accounts with password "Password"
- Students across different classes (Nursery to 7th)

## Sample Students Created
1. **DPS25NUR001** - Rajesh Kumar Sharma (Nursery A)
2. **DPS25LKG001** - Priya Singh (LKG A)
3. **DPS25UKG001** - Arjun Raj Patel (UKG A)
4. **DPS2501001** - Sneha Kumari Gupta (1st A)
5. **DPS2502001** - Rohit Kumar Verma (2nd A)
6. **DPS2503001** - Ananya Joshi (3rd A)
7. **DPS2504001** - Vikram Singh Yadav (4th A)
8. **DPS2505001** - Kavya Sharma Mishra (5th A)
9. **DPS2506001** - Aditya Kumar Tiwari (6th A)
10. **DPS2507001** - Ishita Kumari Agarwal (7th A)

## Frontend Changes
- Student table now has pagination (10 records per page)
- Better styled table headers
- Edit and Delete action buttons
- Student ID format validation in forms
- Format hint in student creation form

## Backend Changes
- Pagination support for students API
- Student ID format validation
- Delete functionality for students

## Class Code Mapping
```
Nursery: NUR
LKG: LKG
UKG: UKG
1st: 01
2nd: 02
3rd: 03
4th: 04
5th: 05
6th: 06
7th: 07
8th: 08
9th: 09
10th: 10
11th: 11
12th: 12
```

## Troubleshooting

### MongoDB Connection Error
If you get a MongoDB connection error:
1. Make sure MongoDB is installed and running
2. Check if the connection string in `.env` is correct
3. Try starting MongoDB manually

### Permission Errors
Make sure you have proper permissions to:
- Connect to MongoDB
- Create/delete collections
- Run Node.js scripts

## Rollback
If you need to rollback:
1. The migration script doesn't create backups
2. You'll need to restore from a previous database backup
3. Or manually recreate students with old format

## Next Steps
After migration:
1. Test the student creation form with new ID format
2. Verify pagination works correctly
3. Test edit/delete functionality
4. Update any external systems that reference student IDs
