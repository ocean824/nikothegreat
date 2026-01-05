import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SHOPIFY_STORE_DOMAIN = 'gkxpnx-ys.myshopify.com'
const SHOPIFY_API_VERSION = '2025-01'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { productHandle, purchaseItemId } = await req.json()
    
    if (!productHandle || !purchaseItemId) {
      return new Response(JSON.stringify({ error: 'Missing productHandle or purchaseItemId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Resend download request: user=${user.email}, product=${productHandle}`)

    // Get product by handle from Shopify
    const productQuery = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          variants(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    `

    const productResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          query: productQuery,
          variables: { handle: productHandle },
        }),
      }
    )

    const productData = await productResponse.json()
    console.log('Product lookup:', JSON.stringify(productData))

    if (!productData.data?.productByHandle) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const product = productData.data.productByHandle
    const variantId = product.variants.edges[0]?.node?.id

    if (!variantId) {
      return new Response(JSON.stringify({ error: 'No variant found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a free draft order for the digital product
    const draftOrderMutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            invoiceUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const draftOrderResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          query: draftOrderMutation,
          variables: {
            input: {
              email: user.email,
              note: 'Resend download - triggered from account page',
              lineItems: [
                {
                  variantId: variantId,
                  quantity: 1,
                }
              ],
              appliedDiscount: {
                value: 100,
                valueType: 'PERCENTAGE',
                title: 'Re-download',
              },
            },
          },
        }),
      }
    )

    const draftOrderData = await draftOrderResponse.json()
    console.log('Draft order created:', JSON.stringify(draftOrderData))

    if (draftOrderData.data?.draftOrderCreate?.userErrors?.length > 0) {
      const errors = draftOrderData.data.draftOrderCreate.userErrors
      console.error('Draft order errors:', errors)
      return new Response(JSON.stringify({ error: errors[0].message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const draftOrderId = draftOrderData.data?.draftOrderCreate?.draftOrder?.id

    if (!draftOrderId) {
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Complete the draft order (mark as paid)
    const completeMutation = `
      mutation draftOrderComplete($id: ID!) {
        draftOrderComplete(id: $id) {
          draftOrder {
            order {
              id
              name
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const completeResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': shopifyAccessToken,
        },
        body: JSON.stringify({
          query: completeMutation,
          variables: { id: draftOrderId },
        }),
      }
    )

    const completeData = await completeResponse.json()
    console.log('Order completed:', JSON.stringify(completeData))

    if (completeData.data?.draftOrderComplete?.userErrors?.length > 0) {
      const errors = completeData.data.draftOrderComplete.userErrors
      console.error('Complete order errors:', errors)
      return new Response(JSON.stringify({ error: errors[0].message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orderName = completeData.data?.draftOrderComplete?.draftOrder?.order?.name

    return new Response(JSON.stringify({ 
      success: true,
      message: `Download link sent to ${user.email}`,
      orderNumber: orderName,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error resending download:', errorMessage)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})