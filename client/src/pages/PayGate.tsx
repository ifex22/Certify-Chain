import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

// ====== WALLET CONFIG ======
import { WALLET_CONFIG } from "@/wallet-config";

export default function PayGate() {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState<"eth" | "sol" | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Use Secure Config
  const evmWallet = WALLET_CONFIG.EVM_ADDRESS;
  const solWallet = WALLET_CONFIG.SOLANA_ADDRESS;

  // Check if user already paid
  useEffect(() => {
    const hasPaid = localStorage.getItem("paid");
    if (hasPaid === "true") {
      setIsPaid(true);
      // Optional: Redirect immediately if they land here but are already paid
      // setLocation("/dashboard");
    }
  }, [setLocation]);

  const handleSuccess = () => {
    localStorage.setItem("paid", "true");
    setIsPaid(true);
    toast({
      title: "Payment Successful",
      description: "Welcome to the Pro Dashboard!",
      variant: "default",
    });
    setTimeout(() => setLocation("/dashboard"), 1000);
  };

  const payWithMetaMask = async () => {
    const win = window as any;
    if (!win.ethereum) {
      toast({ title: "Error", description: "MetaMask not installed", variant: "destructive" });
      return;
    }

    setLoading("eth");
    try {
      await win.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(win.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: evmWallet,
        value: ethers.parseEther("0.002")
      });
      
      await tx.wait();
      handleSuccess();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Payment Failed", description: error.message || "Transaction rejected", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const payWithPhantom = async () => {
    const win = window as any;
    const provider = win.solana;
    
    if (!provider || !provider.isPhantom) {
      toast({ title: "Error", description: "Phantom Wallet not installed", variant: "destructive" });
      return;
    }

    setLoading("sol");
    try {
      await provider.connect();
      const payer = provider.publicKey;
      
      const connection = new Connection("https://api.mainnet-beta.solana.com");
      const receiver = new PublicKey(solWallet);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: receiver,
          lamports: 0.05 * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;

      const signed = await provider.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signed.signature);
      
      handleSuccess();
    } catch (error: any) {
      console.error(error);
      // For mockup purposes, if it fails due to devnet/mainnet issues or no funds, we might want to let it pass if it's a specific error, but let's keep it strict for now or add a "Mock Pay" for dev.
      toast({ title: "Payment Failed", description: error.message || "Transaction failed", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  // Dev Bypass for testing
  const devBypass = () => {
    handleSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-6">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold font-heading">Unlock Certificate Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Pay once to access the certificate issuance tools forever.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Button 
              size="lg" 
              className="h-16 text-lg bg-[#F6851B] hover:bg-[#e2761b] text-white relative overflow-hidden group"
              onClick={payWithMetaMask}
              disabled={!!loading}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading === "eth" ? "Processing..." : "Pay with MetaMask (0.002 ETH)"}
            </Button>

            <Button 
              size="lg" 
              className="h-16 text-lg bg-[#512da8] hover:bg-[#4527a0] text-white relative overflow-hidden group"
              onClick={payWithPhantom}
              disabled={!!loading}
            >
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {loading === "sol" ? "Processing..." : "Pay with Phantom (0.05 SOL)"}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4 space-y-4">
            <p>Secure payment powered by blockchain technology.</p>
            
            <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Testing the app?</p>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={devBypass} 
                    className="text-xs border-dashed border-primary/40 text-primary hover:bg-primary/5"
                >
                    Activate Demo Mode (Skip Payment)
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
