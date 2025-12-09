// Script to list all centre admins with their details
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Set environment variable if not loaded
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0'
}

import { getDatabase } from '../lib/mongodb'
import { User } from '../lib/models'

async function listCentreAdmins() {
  try {
    console.log('Connecting to database...\n')
    const db = await getDatabase()
    const usersCollection = db.collection<User>('users')
    const centresCollection = db.collection('centres')
    
    // Fetch all centre admins
    const centreAdmins = await usersCollection
      .find({ role: 'centre_admin' })
      .sort({ createdAt: 1 })
      .toArray()
    
    console.log(`═══════════════════════════════════════════════════════════════`)
    console.log(`📊 CENTRE ADMINISTRATORS REPORT`)
    console.log(`═══════════════════════════════════════════════════════════════\n`)
    
    console.log(`Total Centre Admins: ${centreAdmins.length}\n`)
    
    if (centreAdmins.length === 0) {
      console.log('No centre administrators found in the database.')
      process.exit(0)
    }
    
    // Group by status
    const byStatus = {
      approved: centreAdmins.filter(u => u.status === 'approved'),
      pending: centreAdmins.filter(u => u.status === 'pending'),
      rejected: centreAdmins.filter(u => u.status === 'rejected'),
      noStatus: centreAdmins.filter(u => !u.status)
    }
    
    console.log(`Status Breakdown:`)
    console.log(`  ✅ Approved: ${byStatus.approved.length}`)
    console.log(`  ⏳ Pending: ${byStatus.pending.length}`)
    console.log(`  ❌ Rejected: ${byStatus.rejected.length}`)
    if (byStatus.noStatus.length > 0) {
      console.log(`  ⚠️  No Status: ${byStatus.noStatus.length}`)
    }
    console.log(`\n${'═'.repeat(65)}\n`)
    
    // Fetch all centres for lookup
    const allCentres = await centresCollection.find({}).toArray()
    const centresMap = new Map(allCentres.map(c => [c.id, c]))
    
    // Display detailed information
    centreAdmins.forEach((admin, index) => {
      const centre = admin.centreId ? centresMap.get(admin.centreId) : null
      
      console.log(`${index + 1}. ${admin.name.toUpperCase()}`)
      console.log(`   ────────────────────────────────────────────────────────────`)
      console.log(`   Employee Code:     ${admin.employeeCode || '❌ Not assigned'}`)
      console.log(`   User ID:           ${admin.id}`)
      console.log(`   Email:             ${admin.email}`)
      console.log(`   Phone:             ${admin.phone || 'N/A'}`)
      console.log(`   Status:            ${admin.status ? admin.status.toUpperCase() : 'N/A'} ${getStatusIcon(admin.status)}`)
      
      if (admin.dob) {
        console.log(`   Date of Birth:     ${new Date(admin.dob).toLocaleDateString()}`)
      }
      if (admin.age) {
        console.log(`   Age:               ${admin.age} years`)
      }
      if (admin.aadharNumber) {
        console.log(`   Aadhar Number:     ${admin.aadharNumber}`)
      }
      if (admin.address) {
        console.log(`   Address:           ${admin.address}`)
      }
      
      console.log(`\n   Centre Information:`)
      if (centre) {
        console.log(`   ├─ Centre ID:       ${centre.id}`)
        console.log(`   ├─ Centre Name:     ${centre.name}`)
        console.log(`   ├─ Location:        ${centre.city}, ${centre.state}`)
        console.log(`   ├─ Address:         ${centre.address}`)
        console.log(`   └─ Status:          ${centre.status}`)
      } else if (admin.centreName) {
        console.log(`   ├─ Centre Name:     ${admin.centreName}`)
        if (admin.centreCity && admin.centreState) {
          console.log(`   ├─ Location:        ${admin.centreCity}, ${admin.centreState}`)
        }
        if (admin.centreAddress) {
          console.log(`   └─ Address:         ${admin.centreAddress}`)
        }
        if (!admin.centreId) {
          console.log(`   ⚠️  Note: Centre not yet created (registration ${admin.status || 'pending'})`)
        }
      } else {
        console.log(`   └─ No centre assigned`)
      }
      
      if (admin.status === 'rejected' && admin.rejectionReason) {
        console.log(`\n   Rejection Reason:  ${admin.rejectionReason}`)
      }
      
      if (admin.approvedAt) {
        console.log(`\n   Approved At:       ${new Date(admin.approvedAt).toLocaleString()}`)
      }
      if (admin.approvedBy) {
        console.log(`   Approved By:       ${admin.approvedBy}`)
      }
      
      if (admin.createdAt) {
        const createdDate = admin.createdAt instanceof Date 
          ? admin.createdAt 
          : new Date(admin.createdAt)
        console.log(`   Registered:        ${createdDate.toLocaleString()}`)
      }
      
      console.log(`\n${'─'.repeat(65)}\n`)
    })
    
    // Summary statistics
    console.log(`═══════════════════════════════════════════════════════════════`)
    console.log(`📈 SUMMARY STATISTICS`)
    console.log(`═══════════════════════════════════════════════════════════════\n`)
    
    const withEmployeeCodes = centreAdmins.filter(u => u.employeeCode).length
    const withPhone = centreAdmins.filter(u => u.phone).length
    const withDOB = centreAdmins.filter(u => u.dob).length
    const withAadhar = centreAdmins.filter(u => u.aadharNumber).length
    const withCentres = centreAdmins.filter(u => u.centreId).length
    
    console.log(`Employee Codes:      ${withEmployeeCodes}/${centreAdmins.length} assigned`)
    console.log(`Phone Numbers:       ${withPhone}/${centreAdmins.length} provided`)
    console.log(`Date of Birth:       ${withDOB}/${centreAdmins.length} provided`)
    console.log(`Aadhar Numbers:      ${withAadhar}/${centreAdmins.length} provided`)
    console.log(`Centres Assigned:    ${withCentres}/${centreAdmins.length}`)
    
    console.log(`\n✅ Report generated successfully!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error listing centre admins:', error)
    process.exit(1)
  }
}

function getStatusIcon(status?: string): string {
  switch (status) {
    case 'approved':
      return '✅'
    case 'pending':
      return '⏳'
    case 'rejected':
      return '❌'
    default:
      return '⚠️'
  }
}

listCentreAdmins()

