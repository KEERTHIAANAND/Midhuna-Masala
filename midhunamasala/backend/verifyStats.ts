import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Fetching orders from Supabase...");
  
  // Fetch all non-cancelled orders
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, total, created_at, status')
    .not('status', 'in', '("cancelled","refund")')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log("No valid orders found.");
    return;
  }

  let totalRevenue = 0;
  let totalOrders = orders.length;

  console.log(`\nFound ${totalOrders} valid orders:`);
  
  orders.slice(0, 10).forEach(o => {
      console.log(`- Order ${o.order_number}: ₹${o.total} (${new Date(o.created_at).toLocaleDateString()})`);
  });
  
  if (totalOrders > 10) {
      console.log(`... and ${totalOrders - 10} more.`);
  }

  orders.forEach(o => {
    totalRevenue += Number(o.total || 0);
  });

  console.log("\n--- Verification Summary ---");
  console.log(`Total Orders: ${totalOrders}`);
  console.log(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
  console.log(`Avg Order Value: ₹${(totalRevenue / totalOrders).toFixed(2)}`);
  console.log("----------------------------\n");
  
  console.log("Note: The dashboard might be filtering by 'Last 30 Days'. This script fetched ALL time orders to give you a raw count.");
}

verify();
