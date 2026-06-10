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
    const product = await request.json();
    await sql`
      INSERT INTO products (id, name, type, category, stock, min_stock, price, cost, unit, recipe, last_updated)
      VALUES (${product.id}, ${product.name}, ${product.type}, ${product.category}, ${product.stock}, ${product.minStock}, ${product.price}, ${product.cost}, ${product.unit}, ${JSON.stringify(product.recipe)}, NOW());
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting product:', error);
    return NextResponse.json([], { status: 200 });
  }
}