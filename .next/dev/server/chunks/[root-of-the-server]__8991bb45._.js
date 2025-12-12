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
"[project]/app/api/patients/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
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
        const patientsCollection = db.collection('patients');
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const centreId = searchParams.get('centreId');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        let query = {};
        // Filter by centreId if centre_admin
        if (role === 'centre_admin' && centreId) {
            query.centreId = centreId;
        }
        // Filter by centreId if provided
        if (centreId && role === 'super_admin') {
            query.centreId = centreId;
        }
        // Filter by status
        if (status && (status === 'admitted' || status === 'under_treatment' || status === 'recovering' || status === 'discharged')) {
            query.status = status;
        }
        // Search filter
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    id: {
                        $regex: search,
                        $options: 'i'
                    }
                },
                {
                    aadharNumber: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ];
        }
        const patients = await patientsCollection.find(query).sort({
            createdAt: -1
        }).toArray();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: patients
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch patients'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const patientsCollection = db.collection('patients');
        const body = await request.json();
        const { role, centreId } = body;
        // Validate required fields
        if (!body.name || !body.name.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Patient name is required'
            }, {
                status: 400
            });
        }
        if (!body.dob || !body.dob.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Date of birth is required'
            }, {
                status: 400
            });
        }
        // Centre admin can only create patients for their centre
        if (role === 'centre_admin') {
            // Ensure centreId is set from the request body
            if (!centreId || centreId === 'undefined' || centreId === 'null' || centreId === '') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.'
                }, {
                    status: 400
                });
            }
            // Ensure the centreId from the request matches the user's centreId (security check)
            body.centreId = centreId;
        } else if (role === 'super_admin') {
            // Super admin must provide centreId
            if (!body.centreId || body.centreId === 'undefined' || body.centreId === 'null' || body.centreId === '') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Centre ID is required. Please select a centre for the patient.'
                }, {
                    status: 400
                });
            }
            // Validate that the centre exists
            const centresCollection = db.collection('centres');
            const centre = await centresCollection.findOne({
                id: body.centreId
            });
            if (!centre) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid centre ID. Please select a valid centre.'
                }, {
                    status: 400
                });
            }
        }
        // Generate ID if not provided
        if (!body.id) {
            const count = await patientsCollection.countDocuments();
            body.id = `P${String(count + 1).padStart(3, '0')}`;
        }
        // Calculate age if not provided (handles DD/MM/YYYY format)
        if (body.dob && !body.age) {
            let birthDate;
            const dobString = String(body.dob).trim();
            // Parse DD/MM/YYYY format
            const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const match = dobString.match(ddmmyyyyRegex);
            if (match) {
                const [, day, month, year] = match;
                birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
                // Try YYYY-MM-DD format (backward compatibility)
                birthDate = new Date(dobString);
            }
            if (!isNaN(birthDate.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
                body.age = age;
            }
        }
        body.medications = body.medications || [];
        body.createdAt = new Date();
        body.updatedAt = new Date();
        // Remove role from patientData (it's only for validation), but KEEP centreId
        const { role: _, ...patientData } = body;
        const result = await patientsCollection.insertOne(patientData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                ...patientData,
                _id: result.insertedId
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating patient:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create patient'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const patientsCollection = db.collection('patients');
        const body = await request.json();
        const { id, role, centreId } = body;
        // Check if patient exists and belongs to centre admin's centre
        const existingPatient = await patientsCollection.findOne({
            id
        });
        if (!existingPatient) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Patient not found'
            }, {
                status: 404
            });
        }
        // Centre admin can only update patients from their centre
        if (role === 'centre_admin') {
            if (!centreId || centreId === 'undefined' || centreId === 'null' || centreId === '') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Centre ID is required for centre admin. Please ensure you are logged in correctly.'
                }, {
                    status: 400
                });
            }
            if (existingPatient.centreId !== centreId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Unauthorized: You can only update patients from your centre'
                }, {
                    status: 403
                });
            }
            // Ensure centre admin cannot change centreId
            body.centreId = centreId;
        }
        // Calculate age if dob changed (handles DD/MM/YYYY format)
        if (body.dob) {
            let birthDate;
            const dobString = String(body.dob).trim();
            // Parse DD/MM/YYYY format
            const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const match = dobString.match(ddmmyyyyRegex);
            if (match) {
                const [, day, month, year] = match;
                birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            } else {
                // Try YYYY-MM-DD format (backward compatibility)
                birthDate = new Date(dobString);
            }
            if (!isNaN(birthDate.getTime())) {
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
                body.age = age;
            }
        }
        // Remove role from updateData (it's only for validation), but KEEP centreId
        const { id: patientId, role: _, ...updateData } = body;
        updateData.updatedAt = new Date();
        const result = await patientsCollection.updateOne({
            id: patientId
        }, {
            $set: updateData
        });
        const updatedPatient = await patientsCollection.findOne({
            id: patientId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: updatedPatient
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to update patient'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const patientsCollection = db.collection('patients');
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const role = searchParams.get('role');
        const centreId = searchParams.get('centreId');
        // Validate id parameter
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Patient ID is required'
            }, {
                status: 400
            });
        }
        // Check if patient exists
        const patient = await patientsCollection.findOne({
            id: id
        });
        if (!patient) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Patient not found'
            }, {
                status: 404
            });
        }
        // Centre admin can only delete patients from their centre
        if (role === 'centre_admin' && patient.centreId !== centreId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized: You can only delete patients from your centre'
            }, {
                status: 403
            });
        }
        const result = await patientsCollection.deleteOne({
            id: id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting patient:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to delete patient'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const patientsCollection = db.collection('patients');
        const body = await request.json();
        const { patientId, medication, role, centreId: userCentreId } = body;
        // Check if patient exists
        const patient = await patientsCollection.findOne({
            id: patientId
        });
        if (!patient) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Patient not found'
            }, {
                status: 404
            });
        }
        // Centre admin can only add medications to patients from their centre
        if (role === 'centre_admin' && patient.centreId !== userCentreId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized: You can only add medications to patients from your centre'
            }, {
                status: 403
            });
        }
        // Generate medication ID
        const medicationId = `MED${String(patient.medications.length + 1).padStart(3, '0')}`;
        const newMedication = {
            ...medication,
            id: medicationId
        };
        const result = await patientsCollection.updateOne({
            id: patientId
        }, {
            $push: {
                medications: newMedication
            },
            $set: {
                updatedAt: new Date()
            }
        });
        const updatedPatient = await patientsCollection.findOne({
            id: patientId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: updatedPatient
        });
    } catch (error) {
        console.error('Error adding medication:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to add medication'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8991bb45._.js.map