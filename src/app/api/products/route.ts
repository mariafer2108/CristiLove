import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        id, 
        name, 
        type, 
        category, 
        stock, 
        min_stock, 
        price, 
        cost, 
        unit, 
        recipe,
        last_updated
      FROM products;
    `;
    const products = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      stock: row.stock,
      minStock: row.min_stock,
      price: row.price,
      cost: row.cost,
      unit: row.unit,
      recipe: row.recipe,
      lastUpdated: row.last_updated
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Si data es un array, es una sincronización completa
    if (Array.isArray(data)) {
      // Por simplicidad en este MVP, borramos y reinsertamos
      // En una app real usaríamos UPSERT o transacciones
      await sql`DELETE FROM products;`;
      
      for (const product of data) {
        await sql`
          INSERT INTO products (id, name, type, category, stock, min_stock, price, cost, unit, recipe, last_updated)
          VALUES (${product.id}, ${product.name}, ${product.type}, ${product.category}, ${product.stock}, ${product.minStock}, ${product.price}, ${product.cost}, ${product.unit}, ${JSON.stringify(product.recipe)}, NOW());
        `;
      }
    } else {
      // Si es un solo objeto, es una inserción/actualización individual
      const product = data;
      await sql`
        INSERT INTO products (id, name, type, category, stock, min_stock, price, cost, unit, recipe, last_updated)
        VALUES (${product.id}, ${product.name}, ${product.type}, ${product.category}, ${product.stock}, ${product.minStock}, ${product.price}, ${product.cost}, ${product.unit}, ${JSON.stringify(product.recipe)}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          category = EXCLUDED.category,
          stock = EXCLUDED.stock,
          min_stock = EXCLUDED.min_stock,
          price = EXCLUDED.price,
          cost = EXCLUDED.cost,
          unit = EXCLUDED.unit,
          recipe = EXCLUDED.recipe,
          last_updated = NOW();
      `;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting product:', error);
    return NextResponse.json([], { status: 200 });
  }
}