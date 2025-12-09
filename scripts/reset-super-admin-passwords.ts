// Script to reset super admin passwords
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

async function resetPasswords() {
  try {
    console.log('Connecting to database...')
    const db = await getDatabase()
    const usersCollection = db.collection('users')
    
    const saltRounds = 10
    
    // Reset password for admin@rehab.gov.in
    const adminPassword = 'admin123'
    const adminHashedPassword = await bcrypt.hash(adminPassword, saltRounds)
    
    const result1 = await usersCollection.updateOne(
      { email: 'admin@rehab.gov.in' },
      {
        $set: {
          password: adminHashedPassword,
          status: 'approved',
          updatedAt: new Date()
        }
      }
    )
    
    if (result1.matchedCount > 0) {
      console.log('✅ Updated password for admin@rehab.gov.in')
      console.log(`   Password: ${adminPassword}`)
    } else {
      console.log('❌ User admin@rehab.gov.in not found')
    }
    
    // Reset password for tanishkwie@gmail.com
    const tanishkPassword = 'tanishk109813'
    const tanishkHashedPassword = await bcrypt.hash(tanishkPassword, saltRounds)
    
    const result2 = await usersCollection.updateOne(
      { email: 'tanishkwie@gmail.com' },
      {
        $set: {
          password: tanishkHashedPassword,
          status: 'approved',
          updatedAt: new Date()
        }
      }
    )
    
    if (result2.matchedCount > 0) {
      console.log('✅ Updated password for tanishkwie@gmail.com')
      console.log(`   Password: ${tanishkPassword}`)
    } else {
      console.log('❌ User tanishkwie@gmail.com not found')
    }
    
    console.log('\n✅ Password reset completed!')
    console.log('\nLogin Credentials:')
    console.log('1. Email: admin@rehab.gov.in')
    console.log('   Password: admin123')
    console.log('\n2. Email: tanishkwie@gmail.com')
    console.log('   Password: tanishk109813')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error resetting passwords:', error)
    process.exit(1)
  }
}

resetPasswords()

