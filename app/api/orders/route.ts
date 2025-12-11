import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Order } from '@/lib/models'

// GET - Fetch all orders (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const ordersCollection = db.collection<Order>('orders')
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const centreId = searchParams.get('centreId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    let query: { $or?: Array<{ targetCentreId: string | null }>; status?: string; priority?: string } = {}

    // Filter by centreId if centre_admin
    if (role === 'centre_admin' && centreId) {
      query.$or = [
        { targetCentreId: centreId },
        { targetCentreId: null }
      ]
    }

    // Filter by status
    if (status) {
      query.status = status
    }

    // Filter by priority
    if (priority) {
      query.priority = priority
    }

    const orders = await ordersCollection.find(query).sort({ issuedAt: -1 }).toArray()
    
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create a new order (only super admin)
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()
    const ordersCollection = db.collection<Order>('orders')
    const centresCollection = db.collection('centres')
    
    const body = await request.json()
    const { role, issuedBy } = body

    // Only super_admin can create orders
    if (role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only super admin can create orders' },
        { status: 403 }
      )
    }

    // Validate required fields
    if (!body.subject || !body.subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject is required' },
        { status: 400 }
      )
    }

    if (!body.instruction || !body.instruction.trim()) {
      return NextResponse.json(
        { success: false, error: 'Instruction is required' },
        { status: 400 }
      )
    }

    if (!body.deadline || !body.deadline.trim()) {
      return NextResponse.json(
        { success: false, error: 'Deadline is required' },
        { status: 400 }
      )
    }

    if (!body.priority) {
      return NextResponse.json(
        { success: false, error: 'Priority is required' },
        { status: 400 }
      )
    }

    // Validate and normalize deadline format (DD/MM/YYYY)
    let deadline = body.deadline.trim()
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    const match = deadline.match(ddmmyyyyRegex)
    
    if (!match) {
      // Try to parse YYYY-MM-DD format (backward compatibility)
      const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/
      const yyyyMatch = deadline.match(yyyymmddRegex)
      if (yyyyMatch) {
        const [, year, month, day] = yyyyMatch
        deadline = `${day}/${month}/${year}`
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid deadline format. Please use DD/MM/YYYY format (e.g., 15/05/2024).' },
          { status: 400 }
        )
      }
    } else {
      // Normalize DD/MM/YYYY format
      const [, day, month, year] = match
      deadline = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }

    // Validate date components
    const dateParts = deadline.split('/')
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10)
      const month = parseInt(dateParts[1], 10)
      const year = parseInt(dateParts[2], 10)
      
      if (month < 1 || month > 12) {
        return NextResponse.json(
          { success: false, error: 'Invalid month in deadline. Month must be between 1 and 12.' },
          { status: 400 }
        )
      }
      
      if (day < 1 || day > 31) {
        return NextResponse.json(
          { success: false, error: 'Invalid day in deadline. Day must be between 1 and 31.' },
          { status: 400 }
        )
      }
      
      // Validate date is valid
      const deadlineDate = new Date(year, month - 1, day)
      if (deadlineDate.getDate() !== day || deadlineDate.getMonth() !== month - 1 || deadlineDate.getFullYear() !== year) {
        return NextResponse.json(
          { success: false, error: 'Invalid deadline date. Please enter a valid date.' },
          { status: 400 }
        )
      }
    }

    // Get centre name if targetCentreId is provided
    if (body.targetCentreId) {
      const centre = await centresCollection.findOne({ id: body.targetCentreId })
      body.targetCentreName = centre?.name || ''
    } else {
      body.targetCentreName = 'All Centres'
    }

    // Generate unique ID if not provided
    if (!body.id) {
      // Find the highest existing order number to ensure uniqueness
      // Support both formats: ORD-XXXXX and ORD00123
      const existingOrders = await ordersCollection
        .find({ id: { $regex: /^ORD/ } })
        .sort({ id: -1 })
        .limit(1)
        .toArray()
      
      let nextNumber = 1
      if (existingOrders.length > 0 && existingOrders[0].id) {
        // Extract number from existing ID (e.g., ORD-00123 -> 123, ORD00123 -> 123)
        const match = existingOrders[0].id.match(/\d+/)
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1
        }
      }
      
      // Format as ORD-XXXXX (5 digits for better scalability)
      body.id = `ORD-${String(nextNumber).padStart(5, '0')}`
      
      // Double-check uniqueness (in case of race conditions)
      const existing = await ordersCollection.findOne({ id: body.id })
      if (existing) {
        // If exists, increment and try again
        body.id = `ORD-${String(nextNumber + 1).padStart(5, '0')}`
      }
    }

    body.issuedBy = issuedBy || 'Unknown'
    body.issuedAt = new Date().toISOString().split('T')[0]
    body.deadline = deadline // Use normalized deadline
    body.status = body.status || 'issued' // Default to 'issued' if not provided
    body.acknowledgements = []
    body.updatedAt = new Date()

    const { role: _, issuedBy: __, ...orderData } = body
    const result = await ordersCollection.insertOne(orderData)
    
    return NextResponse.json(
      { success: true, data: { ...orderData, _id: result.insertedId } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT - Update order status
export async function PUT(request: NextRequest) {
  try {
    const db = await getDatabase()
    const ordersCollection = db.collection<Order>('orders')
    
    const body = await request.json()
    const { id, status, role, centreId: userCentreId } = body

    // Check if order exists
    const order = await ordersCollection.findOne({ id })
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Centre admin can only update orders for their centre
    if (role === 'centre_admin') {
      if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      if (order.targetCentreId !== null && order.targetCentreId !== userCentreId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: You can only update orders for your centre' },
          { status: 403 }
        )
      }
      // Centre admin can only mark as completed
      if (status !== 'completed') {
        return NextResponse.json(
          { success: false, error: 'You can only mark orders as completed' },
          { status: 403 }
        )
      }
    }

    const result = await ordersCollection.updateOne(
      { id },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      }
    )

    const updatedOrder = await ordersCollection.findOne({ id })
    
    return NextResponse.json({ success: true, data: updatedOrder })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// PATCH - Acknowledge order
export async function PATCH(request: NextRequest) {
  try {
    const db = await getDatabase()
    const ordersCollection = db.collection<Order>('orders')
    
    const body = await request.json()
    const { orderId, acknowledgedBy, role, centreId: userCentreId } = body

    // Check if order exists
    const order = await ordersCollection.findOne({ id: orderId })
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Centre admin can only acknowledge orders for their centre
    if (role === 'centre_admin') {
      if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
        return NextResponse.json(
          { success: false, error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.' },
          { status: 400 }
        )
      }
      if (order.targetCentreId !== null && order.targetCentreId !== userCentreId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: You can only acknowledge orders for your centre' },
          { status: 403 }
        )
      }
    }

    // Check if already acknowledged by this centre
    const alreadyAcknowledged = order.acknowledgements.some(
      (ack) => ack.centreId === userCentreId
    )

    if (alreadyAcknowledged) {
      return NextResponse.json(
        { success: false, error: 'Order already acknowledged by your centre' },
        { status: 400 }
      )
    }

    const newAcknowledgement = {
      centreId: userCentreId || '',
      acknowledgedBy,
      acknowledgedAt: new Date().toISOString().split('T')[0]
    }

    const result = await ordersCollection.updateOne(
      { id: orderId },
      { 
        $push: { acknowledgements: newAcknowledgement },
        $set: { 
          status: 'acknowledged',
          updatedAt: new Date()
        }
      }
    )

    const updatedOrder = await ordersCollection.findOne({ id: orderId })
    
    return NextResponse.json({ success: true, data: updatedOrder })
  } catch (error) {
    console.error('Error acknowledging order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to acknowledge order' },
      { status: 500 }
    )
  }
}

