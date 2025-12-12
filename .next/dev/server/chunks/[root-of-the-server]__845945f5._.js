module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongodb [external] (mongodb, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongodb", () => require("mongodb"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getDatabase",
    ()=>getDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongodb [external] (mongodb, cjs)");
;
// Default connection string if not in env (for scripts and fallback)
const defaultUri = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0';
// Get MongoDB URI from environment or use default
let uri;
if (process.env.MONGODB_URI) {
    uri = process.env.MONGODB_URI;
} else if ("TURBOPACK compile-time truthy", 1) {
    // Server-side: use default if not set (for scripts and development)
    uri = defaultUri;
    console.warn('⚠️  MONGODB_URI not set, using default connection string');
} else //TURBOPACK unreachable
;
const options = {
    // Add connection options for better reliability
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
};
let client;
let clientPromise;
if ("TURBOPACK compile-time truthy", 1) {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = /*TURBOPACK member replacement*/ __turbopack_context__.g;
    if (!globalWithMongo._mongoClientPromise) {
        client = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongodb__$5b$external$5d$__$28$mongodb$2c$__cjs$29$__["MongoClient"](uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else //TURBOPACK unreachable
;
const __TURBOPACK__default__export__ = clientPromise;
async function getDatabase() {
    try {
        const client = await clientPromise;
        // Test the connection
        await client.db('admin').command({
            ping: 1
        });
        return client.db('rehabilitation-centre-tracking');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
}),
"[project]/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const ordersCollection = db.collection('orders');
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const centreId = searchParams.get('centreId');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        let query = {};
        // Filter by centreId if centre_admin
        if (role === 'centre_admin' && centreId) {
            query.$or = [
                {
                    targetCentreId: centreId
                },
                {
                    targetCentreId: null
                }
            ];
        }
        // Filter by status
        if (status) {
            query.status = status;
        }
        // Filter by priority
        if (priority) {
            query.priority = priority;
        }
        const orders = await ordersCollection.find(query).sort({
            issuedAt: -1
        }).toArray();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch orders'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const ordersCollection = db.collection('orders');
        const centresCollection = db.collection('centres');
        const body = await request.json();
        const { role, issuedBy } = body;
        // Only super_admin can create orders
        if (role !== 'super_admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized: Only super admin can create orders'
            }, {
                status: 403
            });
        }
        // Validate required fields
        if (!body.subject || !body.subject.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Subject is required'
            }, {
                status: 400
            });
        }
        if (!body.instruction || !body.instruction.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Instruction is required'
            }, {
                status: 400
            });
        }
        if (!body.deadline || !body.deadline.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Deadline is required'
            }, {
                status: 400
            });
        }
        if (!body.priority) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Priority is required'
            }, {
                status: 400
            });
        }
        // Validate and normalize deadline format (DD/MM/YYYY)
        let deadline = body.deadline.trim();
        const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = deadline.match(ddmmyyyyRegex);
        if (!match) {
            // Try to parse YYYY-MM-DD format (backward compatibility)
            const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
            const yyyyMatch = deadline.match(yyyymmddRegex);
            if (yyyyMatch) {
                const [, year, month, day] = yyyyMatch;
                deadline = `${day}/${month}/${year}`;
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid deadline format. Please use DD/MM/YYYY format (e.g., 15/05/2024).'
                }, {
                    status: 400
                });
            }
        } else {
            // Normalize DD/MM/YYYY format
            const [, day, month, year] = match;
            deadline = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
        // Validate date components
        const dateParts = deadline.split('/');
        if (dateParts.length === 3) {
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            if (month < 1 || month > 12) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid month in deadline. Month must be between 1 and 12.'
                }, {
                    status: 400
                });
            }
            if (day < 1 || day > 31) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid day in deadline. Day must be between 1 and 31.'
                }, {
                    status: 400
                });
            }
            // Validate date is valid
            const deadlineDate = new Date(year, month - 1, day);
            if (deadlineDate.getDate() !== day || deadlineDate.getMonth() !== month - 1 || deadlineDate.getFullYear() !== year) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid deadline date. Please enter a valid date.'
                }, {
                    status: 400
                });
            }
        }
        // Get centre name if targetCentreId is provided
        if (body.targetCentreId) {
            const centre = await centresCollection.findOne({
                id: body.targetCentreId
            });
            body.targetCentreName = centre?.name || '';
        } else {
            body.targetCentreName = 'All Centres';
        }
        // Generate unique ID if not provided
        if (!body.id) {
            // Find the highest existing order number to ensure uniqueness
            // Support both formats: ORD-XXXXX and ORD00123
            const existingOrders = await ordersCollection.find({
                id: {
                    $regex: /^ORD/
                }
            }).sort({
                id: -1
            }).limit(1).toArray();
            let nextNumber = 1;
            if (existingOrders.length > 0 && existingOrders[0].id) {
                // Extract number from existing ID (e.g., ORD-00123 -> 123, ORD00123 -> 123)
                const match = existingOrders[0].id.match(/\d+/);
                if (match) {
                    nextNumber = parseInt(match[0], 10) + 1;
                }
            }
            // Format as ORD-XXXXX (5 digits for better scalability)
            body.id = `ORD-${String(nextNumber).padStart(5, '0')}`;
            // Double-check uniqueness (in case of race conditions)
            const existing = await ordersCollection.findOne({
                id: body.id
            });
            if (existing) {
                // If exists, increment and try again
                body.id = `ORD-${String(nextNumber + 1).padStart(5, '0')}`;
            }
        }
        body.issuedBy = issuedBy || 'Unknown';
        body.issuedAt = new Date().toISOString().split('T')[0];
        body.deadline = deadline; // Use normalized deadline
        body.status = body.status || 'issued'; // Default to 'issued' if not provided
        body.acknowledgements = [];
        body.updatedAt = new Date();
        const { role: _, issuedBy: __, ...orderData } = body;
        const result = await ordersCollection.insertOne(orderData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                ...orderData,
                _id: result.insertedId
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create order'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const ordersCollection = db.collection('orders');
        const body = await request.json();
        const { id, status, role, centreId: userCentreId } = body;
        // Check if order exists
        const order = await ordersCollection.findOne({
            id
        });
        if (!order) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        // Centre admin can only update orders for their centre
        if (role === 'centre_admin') {
            if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.'
                }, {
                    status: 400
                });
            }
            if (order.targetCentreId !== null && order.targetCentreId !== userCentreId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Unauthorized: You can only update orders for your centre'
                }, {
                    status: 403
                });
            }
            // Centre admin can only mark as completed
            if (status !== 'completed') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'You can only mark orders as completed'
                }, {
                    status: 403
                });
            }
        }
        const result = await ordersCollection.updateOne({
            id
        }, {
            $set: {
                status,
                updatedAt: new Date()
            }
        });
        const updatedOrder = await ordersCollection.findOne({
            id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to update order'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const ordersCollection = db.collection('orders');
        const body = await request.json();
        const { orderId, acknowledgedBy, role, centreId: userCentreId } = body;
        // Check if order exists
        const order = await ordersCollection.findOne({
            id: orderId
        });
        if (!order) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        // Centre admin can only acknowledge orders for their centre
        if (role === 'centre_admin') {
            if (!userCentreId || userCentreId === 'undefined' || userCentreId === 'null') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.'
                }, {
                    status: 400
                });
            }
            if (order.targetCentreId !== null && order.targetCentreId !== userCentreId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Unauthorized: You can only acknowledge orders for your centre'
                }, {
                    status: 403
                });
            }
        }
        // Check if already acknowledged by this centre
        const alreadyAcknowledged = order.acknowledgements.some((ack)=>ack.centreId === userCentreId);
        if (alreadyAcknowledged) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Order already acknowledged by your centre'
            }, {
                status: 400
            });
        }
        const newAcknowledgement = {
            centreId: userCentreId || '',
            acknowledgedBy,
            acknowledgedAt: new Date().toISOString().split('T')[0]
        };
        const result = await ordersCollection.updateOne({
            id: orderId
        }, {
            $push: {
                acknowledgements: newAcknowledgement
            },
            $set: {
                status: 'acknowledged',
                updatedAt: new Date()
            }
        });
        const updatedOrder = await ordersCollection.findOne({
            id: orderId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error acknowledging order:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to acknowledge order'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__845945f5._.js.map