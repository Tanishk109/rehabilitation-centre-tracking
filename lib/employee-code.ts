// Utility function to generate unique employee codes
// Format: EMP-XXXXX (where XXXXX is a 5-digit sequential number)

import { getDatabase } from './mongodb'
import { User } from './models'

/**
 * Generates a unique employee code in the format EMP-XXXXX
 * @param role - The role of the user (super_admin or centre_admin)
 * @returns A unique employee code string
 */
export async function generateEmployeeCode(role: 'super_admin' | 'centre_admin'): Promise<string> {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    // Find the highest existing employee code number
    const users = await usersCollection
      .find({ employeeCode: { $exists: true, $ne: null } })
      .sort({ employeeCode: -1 })
      .limit(1)
      .toArray()
    
    let nextNumber = 1
    
    if (users.length > 0 && users[0].employeeCode) {
      // Extract number from existing code (e.g., EMP-00123 -> 123)
      const match = users[0].employeeCode.match(/\d+/)
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1
      }
    }
    
    // Format as EMP-XXXXX (5 digits)
    const employeeCode = `EMP-${String(nextNumber).padStart(5, '0')}`
    
    // Double-check uniqueness (in case of race conditions)
    const existing = await usersCollection.findOne({ employeeCode })
    if (existing) {
      // If exists, increment and try again
      return generateEmployeeCode(role)
    }
    
    return employeeCode
  } catch (error) {
    console.error('Error generating employee code:', error)
    // Fallback: use timestamp-based code
    const timestamp = Date.now().toString().slice(-5)
    return `EMP-${timestamp}`
  }
}

/**
 * Ensures a user has an employee code, generates one if missing
 * @param userId - The user ID to check/update
 * @param role - The role of the user
 */
export async function ensureEmployeeCode(userId: string, role: 'super_admin' | 'centre_admin'): Promise<string> {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const user = await usersCollection.findOne({ id: userId })
    if (!user) {
      throw new Error('User not found')
    }
    
    // If user already has an employee code, return it
    if (user.employeeCode) {
      return user.employeeCode
    }
    
    // Generate new employee code
    const employeeCode = await generateEmployeeCode(role)
    
    // Update user with employee code
    await usersCollection.updateOne(
      { id: userId },
      { 
        $set: { 
          employeeCode,
          updatedAt: new Date()
        } 
      }
    )
    
    return employeeCode
  } catch (error) {
    console.error('Error ensuring employee code:', error)
    throw error
  }
}

