-- Add Premium Foods (Categories are dynamic, so these will create new boxes on Home Page!)
INSERT INTO foods (name, price, category, image, description) VALUES 
('Classic Lobster Thermidor', 1250.00, 'Signature Seafood', '/uploads/lobster.jpg', 'Creamy lobster meat cooked with cognac and cheese.'),
('Wagyu Beef Burger', 850.00, 'Gourmet Burgrs', '/uploads/wagyu.jpg', 'Japanese Wagyu beef with caramelized onions and truffle mayo.'),
('Truffle Mushroom Risotto', 650.00, 'Italian Classics', '/uploads/risotto.jpg', 'Arborio rice with fresh black truffles and parmesan.'),
('Dark Chocolate Soufflé', 450.00, 'Desserts', '/uploads/souffle.jpg', 'Warm chocolate souffle with vanilla bean ice cream.'),
('Blueberry Cheesecake', 380.00, 'Desserts', '/uploads/cheesecake.jpg', 'New York style cheesecake with fresh blueberry compote.'),
('Old Fashioned Cocktail', 550.00, 'Cocktails', '/uploads/cocktail.jpg', 'Bourbon, bitters, and orange zest.'),
('Avocado Toast with Poached Egg', 320.00, 'Breakfast Specials', '/uploads/avocado.jpg', 'Smashed avocado on sourdough with a perfectly runny egg.'),
('Spicy Tuna Sushi Roll', 480.00, 'Japanese Selection', '/uploads/sushi.jpg', 'Fresh tuna with spicy mayo and cucumber.'),
('Mango Sticky Rice', 220.00, 'Thai Treats', '/uploads/mango.jpg', 'Sweet coconut rice with ripe seasonal mango.');

-- Add Modern Tables (branch_id, table_name, table_type, price, booked)
INSERT INTO tables (branch_id, table_name, table_type, price, booked) VALUES 
(1, 'Golden Corner (Table 101)', '2-pair', 500.00, 0),
(1, 'Family Haven (Table 201)', '6-family', 1200.00, 0),
(1, 'Business Suite (Table 301)', '4-business', 800.00, 0),
(1, 'The Balcony (Table 401)', '2-pair', 600.00, 0),
(1, 'Royal Circle (Table 501)', '8+ group', 2000.00, 0);

-- Add Coupons (user_id, coupon_code, discount, reason, expiry_date)
INSERT INTO coupons (user_id, coupon_code, discount, reason, expiry_date, is_used) VALUES 
(1, 'WELCOME20', 20.00, 'Introductory Offer', '2026-12-31', 0),
(1, 'VIPGUEST50', 50.00, 'VIP Loyalty Reward', '2026-12-31', 0),
(1, 'FOODIE10', 10.00, 'Weekend Special', '2026-06-30', 0);
