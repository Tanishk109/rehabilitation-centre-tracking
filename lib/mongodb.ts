import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables')
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    return client.db('rehabilitation-centre-tracking')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw new Error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}
