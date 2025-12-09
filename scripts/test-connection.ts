// Test MongoDB connection
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env.local') })

import { getDatabase } from '../lib/mongodb'

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...')
    
    // Set environment variable if not loaded
    if (!process.env.MONGODB_URI) {
      process.env.MONGODB_URI = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0'
    }
    
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found ✓' : 'Missing ✗')
    
    const db = await getDatabase()
    console.log('✅ Database connection successful!')
    console.log('📊 Database name:', db.databaseName)
    
    // Test listing collections
    const collections = await db.listCollections().toArray()
    console.log('\n📁 Existing collections:')
    if (collections.length === 0) {
      console.log('   (No collections found - database is empty)')
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`)
      })
    }
    
    // Test a simple query
    const usersCollection = db.collection('users')
    const userCount = await usersCollection.countDocuments()
    console.log(`\n👥 Users in database: ${userCount}`)
    
    const centresCollection = db.collection('centres')
    const centreCount = await centresCollection.countDocuments()
    console.log(`🏥 Centres in database: ${centreCount}`)
    
    const patientsCollection = db.collection('patients')
    const patientCount = await patientsCollection.countDocuments()
    console.log(`👤 Patients in database: ${patientCount}`)
    
    const queriesCollection = db.collection('queries')
    const queryCount = await queriesCollection.countDocuments()
    console.log(`❓ Queries in database: ${queryCount}`)
    
    const ordersCollection = db.collection('orders')
    const orderCount = await ordersCollection.countDocuments()
    console.log(`📋 Orders in database: ${orderCount}`)
    
    console.log('\n✅ Connection test completed successfully!')
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Connection test failed!')
    console.error('Error:', error.message)
    if (error.message.includes('authentication')) {
      console.error('\n💡 Tip: Check your MongoDB credentials and IP whitelist in MongoDB Atlas')
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Tip: Check your internet connection and MongoDB Atlas cluster status')
    }
    process.exit(1)
  }
}

testConnection()

