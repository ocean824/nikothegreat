import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain',
}

// Download URL mapping for products (product handle -> download URL)
const downloadUrlMap: Record<string, string> = {
  'abstract-minds-vol-1': '/downloads/abstract-minds-vol-1.zip',
  'black-friday-vol-1': '/downloads/black-friday-vol-1.zip',
  'the-feels-vol-1': '/downloads/the-feels-vol-1.zip',
  'gray-area-vol-1': '/downloads/gray-area-vol-1.zip',
  'haze-midi-phrases-vol-1': '/downloads/haze-midi-phrases-vol-1.zip',
  'mana-vol-1': '/downloads/mana-vol-1.zip',
  'stained-glass-vol-1': '/downloads/stained-glass-vol-1.zip',
  'stained-glass-vol-2': '/downloads/stained-glass-vol-2.zip',
  'unrequited-love-vol-1': '/downloads/unrequited-love-vol-1.zip',
  'unrequited-love-vol-2': '/downloads/unrequited-love-vol-2.zip',
  'vibrant-darkness-vol-1': '/downloads/vibrant-darkness-vol-1.zip',
  'vintage-vibes-vol-1': '/downloads/vintage-vibes-vol-1.zip',
}

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
      .single()

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
      const productHandle = item.product_id ? item.handle || item.sku?.toLowerCase().replace(/\s+/g, '-') : null
      
      // Try to find download URL from the handle
      let downloadUrl = null
      if (productHandle && downloadUrlMap[productHandle]) {
        downloadUrl = downloadUrlMap[productHandle]
      } else {
        // Try to match by title
        const titleHandle = item.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        if (titleHandle && downloadUrlMap[titleHandle]) {
          downloadUrl = downloadUrlMap[titleHandle]
        }
      }

      const { error: itemError } = await supabase
        .from('purchase_items')
        .insert({
          purchase_id: purchase.id,
          product_title: item.title || 'Unknown Product',
          product_handle: productHandle,
          variant_title: item.variant_title || null,
          quantity: item.quantity || 1,
          price: parseFloat(item.price || '0'),
          download_url: downloadUrl,
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