const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const shortCode = "90ad9239";
  const minUuid = `${shortCode}-0000-0000-0000-000000000000`;
  const maxUuid = `${shortCode}-ffff-ffff-ffff-ffffffffffff`;

  console.log("min:", minUuid);
  console.log("max:", maxUuid);

  const { data, error } = await supabase
    .from("pets")
    .select("id")
    .gte("id", minUuid)
    .lte("id", maxUuid);

  console.log("data:", data);
  console.log("error:", error);
  
  // Test ilike using cast
  const { data: data2, error: error2 } = await supabase
    .from("pets")
    .select("id")
    .ilike("id::text", `${shortCode}%`);
    
  console.log("data2:", data2);
  console.log("error2:", error2);
}

test();
