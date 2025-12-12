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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/app/api/users/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const usersCollection = db.collection('users');
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const password = searchParams.get('password');
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Email is required'
            }, {
                status: 400
            });
        }
        const user = await usersCollection.findOne({
            email: email.toLowerCase()
        });
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid email or password'
            }, {
                status: 404
            });
        }
        // Verify password if provided
        if (password) {
            if (!user.password) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Password not set. Please use forgot password.'
                }, {
                    status: 401
                });
            }
            const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.password);
            if (!isPasswordValid) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid email or password'
                }, {
                    status: 401
                });
            }
        }
        // Check approval status for centre admins (status is optional for super_admin)
        if (user.role === 'centre_admin' && user.status && user.status !== 'approved') {
            if (user.status === 'pending') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Your registration is pending approval. Please wait for super admin approval.',
                    status: 'pending'
                }, {
                    status: 403
                });
            } else if (user.status === 'rejected') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: user.rejectionReason || 'Your registration has been rejected. Please contact support.',
                    status: 'rejected'
                }, {
                    status: 403
                });
            }
        }
        // Remove password from response
        const userWithoutPassword = {
            ...user
        };
        delete userWithoutPassword.password;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Provide more helpful error messages
        if (errorMessage.includes('MongoDB') || errorMessage.includes('connection')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Database connection failed. Please check server configuration.'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: `Failed to fetch user: ${errorMessage}`
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const usersCollection = db.collection('users');
        const body = await request.json();
        // Check if user already exists
        const existingUser = await usersCollection.findOne({
            email: body.email.toLowerCase()
        });
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'User already exists'
            }, {
                status: 400
            });
        }
        body.email = body.email.toLowerCase();
        body.createdAt = new Date();
        body.updatedAt = new Date();
        const result = await usersCollection.insertOne(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                ...body,
                _id: result.insertedId
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create user'
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const db = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabase"])();
        const usersCollection = db.collection('users');
        const body = await request.json();
        const { userId, email, ...updateData } = body;
        if (!userId && !email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'User ID or email is required'
            }, {
                status: 400
            });
        }
        // Find the user to update - try by id first, then by email
        let user = null;
        let query = {};
        if (userId) {
            query = {
                id: userId
            };
            user = await usersCollection.findOne(query);
        }
        // If not found by id, try by email
        if (!user && email) {
            query = {
                email: email.toLowerCase()
            };
            user = await usersCollection.findOne(query);
        }
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'User not found'
            }, {
                status: 404
            });
        }
        // Fields that can be updated through profile update
        const allowedFields = [
            'name',
            'phone',
            'dob',
            'age',
            'aadharNumber',
            'address'
        ];
        // Filter updateData to only include allowed fields and non-empty values
        const filteredUpdateData = {};
        for (const field of allowedFields){
            if (updateData[field] !== undefined && updateData[field] !== null) {
                // Skip empty strings
                if (typeof updateData[field] === 'string' && updateData[field].trim() === '') {
                    continue;
                }
                filteredUpdateData[field] = updateData[field];
            }
        }
        // Validate and calculate age if DOB is provided
        if (filteredUpdateData.dob) {
            let dobValue = filteredUpdateData.dob;
            // Ensure DOB is a string
            if (typeof dobValue !== 'string') {
                dobValue = String(dobValue);
            }
            // Trim whitespace
            dobValue = dobValue.trim();
            // Parse DD/MM/YYYY format
            const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const match = dobValue.match(ddmmyyyyRegex);
            if (!match) {
                // Try to parse YYYY-MM-DD format (for backward compatibility)
                const yyyymmddRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
                const yyyyMatch = dobValue.match(yyyymmddRegex);
                if (yyyyMatch) {
                    const [, year, month, day] = yyyyMatch;
                    dobValue = `${day}/${month}/${year}`;
                } else {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        success: false,
                        error: 'Invalid date format. Please use DD/MM/YYYY format (e.g., 15/05/1990).'
                    }, {
                        status: 400
                    });
                }
            } else {
                // Normalize DD/MM/YYYY format
                const [, day, month, year] = match;
                dobValue = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            }
            // Parse date for validation
            const dateParts = dobValue.split('/');
            if (dateParts.length !== 3) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid date format. Please use DD/MM/YYYY format.'
                }, {
                    status: 400
                });
            }
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            // Validate date components
            if (isNaN(day) || isNaN(month) || isNaN(year)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid date. Please enter valid numbers.'
                }, {
                    status: 400
                });
            }
            if (month < 1 || month > 12) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid month. Month must be between 1 and 12.'
                }, {
                    status: 400
                });
            }
            if (day < 1 || day > 31) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid day. Day must be between 1 and 31.'
                }, {
                    status: 400
                });
            }
            // Create date object for validation
            const birthDate = new Date(year, month - 1, day);
            // Validate date is valid (handles invalid dates like 31/02/1990)
            if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid date. Please enter a valid date.'
                }, {
                    status: 400
                });
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            birthDate.setHours(0, 0, 0, 0);
            // Validate date is not in the future
            if (birthDate > today) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Date of birth cannot be in the future'
                }, {
                    status: 400
                });
            }
            // Validate date is reasonable (not more than 150 years ago)
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 150);
            minDate.setHours(0, 0, 0, 0);
            if (birthDate < minDate) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Date of birth is too far in the past (more than 150 years ago)'
                }, {
                    status: 400
                });
            }
            // Store DOB in DD/MM/YYYY format
            filteredUpdateData.dob = dobValue;
            // Calculate age
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
                age--;
            }
            // Validate calculated age is reasonable
            if (age < 0 || age > 150) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Invalid age calculated from date of birth'
                }, {
                    status: 400
                });
            }
            filteredUpdateData.age = age;
        }
        // Validate age if provided directly (without DOB)
        if (filteredUpdateData.age !== undefined && !filteredUpdateData.dob) {
            const ageNum = typeof filteredUpdateData.age === 'number' ? filteredUpdateData.age : parseInt(String(filteredUpdateData.age));
            if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: 'Age must be a number between 0 and 150'
                }, {
                    status: 400
                });
            }
            filteredUpdateData.age = ageNum;
        }
        // Add updatedAt timestamp
        filteredUpdateData.updatedAt = new Date();
        // Update the user using the same query we used to find the user
        const result = await usersCollection.updateOne(query, {
            $set: filteredUpdateData
        });
        if (result.matchedCount === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'User not found'
            }, {
                status: 404
            });
        }
        // Fetch and return the updated user (without password)
        const updatedUser = await usersCollection.findOne(query);
        if (!updatedUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Failed to fetch updated user'
            }, {
                status: 500
            });
        }
        const userWithoutPassword = {
            ...updatedUser
        };
        delete userWithoutPassword.password;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: userWithoutPassword
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        // Provide more specific error messages
        if (errorMessage.includes('pattern') || errorMessage.includes('validation') || errorMessage.includes('format')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid data format. Please ensure all fields are in the correct format.'
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: `Failed to update profile: ${errorMessage}`
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__120839b6._.js.map