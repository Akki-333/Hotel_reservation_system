-- Disable checks to allow truncation
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE foods;
SET FOREIGN_KEY_CHECKS = 1;

-- ── STARTERS (12 Items) ──
INSERT INTO foods (name, description, price, image, category) VALUES
('Crispy Truffle Arancini', 'Golden risotto balls infused with truffle oil and melting mozzarella heart.', 450, 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600', 'Starters'),
('Zesty Lime Calamari', 'Tender squid rings with a spicy citrus glaze and roasted garlic aioli.', 550, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 'Starters'),
('Honey Glazed Wings', 'Slow-roasted chicken wings tossed in a secret honey-siracha reduction.', 480, 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=600', 'Starters'),
('Stuffed Portobello', 'Large mushrooms filled with spinach, pine nuts, and aged parmesan.', 420, 'https://images.unsplash.com/photo-1515443961218-152367888767?w=600', 'Starters'),
('Burrata Bliss', 'Creamy burrata served with heritage tomatoes and cold-pressed basil oil.', 520, 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600', 'Starters'),
('Spicy Edamame', 'Steam-steamed soy beans tossed in smoked sea salt and chili flakes.', 350, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', 'Starters'),
('Crispy Veg Spring Rolls', 'Hand-rolled with garden vegetables and glass noodles, sweet chili dip.', 380, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'Starters'),
('Duck Confit Gyoza', 'Delicate Japanese dumplings with shredded duck and ginger-soy mirin.', 590, 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600', 'Starters'),
('Bruschetta Trio', 'Tomato-basil, olive tapenade, and roasted pepper on sourdough.', 390, 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=600', 'Starters'),
('Shrimp Tempura', 'Light and airy fried shrimp with traditional wasabi-radish dip.', 650, 'https://images.unsplash.com/photo-1562607311-4770802ed40e?w=600', 'Starters'),
('Goat Cheese Croquettes', 'Warm honey-drizzled goat cheese balls with a golden panko crust.', 460, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600', 'Starters'),
('Sizzling Tofu', 'Extra firm organic tofu cubes in a black pepper and cilantro glaze.', 410, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', 'Starters');

-- ── SEAFOOD (11 Items) ──
INSERT INTO foods (name, description, price, image, category) VALUES
('Lobster Thermidor', 'Premium Atlantic lobster baked in a rich cognac and gruyere sauce.', 2800, 'https://images.unsplash.com/photo-1590759021051-020556fca411?w=600', 'Seafood'),
('Miso Glazed Salmon', 'Pan-seared salmon fillet with a sweet miso crust and baby bok choy.', 1450, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 'Seafood'),
('Garlic Butter Prawns', 'Jumbo prawns sautéed in wild garlic butter and parsley oil.', 1250, 'https://images.unsplash.com/photo-1559742811-822873691df8?w=600', 'Seafood'),
('Grilled Whole Sea Bass', 'Citrus-marinated sea bass served with roasted baby potatoes.', 1800, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600', 'Seafood'),
('Spicy Seafood Paella', 'Authentic Spanish rice with mussels, clams, shrimp, and saffron.', 1650, 'https://images.unsplash.com/photo-1534080564617-6f7a9bd91be2?w=600', 'Seafood'),
('Seared Scallops', 'Hokkaido scallops with a creamy cauliflower purée and pancetta.', 1350, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 'Seafood'),
('Oysters Rockefeller', 'Half-dozen fresh oysters topped with spinach and herb butter.', 1100, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'Seafood'),
('Crab Linguine', 'Fresh pasta tossed with succulent crab meat, lemon, and chili.', 1550, 'https://images.unsplash.com/photo-1563379091339-0efb16262fca?w=600', 'Seafood'),
('Tuna Tartare', 'Yellowfin tuna with avocado mousse and crispy wonton chips.', 950, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600', 'Seafood'),
('Battered Fish & Chips', 'Traditional British-style Atlantic cod served with mushy peas.', 890, 'https://images.unsplash.com/photo-1579206239184-41e4620ca96c?w=600', 'Seafood'),
('Chilean Sea Bass', 'Oven-roasted with cherry tomatoes and a lemon-caper reduction.', 2400, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 'Seafood');

-- ── MAIN COURSE (12 Items) ──
INSERT INTO foods (name, description, price, image, category) VALUES
('Wagyu Ribeye Steak', 'Premium Marble Grade 7 steak with red wine reduction and mash.', 4500, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600', 'Main Course'),
('Wild Mushroom Risotto', 'Arborio rice slow-cooked with porcini and truffle shavings.', 1100, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600', 'Main Course'),
('Braised Lamb Shank', '12-hour slow-cooked lamb in a rich tomato and rosemary gravy.', 1850, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'Main Course'),
('Roasted Chicken Supreme', 'Organic corn-fed chicken with seasonal root vegetables.', 1250, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600', 'Main Course'),
('Classic Beef Wellington', 'Tenderloin wrapped in mushroom duxelles and buttery puff pastry.', 2200, 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600', 'Main Course'),
('Fettuccine Alfredo', 'Fresh Pasta with parmesan cream sauce and roasted pine nuts.', 950, 'https://images.unsplash.com/photo-1645112481338-3560e77af55f?w=600', 'Main Course'),
('Traditional Butter Chicken', 'Velvety tomato gravy with tandoor-charred chicken thigh.', 1050, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600', 'Main Course'),
('Eggplant Parmigiana', 'Layers of baked aubergine, buffalo mozzarella, and marinara.', 880, 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600', 'Main Course'),
('Paneer Tikka Masala', 'Grilled cottage cheese cubes in a spicy onion-tomato masala.', 850, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600', 'Main Course'),
('Oven Roasted Duck Duck', 'Crispy skin duck breast with orange-honey glaze and asparagus.', 1950, 'https://images.unsplash.com/photo-1511688826399-13f729311965?w=600', 'Main Course'),
('Quinoa Buddha Bowl', 'Superfood mix with roasted chickpeas, kale, and tahini dressing.', 750, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', 'Main Course'),
('Slow Cooked Short Ribs', 'Boneless beef ribs with creamy polenta and crispy shallots.', 2100, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'Main Course');

-- ── DESSERTS (12 Items) ──
INSERT INTO foods (name, description, price, image, category) VALUES
('Classic Tiramisu', 'Mascarpone cream layered with espresso-soaked ladyfingers.', 650, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600', 'Desserts'),
('Molten Lava Cake', 'Warm chocolate cake with a melting dark chocolate heart.', 680, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600', 'Desserts'),
('New York Cheesecake', 'Rich and creamy cheesecake with a berry compote swirl.', 720, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600', 'Desserts'),
('Baklava Tower', 'Flaky phyllo pastry with honey, pistachios, and rose water.', 580, 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600', 'Desserts'),
('Crème Brûlée', 'Velvety vanilla bean custard with a scorched sugar crust.', 620, 'https://images.unsplash.com/photo-1470333738027-51939c063cf4?w=600', 'Desserts'),
('Mango Panna Cotta', 'Silky Italian dessert topped with fresh Alfonso mango gel.', 550, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 'Desserts'),
('Artisanal Gelato Trio', 'Selection of Pistachio, Dark Chocolate, and Sea Salt Caramel.', 490, 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600', 'Desserts'),
('Fruit Tart Tartin', 'Crispy pastry with caramelized apples and cinnamon ice cream.', 640, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600', 'Desserts'),
('Churros with Dip', 'Cinnamon-sugar dusted churros served with warm chocolate sauce.', 520, 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=600', 'Desserts'),
('Sticky Toffee Pudding', 'Date cake soaked in a rich toffee sauce with vanilla whip.', 690, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600', 'Desserts'),
('Macaron Selection', 'Box of 6 premium macarons: Lavender, Rose, Lemon, Earl Grey.', 750, 'https://images.unsplash.com/photo-1569864358642-9d16197022c9?w=600', 'Desserts'),
('Red Velvet Cupcake', 'Soft cocoa cupcake with tangy cream cheese frosting.', 450, 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600', 'Desserts');

-- ── BEVERAGES (13 Items) ──
INSERT INTO foods (name, description, price, image, category) VALUES
('Virgin Blue Mojito', 'Fresh mint, lime, and blueberries with a splash of soda.', 350, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', 'Beverages'),
('Passion Fruit Iced Tea', 'Premium black tea infused with tropical passion fruit pulp.', 290, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600', 'Beverages'),
('Espresso Martini (Mocktail)', 'Chilled double shot of espresso with vanilla bean pod.', 380, 'https://images.unsplash.com/photo-1545438102-799c39913b91?w=600', 'Beverages'),
('Fresh Avocado Smoothie', 'Creamy avocado blended with honey and almond milk.', 450, 'https://images.unsplash.com/photo-1525385133336-247b6c4fd250?w=600', 'Beverages'),
('Sunrise Sparkler', 'Orange juice, pomegranate syrup, and sparkling water.', 320, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600', 'Beverages'),
('Matcha Green Latte', 'Ceremonial grade matcha whisked with oat milk.', 420, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600', 'Beverages'),
('Signature Hot Chocolate', 'Melting Belgian chocolate with torched marshmallows.', 390, 'https://images.unsplash.com/photo-1544787210-2211dca4b06b?w=600', 'Beverages'),
('Watermelon Spritz', 'Cold-pressed watermelon juice with fresh basil sprig.', 310, 'https://images.unsplash.com/photo-1497534446932-c946e7316ba1?w=600', 'Beverages'),
('Earl Grey Lavender Tea', 'Aromatic blend of bergamot and dried lavender buds.', 280, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600', 'Beverages'),
('Ginger Beer Zinger', 'House-made spicy ginger extract with honey and lemon.', 340, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', 'Beverages'),
('Detox Green Juice', 'Cucumber, apple, celery, and spinach cold-pressed blend.', 410, 'https://images.unsplash.com/photo-1615478503562-ec2e8aa0e24e?w=600', 'Beverages'),
('Sparkling Elderflower', 'Lightly floral sparkling drink with lemon zest.', 330, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600', 'Beverages'),
('Iced Caramel Macchiato', 'Double espresso with buttery caramel and cold milk.', 390, 'https://images.unsplash.com/photo-1572286258217-40142c1c6a70?w=600', 'Beverages');
