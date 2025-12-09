import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

// POST - Register a new centre admin
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const body = await request.json()
    const { email, name, phone, password, centreName, centreAddress, centreState, centreCity } = body

    // Validate required fields
    if (!email || !name || !phone || !password || !centreName || !centreAddress || !centreState || !centreCity) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate user ID
    const count = await usersCollection.countDocuments()
    const userId = `admin${String(count + 1).padStart(3, '0')}`

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create pending user
    const newUser: User = {
      id: userId,
      name,
      email: email.toLowerCase(),
      role: 'centre_admin',
      centreId: null, // Will be assigned after approval
      phone,
      password: hashedPassword,
      centreName,
      centreAddress,
      centreState,
      centreCity,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration submitted successfully. Please wait for super admin approval.',
        data: { ...newUser, _id: result.insertedId } 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to register. Please try again.' },
      { status: 500 }
    )
  }
}

// GET - Get all pending registrations (super admin only)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const role = searchParams.get('role')

    // Only super admin can view registrations
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const query: any = { status }
    if (status === 'pending') {
      query.role = 'centre_admin'
    }

    const registrations = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ success: true, data: registrations })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

// PUT - Approve or reject registration (super admin only)
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    const centresCollection = db.collection('centres')
    
    const body = await request.json()
    const { userId, action, role, approvedBy, rejectionReason, centreId } = body

    // Only super admin can approve/reject
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin can approve registrations' },
        { status: 403 }
      )
    }

    const user = await usersCollection.findOne({ id: userId })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Create centre if not exists
      let assignedCentreId = centreId
      
      if (!assignedCentreId) {
        // Generate centre ID
        const stateCode = user.centreState?.substring(0, 2).toUpperCase() || 'XX'
        const centreCount = await centresCollection.countDocuments()
        assignedCentreId = `C${stateCode}${String(centreCount + 1).padStart(3, '0')}`
        
        // Create centre
        const newCentre = {
          id: assignedCentreId,
          name: user.centreName,
          state: user.centreState,
          city: user.centreCity,
          address: user.centreAddress,
          phone: user.phone || '',
          email: user.email,
          capacity: 100, // Default capacity
          administrator: user.name,
          adminEmail: user.email,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date(),
        }
        
        await centresCollection.insertOne(newCentre)
      }

      // Update user status
      await usersCollection.updateOne(
        { id: userId },
        {
          $set: {
            status: 'approved',
            centreId: assignedCentreId,
            approvedAt: new Date(),
            approvedBy,
            updatedAt: new Date(),
          }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'Registration approved successfully',
        data: { centreId: assignedCentreId }
      })
    } else if (action === 'reject') {
      // Update user status
      await usersCollection.updateOne(
        { id: userId },
        {
          $set: {
            status: 'rejected',
            rejectionReason: rejectionReason || 'Registration rejected by super admin',
            approvedBy,
            updatedAt: new Date(),
          }
        }
      )

      return NextResponse.json({
        success: true,
        message: 'Registration rejected'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing registration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process registration' },
      { status: 500 }
    )
  }
}

