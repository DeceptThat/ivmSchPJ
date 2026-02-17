const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); 

// Standardized to use the Linker file for all models
const { Staff, Item, Movement, Schedule, Supplier, Notification, Sale, sequelize } = require('../model/Linker');

// --- 1. AUTH / LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Staff.findOne({ where: { username, password } });
        if (user) {
            res.json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 2. SUPPLIER ROUTES ---
router.get('/supplier-list', async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({ order: [['supplier_name', 'ASC']] });
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching suppliers" });
    }
});

router.post('/add-supplier', async (req, res) => {
    try {
        const { supplier_name, email, phone } = req.body;
        const newSupplier = await Supplier.create({ supplier_name, email, phone });
        res.status(201).json(newSupplier);
    } catch (err) {
        res.status(500).json({ message: "Error saving supplier" });
    }
});

router.delete('/remove-supplier/:id', async (req, res) => {
    try {
        await Supplier.destroy({ where: { supplier_id: req.params.id } });
        res.json({ message: "Supplier removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// --- 3. ITEM ROUTES ---
router.get('/item-list', async (req, res) => {
    try {
        const items = await Item.findAll({ order: [['item_name', 'ASC']] });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Error fetching items" });
    }
});

router.post('/add-item', async (req, res) => {
    try {
        const newItem = await Item.create(req.body); 
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: "Error: SKU must be unique." });
    }
});

router.delete('/remove-item/:id', async (req, res) => {
    try {
        await Item.destroy({ where: { item_id: req.params.id } });
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// --- 4. MOVEMENT ROUTES ---
router.post('/add-movement', async (req, res) => {
    const { sku, type, quantity, expire_date, ref_no, staff_id, supplier_name } = req.body;
    try {
        const item = await Item.findOne({ where: { sku: sku.trim() } });
        if (!item) return res.status(404).json({ message: `SKU ${sku} not found` });

        const qtyChange = parseInt(quantity);
        let newStock = Number(item.stock_quantity);

        if (type === 'IN') {
            newStock += qtyChange;
            await item.update({ stock_quantity: newStock, last_supplier: supplier_name });
        } else {
            newStock -= qtyChange;
            await item.update({ stock_quantity: newStock });
        }

        await Movement.create({
            sku: sku.trim(),
            staff_id,
            type,
            quantity: qtyChange,
            expire_date,
            ref_no,
            supplier_name: type === 'IN' ? supplier_name : null,
            date: new Date()
        });

        res.status(201).json({ message: "Success", updatedStock: newStock });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/movement-list', async (req, res) => {
    try {
        const movements = await Movement.findAll({
            include: [
                { model: Item, attributes: ['item_name'] },
                { model: Staff, attributes: ['staff_name'] }
            ],
            order: [['movement_id', 'DESC']]
        });
        res.json(movements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 5. STAFF & SCHEDULE ROUTES ---
router.get('/staff-list', async (req, res) => {
    try {
        const staff = await Staff.findAll({ order: [['staff_id', 'ASC']] });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: "Error fetching staff" });
    }
});

router.post('/add-staff', async (req, res) => {
    try {
        const { staff_name, username, password, role } = req.body;
        const newStaff = await Staff.create({ staff_name, username, password, role });
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(500).json({ message: "Error saving staff" });
    }
});

router.delete('/remove-staff/:id', async (req, res) => {
    try {
        await Staff.destroy({ where: { staff_id: req.params.id } });
        res.json({ message: "Staff removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

router.get('/schedule-list', async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [{ model: Staff, attributes: ['staff_name'] }],
            order: [['date', 'ASC']]
        });
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: "Error fetching schedules" });
    }
});

router.post('/add-schedule', async (req, res) => {
    try {
        const newSched = await Schedule.create(req.body);
        res.status(201).json(newSched);
    } catch (err) {
        res.status(500).json({ message: "Error saving schedule" });
    }
});

router.delete('/remove-schedule/:id', async (req, res) => {
    try {
        await Schedule.destroy({ where: { sched_id: req.params.id } });
        res.json({ message: "Schedule removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

// --- 6. SALE & SEARCH ---
router.get('/find-item', async (req, res) => {
    const { query } = req.query;
    try {
        const item = await Item.findOne({
            where: {
                [Op.or]: [
                    { sku: { [Op.iLike]: query } },
                    { item_name: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });
        if (item) res.json(item);
        else res.status(404).json({ message: "Not found" });
    } catch (err) { 
        res.status(500).json({ message: "Search error" }); 
    }
});

router.post('/complete-sale', async (req, res) => {
    const { staff_id, items, total_amount } = req.body;
    try {
        const cleanTotal = parseFloat(total_amount.toString().replace(/[^\d.-]/g, '')) || 0;
        const newSale = await Sale.create({
            staff_id: staff_id || 0,
            total_amount: cleanTotal,
            sale_date: new Date()
        });

        for (let cartItem of items) {
            const dbItem = await Item.findOne({ where: { sku: cartItem.sku } });
            if (dbItem) {
                const newQty = dbItem.stock_quantity - cartItem.quantity;
                await dbItem.update({ stock_quantity: newQty });
                await Movement.create({
                    sku: cartItem.sku,
                    staff_id: staff_id,
                    type: 'SOLD',
                    quantity: cartItem.quantity,
                    ref_no: `SALE-${newSale.sale_id}`,
                    date: new Date()
                });
            }
        }
        res.status(200).json({ message: "Sale processed", saleId: newSale.sale_id });
    } catch (err) {
        res.status(500).json({ message: "Sale failed: " + err.message });
    }
});

router.get('/sale-list', async (req, res) => {
    const { start, end } = req.query;
    try {
        let query;
        let replacements = {};
        if (start && end) {
            query = `SELECT s.*, st.staff_name FROM public.sales s LEFT JOIN public.staff st ON s.staff_id = st.staff_id WHERE (timezone('Asia/Bangkok', s.sale_date))::date BETWEEN :start AND :end ORDER BY s.sale_date DESC`;
            replacements = { start, end };
        } else {
            query = `SELECT s.*, st.staff_name FROM public.sales s LEFT JOIN public.staff st ON s.staff_id = st.staff_id ORDER BY s.sale_date DESC`;
        }
        const sales = await sequelize.query(query, { replacements, type: sequelize.QueryTypes.SELECT });
        res.json(sales);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// --- 7. CHART STATS (RESTORED) ---
router.get('/weekly-stats', async (req, res) => {
    try {
        const stats = await sequelize.query(`
            SELECT TO_CHAR(d.date_series, 'DD-MM-YYYY') AS "day", COALESCE(SUM(s.total_amount), 0)::float AS "sales"
            FROM (SELECT (timezone('Asia/Bangkok', CURRENT_TIMESTAMP)::date - i) AS date_series FROM generate_series(0, 6) AS i) d
            LEFT JOIN public.sales s ON d.date_series = timezone('Asia/Bangkok', s.sale_date)::date
            GROUP BY d.date_series ORDER BY d.date_series ASC
        `, { type: sequelize.QueryTypes.SELECT });
        res.json(stats);
    } catch (err) { res.status(500).json({ error: "Chart sync error" }); }
});

router.get('/monthly-stats', async (req, res) => {
    try {
        const stats = await sequelize.query(`
            SELECT to_char(d.date_series, 'DD Mon') AS "name", COALESCE(SUM(s.total_amount), 0)::float AS "earnings"
            FROM (SELECT (timezone('Asia/Bangkok', CURRENT_TIMESTAMP)::date - i) AS date_series FROM generate_series(0, 29) AS i) d
            LEFT JOIN public.sales s ON d.date_series = timezone('Asia/Bangkok', s.sale_date)::date
            GROUP BY d.date_series ORDER BY d.date_series ASC
        `, { type: sequelize.QueryTypes.SELECT });
        res.json(stats); 
    } catch (err) { res.status(500).json({ error: "Sync error" }); }
});

// --- 8. NOTIFICATION ROUTES ---
router.get('/notification-list', async (req, res) => {
    try {
        const notifications = await Notification.findAll({ order: [['createdAt', 'DESC']] });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

router.post('/add-notification', async (req, res) => {
    try {
        const { message } = req.body;
        const newNotif = await Notification.create({ message });
        res.status(201).json(newNotif);
    } catch (err) {
        res.status(500).json({ message: "Error saving notification" });
    }
});

router.delete('/remove-notification/:id', async (req, res) => {
    try {
        await Notification.destroy({ where: { notif_id: req.params.id } });
        res.json({ message: "Notification removed" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;