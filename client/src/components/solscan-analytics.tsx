import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, RefreshCw, TrendingUp, Users, ExternalLink, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { solscanTracker, SolscanDeFiActivity, SolscanTokenHolder, TransactionInfo } from '@/lib/solscan-tracker';
import { toast } from '@/hooks/use-toast';

export function SolscanAnalytics() {
  const [defiActivities, setDefiActivities] = useState<SolscanDeFiActivity[]>([]);
  const [tokenHolders, setTokenHolders] = useState<SolscanTokenHolder[]>([]);
  const [localTransactions, setLocalTransactions] = useState<TransactionInfo[]>([]);
  const [isLoadingDefi, setIsLoadingDefi] = useState(false);
  const [isLoadingHolders, setIsLoadingHolders] = useState(false);
  const [activeTab, setActiveTab] = useState('verification');

  // Fetch DeFi activities
  const fetchDeFiActivities = async () => {
    setIsLoadingDefi(true);
    try {
      const activities = await solscanTracker.getGoldiumDeFiActivities(1, 10);
      setDefiActivities(activities);
      
      if (activities.length > 0) {
        toast({
          title: "DeFi Data Loaded",
          description: `Fetched ${activities.length} DeFi activities from Solscan`,
        });
      } else {
        toast({
          title: "No DeFi Activities",
          description: "No recent DeFi activities found for GOLDIUM token",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching DeFi activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch DeFi activities from Solscan",
        variant: "destructive"
      });
    } finally {
      setIsLoadingDefi(false);
    }
  };

  // Fetch token holders
  const fetchTokenHolders = async () => {
    setIsLoadingHolders(true);
    try {
      const holders = await solscanTracker.getGoldiumTokenHolders(1, 10);
      setTokenHolders(holders);
      
      if (holders.length > 0) {
        toast({
          title: "Holders Data Loaded",
          description: `Fetched ${holders.length} token holders from Solscan`,
        });
      } else {
        toast({
          title: "No Token Holders",
          description: "No token holders found for GOLDIUM token",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching token holders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch token holders from Solscan",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHolders(false);
    }
  };

  // Load local transactions
  const loadLocalTransactions = () => {
    const transactions = solscanTracker.getRecentTransactions(20);
    setLocalTransactions(transactions);
  };

  // Get verification status icon
  const getVerificationIcon = (tx: TransactionInfo) => {
    if (tx.status === 'pending') {
      return <Loader className="w-4 h-4 animate-spin text-yellow-500" />;
    } else if (tx.isDeFiVerified) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  // Get verification status text
  const getVerificationStatus = (tx: TransactionInfo) => {
    if (tx.status === 'pending') {
      return 'Verifying...';
    } else if (tx.isDeFiVerified) {
      return tx.solscanCategory || 'DeFi Verified';
    } else {
      return 'Not DeFi Categorized';
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // Auto-fetch data on component mount
  useEffect(() => {
    fetchDeFiActivities();
    fetchTokenHolders();
    loadLocalTransactions();

    // Set up interval to refresh local transactions for real-time verification
    const interval = setInterval(() => {
      loadLocalTransactions();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format amount
  const formatAmount = (amount: number, decimals: number = 6) => {
    return (amount / Math.pow(10, decimals)).toFixed(4);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-br from-galaxy-dark via-galaxy-darker to-black border-galaxy-blue/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-galaxy-bright flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Solscan Analytics
              </CardTitle>
              <CardDescription className="text-galaxy-muted">
                Real-time DeFi activities with blockchain verification from Solscan API
                <br />
                <span className="text-xs text-galaxy-blue mt-1 block">
                  🔍 Live verification: Jupiter V6 for swaps, Native Stake for staking, SPL Token for transfers
                </span>
                <span className="text-xs text-green-400 mt-1 block">
                  ✅ All transactions verified on blockchain for proper DeFi categorization
                </span>
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                fetchDeFiActivities();
                fetchTokenHolders();
              }}
              disabled={isLoadingDefi || isLoadingHolders}
              className="bg-galaxy-blue hover:bg-galaxy-bright text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${(isLoadingDefi || isLoadingHolders) ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-galaxy-darker">
              <TabsTrigger 
                value="verification" 
                className="data-[state=active]:bg-galaxy-blue data-[state=active]:text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verification ({localTransactions.length})
              </TabsTrigger>
              <TabsTrigger 
                value="defi" 
                className="data-[state=active]:bg-galaxy-blue data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                DeFi Activities ({defiActivities.length})
              </TabsTrigger>
              <TabsTrigger 
                value="holders" 
                className="data-[state=active]:bg-galaxy-blue data-[state=active]:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Token Holders ({tokenHolders.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="verification" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-galaxy-bright">Transaction Verification</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-galaxy-blue text-galaxy-blue">
                      {localTransactions.length} transactions
                    </Badge>
                    <Button
                      size="sm"
                      onClick={loadLocalTransactions}
                      className="bg-galaxy-blue hover:bg-galaxy-bright text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
                
                {localTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {localTransactions.map((tx, index) => (
                      <Card key={index} className="bg-galaxy-darker/50 border-galaxy-blue/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getVerificationIcon(tx)}
                                <Badge className={`${
                                  tx.isDeFiVerified 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : tx.status === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}>
                                  {getVerificationStatus(tx)}
                                </Badge>
                                <span className="text-xs text-galaxy-muted">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {new Date(tx.timestamp).toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="text-sm text-galaxy-bright font-mono">
                                {formatAddress(tx.signature)}
                              </div>
                              
                              {tx.solscanCategory && (
                                <div className="text-xs text-galaxy-blue">
                                  Solscan Category: {tx.solscanCategory}
                                </div>
                              )}
                              
                              {tx.error && (
                                <div className="text-xs text-red-400">
                                  Error: {tx.error}
                                </div>
                              )}
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="text-galaxy-blue hover:text-galaxy-bright"
                            >
                              <a
                                href={`https://solscan.io/tx/${tx.signature}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-xs">View</span>
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-galaxy-muted">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions to verify</p>
                    <p className="text-sm">Transactions will appear here as they are processed</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="defi" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-galaxy-bright">Recent DeFi Activities</h3>
                  <Badge variant="outline" className="border-galaxy-blue text-galaxy-blue">
                    {defiActivities.length} activities
                  </Badge>
                </div>
                
                {isLoadingDefi ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-galaxy-blue" />
                    <span className="ml-2 text-galaxy-muted">Loading DeFi activities...</span>
                  </div>
                ) : defiActivities.length > 0 ? (
                  <div className="space-y-3">
                    {defiActivities.map((activity, index) => (
                      <Card key={index} className="bg-galaxy-darker/50 border-galaxy-blue/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30">
                                  {activity.activity_type}
                                </Badge>
                                <span className="text-sm text-galaxy-muted">
                                  {formatTimestamp(activity.block_time)}
                                </span>
                              </div>
                              <div className="text-sm text-galaxy-bright">
                                Amount: {formatAmount(activity.amount)} GOLDIUM
                              </div>
                              <div className="text-xs text-galaxy-muted mb-1">
                                Program: <Badge variant="secondary" className="text-xs ml-1">
                                  {activity.program_id === 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' ? 'Jupiter V6' :
                                   activity.program_id === 'Stake11111111111111111111111111111111111112' ? 'Stake Program' :
                                   activity.program_id === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ? 'SPL Token' :
                                   'DeFi Protocol'}
                                </Badge>
                              </div>
                              <div className="text-xs text-galaxy-muted">
                                From: {formatAddress(activity.from_address)} → To: {formatAddress(activity.to_address)}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="text-galaxy-blue hover:text-galaxy-bright"
                            >
                              <a
                                href={`https://solscan.io/tx/${activity.signature}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-xs">Solscan</span>
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-galaxy-muted">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No DeFi activities found</p>
                    <p className="text-sm">Try refreshing or check back later</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="holders" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-galaxy-bright">Top Token Holders</h3>
                  <Badge variant="outline" className="border-galaxy-blue text-galaxy-blue">
                    {tokenHolders.length} holders
                  </Badge>
                </div>
                
                {isLoadingHolders ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-galaxy-blue" />
                    <span className="ml-2 text-galaxy-muted">Loading token holders...</span>
                  </div>
                ) : tokenHolders.length > 0 ? (
                  <div className="space-y-3">
                    {tokenHolders.map((holder, index) => (
                      <Card key={index} className="bg-galaxy-darker/50 border-galaxy-blue/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/30">
                                  Rank #{holder.rank}
                                </Badge>
                                <span className="text-sm font-mono text-galaxy-bright">
                                  {formatAddress(holder.address)}
                                </span>
                              </div>
                              <div className="text-sm text-galaxy-bright">
                                Balance: {formatAmount(holder.amount, holder.decimals)} GOLDIUM
                              </div>
                              <div className="text-xs text-galaxy-muted">
                                Owner: {formatAddress(holder.owner)}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              className="text-galaxy-blue hover:text-galaxy-bright"
                            >
                              <a
                                href={`https://solscan.io/account/${holder.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-xs">Solscan</span>
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-galaxy-muted">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No token holders found</p>
                    <p className="text-sm">Try refreshing or check back later</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default SolscanAnalytics;