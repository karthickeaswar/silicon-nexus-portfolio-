const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT')) {
    console.warn('⚠️  Supabase not configured — using fallback mode (no database)');
}

const supabase = (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT'))
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

module.exports = supabase;
