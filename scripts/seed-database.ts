// Seed script to initialize MongoDB database with initial data
import dotenv from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Set environment variable if not loaded
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0'
}

import { getDatabase } from '../lib/mongodb'
import { generateEmployeeCode } from '../lib/employee-code'

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
]

async function seedDatabase() {
  try {
    console.log('Connecting to database...')
    const db = await getDatabase()

    // Seed Users
    console.log('Seeding users...')
    const usersCollection = db.collection('users')
    
    // Hash default password
    const defaultPassword = 'admin123'
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds)
    
    const users = [
      {
        id: "admin1",
        name: "Dr. Rajesh Kumar",
        email: "admin@rehab.gov.in",
        role: "super_admin",
        centreId: null,
        password: hashedPassword,
        status: "approved", // Super admin is auto-approved
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "admin2",
        name: "Mr. Anil Deshmukh",
        email: "centrea@example.com",
        role: "centre_admin",
        centreId: "C001",
        password: hashedPassword,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "admin3",
        name: "Dr. Priya Sharma",
        email: "centreb@example.com",
        role: "centre_admin",
        centreId: "C002",
        password: hashedPassword,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const user of users) {
      // Generate employee code for each user
      const employeeCode = await generateEmployeeCode(user.role)
      const userWithCode = { ...user, employeeCode }
      
      await usersCollection.updateOne(
        { email: user.email },
        { $set: userWithCode },
        { upsert: true }
      )
    }
    console.log('✓ Users seeded (Default password for all: admin123)')
    console.log('✓ Users seeded')

    // Seed Centres
    console.log('Seeding centres...')
    const centresCollection = db.collection('centres')
    const centres = [
      {
        id: "C001",
        name: "Mumbai Central Rehabilitation Centre",
        state: "Maharashtra",
        city: "Mumbai",
        address: "123, Bandra West, Mumbai - 400050",
        phone: "022-12345678",
        email: "mumbai@rehab.gov.in",
        capacity: 150,
        administrator: "Mr. Anil Deshmukh",
        adminEmail: "anil@rehab.gov.in",
        status: "active",
        createdAt: "2023-01-15",
        updatedAt: new Date(),
      },
      {
        id: "C002",
        name: "Delhi AIIMS De-addiction Centre",
        state: "Delhi",
        city: "New Delhi",
        address: "AIIMS Campus, Ansari Nagar, New Delhi",
        phone: "011-26588500",
        email: "delhi@rehab.gov.in",
        capacity: 200,
        administrator: "Dr. Priya Sharma",
        adminEmail: "priya@rehab.gov.in",
        status: "active",
        createdAt: "2022-06-01",
        updatedAt: new Date(),
      },
      {
        id: "C003",
        name: "Bengaluru Hope Foundation Centre",
        state: "Karnataka",
        city: "Bengaluru",
        address: "45, Koramangala, Bengaluru",
        phone: "080-23456789",
        email: "bengaluru@rehab.gov.in",
        capacity: 100,
        administrator: "Dr. Venkatesh Iyer",
        adminEmail: "venkatesh@rehab.gov.in",
        status: "active",
        createdAt: "2023-03-20",
        updatedAt: new Date(),
      },
      {
        id: "C004",
        name: "Chennai Recovery Centre",
        state: "Tamil Nadu",
        city: "Chennai",
        address: "78, T. Nagar, Chennai",
        phone: "044-34567890",
        email: "chennai@rehab.gov.in",
        capacity: 120,
        administrator: "Dr. Lakshmi Narayanan",
        adminEmail: "lakshmi@rehab.gov.in",
        status: "active",
        createdAt: "2023-05-10",
        updatedAt: new Date(),
      },
    ]

    for (const centre of centres) {
      await centresCollection.updateOne(
        { id: centre.id },
        { $set: centre },
        { upsert: true }
      )
    }
    console.log('✓ Centres seeded')

    // Seed Patients
    console.log('Seeding patients...')
    const patientsCollection = db.collection('patients')
    const patients = [
      {
        id: "P001",
        centreId: "C001",
        name: "Rahul Verma",
        dob: "1992-05-15",
        age: 32,
        gender: "male",
        phone: "9876543210",
        email: "rahul@email.com",
        address: "45, Andheri East, Mumbai",
        aadharNumber: "1234-5678-9012",
        familyContactName: "Sanjay Verma (Father)",
        familyContactPhone: "9876543211",
        addictionType: "Alcohol",
        admissionDate: "2024-01-10",
        status: "under_treatment",
        medications: [
          {
            id: "MED001",
            name: "Naltrexone",
            dosage: "50mg",
            frequency: "Once daily",
            prescribedBy: "Dr. Anil Sharma",
            startDate: "2024-01-12",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "P002",
        centreId: "C001",
        name: "Priya Patel",
        dob: "1988-11-22",
        age: 36,
        gender: "female",
        phone: "9876543220",
        email: "priya@email.com",
        address: "22, Powai, Mumbai",
        aadharNumber: "2345-6789-0123",
        familyContactName: "Meera Patel (Mother)",
        familyContactPhone: "9876543221",
        addictionType: "Prescription Drugs",
        admissionDate: "2024-02-05",
        status: "recovering",
        medications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "P003",
        centreId: "C002",
        name: "Amit Singh",
        dob: "1995-03-08",
        age: 29,
        gender: "male",
        phone: "9876543230",
        email: "amit@email.com",
        address: "12, Rohini, New Delhi",
        aadharNumber: "3456-7890-1234",
        familyContactName: "Rajesh Singh (Brother)",
        familyContactPhone: "9876543231",
        addictionType: "Opioids (Heroin, Morphine)",
        admissionDate: "2024-01-20",
        status: "under_treatment",
        medications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "P004",
        centreId: "C003",
        name: "Divya Reddy",
        dob: "1990-07-14",
        age: 34,
        gender: "female",
        phone: "9876543240",
        email: "divya@email.com",
        address: "56, Whitefield, Bengaluru",
        aadharNumber: "4567-8901-2345",
        familyContactName: "Krishna Reddy (Husband)",
        familyContactPhone: "9876543241",
        addictionType: "Alcohol",
        admissionDate: "2023-12-15",
        status: "discharged",
        medications: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const patient of patients) {
      await patientsCollection.updateOne(
        { id: patient.id },
        { $set: patient },
        { upsert: true }
      )
    }
    console.log('✓ Patients seeded')

    // Seed Queries
    console.log('Seeding queries...')
    const queriesCollection = db.collection('queries')
    const queries = [
      {
        id: "QRY001",
        centreId: "C001",
        centreName: "Mumbai Central Rehabilitation Centre",
        subject: "Request for Additional Medical Staff",
        description: "Due to increased patient admissions, we require 2 additional psychiatrists.",
        priority: "high",
        status: "open",
        createdBy: "Mr. Anil Deshmukh",
        createdAt: "2024-03-01",
        responses: [],
        updatedAt: new Date(),
      },
      {
        id: "QRY002",
        centreId: "C002",
        centreName: "Delhi AIIMS De-addiction Centre",
        subject: "Equipment Maintenance Required",
        description: "Several medical equipment need urgent maintenance.",
        priority: "medium",
        status: "in_progress",
        createdBy: "Dr. Priya Sharma",
        createdAt: "2024-02-25",
        responses: [
          {
            id: "RES001",
            message: "Maintenance team has been notified.",
            respondedBy: "Dr. Rajesh Kumar",
            respondedAt: "2024-02-26",
            isAdmin: true,
          },
        ],
        updatedAt: new Date(),
      },
    ]

    for (const query of queries) {
      await queriesCollection.updateOne(
        { id: query.id },
        { $set: query },
        { upsert: true }
      )
    }
    console.log('✓ Queries seeded')

    // Seed Orders
    console.log('Seeding orders...')
    const ordersCollection = db.collection('orders')
    const orders = [
      {
        id: "ORD001",
        subject: "Monthly Patient Report Submission",
        instruction: "All centres must submit monthly patient progress reports by 5th of every month.",
        targetCentreId: null,
        targetCentreName: "All Centres",
        priority: "high",
        status: "issued",
        deadline: "2024-03-05",
        issuedBy: "Dr. Rajesh Kumar",
        issuedAt: "2024-03-01",
        acknowledgements: [],
        updatedAt: new Date(),
      },
      {
        id: "ORD002",
        subject: "New Safety Protocol Implementation",
        instruction: "Implement updated safety protocols as per Ministry guidelines.",
        targetCentreId: "C001",
        targetCentreName: "Mumbai Central Rehabilitation Centre",
        priority: "critical",
        status: "acknowledged",
        deadline: "2024-03-10",
        issuedBy: "Dr. Rajesh Kumar",
        issuedAt: "2024-02-28",
        acknowledgements: [
          {
            centreId: "C001",
            acknowledgedBy: "Mr. Anil Deshmukh",
            acknowledgedAt: "2024-03-01",
          },
        ],
        updatedAt: new Date(),
      },
    ]

    for (const order of orders) {
      await ordersCollection.updateOne(
        { id: order.id },
        { $set: order },
        { upsert: true }
      )
    }
    console.log('✓ Orders seeded')

    console.log('\n✅ Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

