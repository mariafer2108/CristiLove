import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        id, 
        type, 
        description, 
        amount, 
        category, 
        date
      FROM transactions
      ORDER BY date DESC;
    `;
    const transactions = result.rows.map((row: any) => ({
      id: row.id,
      type: row.type,
      description: row.description,
      amount: row.amount,
      category: row.category,
      date: row.date
    }));
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const transaction = await request.json();
    await sql`
      INSERT INTO transactions (id, type, description, amount, category, date)
      VALUES (${transaction.id}, ${transaction.type}, ${transaction.description}, ${transaction.amount}, ${transaction.category}, ${transaction.date});
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting transaction:', error);
    return NextResponse.json([], { status: 200 });
  }
}