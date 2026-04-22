=====================================================                                                                                                       
  -- CRÉATION DU BUCKET COUNTRIES-LOGOS                                                                                                                          
  -- =====================================================                                                                                                       
                                                                                                                                                                 
  -- 1. Créer le bucket                                                                                                                                          
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)                                                                            
  VALUES ('countries-logos', 'countries-logos', true, 5242880,                                                                                                   
          ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);                                                                                      
                                                                                                                                                                 
  -- =====================================================                                                                                                       
  -- POLITIQUES RLS (ROW LEVEL SECURITY)                                                                                                                         
  -- =====================================================                                                                                                       
                                                                                                                                                                 
  -- IMPORTANT: D'abord supprimer les anciennes politiques si elles existent                                                                                     
  DROP POLICY IF EXISTS "Public can view country logos" ON storage.objects;                                                                                      
  DROP POLICY IF EXISTS "Authenticated users can upload country logos" ON storage.objects;                                                                       
  DROP POLICY IF EXISTS "Authenticated users can update country logos" ON storage.objects;                                                                       
  DROP POLICY IF EXISTS "Super admins can delete country logos" ON storage.objects;                                                                              
                                                                                                                                                                 
  -- 2. Politique SELECT: Tout le monde peut voir les logos (bucket public)                                                                                      
  CREATE POLICY "Public can view country logos"                                                                                                                  
  ON storage.objects FOR SELECT                                                                                                                                  
  TO public                                                                                                                                                      
  USING (bucket_id = 'countries-logos');                                                                                                                         
                                                                                                                                                                 
  -- 3. Politique INSERT: Utilisateurs authentifiés avec rôle autorisé peuvent uploader                                                                          
  CREATE POLICY "Authenticated users can upload country logos"                                                                                                   
  ON storage.objects FOR INSERT                                                                                                                                  
  TO authenticated                                                                                                                                               
  WITH CHECK (bucket_id = 'countries-logos');                                                                                                                    
                                                                                                                                                                 
  -- 4. Politique UPDATE: Utilisateurs authentifiés peuvent mettre à jour                                                                                        
  CREATE POLICY "Authenticated users can update country logos"                                                                                                   
  ON storage.objects FOR UPDATE                                                                                                                                  
  TO authenticated                                                                                                                                               
  USING (bucket_id = 'countries-logos')                                                                                                                          
  WITH CHECK (bucket_id = 'countries-logos');                                                                                                                    
                                                                                                                                                                 
  -- 5. Politique DELETE: Seuls super_admin peuvent supprimer                                                                                                    
  CREATE POLICY "Super admins can delete country logos"                                                                                                          
  ON storage.objects FOR DELETE                                                                                                                                  
  TO authenticated                                                                                                                                               
  USING (                                                                                                                                                        
    bucket_id = 'countries-logos'                                                                                                                                
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'                                                                                        
  );                                           