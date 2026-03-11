import { initProvider, threatIntelContract } from '../utils/Web3';

/**
 * Submit a threat report to the blockchain
 * Your contract: submitReport(string calldata ipfsHash)
 * 
 * @param {string} ipfsHash - IPFS hash of the uploaded report
 * @returns {Promise<Object>} Transaction result with hash and event data
 */
export const submitThreatReport = async (ipfsHash) => {
  try {
    if (!threatIntelContract) await initProvider();
    
    if (!ipfsHash || ipfsHash.trim() === '') {
      throw new Error('IPFS hash cannot be empty');
    }
    
    // Call contract function: submitReport(ipfsHash)
    const tx = await threatIntelContract.submitReport(ipfsHash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Extract ReportSubmitted event
    const event = receipt.logs.find(log => {
      try {
        const parsed = threatIntelContract.interface.parseLog(log);
        return parsed && parsed.name === 'ReportSubmitted';
      } catch {
        return false;
      }
    });
    
    let reporterAddress = null;
    let eventIpfsHash = null;
    
    if (event) {
      const parsedEvent = threatIntelContract.interface.parseLog(event);
      reporterAddress = parsedEvent.args.reporter;
      eventIpfsHash = parsedEvent.args.ipfsHash;
    }
    
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      reporter: reporterAddress,
      ipfsHash: eventIpfsHash,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Error submitting report to blockchain:', error);
    throw error;
  }
};

/**
 * Listen for ReportSubmitted events
 * Event: ReportSubmitted(address indexed reporter, string ipfsHash)
 */
export const onReportSubmitted = (callback) => {
  if (!threatIntelContract) {
    console.error('Contract not initialized');
    return;
  }
  
  threatIntelContract.on('ReportSubmitted', (reporter, ipfsHash, event) => {
    callback({
      reporter,
      ipfsHash,
      transactionHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber
    });
  });
};

/**
 * Listen for ReporterRewarded events
 * Event: ReporterRewarded(address indexed reporter, uint256 amount)
 */
export const onReporterRewarded = (callback) => {
  if (!threatIntelContract) {
    console.error('Contract not initialized');
    return;
  }
  
  threatIntelContract.on('ReporterRewarded', (reporter, amount, event) => {
    callback({
      reporter,
      amount: amount.toString(),
      transactionHash: event.log.transactionHash,
      blockNumber: event.log.blockNumber
    });
  });
};

/**
 * Get reward token address from ThreatIntel contract
 */
export const getRewardTokenAddress = async () => {
  try {
    if (!threatIntelContract) await initProvider();
    
    const tokenAddress = await threatIntelContract.rewardToken();
    return tokenAddress;
  } catch (error) {
    console.error('Error getting reward token address:', error);
    throw error;
  }
};

/**
 * Get contract owner address
 */
export const getContractOwner = async () => {
  try {
    if (!threatIntelContract) await initProvider();
    
    const owner = await threatIntelContract.owner();
    return owner;
  } catch (error) {
    console.error('Error getting contract owner:', error);
    throw error;
  }
};

/**
 * Remove all event listeners
 */
export const removeAllListeners = () => {
  if (threatIntelContract) {
    threatIntelContract.removeAllListeners();
  }
};
