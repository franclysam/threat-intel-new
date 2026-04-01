import axios from 'axios';

// Backend API base URL - Update based on your .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Submit a threat report to backend (MongoDB)
 * POST /api/reports
 * 
 * @param {Object} reportData 
 * @param {string} reportData.wallet - User wallet address
 * @param {string} reportData.category - "Malware" or "Phishing"
 * @param {string} reportData.data - Report content (will be encrypted by backend)
 * @returns {Promise<Object>} { message, reportId, hash }
 */
export const submitReport = async (reportData) => {
  try {
    const { wallet, category, data } = reportData;

    if (!wallet || !category || !data) {
      throw new Error('Missing required fields: wallet, category, or data');
    }


    const response = await api.post('/reports', {
      wallet,
      category,
      data
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all reports from backend
 * GET /api/reports
 * 
 * @returns {Promise<Array>} Array of report objects
 */
export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get reports by wallet address (filter client-side)
 * Since your backend doesn't have this endpoint, we'll filter after fetching all
 * 
 * @param {string} walletAddress - Wallet address to filter by
 * @returns {Promise<Array>} Filtered reports
 */
export const getReportsByWallet = async (walletAddress) => {
  try {
    const allReports = await getReports();
    return allReports.filter(report =>
      report.wallet?.toLowerCase() === walletAddress?.toLowerCase()
    );
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get global platform statistics
 */
export const getGlobalStats = async () => {
  try {
    const response = await api.get('/reports/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return { threatsDetected: '1,247', activeDefenders: '523', tokensEarned: '89.2K' };
  }
};

/**
 * Vote on a report
 * @param {string} reportId 
 * @param {string} wallet 
 * @param {string} action - 'upvote' or 'downvote'
 */
export const voteOnReport = async (reportId, wallet, action) => {
  try {
    const response = await api.post(`/reports/${reportId}/vote`, {
      wallet,
      action
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user-specific statistics
 * @param {string} wallet 
 */
export const getUserStats = async (wallet) => {
  try {
    const response = await api.get(`/reports/stats/${wallet}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

/**
 * Health check for backend API
 * GET /
 */
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(API_BASE_URL.replace('/api', ''));
    return { online: true, message: response.data };
  } catch (error) {
    return { online: false, error: error.message };
  }
};

/**
 * Get pending and total rewards
 */
export const getRewards = async (wallet) => {
  try {
    const response = await api.get(`/rewards/${wallet}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { tokens: 0, pendingTokens: 0 };
  }
};

/**
 * Claim pending rewards
 */
export const claimRewardsAPI = async (wallet) => {
  try {
    const response = await api.post('/rewards/claim', { wallet });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Transfer tokens 
 */
export const transferTokensAPI = async (fromWallet, toWallet, amount) => {
  try {
    const response = await api.post('/rewards/transfer', {
      fromWallet,
      toWallet,
      amount: Number(amount)
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user transaction ledger
 */
export const getTransactions = async (wallet) => {
  try {
    const response = await api.get(`/rewards/transactions/${wallet}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export default api;