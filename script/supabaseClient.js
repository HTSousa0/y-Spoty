// ==========================================
// SPOTY - Conexão com o Supabase
// Esse arquivo só cria a "ligação" com o banco de dados.
// Os outros arquivos (cadastro.js, login.js, sessao.js) usam
// a variável "supabaseClient" criada aqui.
// ==========================================

const supabaseClient = window.supabase.createClient(
  "https://gboxgtwffoqlqfatqxik.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdib3hndHdmZm9xbHFmYXRxeGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODg5ODQsImV4cCI6MjEwNTE2NDk4NH0.6fjsNoqRIIeH0esXcAAuYSHsTIeB22wyMjdb_sod1Do"
);
