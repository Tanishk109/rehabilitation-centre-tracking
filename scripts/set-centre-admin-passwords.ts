// Script to set passwords for centre admins
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
import { User } from '../lib/models'

async function setCentreAdminPasswords() {
  try {
    console.log('Connecting to database...\n')
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    // Default password for all centre admins
    const defaultPassword = 'admin123'
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds)
    
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('🔐 SETTING PASSWORDS FOR CENTRE ADMINS')
    console.log('═══════════════════════════════════════════════════════════════\n')
    
    // Find all centre admins
    const centreAdmins = await usersCollection
      .find({ role: 'centre_admin' })
      .toArray()
    
    if (centreAdmins.length === 0) {
      console.log('❌ No centre admins found in the database.')
      process.exit(1)
    }
    
    console.log(`Found ${centreAdmins.length} centre admin(s) to update.\n`)
    console.log(`Default password: ${defaultPassword}\n`)
    console.log('─'.repeat(65))
    console.log()
    
    let updatedCount = 0
    
    for (const admin of centreAdmins) {
      try {
        // Update password
        await usersCollection.updateOne(
          { id: admin.id },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        )
        
        console.log(`✅ Password set for: ${admin.name}`)
        console.log(`   Email: ${admin.email}`)
        console.log(`   Employee Code: ${admin.employeeCode || 'N/A'}`)
        console.log(`   Password: ${defaultPassword}`)
        console.log()
        
        updatedCount++
      } catch (error) {
        console.error(`❌ Failed to update password for ${admin.name}:`, error)
      }
    }
    
    console.log('─'.repeat(65))
    console.log()
    console.log(`✅ Successfully updated passwords for ${updatedCount}/${centreAdmins.length} centre admin(s)!`)
    console.log()
    console.log('📋 Login Credentials:')
    console.log('─'.repeat(65))
    
    centreAdmins.forEach(admin => {
      console.log(`${admin.name}`)
      console.log(`  Email: ${admin.email}`)
      console.log(`  Password: ${defaultPassword}`)
      console.log()
    })
    
    console.log('✅ All passwords have been set!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting passwords:', error)
    process.exit(1)
  }
}

setCentreAdminPasswords()

