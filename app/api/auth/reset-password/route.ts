import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

// POST - Reset password
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
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

    // Hash new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update password and clear reset token
    await usersCollection.updateOne(
      { id: user.id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpiry: '',
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}

