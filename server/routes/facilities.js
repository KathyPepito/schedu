import express from 'express';
import Facility from '../models/Facility.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { type, status, sort } = req.query;
    
    let query = {};
    
    if (type && type !== 'All Types') {
      query.type = type;
    }
    
    if (status && status !== 'All Status') {
      query.status = status;
    }

    let facilities = Facility.find(query);

    if (sort === 'name') {
      facilities = facilities.sort({ name: 1 });
    } else if (sort === 'capacity') {
      facilities = facilities.sort({ capacity: -1 });
    }

    const result = await facilities;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);

    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json({ message: 'Facility removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;