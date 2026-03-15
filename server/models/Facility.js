import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Stage', 'Quadrangle', 'AVR', 'ACCRE', 'Dance Hall', 'DT Lab', 'Other'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  equipment: [{
    name: String,
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available'
  },
  icon: {
    type: String,
    default: '🏛️'
  }
}, {
  timestamps: true
});

const Facility = mongoose.model('Facility', facilitySchema);

export default Facility;