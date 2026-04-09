import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContractFactory, parseEther, Contract, formatEther } from 'ethers';
import EscrowArtifact from '../contracts/EscrowContract.json';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import { 
  Plus, 
  ArrowRight, 
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw, 
  Wallet as WalletIcon, 
  History, 
  TrendingUp,
  Globe,
  DollarSign,
  Briefcase,
  ShieldAlert,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export default function Wallet() {
  const { provider, signer, account, network, connectWallet } = useWeb3();
  
  const [isBuildingContract, setIsBuildingContract] = useState(false);
  const [conversionFrom, setConversionFrom] = useState('USD');
  const [conversionTo, setConversionTo] = useState('ETH');
  const [amount, setAmount] = useState('1000');

  // Web3 States
  const [projectName, setProjectName] = useState('');
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Deployed Contract States
  const [deployedContract, setDeployedContract] = useState(null);
  const [contractData, setContractData] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);

  // Live History
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await api.get('/transaction/history');
        setTransactionHistory(res.data);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Deploy Contract
  const deployContract = async () => {
    if (!signer) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!freelancerAddress || !depositAmount || !projectName) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsDeploying(true);
      setTxHash('');
      const factory = new ContractFactory(EscrowArtifact.abi, EscrowArtifact.bytecode, signer);
      
      const deploymentTx = await factory.deploy(freelancerAddress, projectName, {
        value: parseEther(depositAmount)
      });
      
      const contract = await deploymentTx.waitForDeployment();
      const address = await contract.getAddress();
      
      setDeployedContract(contract);
      setTxHash(deploymentTx.deploymentTransaction().hash);
      setIsBuildingContract(false);
      
      await loadContractData(contract);
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed. Check console.");
    } finally {
      setIsDeploying(false);
    }
  };

  const loadContractData = async (contractAttr = deployedContract) => {
    if (!contractAttr) return;
    try {
      const pName = await contractAttr.projectName();
      const fAddr = await contractAttr.freelancer();
      const cAddr = await contractAttr.client();
      const bal = await provider.getBalance(await contractAttr.getAddress());
      const completed = await contractAttr.isCompleted();
      const approved = await contractAttr.isApproved();

      setContractData({
        address: await contractAttr.getAddress(),
        projectName: pName,
        freelancer: fAddr,
        client: cAddr,
        balance: formatEther(bal),
        isCompleted: completed,
        isApproved: approved
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markComplete = async () => {
    try {
      setIsInteracting(true);
      const tx = await deployedContract.markComplete();
      await tx.wait();
      setTxHash(tx.hash);
      await loadContractData();
    } catch (e) { console.error(e); alert("Failed to mark complete. Are you the freelancer?"); }
    setIsInteracting(false);
  };

  const approvePayment = async () => {
    try {
      setIsInteracting(true);
      const tx = await deployedContract.approvePayment();
      await tx.wait();
      setTxHash(tx.hash);
      await loadContractData();
    } catch (e) { console.error(e); alert("Failed to approve. Are you the client?"); }
    setIsInteracting(false);
  };

  const releaseFunds = async () => {
    try {
      setIsInteracting(true);
      const tx = await deployedContract.releaseFunds();
      await tx.wait();
      setTxHash(tx.hash);
      await loadContractData();
    } catch (e) { console.error(e); alert("Failed to release funds."); }
    setIsInteracting(false);
  };

  const exchangeRates = {
    'USD-ETH': 0.00034,
    'ETH-USD': 2940.50,
    'USD-INR': 83.20,
    'INR-USD': 0.012
  };

  const calculateConversion = () => {
    const rateKey = `${conversionFrom}-${conversionTo}`;
    const rate = exchangeRates[rateKey] || 1;
    return (parseFloat(amount || 0) * rate).toFixed(4);
  };

  return (
    <div className="space-y-8">
      {/* Balances Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-indigo-600 rounded-xl">
               <DollarSign className="text-white" size={24} />
             </div>
             <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Main USD Balance</p>
          <h3 className="text-3xl font-bold text-white">$12,450.80</h3>
        </GlassCard>

         <GlassCard className="bg-gradient-to-br from-amber-600/20 to-transparent border-amber-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-500 rounded-xl">
               <TrendingUp className="text-white" size={24} />
             </div>
             <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Live Market</span>
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Crypto (ETH)</p>
          <h3 className="text-3xl font-bold text-white">4.25 ETH</h3>
        </GlassCard>

         <GlassCard className="bg-gradient-to-br from-emerald-600/20 to-transparent border-emerald-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-emerald-500 rounded-xl">
               <Layers className="text-white" size={24} />
             </div>
             <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded-lg">Settled</span>
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Local Savings (INR)</p>
          <h3 className="text-3xl font-bold text-white">₹2,45,000</h3>
        </GlassCard>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Conversion & Building */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Conversion Tool */}
          <GlassCard className="bg-white/[0.02]">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <RefreshCcw size={20} className="text-indigo-400" />
              Instant Currency Conversion
            </h4>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">From</label>
                <div className="flex gap-2">
                   <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-600/50" 
                  />
                  <select 
                    value={conversionFrom}
                    onChange={(e) => setConversionFrom(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <ArrowRight className="text-white/20 hidden md:block" />
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center md:hidden">
                  <Plus className="text-white/40 rotate-45" />
                </div>
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">To (Estimated)</label>
                <div className="flex gap-2">
                   <div className="flex-1 bg-indigo-600/10 border border-indigo-600/30 rounded-xl px-4 py-3 text-indigo-400 font-bold">
                    {calculateConversion()}
                  </div>
                  <select 
                     value={conversionTo}
                     onChange={(e) => setConversionTo(e.target.value)}
                     className="bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-white/40" />
                <p className="text-xs text-white/40 italic">Exchange rate: 1 {conversionFrom} = {exchangeRates[`${conversionFrom}-${conversionTo}`] || 1} {conversionTo} • No hidden fees</p>
              </div>
              <Button variant="accent">Confirm Swap</Button>
            </div>
          </GlassCard>

          {/* Smart Contract Builder Simulation */}
          <GlassCard className={`border-indigo-500/${deployedContract ? '40' : '20'} bg-indigo-600/5 overflow-hidden relative`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <WalletIcon size={80} />
            </div>
            
            {!deployedContract ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tight">Smart Contract Builder</h4>
                      <p className="text-white/40 text-sm">Deploy actual Escrow contract to {network || 'Network'}.</p>
                  </div>
                  {!account ? (
                    <Button variant="primary" onClick={connectWallet}>Connect MetaMask to Deploy</Button>
                  ) : (
                    <Button variant="primary" onClick={() => setIsBuildingContract(true)}>Initialize New Escrow</Button>
                  )}
                </div>

                {isBuildingContract ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Project Name</label>
                        <input value={projectName} onChange={e=>setProjectName(e.target.value)} type="text" placeholder="e.g. Mobile App UI" className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Freelancer Address (0x...)</label>
                        <input value={freelancerAddress} onChange={e=>setFreelancerAddress(e.target.value)} type="text" placeholder="0xabc...123" className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                      </div>
                    </div>

                    <div className="p-6 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white">Milestone #1</h5>
                        <span className="text-[10px] font-bold text-indigo-400">Total Deposit</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" disabled value="Full Delivery" className="bg-[#0f172a] border-white/5 rounded-lg px-3 py-2 text-xs text-white/50" />
                        <input value={depositAmount} onChange={e=>setDepositAmount(e.target.value)} type="number" step="0.01" placeholder="e.g. 0.05 ETH" className="bg-[#0f172a] border-white/5 rounded-lg px-3 py-2 text-xs text-white" />
                      </div>
                    </div>

                    {txHash && (
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-400 break-all">
                        Tx Hash: {txHash}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1" onClick={() => setIsBuildingContract(false)} disabled={isDeploying}>Cancel</Button>
                      <Button variant="primary" className="flex-1 shadow-indigo-500/40 relative" onClick={deployContract} disabled={isDeploying}>
                        {isDeploying ? 'Deploying on Testnet...' : 'Deploy Smart Contract'}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-white/20 text-sm">No active builds. Click "Initialize" to deploy an Escrow.</p>
                  </div>
                )}
              </>
            ) : (
              // DEPLOYED CONTRACT VIEW
               <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                 <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-emerald-400 uppercase tracking-tight">Active Escrow: {contractData?.projectName}</h4>
                      <p className="text-white/40 text-xs mt-1 break-all">Contract: {contractData?.address}</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                       LIVE
                    </div>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Locked Balance</p>
                      <p className="font-bold text-white">{contractData?.balance} ETH</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Status</p>
                      <p className="font-bold text-emerald-400">{contractData?.isApproved ? "Approved" : contractData?.isCompleted ? "Awaiting Approval" : "In Progress"}</p>
                    </div>
                 </div>

                 {txHash && (
                    <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-white/60 break-all">
                      Last Tx: <span className="text-indigo-400">{txHash}</span>
                    </div>
                 )}

                 <div className="grid grid-cols-3 gap-4 pt-2">
                    <Button variant="outline" className={`text-xs p-2 ${contractData?.isCompleted ? 'opacity-50' : ''}`} onClick={markComplete} disabled={isInteracting || contractData?.isCompleted}>
                       {isInteracting ? '...' : '1. Mark Complete'}
                    </Button>
                    <Button variant="primary" className={`text-xs p-2 ${contractData?.isApproved ? 'opacity-50' : ''}`} onClick={approvePayment} disabled={isInteracting || contractData?.isApproved || !contractData?.isCompleted}>
                       {isInteracting ? '...' : '2. Approve Work'}
                    </Button>
                    <Button variant="accent" className="text-xs p-2 bg-amber-500 hover:bg-amber-600 text-white" onClick={releaseFunds} disabled={isInteracting || !contractData?.isApproved || contractData?.balance === "0.0"}>
                       {isInteracting ? '...' : '3. Release Funds'}
                    </Button>
                 </div>
               </motion.div>
            )}
            
          </GlassCard>
        </div>

        {/* Right: History & Notifications */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <GlassCard className="h-full">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <History size={20} className="text-amber-400" />
              Recent Transactions
            </h4>
            
            <div className="space-y-6">
              {historyLoading ? (
                <div className="text-white/40 text-sm text-center py-4">Loading history...</div>
              ) : transactionHistory.length === 0 ? (
                <div className="text-white/40 text-sm text-center py-4">No recent transactions.</div>
              ) : transactionHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-400`}>
                       <RefreshCcw size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Transfer</p>
                      <p className="text-[10px] text-white/40 tracking-wide break-all">To: {item.receiver.slice(0,10)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{item.amount} {item.currency}</p>
                    <p className="text-[10px] text-white/40">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 text-xs font-bold text-white/40 border border-white/5 rounded-xl hover:bg-white/5 transition-all">
              View All History
            </button>
          </GlassCard>

          <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
             <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="text-indigo-400" size={18} />
                <h5 className="text-xs font-bold text-white uppercase tracking-widest">Compliance Check</h5>
             </div>
             <p className="text-[10px] text-white/60">Your current regional tax threshold is at 70%. We recommend generating a settlement report for Q2.</p>
             <button className="mt-3 text-[10px] font-bold text-indigo-400 hover:underline">Download Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}