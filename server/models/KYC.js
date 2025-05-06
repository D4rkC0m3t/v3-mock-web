const supabase = require('../supabase-config');

const KYC = {
  async create(userId, data) {
    const { data: kycData, error } = await supabase
      .from('kyc')
      .insert({
        user_id: userId,
        ...data,
        status: 'pending'
      })
      .select('*');

    if (error) throw error;
    return kycData;
  },

  async get(userId) {
    const { data, error } = await supabase
      .from('kyc')
      .select('*')
      .eq('user_id', userId)
      .single();

    return error ? null : data;
  },

  async updateStatus(userId, status) {
    const { error } = await supabase
      .from('kyc')
      .update({ status })
      .eq('user_id', userId);

    if (error) throw error;
  }
};

module.exports = KYC;