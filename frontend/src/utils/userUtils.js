// Common utility functions for user management

export const getRoleColor = (role) => {
  if (!role || role.trim() === '') {
    return 'red';
  }
  
  const roleColors = {
    'admin': 'blue',
    'super-admin': 'red',
    'teacher': 'teal',
    'student': 'green',
    'parent': 'purple',
    'staff': 'gray'
  };
  
  return roleColors[role] || 'gray';
};

export const getRoleDisplayName = (role) => {
  if (!role || role.trim() === '') {
    return 'No Role';
  }
  
  const roleNames = {
    'admin': 'Administrator',
    'super-admin': 'Super Admin',
    'teacher': 'Teacher',
    'student': 'Student',
    'parent': 'Parent',
    'staff': 'Staff'
  };
  
  return roleNames[role] || role;
};

export const getRoleShortName = (role) => {
  const shortNames = {
    'admin': 'AD',
    'super-admin': 'SA',
    'superadmin': 'SA',
    'teacher': 'TE',
    'student': 'ST',
    'parent': 'PA',
    'staff': 'SF'
  };
  return shortNames[role] || 'US';
};

export const formatStudentName = (student) => {
  const { firstName, middleName, lastName } = student;
  return `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();
};

export const getUniqueClasses = (students) => {
  const classes = [...new Set(students.map(student => student.currentStudyClass).filter(Boolean))];
  return classes.sort((a, b) => {
    // Sort classes numerically (1st, 2nd, 3rd, etc.)
    const aNum = parseInt(a.replace(/\D/g, ''));
    const bNum = parseInt(b.replace(/\D/g, ''));
    return aNum - bNum;
  });
};

export const filterStudents = (students, searchTerm, classFilter) => {
  return students.filter(student => {
    // Search filter
    const searchTermLower = searchTerm.toLowerCase().trim();
    let matchesSearch = true;
    
    if (searchTermLower) {
      // Create full name combinations for better search
      const fullName = formatStudentName(student).toLowerCase();
      const firstNameLastName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase().trim();
      const lastNameFirstName = `${student.lastName || ''} ${student.firstName || ''}`.toLowerCase().trim();
      
      matchesSearch = 
        student.studentId?.toLowerCase().includes(searchTermLower) ||
        student.firstName?.toLowerCase().includes(searchTermLower) ||
        student.middleName?.toLowerCase().includes(searchTermLower) ||
        student.lastName?.toLowerCase().includes(searchTermLower) ||
        student.rollNo?.toLowerCase().includes(searchTermLower) ||
        fullName.includes(searchTermLower) ||
        firstNameLastName.includes(searchTermLower) ||
        lastNameFirstName.includes(searchTermLower);
    }
    
    // Class filter
    const matchesClass = classFilter === 'all' || 
      student.currentStudyClass === classFilter;
    
    return matchesSearch && matchesClass;
  });
};

export const sortStudents = (students, sortField, sortDirection) => {
  return students.sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue, bValue;
    
    switch (sortField) {
      case 'studentId':
        aValue = a.studentId || '';
        bValue = b.studentId || '';
        break;
      case 'rollNo':
        aValue = a.rollNo || '';
        bValue = b.rollNo || '';
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
};

export const paginateData = (data, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};
