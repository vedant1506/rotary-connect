import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Volunteer", "Patient", "Family Member"
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    approved: {
      // Admin can flip this to true to show it publicly
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.models.Story || mongoose.model('Story', StorySchema);

export default Story;
