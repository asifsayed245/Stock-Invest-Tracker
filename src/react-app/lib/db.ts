// src/react-app/lib/db.ts
import { supabase } from './supabaseClient'

// Example: read current user's profile (optional table)
export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) return null
  return data
}
