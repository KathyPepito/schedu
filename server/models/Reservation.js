import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  timeFrom: {
    type: String,
    required: true
  },
  timeTo: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  equipment: [{
    fans: { type: Number, default: 0 },
    aircon: { type: Boolean, default: false },
    soundSystem: { type: Boolean, default: false },
    smartTV: { type: Boolean, default: false },
    chairs: { type: Number, default: 0 },
    tables: { type: Number, default: 0 },
    wirelessMic: { type: Number, default: 0 },
    wiredMic: { type: Number, default: 0 },
    ledScreen: { type: Boolean, default: false },
    redCarpet: { type: Boolean, default: false },
    stageLighting: { type: Boolean, default: false }
  }],
  remarks: {
    type: String
  },
  teacherName: {
    type: String
  },
  section: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

reservationSchema.index({ facility: 1, dateFrom: 1, dateTo: 1 });

reservationSchema.statics.checkConflict = async function(facilityId, dateFrom, dateTo, excludeId = null) {
  const query = {
    facility: facilityId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      {
        dateFrom: { $lte: dateTo },
        dateTo: { $gte: dateFrom }
      }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;