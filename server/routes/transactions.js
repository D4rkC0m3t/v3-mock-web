const express = require('express');
const router = express.Router();
const supabase = require('../supabase-config');

// Get transactions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { wallet, filter, page = 0, limit = 10 } = req.query;
    const offset = page * limit;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    // Add wallet address filter if provided
    if (wallet) {
      query = query.eq('wallet_address', wallet);
    }

    // Add transaction type filter if provided
    if (filter && filter !== 'all') {
      query = query.eq('type', filter);
    }

    // Add pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      transactions: data,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...req.body,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;