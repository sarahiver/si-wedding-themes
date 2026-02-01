// Füge diese Funktion zu src/lib/supabase.js hinzu (nach updateProjectStatus)

// ============================================
// UPDATE PROJECT (für Settings: location, hashtag, display_email, display_phone)
// ============================================

export async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  
  return { data, error };
}
