import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from 'bcryptjs'

// POST - Request password reset - sends new temporary password
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await usersCollection.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      // User not found - return error
      return NextResponse.json({
        success: false,
        error: 'No account found with this email address. Please check your email or register first.'
      }, { status: 404 })
    }

    // Generate temporary password (8 characters: mix of letters and numbers)
    const tempPassword = generateTemporaryPassword()
    
    // Hash the temporary password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds)

    // Update user password with temporary password
    await usersCollection.updateOne(
      { id: user.id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        }
      }
    )

    // Send email with login credentials
    try {
      await sendCredentialsEmail(user.email, user.name, email.toLowerCase(), tempPassword)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Still return success to not reveal email issues
    }

    return NextResponse.json({
      success: true,
      message: 'Login credentials have been sent to your email address.'
    })
  } catch (error) {
    console.error('Error processing forgot password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}

function generateTemporaryPassword(): string {
  // Generate a secure temporary password: 8 characters with uppercase, lowercase, and numbers
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const allChars = uppercase + lowercase + numbers
  
  let password = ''
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  
  // Fill the rest randomly
  for (let i = password.length; i < 8; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

async function sendCredentialsEmail(email: string, name: string, loginEmail: string, tempPassword: string) {
  // Configure email transporter
  // For production, use environment variables for email credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // If no SMTP credentials, log the credentials instead (for development)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('=== LOGIN CREDENTIALS (Development Mode) ===')
    console.log(`Email: ${email}`)
    console.log(`Name: ${name}`)
    console.log(`Login Email: ${loginEmail}`)
    console.log(`Temporary Password: ${tempPassword}`)
    console.log(`Login URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`)
    console.log('============================================')
    return
  }

  const mailOptions = {
    from: `"NRCMS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Login Credentials - NRCMS',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1e3a8a;">NRCMS</h1>
              <p style="color: #666;">National Rehabilitation Centre Management System</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">Your Login Credentials</h2>
              
              <p>Hello ${name},</p>
              
              <p>You have requested to retrieve your login credentials for your NRCMS account.</p>
              
              <div style="background: white; padding: 20px; border-radius: 5px; border: 2px solid #1e3a8a; margin: 20px 0;">
                <h3 style="color: #1e3a8a; margin-top: 0;">Your Login Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #666;">Email:</td>
                    <td style="padding: 10px 0; color: #1e3a8a; font-size: 16px;"><strong>${loginEmail}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #666;">Password:</td>
                    <td style="padding: 10px 0; color: #1e3a8a; font-size: 16px; font-family: monospace; letter-spacing: 2px;"><strong>${tempPassword}</strong></td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
                   style="background: #1e3a8a; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                  Login Now
                </a>
              </div>
              
              <p style="font-size: 14px; color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 5px; border-left: 4px solid #d32f2f;">
                <strong>⚠️ Security Notice:</strong><br>
                • This is a temporary password. Please change it after logging in for security.<br>
                • Keep your credentials secure and do not share them with anyone.<br>
                • If you didn't request this, please contact support immediately.
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                <strong>Login URL:</strong><br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #1e3a8a; word-break: break-all;">
                  ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
                </a>
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
              <p>Government of India</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  await transporter.sendMail(mailOptions)
}

