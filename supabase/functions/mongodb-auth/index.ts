import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { create, verify } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JWT_SECRET = "your-secret-key"; // In production, use env variable

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mongoUri = Deno.env.get('MONGODB_CONNECTION_STRING');
    if (!mongoUri) {
      throw new Error('MongoDB connection string not configured');
    }

    const { action, email, password, fullName } = await req.json();
    
    console.log(`MongoDB Auth - Action: ${action}, Email: ${email}`);

    const client = new MongoClient();
    await client.connect(mongoUri);
    
    const db = client.database("wajir_helpdesk");
    const users = db.collection("users");

    let result;

    switch (action) {
      case 'register':
        // Check if user exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Create user
        const newUser = {
          email,
          password: hashedPassword,
          fullName,
          role: 'requester',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const insertResult = await users.insertOne(newUser);
        
        // Generate JWT
        const token = await generateJWT({ 
          userId: insertResult.insertedId, 
          email, 
          role: 'requester' 
        });
        
        result = { 
          user: { 
            id: insertResult.insertedId, 
            email, 
            fullName, 
            role: 'requester' 
          }, 
          token 
        };
        break;

      case 'login':
        // Find user
        const user = await users.findOne({ email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        // Generate JWT
        const loginToken = await generateJWT({ 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        });

        result = { 
          user: { 
            id: user._id, 
            email: user.email, 
            fullName: user.fullName, 
            role: user.role 
          }, 
          token: loginToken 
        };
        break;

      case 'verify':
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          throw new Error('No token provided');
        }

        const token = authHeader.substring(7);
        const payload = await verifyJWT(token);
        
        // Get fresh user data
        const currentUser = await users.findOne({ _id: payload.userId });
        if (!currentUser) {
          throw new Error('User not found');
        }

        result = { 
          user: { 
            id: currentUser._id, 
            email: currentUser.email, 
            fullName: currentUser.fullName, 
            role: currentUser.role 
          } 
        };
        break;

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    await client.close();

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('MongoDB Auth Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

async function generateJWT(payload: any): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return await create({ alg: "HS256", typ: "JWT" }, payload, key);
}

async function verifyJWT(token: string): Promise<any> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  return await verify(token, key);
}