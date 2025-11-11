import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { unlockCode, userIdentifier } = await req.json()

    if (!unlockCode || !userIdentifier) {
      throw new Error('Missing unlock code or user identifier')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    // Check if code exists and is not yet used
    const { data: unlockData, error: fetchError } = await supabaseClient
      .from('premium_unlocks')
      .select('*')
      .eq('unlock_code', unlockCode.toUpperCase())
      .is('unlocked_at', null)
      .single()

    if (fetchError || !unlockData) {
      console.error('Invalid or already used code:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Invalid or already used unlock code' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Mark code as used
    const { error: updateError } = await supabaseClient
      .from('premium_unlocks')
      .update({
        user_identifier: userIdentifier,
        unlocked_at: new Date().toISOString(),
      })
      .eq('unlock_code', unlockCode.toUpperCase())

    if (updateError) {
      console.error('Error updating unlock code:', updateError)
      throw updateError
    }

    console.log(`Code ${unlockCode} successfully unlocked for ${userIdentifier}`)

    return new Response(
      JSON.stringify({
        success: true,
        skinId: unlockData.skin_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in validate-unlock-code:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
