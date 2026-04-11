
-- 1. SECURITY DATA
-- 2. PRODUCT DATA
-- 3. PRESENTATIONS
-- 4. WAREHOUSE
-- 5. INVENTORY
-- 6. MOVEMENT
-- 7. LOT 

-- =========================
-- SECURITY DATA
-- =========================

-- Users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM app_user) THEN
        INSERT INTO app_user (username, name, lastname, email, password_hash) VALUES
        ('admin','admin_name','admin_lastname','admin@example.com','hash1'),
        ('warehouse1','warehouse1_name','warehouse1_lastname','wh1@example.com','hash2'),
        ('warehouse2','warehouse2_name','warehouse2_lastname','wh2@example.com','hash3'),
        ('auditor1','auditor1_name','auditor1_lastname','aud1@example.com','hash4'),
        ('supervisor1','supervisor1_name','supervisor1_lastname','sup1@example.com','hash5'),
        ('user1','user1_name','user1_lastname','user1@example.com','hash6'),
        ('user2','user2_name','user2_lastname','user2@example.com','hash7'),
        ('user3','user3_name','user3_lastname','user3@example.com','hash8'),
        ('user4','user4_name','user4_lastname','user4@example.com','hash9'),
        ('user5','user5_name','user5_lastname','user5@example.com','hash10'),
        ('user6','user6_name','user6_lastname','user6@example.com','hash11'),
        ('user7','user7_name','user7_lastname','user7@example.com','hash12'),
        ('user8','user8_name','user8_lastname','user8@example.com','hash13'),
        ('user9','user9_name','user9_lastname','user9@example.com','hash14'),
        ('user10','user10_name','user10_lastname','user10@example.com','hash15'),
        ('user11','user11_name','user11_lastname','user11@example.com','hash16'),
        ('user12','user12_name','user12_lastname','user12@example.com','hash17'),
        ('user13','user13_name','user13_lastname','user13@example.com','hash18'),
        ('user14','user14_name','user14_lastname','user14@example.com','hash19'),
        ('user15','user15_name','user15_lastname','user15@example.com','hash20'),
        ('user16','user16_name','user16_lastname','user16@example.com','hash21'),
        ('user17','user17_name','user17_lastname','user17@example.com','hash22'),
        ('user18','user18_name','user18_lastname','user18@example.com','hash23'),
        ('user19','user19_name','user19_lastname','user19@example.com','hash24'),
        ('user20','user20_name','user20_lastname','user20@example.com','hash25');
    END IF;
END $$;

-- Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM role) THEN
        INSERT INTO role (role_name, description) VALUES
        ('admin','Full access'),
        ('warehouse','Manage stock'),
        ('supervisor','Approve movements'),
        ('auditor','View reports'),
        ('basic','Consult inventory'),
        ('role6','Test role'),
        ('role7','Test role'),
        ('role8','Test role'),
        ('role9','Test role'),
        ('role10','Test role'),
        ('role11','Test role'),
        ('role12','Test role'),
        ('role13','Test role'),
        ('role14','Test role'),
        ('role15','Test role'),
        ('role16','Test role'),
        ('role17','Test role'),
        ('role18','Test role'),
        ('role19','Test role'),
        ('role20','Test role'),
        ('role21','Test role'),
        ('role22','Test role'),
        ('role23','Test role'),
        ('role24','Test role'),
        ('role25','Test role');
    END IF;
END $$;

-- Permissions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM permission) THEN
        INSERT INTO permission (permission_name, description) VALUES
        ('create_user','Create users'),
        ('edit_user','Edit users'),
        ('delete_user','Delete users'),
        ('register_entry','Register stock entry'),
        ('register_exit','Register stock exit'),
        ('register_transfer','Register stock transfer'),
        ('view_inventory','View inventory'),
        ('view_report','View reports'),
        ('create_product','Create product'),
        ('edit_product','Edit product'),
        ('delete_product','Delete product'),
        ('create_warehouse','Create warehouse'),
        ('edit_warehouse','Edit warehouse'),
        ('delete_warehouse','Delete warehouse'),
        ('approve_adjustment','Approve adjustment'),
        ('view_audit','View audit'),
        ('perm17','Test'),
        ('perm18','Test'),
        ('perm19','Test'),
        ('perm20','Test'),
        ('perm21','Test'),
        ('perm22','Test'),
        ('perm23','Test'),
        ('perm24','Test'),
        ('perm25','Test');
    END IF;
END $$;

-- =========================
-- PRODUCT DATA
-- =========================

-- Categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM category) THEN
        INSERT INTO category (name, description) VALUES
        ('Beverage','Drinks'),
        ('Food','Groceries'),
        ('Medicine','Pharmacy'),
        ('Tool','Hardware'),
        ('Cleaning','Household'),
        ('Electronics','Devices'),
        ('Stationery','Office'),
        ('Textile','Clothing'),
        ('Cosmetic','Beauty'),
        ('Pet','Animal products'),
        ('category11','Test'),
        ('category12','Test'),
        ('category13','Test'),
        ('category14','Test'),
        ('category15','Test'),
        ('category16','Test'),
        ('category17','Test'),
        ('category18','Test'),
        ('category19','Test'),
        ('category20','Test'),
        ('category21','Test'),
        ('category22','Test'),
        ('category23','Test'),
        ('category24','Test'),
        ('category25','Test');
    END IF;
END $$;


-- Suppliers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM supplier) THEN
        INSERT INTO supplier (name, contact, email, phone, address) VALUES
        ('Supplier1','Contact1','Supplier1@email.com','1111','Address1'),
        ('Supplier2','Contact2','Supplier2@email.com','2222','Address2'),
        ('Supplier3','Contact3','Supplier3@email.com','3333','Address3'),
        ('Supplier4','Contact4','Supplier4@email.com','4444','Address4'),
        ('Supplier5','Contact5','Supplier5@email.com','5555','Address5'),
        ('Supplier6','Contact6','Supplier6@email.com','6666','Address6'),
        ('Supplier7','Contact7','Supplier7@email.com','7777','Address7'),
        ('Supplier8','Contact8','Supplier8@email.com','8888','Address8'),
        ('Supplier9','Contact9','Supplier9@email.com','9999','Address9'),
        ('Supplier10','Contact10','Supplier10@email.com','1010','Address10'),
        ('Supplier11','Contact11','Supplier11@email.com','1110','Address11'),
        ('Supplier12','Contact12','Supplier12@email.com','1212','Address12'),
        ('Supplier13','Contact13','Supplier13@email.com','1313','Address13'),
        ('Supplier14','Contact14','Supplier14@email.com','1414','Address14'),
        ('Supplier15','Contact15','Supplier15@email.com','1515','Address15'),
        ('Supplier16','Contact16','Supplier16@email.com','1616','Address16'),
        ('Supplier17','Contact17','Supplier17@email.com','1717','Address17'),
        ('Supplier18','Contact18','Supplier18@email.com','1818','Address18'),
        ('Supplier19','Contact19','Supplier19@email.com','1919','Address19'),
        ('Supplier20','Contact20','Supplier20@email.com','2020','Address20'),
        ('Supplier21','Contact21','Supplier21@email.com','2121','Address21'),
        ('Supplier22','Contact22','Supplier22@email.com','2222','Address22'),
        ('Supplier23','Contact23','Supplier23@email.com','2323','Address23'),
        ('Supplier24','Contact24','Supplier24@email.com','2424','Address24'),
        ('Supplier25','Contact25','Supplier25@email.com','2525','Address25');
    END IF;
END $$;

-- Products (25)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM product) THEN
        INSERT INTO product (sku, description, category_id, supplier_id, base_unit, unit_cost, sale_price, barcode) VALUES
        ('P001','Cola 355ml',1,1,'unit',0.25,0.50,'111111111111'),
        ('P002','Orange Juice 1L',1,2,'unit',0.80,1.20,'222222222222'),
        ('P003','Rice 1kg',2,3,'kg',0.50,0.90,'333333333333'),
        ('P004','Sugar 1kg',2,4,'kg',0.40,0.70,'444444444444'),
        ('P005','Paracetamol 500mg',3,5,'tablet',0.05,0.10,'555555555555'),
        ('P006','Hammer',4,6,'unit',3.00,5.00,'666666666666'),
        ('P007','Detergent 1kg',5,7,'kg',1.00,1.50,'777777777777'),
        ('P008','Laptop',6,8,'unit',500.00,700.00,'888888888888'),
        ('P009','Notebook',7,9,'unit',1.00,1.50,'999999999999'),
        ('P010','T-shirt',8,10,'unit',5.00,8.00,'101010101010'),
        ('P011','Lipstick',9,11,'unit',2.00,3.50,'111111111112'),
        ('P012','Dog Food 5kg',10,12,'kg',10.00,15.00,'121212121212'),
        ('P013','Product13',1,13,'unit',1.00,2.00,'131313131313'),
        ('P014','Product14',2,14,'unit',1.00,2.00,'141414141414'),
        ('P015','Product15',3,15,'unit',1.00,2.00,'151515151515'),
        ('P016','Product16',4,16,'unit',1.00,2.00,'161616161616'),
        ('P017','Product17',5,17,'unit',1.00,2.00,'171717171717'),
        ('P018','Product18',6,18,'unit',1.00,2.00,'181818181818'),
        ('P019','Product19',7,19,'unit',1.00,2.00,'191919191919'),
        ('P020','Product20',8,20,'unit',1.00,2.00,'202020202020'),
        ('P021','Product21',9,21,'unit',1.00,2.00,'212121212121'),
        ('P022','Product22',10,22,'unit',1.00,2.00,'222222222221'),
        ('P023','Product23',1,23,'unit',1.00,2.00,'232323232323'),
        ('P024','Product24',2,24,'unit',1.00,2.00,'242424242424'),
        ('P025','Product25',3,25,'unit',1.00,2.00,'252525252525');
    END IF;
END $$;

-- =========================
-- PRESENTATIONS (25)
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM presentation) THEN
        INSERT INTO presentation (product_id, name, conversion_factor, base_unit, barcode) VALUES
        (1,'Pack6',6,'unit','111111111116'),
        (2,'Box12',12,'unit','222222222226'),
        (3,'Sack25',25,'kg','333333333336'),
        (4,'Bag10',10,'kg','444444444446'),
        (5,'Blister10',10,'tablet','555555555556'),
        (6,'Box5',5,'unit','666666666676'),
        (7,'Bag2',2,'kg','777777777786'),
        (8,'Box1',1,'unit','888888888896'),
        (9,'Pack3',3,'unit','999999999906'),
        (10,'Pack2',2,'unit','101010101016'),
        (11,'Box4',4,'unit','111111111126'),
        (12,'Bag5',5,'kg','121212121226'),
        (13,'Pack13',13,'unit','131313131326'),
        (14,'Pack14',14,'unit','141414141426'),
        (15,'Pack15',15,'unit','151515151526'),
        (16,'Pack16',16,'unit','161616161626'),
        (17,'Pack17',17,'unit','171717171726'),
        (18,'Pack18',18,'unit','181818181826'),
        (19,'Pack19',19,'unit','191919191926'),
        (20,'Pack20',20,'unit','202020202026'),
        (21,'Pack21',21,'unit','212121212126'),
        (22,'Pack22',22,'unit','222222222227'),
        (23,'Pack23',23,'unit','232323232326'),
        (24,'Pack24',24,'unit','242424242426'),
        (25,'Pack25',25,'unit','252525252526');

    END IF;
END $$;

-- =========================
-- WAREHOUSE (25)
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM warehouse) THEN
        INSERT INTO warehouse (name, location, phone1) VALUES
        ('Warehouse1','San Salvador', '100 0000'),
        ('Warehouse2','Santa Ana', '200 0000'),
        ('Warehouse3','San Miguel','300 0000'),
        ('Warehouse4','La Libertad',  '400 0000'),
        ('Warehouse5','Sonsonate', '500 0000'),
        ('Warehouse6','Usulután', '600 0000'),
        ('Warehouse7','Ahuachapán', '700 0000'),
        ('Warehouse8','Morazán', '800 0000'),
        ('Warehouse9','Chalatenango', '900 0000'),
        ('Warehouse10','Cuscatlán', '1000 0000'),
        ('Warehouse11','Cabañas', '1100 0000'),
        ('Warehouse12','La Paz', '1200 0000'),
        ('Warehouse13','San Vicente', '1300 0000'),
        ('Warehouse14','Santa Tecla', '1400 0000'),
        ('Warehouse15','Soyapango', '1500 0000'),
        ('Warehouse16','Mejicanos', '1600 0000'),
        ('Warehouse17','Ilopango', '1700 0000'),
        ('Warehouse18','Apopa', '1800 0000'),
        ('Warehouse19','Metapán', '1900 0000'),
        ('Warehouse20','Zacatecoluca', '2000 0000'),
        ('Warehouse21','Sensuntepeque', '2100 0000'),
        ('Warehouse22','Nueva Concepción', '2200 0000'),
        ('Warehouse23','Ciudad Delgado', '2300 0000'),
        ('Warehouse24','Colón', '2400 0000'),
        ('Warehouse25','Ayutuxtepeque', '2500 0000');
    END IF;
END $$;

-- =========================
-- INVENTORY (25)
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM inventory) THEN
        INSERT INTO inventory (product_id, warehouse_id, current_quantity, minimum, maximum) VALUES
        (1,1,100,10,500),
        (2,2,200,20,600),
        (3,3,300,30,700),
        (4,4,400,40,800),
        (5,5,500,50,900),
        (6,6,600,60,1000),
        (7,7,700,70,1100),
        (8,8,800,80,1200),
        (9,9,900,90,1300),
        (10,10,1000,100,1400),
        (11,11,1100,110,1500),
        (12,12,1200,120,1600),
        (13,13,1300,130,1700),
        (14,14,1400,140,1800),
        (15,15,1500,150,1900),
        (16,16,1600,160,2000),
        (17,17,1700,170,2100),
        (18,18,1800,180,2200),
        (19,19,1900,190,2300),
        (20,20,2000,200,2400),
        (21,21,2100,210,2500),
        (22,22,2200,220,2600),
        (23,23,2300,230,2700),
        (24,24,2400,240,2800),
        (25,25,2500,250,2900);
    END IF;
END $$;



-- =========================
-- MOVEMENT (25)
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM movement) THEN
        INSERT INTO movement (product_id, warehouse_id, type, quantity, unit_cost, app_user_id, reference) VALUES
        (1,1,'entry',50,0.25,1,'Ref001'),
        (2,2,'exit',20,0.80,2,'Ref002'),
        (3,3,'transfer',30,0.50,3,'Ref003'),
        (4,4,'entry',40,0.40,4,'Ref004'),
        (5,5,'exit',10,0.05,5,'Ref005'),
        (6,6,'entry',15,3.00,6,'Ref006'),
        (7,7,'exit',25,1.00,7,'Ref007'),
        (8,8,'transfer',5,500.00,8,'Ref008'),
        (9,9,'entry',60,1.00,9,'Ref009'),
        (10,10,'exit',12,5.00,10,'Ref010'),
        (11,11,'entry',18,2.00,11,'Ref011'),
        (12,12,'exit',22,10.00,12,'Ref012'),
        (13,13,'entry',33,1.00,13,'Ref013'),
        (14,14,'exit',44,1.00,14,'Ref014'),
        (15,15,'transfer',55,1.00,15,'Ref015'),
        (16,16,'entry',66,1.00,16,'Ref016'),
        (17,17,'exit',77,1.00,17,'Ref017'),
        (18,18,'entry',88,1.00,18,'Ref018'),
        (19,19,'exit',99,1.00,19,'Ref019'),
        (20,20,'transfer',111,1.00,20,'Ref020'),
        (21,21,'entry',222,1.00,21,'Ref021'),
        (22,22,'exit',333,1.00,22,'Ref022'),
        (23,23,'entry',444,1.00,23,'Ref023'),
        (24,24,'exit',555,1.00,24,'Ref024'),
        (25,25,'transfer',666,1.00,25,'Ref025');

    END IF;
END $$;


-- =========================
-- LOT (25)
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM lot) THEN
        INSERT INTO lot (product_id, lot_code, expiration_date, quantity) VALUES
        (1,'Lot001','2026-12-31',100),
        (2,'Lot002','2026-11-30',200),
        (3,'Lot003','2026-10-31',300),
        (4,'Lot004','2026-09-30',400),
        (5,'Lot005','2026-08-31',500),
        (6,'Lot006','2026-07-31',600),
        (7,'Lot007','2026-06-30',700),
        (8,'Lot008','2026-05-31',800),
        (9,'Lot009','2026-04-30',900),
        (10,'Lot010','2026-03-31',1000),
        (11,'Lot011','2026-02-28',1100),
        (12,'Lot012','2026-01-31',1200),
        (13,'Lot013','2025-12-31',1300),
        (14,'Lot014','2025-11-30',1400),
        (15,'Lot015','2025-10-31',1500),
        (16,'Lot016','2025-09-30',1600),
        (17,'Lot017','2025-08-31',1700),
        (18,'Lot018','2025-07-31',1800),
        (19,'Lot019','2025-06-30',1900),
        (20,'Lot020','2025-05-31',2000),
        (21,'Lot021','2025-04-30',2100),
        (22,'Lot022','2025-03-31',2200),
        (23,'Lot023','2025-02-28',2300),
        (24,'Lot024','2025-01-31',2400),
        (25,'Lot025','2024-12-31',2500);
    END IF;
END $$;


-- =========================
-- PURCHASE ORDER
-- =========================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM purchase_order) THEN
        INSERT INTO purchase_order (supplier_id, app_user_id, order_date, status, total_amount) VALUES
        (1, 1, '2026-04-01', 'pending', 0),
        (2, 2, '2026-04-02', 'approved', 0),
        (3, 3, '2026-04-03', 'received', 0),
        (4, 4, '2026-04-04', 'pending', 0),
        (5, 5, '2026-04-05', 'cancelled', 0);
    END IF;
END $$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM purchase_order_detail) THEN
        -- Orden 1: proveedor 1
        INSERT INTO purchase_order_detail (po_id, product_id, quantity, unit_cost) VALUES
        (1, 1, 100, 0.25),   -- Cola 355ml
        (1, 2, 50, 0.80),    -- Orange Juice 1L
        (1, 3, 200, 0.50);   -- Rice 1kg
        
        -- Orden 2: proveedor 2
        INSERT INTO purchase_order_detail (po_id, product_id, quantity, unit_cost) VALUES
        (2, 4, 150, 0.40),   -- Sugar 1kg
        (2, 5, 500, 0.05),   -- Paracetamol 500mg
        (2, 6, 20, 3.00);    -- Hammer
        
        -- Orden 3: proveedor 3
        INSERT INTO purchase_order_detail (po_id, product_id, quantity, unit_cost) VALUES
        (3, 7, 100, 1.00),   -- Detergent 1kg
        (3, 8, 5, 500.00),   -- Laptop
        (3, 9, 200, 1.00);   -- Notebook
        
        -- Orden 4: proveedor 4
        INSERT INTO purchase_order_detail (po_id, product_id, quantity, unit_cost) VALUES
        (4, 10, 50, 5.00),   -- T-shirt
        (4, 11, 80, 2.00),   -- Lipstick
        (4, 12, 30, 10.00);  -- Dog Food 5kg
        
        -- Orden 5: proveedor 5
        INSERT INTO purchase_order_detail (po_id, product_id, quantity, unit_cost) VALUES
        (5, 13, 100, 1.00),  -- Product13
        (5, 14, 120, 1.00),  -- Product14
        (5, 15, 140, 1.00);  -- Product15
    END IF;
END $$;



