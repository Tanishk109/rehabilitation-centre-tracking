// Script to check existing users in the database
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

async function checkUsers() {
  try {
    console.log('Connecting to database...')
    const db = await getDatabase()
    const usersCollection = db.collection('users')
    
    console.log('\n=== Checking All Users ===\n')
    
    const allUsers = await usersCollection.find({}).toArray()
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database!')
      console.log('💡 Run "npm run seed" to create initial users')
      process.exit(1)
    }
    
    console.log(`Found ${allUsers.length} user(s):\n`)
    
    for (const user of allUsers) {
      console.log(`📧 Email: ${user.email}`)
      console.log(`   Name: ${user.name || 'N/A'}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Status: ${user.status || 'N/A'}`)
      console.log(`   User ID: ${user.id}`)
      console.log(`   Has Password: ${user.password ? '✅ Yes' : '❌ No'}`)
      
      if (user.password) {
        // Test password verification for known passwords
        const testPasswords = [
          'admin123',
          'tanishk109813',
          'Admin123',
          'Tanishk109813'
        ]
        
        let passwordMatch = false
        for (const testPwd of testPasswords) {
          try {
            const isValid = await bcrypt.compare(testPwd, user.password)
            if (isValid) {
              console.log(`   ✅ Password matches: "${testPwd}"`)
              passwordMatch = true
              break
            }
          } catch (err) {
            // Continue to next password
          }
        }
        
        if (!passwordMatch) {
          console.log(`   ⚠️  Password doesn't match any known test passwords`)
        }
      }
      
      console.log('')
    }
    
    // Check specifically for super admins
    console.log('\n=== Super Admin Accounts ===\n')
    const superAdmins = allUsers.filter(u => u.role === 'super_admin')
    
    if (superAdmins.length === 0) {
      console.log('❌ No super admin users found!')
      console.log('💡 Run "npm run create-super-admin" to create a super admin')
    } else {
      console.log(`Found ${superAdmins.length} super admin(s):`)
      superAdmins.forEach(admin => {
        console.log(`  - ${admin.email} (${admin.name || 'N/A'})`)
      })
    }
    
    console.log('\n✅ User check completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error checking users:', error)
    process.exit(1)
  }
}

checkUsers()

