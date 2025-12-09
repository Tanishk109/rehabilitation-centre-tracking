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
// Default connection string if not in env (for scripts)
const defaultUri = 'mongodb+srv://necks:fdLaWizvRAmTYvdG@cluster0.ebmc6q3.mongodb.net/rehabilitation-centre-tracking?retryWrites=true&w=majority&appName=Cluster0';
if (!process.env.MONGODB_URI && ("TURBOPACK compile-time value", "undefined") === 'undefined') {
    // Only set default in server-side context
    process.env.MONGODB_URI = defaultUri;
}
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}
const uri = process.env.MONGODB_URI;
const options = {};
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
    const client = await clientPromise;
    return client.db('rehabilitation-centre-tracking');
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
        if (status) {
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
        const { role, centreId: userCentreId } = body;
        // Centre admin can only create patients for their centre
        if (role === 'centre_admin') {
            body.centreId = userCentreId;
        }
        // Generate ID if not provided
        if (!body.id) {
            const count = await patientsCollection.countDocuments();
            body.id = `P${String(count + 1).padStart(3, '0')}`;
        }
        // Calculate age if not provided
        if (body.dob && !body.age) {
            const today = new Date();
            const birthDate = new Date(body.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
            body.age = age;
        }
        body.medications = body.medications || [];
        body.createdAt = new Date();
        body.updatedAt = new Date();
        const { role: _, centreId: __, ...patientData } = body;
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
        const { id, role, centreId: userCentreId } = body;
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
        if (role === 'centre_admin' && existingPatient.centreId !== userCentreId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Unauthorized: You can only update patients from your centre'
            }, {
                status: 403
            });
        }
        // Ensure centre admin cannot change centreId
        if (role === 'centre_admin') {
            body.centreId = userCentreId;
        }
        // Calculate age if dob changed
        if (body.dob) {
            const today = new Date();
            const birthDate = new Date(body.dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) age--;
            body.age = age;
        }
        const { id: patientId, role: _, centreId: __, ...updateData } = body;
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
        // Check if patient exists
        const patient = await patientsCollection.findOne({
            id
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
            id
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