import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

// GET - Fetch user by email (for login)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const password = searchParams.get('password')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await usersCollection.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 404 }
      )
    }

    // Verify password if provided
    if (password) {
      if (!user.password) {
        return NextResponse.json(
          { success: false, error: 'Password not set. Please use forgot password.' },
          { status: 401 }
        )
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
      }
    }

    // Check approval status for centre admins (status is optional for super_admin)
    if (user.role === 'centre_admin' && user.status && user.status !== 'approved') {
      if (user.status === 'pending') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Your registration is pending approval. Please wait for super admin approval.',
            status: 'pending'
          },
          { status: 403 }
        )
      } else if (user.status === 'rejected') {
        return NextResponse.json(
          { 
            success: false, 
            error: user.rejectionReason || 'Your registration has been rejected. Please contact support.',
            status: 'rejected'
          },
          { status: 403 }
        )
      }
    }

    // Remove password from response
    const userWithoutPassword = { ...user }
    delete userWithoutPassword.password
    
    return NextResponse.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    console.error('Error fetching user:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    // Provide more helpful error messages
    if (errorMessage.includes('MongoDB') || errorMessage.includes('connection')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please check server configuration.' },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, error: `Failed to fetch user: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// POST - Create a new user (for initial setup)
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const body = await request.json()

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: body.email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      )
    }

    body.email = body.email.toLowerCase()
    body.createdAt = new Date()
    body.updatedAt = new Date()

    const result = await usersCollection.insertOne(body)
    
    return NextResponse.json(
      { success: true, data: { ...body, _id: result.insertedId } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const body = await request.json()
    const { userId, email, ...updateData } = body

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or email is required' },
        { status: 400 }
      )
    }

    // Find the user to update - try by id first, then by email
    let user: User | null = null
    let query: { id?: string; email?: string } = {}
    
    if (userId) {
      query = { id: userId }
      user = await usersCollection.findOne(query)
    }
    
    // If not found by id, try by email
    if (!user && email) {
      query = { email: email.toLowerCase() }
      user = await usersCollection.findOne(query)
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fields that can be updated through profile update
    const allowedFields = ['name', 'phone', 'dob', 'age', 'aadharNumber', 'address']
    
    // Filter updateData to only include allowed fields and non-empty values
    const filteredUpdateData: Partial<User> = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        // Skip empty strings
        if (typeof updateData[field] === 'string' && updateData[field].trim() === '') {
          continue
        }
        filteredUpdateData[field as keyof User] = updateData[field]
      }
    }

    // Validate and calculate age if DOB is provided
    if (filteredUpdateData.dob) {
      let dobValue = filteredUpdateData.dob
      
      // Ensure DOB is a string
      if (typeof dobValue !== 'string') {
        dobValue = String(dobValue)
      }
      
      // Trim whitespace
      dobValue = dobValue.trim()
      
      // Parse DD/MM/YYYY format
      const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
      const match = dobValue.match(ddmmyyyyRegex)
      
      if (!match) {
        // Try to parse YYYY-MM-DD format (for backward compatibility)
        const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/
        const yyyyMatch = dobValue.match(yyyymmddRegex)
        if (yyyyMatch) {
          const [, year, month, day] = yyyyMatch
          dobValue = `${day}/${month}/${year}`
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid date format. Please use DD/MM/YYYY format (e.g., 15/05/1990).' },
            { status: 400 }
          )
        }
      } else {
        // Normalize DD/MM/YYYY format
        const [, day, month, year] = match
        dobValue = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
      }
      
      // Parse date for validation
      const dateParts = dobValue.split('/')
      if (dateParts.length !== 3) {
        return NextResponse.json(
          { success: false, error: 'Invalid date format. Please use DD/MM/YYYY format.' },
          { status: 400 }
        )
      }
      
      const day = parseInt(dateParts[0], 10)
      const month = parseInt(dateParts[1], 10)
      const year = parseInt(dateParts[2], 10)
      
      // Validate date components
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return NextResponse.json(
          { success: false, error: 'Invalid date. Please enter valid numbers.' },
          { status: 400 }
        )
      }
      
      if (month < 1 || month > 12) {
        return NextResponse.json(
          { success: false, error: 'Invalid month. Month must be between 1 and 12.' },
          { status: 400 }
        )
      }
      
      if (day < 1 || day > 31) {
        return NextResponse.json(
          { success: false, error: 'Invalid day. Day must be between 1 and 31.' },
          { status: 400 }
        )
      }
      
      // Create date object for validation
      const birthDate = new Date(year, month - 1, day)
      
      // Validate date is valid (handles invalid dates like 31/02/1990)
      if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
        return NextResponse.json(
          { success: false, error: 'Invalid date. Please enter a valid date.' },
          { status: 400 }
        )
      }
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      birthDate.setHours(0, 0, 0, 0)
      
      // Validate date is not in the future
      if (birthDate > today) {
        return NextResponse.json(
          { success: false, error: 'Date of birth cannot be in the future' },
          { status: 400 }
        )
      }
      
      // Validate date is reasonable (not more than 150 years ago)
      const minDate = new Date()
      minDate.setFullYear(today.getFullYear() - 150)
      minDate.setHours(0, 0, 0, 0)
      if (birthDate < minDate) {
        return NextResponse.json(
          { success: false, error: 'Date of birth is too far in the past (more than 150 years ago)' },
          { status: 400 }
        )
      }
      
      // Store DOB in DD/MM/YYYY format
      filteredUpdateData.dob = dobValue
      
      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      // Validate calculated age is reasonable
      if (age < 0 || age > 150) {
        return NextResponse.json(
          { success: false, error: 'Invalid age calculated from date of birth' },
          { status: 400 }
        )
      }
      
      filteredUpdateData.age = age
    }

    // Validate age if provided directly (without DOB)
    if (filteredUpdateData.age !== undefined && !filteredUpdateData.dob) {
      const ageNum = typeof filteredUpdateData.age === 'number' 
        ? filteredUpdateData.age 
        : parseInt(String(filteredUpdateData.age))
      
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return NextResponse.json(
          { success: false, error: 'Age must be a number between 0 and 150' },
          { status: 400 }
        )
      }
      filteredUpdateData.age = ageNum
    }

    // Add updatedAt timestamp
    filteredUpdateData.updatedAt = new Date()

    // Update the user using the same query we used to find the user
    const result = await usersCollection.updateOne(
      query,
      { $set: filteredUpdateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch and return the updated user (without password)
    const updatedUser = await usersCollection.findOne(query)
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch updated user' },
        { status: 500 }
      )
    }

    const userWithoutPassword = { ...updatedUser }
    delete userWithoutPassword.password

    return NextResponse.json(
      { success: true, data: userWithoutPassword },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating user profile:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Provide more specific error messages
    if (errorMessage.includes('pattern') || errorMessage.includes('validation') || errorMessage.includes('format')) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format. Please ensure all fields are in the correct format.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to update profile: ${errorMessage}` },
      { status: 500 }
    )
  }
}
