import express from 'express';
import Reservation from '../models/Reservation.js';
import Facility from '../models/Facility.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reservations/stats
// @desc    Get reservation statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const now = new Date();

    const upcomingCount = await Reservation.countDocuments({
      ...query,
      status: 'Approved',
      dateFrom: { $gte: now }
    });

    const pendingCount = await Reservation.countDocuments({
      ...query,
      status: 'Pending'
    });

    const approvedCount = await Reservation.countDocuments({
      ...query,
      status: 'Approved'
    });

    const totalCount = await Reservation.countDocuments(query);

    res.json({
      upcoming: upcomingCount || 0,
      pending: pendingCount || 0,
      approved: approvedCount || 0,
      total: totalCount || 0
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch stats',
      error: error.message 
    });
  }
});

// @route   GET /api/reservations
// @desc    Get reservations (role-based)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student' || req.user.role === 'teacher') {
      query.user = req.user._id;
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email role studentId section department')
      .populate('facility', 'name type location')
      .sort({ createdAt: -1 })
      .lean();

    res.json(reservations || []);
  } catch (error) {
    console.error('Reservations Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reservations',
      error: error.message 
    });
  }
});

// @route   GET /api/reservations/:id
// @desc    Get single reservation
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('facility');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin' && reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Get Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/reservations
// @desc    Create reservation
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { facility, dateFrom, dateTo, timeFrom, timeTo, purpose, equipment, remarks, teacherName, section, department } = req.body;

    const facilityExists = await Facility.findById(facility);
    if (!facilityExists) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    const hasConflict = await Reservation.checkConflict(facility, new Date(dateFrom), new Date(dateTo));
    if (hasConflict) {
      return res.status(400).json({ message: 'Facility is already booked for this time period' });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      facility,
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
      purpose,
      equipment: equipment || {},
      remarks,
      teacherName: req.user.role === 'student' ? teacherName : req.user.name,
      section: req.user.role === 'student' ? section : req.user.section,
      department
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('user', 'name email role')
      .populate('facility');

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error('Create Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.dateFrom || req.body.dateTo) {
      const dateFrom = req.body.dateFrom ? new Date(req.body.dateFrom) : reservation.dateFrom;
      const dateTo = req.body.dateTo ? new Date(req.body.dateTo) : reservation.dateTo;
      
      const hasConflict = await Reservation.checkConflict(
        reservation.facility,
        dateFrom,
        dateTo,
        reservation._id
      );

      if (hasConflict) {
        return res.status(400).json({ message: 'Facility is already booked for this time period' });
      }
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email role').populate('facility');

    res.json(reservation);
  } catch (error) {
    console.error('Update Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reservations/:id/approve
// @desc    Approve reservation
// @access  Private/Admin/Teacher
router.put('/:id/approve', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = 'Approved';
    reservation.reviewedBy = req.user._id;
    reservation.reviewedAt = Date.now();

    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('user', 'name email role')
      .populate('facility')
      .populate('reviewedBy', 'name');

    res.json(updatedReservation);
  } catch (error) {
    console.error('Approve Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/reservations/:id/reject
// @desc    Reject reservation
// @access  Private/Admin/Teacher
router.put('/:id/reject', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.status = 'Rejected';
    reservation.rejectionReason = rejectionReason;
    reservation.reviewedBy = req.user._id;
    reservation.reviewedAt = Date.now();

    await reservation.save();

    const updatedReservation = await Reservation.findById(reservation._id)
      .populate('user', 'name email role')
      .populate('facility')
      .populate('reviewedBy', 'name');

    res.json(updatedReservation);
  } catch (error) {
    console.error('Reject Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel/Delete reservation
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    console.error('Delete Reservation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;