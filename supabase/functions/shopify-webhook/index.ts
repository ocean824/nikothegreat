import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain',
}

// Product handle to storage path mapping
// Files should be uploaded to the 'downloads' bucket with this structure:
// downloads/{product-handle}/{filename}.zip
const productHandles = [
  'abstract-minds-vol-1',
  'black-friday-vol-1',
  'the-feels-vol-1',
  'gray-area-vol-1',
  'haze-midi-phrases-vol-1',
  'mana-vol-1',
  'stained-glass-vol-1',
  'stained-glass-vol-2',
  'unrequited-love-vol-1',
  'unrequited-love-vol-2',
  'vibrant-darkness-vol-1',
  'vintage-vibes-vol-1',
]

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the webhook topic from headers
    const topic = req.headers.get('x-shopify-topic')
    console.log('Received Shopify webhook:', topic)

    if (topic !== 'orders/paid' && topic !== 'orders/create') {
      console.log('Ignoring webhook topic:', topic)
      return new Response(JSON.stringify({ message: 'Webhook received but not processed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orderData = await req.json()
    console.log('Order data received:', JSON.stringify(orderData, null, 2))

    const customerEmail = orderData.email?.toLowerCase()
    if (!customerEmail) {
      console.error('No customer email in order')
      return new Response(JSON.stringify({ error: 'No customer email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from('purchases')
      .select('id')
      .eq('shopify_order_id', orderData.id.toString())
      .maybeSingle()

    if (existingOrder) {
      console.log('Order already exists, skipping:', orderData.id)
      return new Response(JSON.stringify({ message: 'Order already processed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Insert the purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        email: customerEmail,
        shopify_order_id: orderData.id.toString(),
        shopify_order_number: orderData.order_number?.toString() || orderData.name,
        order_date: orderData.created_at || new Date().toISOString(),
        total_amount: parseFloat(orderData.total_price || '0'),
        currency: orderData.currency || 'USD',
        status: 'completed',
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Error inserting purchase:', purchaseError)
      return new Response(JSON.stringify({ error: 'Failed to insert purchase' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Purchase created:', purchase.id)

    // Insert purchase items
    const lineItems = orderData.line_items || []
    for (const item of lineItems) {
      // Try to get handle from the item, or derive from title
      let productHandle = item.handle || null
      
      if (!productHandle && item.title) {
        // Try to match by title to known handles
        const titleHandle = item.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (productHandles.includes(titleHandle)) {
          productHandle = titleHandle
        } else {
          // Try partial matching
          const matchedHandle = productHandles.find(h => 
            titleHandle.includes(h) || h.includes(titleHandle)
          )
          if (matchedHandle) {
            productHandle = matchedHandle
          }
        }
      }

      console.log(`Processing item: ${item.title}, handle: ${productHandle}`)

      const { error: itemError } = await supabase
        .from('purchase_items')
        .insert({
          purchase_id: purchase.id,
          product_title: item.title || 'Unknown Product',
          product_handle: productHandle,
          variant_title: item.variant_title || null,
          quantity: item.quantity || 1,
          price: parseFloat(item.price || '0'),
          // download_url will be generated dynamically via signed URLs
          download_url: null,
        })

      if (itemError) {
        console.error('Error inserting purchase item:', itemError)
      }
    }

    console.log('Order processed successfully:', orderData.order_number)

    return new Response(JSON.stringify({ success: true, purchaseId: purchase.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook processing error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})