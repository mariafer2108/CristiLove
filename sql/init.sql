-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'product' o 'material'
    category TEXT,
    stock NUMERIC NOT NULL DEFAULT 0,
    min_stock NUMERIC NOT NULL DEFAULT 0,
    price NUMERIC,
    cost NUMERIC,
    unit TEXT,
    recipe JSONB, -- Para la lista de materiales
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Crear la tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'income' o 'expense'
    description TEXT,
    amount NUMERIC NOT NULL,
    category TEXT,
    date TIMESTAMP DEFAULT NOW()
);

-- Crear índices para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);