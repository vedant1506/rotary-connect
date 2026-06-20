import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    age: {
      type: String,
      required: true,
      trim: true,
    },
    bloodType: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      default: 'Registered',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);

export default Volunteer;
