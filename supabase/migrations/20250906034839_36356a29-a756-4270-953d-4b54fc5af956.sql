-- Create delete user edge function
CREATE OR REPLACE FUNCTION public.request_user_deletion(user_id_to_delete uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role text;
  result json;
BEGIN
  -- Check if current user is admin
  current_user_role := get_current_user_role();
  
  IF current_user_role != 'admin' THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized: Only admins can delete users');
  END IF;
  
  -- Check if user exists in profiles
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_id_to_delete) THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Mark for deletion (we'll use edge function for actual auth deletion)
  UPDATE profiles 
  SET full_name = '[DELETED] ' || full_name,
      email = 'deleted_' || extract(epoch from now()) || '@example.com'
  WHERE id = user_id_to_delete;
  
  RETURN json_build_object('success', true, 'message', 'User marked for deletion');
END;
$$;