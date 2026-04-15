// Archivo de Configuración de Supabase
// RECUERDA: Reemplaza estos valores con las credenciales reales de tu proyecto Supabase.
const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_ANON_KEY";

// Inicializar el cliente (La CDN de Supabase debe ser importada antes de este script)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
