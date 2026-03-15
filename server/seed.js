import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Facility from './models/Facility.js';
import Reservation from './models/Reservation.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Facility.deleteMany({});
    await Reservation.deleteMany({});
    console.log('✅ Data cleared');

    console.log('👥 Creating users...');
    
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@smcc.edu.ph',
        password: 'admin123',
        role: 'admin',
        department: 'Administration',
        contactNumber: '09123456789'
      },
      {
        name: 'Prof. Maria Santos',
        email: 'maria.santos@smcc.edu.ph',
        password: 'teacher123',
        role: 'teacher',
        department: 'CCIS',
        contactNumber: '09234567890'
      },
      {
        name: 'Prof. John Dela Cruz',
        email: 'john.delacruz@smcc.edu.ph',
        password: 'teacher123',
        role: 'teacher',
        department: 'CAS',
        contactNumber: '09345678901'
      },
      {
        name: 'Kathy Pepito',
        email: 'kathy.pepito@smcc.edu.ph',
        password: 'student123',
        role: 'student',
        studentId: '2021-00001',
        section: 'BSIT 2A',
        contactNumber: '09456789012'
      },
      {
        name: 'Maria Clara',
        email: 'maria.clara@smcc.edu.ph',
        password: 'student123',
        role: 'student',
        studentId: '2021-00002',
        section: 'BSIT 2B',
        contactNumber: '09567890123'
      },
      {
        name: 'Pedro Cruz',
        email: 'pedro.cruz@smcc.edu.ph',
        password: 'student123',
        role: 'student',
        studentId: '2021-00003',
        section: 'BSCS 4A',
        contactNumber: '09678901234'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    console.log('🏛️  Creating facilities...');

    const facilities = await Facility.create([
      {
        name: 'Stage',
        type: 'Stage',
        capacity: 500,
        location: 'Main Building Ground Floor',
        description: 'Large indoor stage facility with seating for 500 people. Perfect for seminars, workshops, and major events.',
        equipment: [
          { name: 'Sound System', quantity: 1 },
          { name: 'Projector', quantity: 2 },
          { name: 'Stage Lighting', quantity: 1 },
          { name: 'Microphones', quantity: 10 }
        ],
        status: 'Available',
        icon: '🎭'
      },
      {
        name: 'University Quadrangle',
        type: 'Quadrangle',
        location: 'Central Campus',
        capacity: 1000,
        description: 'Open courtyard space perfect for outdoor events, assemblies, and large gatherings.',
        equipment: [
          { name: 'Tent Canopy', quantity: 10 },
          { name: 'Stage Platform', quantity: 1 },
          { name: 'PA System', quantity: 1 },
          { name: 'Chairs', quantity: 500 }
        ],
        status: 'Available',
        icon: '🌳'
      },
      {
        name: 'AVR Room A',
        type: 'AVR',
        capacity: 80,
        location: 'Academic Building 2nd Floor',
        description: 'Audio-visual room equipped for presentations and multimedia learning.',
        equipment: [
          { name: 'Projector', quantity: 1 },
          { name: 'Screen', quantity: 1 },
          { name: 'Sound System', quantity: 1 },
          { name: 'Whiteboard', quantity: 1 },
          { name: 'Air Conditioning', quantity: 2 }
        ],
        status: 'Occupied',
        icon: '🎥'
      },
      {
        name: 'ACCRE',
        type: 'ACCRE',
        capacity: 40,
        location: 'Academic Building 3rd Floor',
        description: 'Design and drafting laboratory with specialized equipment for technical work.',
        equipment: [
          { name: 'Computers', quantity: 40 },
          { name: 'Projector', quantity: 1 },
          { name: 'Air Conditioning', quantity: 2 }
        ],
        status: 'Available',
        icon: '📄'
      },
      {
        name: 'Dance Hall',
        type: 'Dance Hall',
        capacity: 60,
        location: 'Student Center Building',
        description: 'Spacious hall with mirrors and sound system.',
        equipment: [
          { name: 'Mirror Walls', quantity: 4 },
          { name: 'Sound System', quantity: 1 },
          { name: 'Air Conditioning', quantity: 2 }
        ],
        status: 'Available',
        icon: '💃'
      },
      {
        name: 'DT Lab 101',
        type: 'DT Lab',
        capacity: 40,
        location: 'Engineering Building 1st Floor',
        description: 'Design and drafting laboratory.',
        equipment: [
          { name: 'Drafting Tables', quantity: 40 },
          { name: 'CAD Workstations', quantity: 20 }
        ],
        status: 'Available',
        icon: '📐'
      }
    ]);

    console.log(`✅ Created ${facilities.length} facilities`);

    console.log('📅 Creating sample reservations...');

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const reservations = await Reservation.create([
      {
        user: users[3]._id,
        facility: facilities[0]._id,
        dateFrom: nextWeek,
        dateTo: nextWeek,
        timeFrom: '14:00',
        timeTo: '17:00',
        purpose: 'CS Department Seminar on AI',
        equipment: [{
          soundSystem: true,
          wirelessMic: 2,
          chairs: 150
        }],
        remarks: 'Need technical support',
        teacherName: 'Prof. Maria Santos',
        section: 'BSCS 3A',
        status: 'Approved',
        reviewedBy: users[0]._id,
        reviewedAt: now
      },
      {
        user: users[4]._id,
        facility: facilities[2]._id,
        dateFrom: tomorrow,
        dateTo: tomorrow,
        timeFrom: '09:00',
        timeTo: '11:00',
        purpose: 'Research Presentation',
        equipment: [{
          soundSystem: true,
          smartTV: true
        }],
        teacherName: 'Prof. John Dela Cruz',
        section: 'BSIT 2B',
        status: 'Pending'
      }
    ]);

    console.log(`✅ Created ${reservations.length} reservations`);

    console.log('\n✨ ========================================');
    console.log('✨  DATABASE SEEDED SUCCESSFULLY!');
    console.log('✨ ========================================\n');

    console.log('🔐 TEST CREDENTIALS:\n');
    console.log('👨‍💼 ADMIN:');
    console.log('   Email: admin@smcc.edu.ph');
    console.log('   Password: admin123\n');

    console.log('👨‍🏫 TEACHER:');
    console.log('   Email: maria.santos@smcc.edu.ph');
    console.log('   Password: teacher123\n');

    console.log('👨‍🎓 STUDENT:');
    console.log('   Email: juan.pepito@smcc.edu.ph');
    console.log('   Password: student123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();