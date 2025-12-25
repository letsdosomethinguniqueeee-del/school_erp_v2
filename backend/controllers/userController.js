const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Get the full user details for the requesting user
    const requestingUser = await User.findById(req.user.id);
    const isSuperAdmin = requestingUser && requestingUser.role === 'super-admin';
    
    console.log('Requesting user role:', requestingUser?.role, 'Is super admin:', isSuperAdmin);
    
    // If super admin, include passwords; otherwise exclude them
    const users = await User.find({});
    
    // Process users based on admin status
    const processedUsers = users.map(user => {
      const userObj = user.toObject(); // Use toObject() to bypass automatic password removal
      if (!isSuperAdmin) {
        delete userObj.password; // Remove password for non-super-admin users
        delete userObj.originalPassword; // Remove original password for non-super-admin users
      } else {
        // For super admin, show the decrypted password
        try {
          userObj.password = user.getDecryptedPassword() || userObj.originalPassword;
        } catch (error) {
          userObj.password = userObj.originalPassword;
        }
      }
      return userObj;
    });
    
    console.log('Total users fetched:', processedUsers.length);
    res.status(200).json({ users: processedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { userId, name, password, role, isActive = true } = req.body;

    // Validate required fields
    if (!userId || !password || !role) {
      return res.status(400).json({ message: 'userId, password, and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userId, role });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID and role already exists' });
    }

    // Create new user
    const user = new User({
      userId,
      name: name || '',
      password,
      role,
      isActive
    });

    await user.save();

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, password, role, isActive } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new userId and role combination already exists (excluding current user)
    if (userId && role) {
      const existingUser = await User.findOne({ 
        userId, 
        role, 
        _id: { $ne: id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this ID and role already exists' });
      }
    }

    // Update fields
    if (userId) user.userId = userId;
    if (name !== undefined) user.name = name;
    if (password) user.password = password;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ 
      message: 'User updated successfully',
      user: userResponse 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: userResponse 
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the full user details for the requesting user
    const requestingUser = await User.findById(req.user.id);
    const isSuperAdmin = requestingUser && requestingUser.role === 'super-admin';

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process user based on admin status
    const userObj = user.toObject(); // Use toObject() to bypass automatic password removal
    if (!isSuperAdmin) {
      delete userObj.password; // Remove password for non-super-admin users
      delete userObj.originalPassword; // Remove original password for non-super-admin users
    } else {
      // For super admin, show the original password instead of hashed password
      userObj.password = userObj.originalPassword || userObj.password;
    }

    res.status(200).json({ user: userObj });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

