import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Get the first product
    const { data: products, error: fetchError } = await supabase.from('products').select('*').limit(1);
    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }
    if (!products || products.length === 0) {
        console.log('No products found');
        return;
    }

    const targetProduct = products[0];
    console.log(`Updating product: ${targetProduct.name} to 1 rupee`);

    const { error: updateError } = await supabase
        .from('products')
        .update({ price: 1 })
        .eq('id', targetProduct.id);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('Success!');
    }
}

main();
