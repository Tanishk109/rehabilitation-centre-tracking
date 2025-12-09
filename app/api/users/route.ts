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

