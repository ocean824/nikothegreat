import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create client with user's JWT to verify authentication
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get the current user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get request body
    const { productHandle, purchaseItemId } = await req.json()
    
    if (!productHandle || !purchaseItemId) {
      return new Response(JSON.stringify({ error: 'Missing productHandle or purchaseItemId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Download request: user=${user.email}, product=${productHandle}, itemId=${purchaseItemId}`)

    // Use service role to verify purchase ownership
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's profile to get their email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError || !profile) {
      console.error('Profile error:', profileError)
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify the user owns this purchase item
    const { data: purchaseItem, error: itemError } = await supabaseAdmin
      .from('purchase_items')
      .select(`
        id,
        product_handle,
        purchase:purchases!inner (
          email
        )
      `)
      .eq('id', purchaseItemId)
      .maybeSingle()

    if (itemError || !purchaseItem) {
      console.error('Purchase item error:', itemError)
      return new Response(JSON.stringify({ error: 'Purchase not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify email matches
    const purchaseEmail = (purchaseItem.purchase as any).email?.toLowerCase()
    if (purchaseEmail !== profile.email.toLowerCase()) {
      console.error(`Email mismatch: ${purchaseEmail} vs ${profile.email}`)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // List files in the product folder
    const { data: files, error: listError } = await supabaseAdmin
      .storage
      .from('downloads')
      .list(productHandle)

    if (listError) {
      console.error('Storage list error:', listError)
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!files || files.length === 0) {
      console.error(`No files found for product: ${productHandle}`)
      return new Response(JSON.stringify({ error: 'Download not available yet. Files are being uploaded.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get the first file (usually .zip)
    const file = files[0]
    const filePath = `${productHandle}/${file.name}`

    // Generate a signed URL (valid for 1 hour)
    const { data: signedUrl, error: signError } = await supabaseAdmin
      .storage
      .from('downloads')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (signError || !signedUrl) {
      console.error('Signed URL error:', signError)
      return new Response(JSON.stringify({ error: 'Could not generate download URL' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Generated download URL for ${filePath}`)

    return new Response(JSON.stringify({ 
      downloadUrl: signedUrl.signedUrl,
      fileName: file.name,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error generating download URL:', errorMessage)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})