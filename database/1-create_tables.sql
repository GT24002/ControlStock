-- -- Create database
-- CREATE DATABASE controlstockdb;
-- \c controlstockdb;


-- ORDER  TO CREATE ---
-- 1. SECURITY
-- 2. PRODUCT
-- 3. PRESENTATIONS
-- 4. WAREHOUSE
-- 5. INVENTORY
-- 6. MOVEMENT
-- 7. LOT
-- 8. PURCHASE ORDER

-- =========================
-- SECURITY TABLES
-- =========================

CREATE TABLE IF NOT EXISTS app_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS permission (
    permission_id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS app_user_role (
    app_user_id INT REFERENCES app_user(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES  role(role_id) ON DELETE CASCADE,
    PRIMARY KEY (app_user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permission (
    role_id INT REFERENCES  role(role_id) ON DELETE CASCADE,
    permission_id INT REFERENCES permission(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- =========================
-- PRODUCT TABLES
-- =========================

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS supplier (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS product (
    product_id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    category_id INT REFERENCES category(category_id),
    supplier_id INT REFERENCES supplier(supplier_id),
    base_unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    barcode VARCHAR(50) UNIQUE,
    image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS presentation (
    presentation_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    conversion_factor INT DEFAULT 1, -- how many base units it represents
    base_unit VARCHAR(50) NOT NULL,
    barcode VARCHAR(50) UNIQUE
);

-- =========================
-- INVENTORY TABLES
-- =========================

CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT,
    phone1 VARCHAR(50) NOT NULL,
    phone2 VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id),
    warehouse_id INT REFERENCES warehouse(warehouse_id),
    current_quantity DECIMAL(12,2) DEFAULT 0,
    minimum DECIMAL(12,2) DEFAULT 0,
    maximum DECIMAL(12,2) DEFAULT 0,
    UNIQUE (product_id, warehouse_id)
);

CREATE TABLE IF NOT EXISTS movement (
    movement_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id),
    warehouse_id INT REFERENCES warehouse(warehouse_id),
    type VARCHAR(20) CHECK (type IN ('entry','exit','transfer')),
    quantity DECIMAL(12,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    app_user_id INT REFERENCES  app_user(user_id),
    reference VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS lot (
    lot_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES product(product_id),
    lot_code VARCHAR(50),
    expiration_date DATE,
    quantity DECIMAL(12,2)
);

-- =========================
-- AUDIT TABLE
-- =========================

CREATE TABLE IF NOT EXISTS action_log (
    action_id SERIAL PRIMARY KEY,
    app_user_id INT REFERENCES  app_user(user_id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    affected_table VARCHAR(100),
    record_id INT
);

-- =========================
-- PURCHASE ORDER
-- =========================
CREATE TABLE IF NOT EXISTS purchase_order (
    po_id SERIAL PRIMARY KEY, --purchase order id
    supplier_id INT REFERENCES supplier(supplier_id),
    app_user_id INT REFERENCES app_user(user_id), -- quien creo la orden
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending','approved','received','cancelled')),
    total_amount DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS purchase_order_detail (
    pod_id SERIAL PRIMARY KEY, -- purchase order detail id
    po_id INT REFERENCES purchase_order(po_id) ON DELETE CASCADE,
    product_id INT REFERENCES product(product_id),
    quantity DECIMAL(12,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED
);
