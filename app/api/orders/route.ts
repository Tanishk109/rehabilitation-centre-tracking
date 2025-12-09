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

    let query: any = {}

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

    // Get centre name if targetCentreId is provided
    if (body.targetCentreId) {
      const centre = await centresCollection.findOne({ id: body.targetCentreId })
      body.targetCentreName = centre?.name || ''
    } else {
      body.targetCentreName = 'All Centres'
    }

    // Generate ID if not provided
    if (!body.id) {
      const count = await ordersCollection.countDocuments()
      body.id = `ORD${String(count + 1).padStart(3, '0')}`
    }

    body.issuedBy = issuedBy || 'Unknown'
    body.issuedAt = new Date().toISOString().split('T')[0]
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

