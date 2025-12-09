import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'

// GET - Verify reset token
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      )
    }

    const user = await usersCollection.findOne({ resetPasswordToken: token })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset token' },
        { status: 404 }
      )
    }

    // Check if token has expired
    if (!user.resetPasswordExpiry || new Date() > new Date(user.resetPasswordExpiry)) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid'
    })
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}

