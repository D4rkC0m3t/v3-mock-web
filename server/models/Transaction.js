const supabase = require('../supabase-config');

const Transaction = {
  async create(txData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(txData)
      .select('*');

    if (error) throw error;
    return data;
  }
};

module.exports = Transaction;