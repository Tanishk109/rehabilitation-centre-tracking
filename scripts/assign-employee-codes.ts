// Script to assign employee codes to all existing users who don't have one
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Set environment variable if not loaded
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0'
}

import { getDatabase } from '../lib/mongodb'
import { generateEmployeeCode } from '../lib/employee-code'
import { User } from '../lib/models'

async function assignEmployeeCodes() {
  try {
    console.log('Connecting to database...')
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    console.log('\n=== Assigning Employee Codes to Existing Users ===\n')
    
    // Find all users without employee codes
    const usersWithoutCodes = await usersCollection
      .find({ 
        $or: [
          { employeeCode: { $exists: false } },
          { employeeCode: null }
        ]
      })
      .toArray()
    
    if (usersWithoutCodes.length === 0) {
      console.log('✅ All users already have employee codes!')
      process.exit(0)
    }
    
    console.log(`Found ${usersWithoutCodes.length} user(s) without employee codes:\n`)
    
    let assignedCount = 0
    
    for (const user of usersWithoutCodes) {
      try {
        // Generate employee code based on role
        const employeeCode = await generateEmployeeCode(user.role)
        
        // Update user with employee code
        await usersCollection.updateOne(
          { id: user.id },
          {
            $set: {
              employeeCode,
              updatedAt: new Date()
            }
          }
        )
        
        console.log(`✓ Assigned ${employeeCode} to ${user.name} (${user.email}) - ${user.role}`)
        assignedCount++
      } catch (error) {
        console.error(`✗ Failed to assign code to ${user.name} (${user.email}):`, error)
      }
    }
    
    console.log(`\n✅ Successfully assigned employee codes to ${assignedCount} user(s)!`)
    
    // Show all users with their codes
    console.log('\n=== All Users with Employee Codes ===\n')
    const allUsers = await usersCollection.find({}).sort({ employeeCode: 1 }).toArray()
    
    for (const user of allUsers) {
      console.log(`${user.employeeCode || 'NO CODE'} - ${user.name} (${user.email}) - ${user.role}`)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error assigning employee codes:', error)
    process.exit(1)
  }
}

assignEmployeeCodes()

