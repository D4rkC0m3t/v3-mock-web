const ethers = require('ethers');
const { parseEther, formatEther } = ethers;

// Sepolia Testnet RPC
const provider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);

// Contract configuration
const swapRouterABI = require('./swapRouterABI.json');
const swapRouterAddress = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";

// Initialize wallet and contract
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const swapContract = new ethers.Contract(swapRouterAddress, swapRouterABI, wallet);

// Helper function to validate transaction parameters
const validateTransactionParams = (tokenAddress, amount) => {
  if (!ethers.isAddress(tokenAddress)) {
    throw new Error('Invalid token address');
  }
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount');
  }
};

async function swapTokens(tokenIn, tokenOut, amountIn) {
  try {
    validateTransactionParams(tokenIn, amountIn);
    validateTransactionParams(tokenOut, 1); // Validate destination token

    // Estimate gas
    const gasEstimate = await swapContract.swap.estimateGas(
      tokenIn,
      tokenOut,
      parseEther(amountIn.toString())
    );

    // Add 20% buffer to gas estimate
    const gasLimit = Math.floor(gasEstimate * 1.2);

    const tx = await swapContract.swap(
      tokenIn,
      tokenOut,
      parseEther(amountIn.toString()),
      { gasLimit }
    );

    console.log(`Swap transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();

    if (!receipt.status) {
      throw new Error('Transaction failed');
    }

    return {
      hash: tx.hash,
      status: 'success',
      gasUsed: formatEther(receipt.gasUsed),
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Swap failed:', error);
    throw new Error(`Swap failed: ${error.message}`);
  }
}

// Buy ETH with USDT (example)
async function buyETH(usdtAmount) {
  const txHash = await swapTokens(
    "0x7169D38820dfd117B3B7EB3F62A1D18E6246C4D2", // Sepolia USDT test address
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Sepolia WETH address
    usdtAmount
  );
  return txHash;
}

// Sell ETH for USDT
async function sellETH(ethAmount) {
  const txHash = await swapTokens(
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Sepolia WETH address
    "0x7169D38820dfd117B3B7EB3F62A1D18E6246C4D2", // Sepolia USDT test address
    ethAmount
  );
  return txHash;
}

// Transfer Tokens Between Wallets
async function transferToken(tokenAddress, recipient, amount) {
  try {
    validateTransactionParams(tokenAddress, amount);
    if (!ethers.isAddress(recipient)) {
      throw new Error('Invalid recipient address');
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function transfer(address to, uint amount)"],
      wallet
    );

    // Estimate gas
    const gasEstimate = await tokenContract.transfer.estimateGas(
      recipient,
      parseEther(amount.toString())
    );

    // Add 20% buffer to gas estimate
    const gasLimit = Math.floor(gasEstimate * 1.2);

    const tx = await tokenContract.transfer(
      recipient,
      parseEther(amount.toString()),
      { gasLimit }
    );

    console.log(`Transfer transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();

    if (!receipt.status) {
      throw new Error('Transaction failed');
    }

    return {
      hash: tx.hash,
      status: 'success',
      gasUsed: formatEther(receipt.gasUsed),
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Transfer failed:', error);
    throw new Error(`Transfer failed: ${error.message}`);
  }
}

module.exports = { swapTokens, buyETH, sellETH, transferToken };