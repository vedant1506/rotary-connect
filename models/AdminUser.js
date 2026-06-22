import mongoose from 'mongoose';

const AdminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'volunteer'],
      default: 'volunteer',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    approved: {
      // Volunteers need admin approval before they can log in
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

export default AdminUser;
