// Script to create a super admin user
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

async function createSuperAdmin() {
  try {
    console.log('Connecting to database...')
    const db = await getDatabase()
    const usersCollection = db.collection('users')
    
    const email = 'tanishkwie@gmail.com'
    const password = 'tanishk109813'
    const name = 'Super Admin'
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log('User already exists. Updating password and ensuring super admin status...')
      
      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      
      // Update user to ensure super admin status and update password
      await usersCollection.updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            role: 'super_admin',
            password: hashedPassword,
            status: 'approved',
            updatedAt: new Date(),
          }
        }
      )
      
      console.log('✓ Super admin user updated successfully!')
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
    } else {
      console.log('Creating new super admin user...')
      
      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      
      // Generate user ID
      const count = await usersCollection.countDocuments()
      const userId = `admin${String(count + 1).padStart(3, '0')}`
      
      // Create super admin user
      const superAdmin = {
        id: userId,
        name: name,
        email: email.toLowerCase(),
        role: 'super_admin',
        centreId: null,
        password: hashedPassword,
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      await usersCollection.insertOne(superAdmin)
      
      console.log('✓ Super admin user created successfully!')
      console.log(`Email: ${email}`)
      console.log(`Password: ${password}`)
      console.log(`User ID: ${userId}`)
    }
    
    console.log('\n✅ Super admin account is ready to use!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating super admin:', error)
    process.exit(1)
  }
}

createSuperAdmin()

