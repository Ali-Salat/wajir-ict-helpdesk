import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { operation, collection, data, filter, update } = await req.json();
    
    console.log(`MongoDB Bridge - Operation: ${operation}, Collection: ${collection}`);

    const client = new MongoClient();
    await client.connect(mongoUri);
    
    const db = client.database("wajir_helpdesk"); // Default database name
    const coll = db.collection(collection);

    let result;

    switch (operation) {
      case 'find':
        result = await coll.find(filter || {}).toArray();
        break;
      
      case 'findOne':
        result = await coll.findOne(filter || {});
        break;
      
      case 'insertOne':
        result = await coll.insertOne(data);
        break;
      
      case 'insertMany':
        result = await coll.insertMany(data);
        break;
      
      case 'updateOne':
        result = await coll.updateOne(filter, { $set: update });
        break;
      
      case 'updateMany':
        result = await coll.updateMany(filter, { $set: update });
        break;
      
      case 'deleteOne':
        result = await coll.deleteOne(filter);
        break;
      
      case 'deleteMany':
        result = await coll.deleteMany(filter);
        break;
      
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    await client.close();

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('MongoDB Bridge Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});