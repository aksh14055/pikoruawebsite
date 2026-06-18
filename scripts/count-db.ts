import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const { data: allProps, error: errAll } = await supabase.from("properties").select("*");
  if (errAll) {
    console.error("Error fetching properties:", errAll.message);
    return;
  }

  console.log(`Total properties in Supabase properties table: ${allProps?.length}`);
  if (allProps && allProps.length > 0) {
    console.log("Columns in properties table:", Object.keys(allProps[0]));
    console.log("Sample property:", allProps[0]);
  }
}

main();
