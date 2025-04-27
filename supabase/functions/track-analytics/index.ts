// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a Supabase client with the Auth context of the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AnalyticsEvent {
  session_id: string
  visitor_id: string
  page_url: string
  page_title: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  region?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
}

interface SessionUpdate {
  session_id: string
  duration: number
  is_bounce: boolean
}

serve(async (req) => {
  // Get the origin from the request
  const origin = req.headers.get('origin') || '*';
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://xuanphuong.com'
  ];
  
  // Set the appropriate CORS header
  const corsOrigin = allowedOrigins.includes(origin) ? origin : '*';
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers })
  }

  try {
    const { type, data } = await req.json()

    if (type === 'pageview' && isAnalyticsEvent(data)) {
      // Call the track_analytics function
      const { error } = await supabase.rpc('track_analytics', {
        session_id: data.session_id,
        visitor_id: data.visitor_id,
        page_url: data.page_url,
        page_title: data.page_title,
        referrer: data.referrer,
        user_agent: data.user_agent,
        ip_address: req.headers.get('x-forwarded-for') || data.ip_address,
        region: data.region,
        city: data.city,
        device_type: data.device_type,
        browser: data.browser,
        os: data.os
      })

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), { headers })
    } 
    else if (type === 'session' && isSessionUpdate(data)) {
      // Call the update_analytics_session function
      const { error } = await supabase.rpc('update_analytics_session', {
        session_id: data.session_id,
        duration: data.duration,
        is_bounce: data.is_bounce
      })

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), { headers })
    }
    else {
      throw new Error('Invalid event type or data')
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers }
    )
  }
})

// Type guards
function isAnalyticsEvent(data: any): data is AnalyticsEvent {
  return data && 
    typeof data.session_id === 'string' && 
    typeof data.visitor_id === 'string' && 
    typeof data.page_url === 'string' && 
    typeof data.page_title === 'string'
}

function isSessionUpdate(data: any): data is SessionUpdate {
  return data && 
    typeof data.session_id === 'string' && 
    typeof data.duration === 'number' && 
    typeof data.is_bounce === 'boolean'
}
