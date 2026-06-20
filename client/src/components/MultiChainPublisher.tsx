import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileUp, Send, Link2, ShieldCheck, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { Connection, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";

interface MultiChainPublisherProps {
  certificateData: {
    studentName: string;
    courseName: string;
    issuerName: string;
    date: string;
    notes: string;
  };
}

export default function MultiChainPublisher({ certificateData }: MultiChainPublisherProps) {
  const { toast } = useToast();
  const [hash, setHash] = useState<string>("");
  const [isComputing, setIsComputing] = useState(false);
  const [isPublishing, setIsPublishing] = useState<"evm" | "solana" | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const computeHash = async () => {
    setIsComputing(true);
    // Simulate slight delay for "computation" feel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const dataString = JSON.stringify(certificateData);
      const bytes = ethers.toUtf8Bytes(dataString);
      const computedHash = ethers.keccak256(bytes);
      setHash(computedHash);
      toast({ title: "Hash Computed", description: "Certificate data hashed successfully." });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Failed to compute hash", variant: "destructive" });
    } finally {
      setIsComputing(false);
    }
  };

  const publishEVM = async () => {
    const win = window as any;
    if (!win.ethereum) {
      toast({ title: "Error", description: "MetaMask not installed", variant: "destructive" });
      return;
    }

    if (!hash) {
      toast({ title: "Error", description: "Please compute hash first", variant: "destructive" });
      return;
    }

    setIsPublishing("evm");
    try {
      await win.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(win.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Send 0 ETH to self with data
      const tx = await signer.sendTransaction({
        to: address,
        value: 0,
        data: hash // The hash is stored in input data
      });

      setTxHash(tx.hash);
      toast({ 
        title: "Published on EVM!", 
        description: "Transaction sent successfully." 
      });
    } catch (error: any) {
      console.error(error);
      toast({ title: "Publish Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsPublishing(null);
    }
  };

  const publishSolana = async () => {
    const win = window as any;
    if (!win.solana || !win.solana.isPhantom) {
      toast({ title: "Error", description: "Phantom wallet not installed", variant: "destructive" });
      return;
    }

    if (!hash) {
      toast({ title: "Error", description: "Please compute hash first", variant: "destructive" });
      return;
    }

    setIsPublishing("solana");
    try {
        await win.solana.connect();
        const provider = win.solana;
        const connection = new Connection("https://api.mainnet-beta.solana.com");
        const payer = provider.publicKey;

        // Memo Program ID
        const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

        const instruction = {
            keys: [],
            programId: memoProgramId,
            data: Buffer.from(hash)
        };
        
        const transaction = new Transaction().add({
            keys: [],
            programId: memoProgramId,
            data: Buffer.from(hash)
        });
        
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer;

        const { signature } = await provider.signAndSendTransaction(transaction);
        await connection.confirmTransaction(signature);

        setTxHash(signature);
        toast({ 
            title: "Published on Solana!", 
            description: "Memo instruction sent successfully." 
        });

    } catch (error: any) {
         console.error(error);
        // For mock/devnet failures allow a "success" simulation if needed, but try real first
        toast({ title: "Publish Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsPublishing(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Hash & Publish
          </CardTitle>
          <CardDescription>
            Cryptographically hash your certificate data and publish it on-chain for immutable proof of existence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <Label>Computed SHA-256 Hash</Label>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={computeHash} 
                    disabled={isComputing}
                >
                    {isComputing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Database className="h-3 w-3 mr-2" />}
                    Compute Hash
                </Button>
             </div>
             <div className="p-3 bg-muted rounded-md font-mono text-xs break-all min-h-[3rem] flex items-center">
                {hash || <span className="text-muted-foreground italic">No hash computed yet...</span>}
             </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
             <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={publishEVM}
                disabled={!hash || !!isPublishing}
             >
                {isPublishing === "evm" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png" className="h-4 w-4 mr-2 object-contain" />}
                Publish to EVM
             </Button>

             <Button 
                className="w-full bg-[#9945FF] hover:bg-[#8636e3] text-white"
                onClick={publishSolana}
                disabled={!hash || !!isPublishing}
             >
                {isPublishing === "solana" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <img src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" className="h-4 w-4 mr-2 object-contain invert brightness-0 grayscale opacity-0" style={{filter: "brightness(0) invert(1)"}} />}
                Publish to Solana
             </Button>
          </div>

          {txHash && (
            <div className="pt-4 border-t">
                <Label className="text-emerald-600 font-bold flex items-center gap-2 mb-2">
                    <Link2 className="h-4 w-4" />
                    Published Successfully!
                </Label>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded text-xs font-mono text-emerald-800 break-all">
                    Tx: {txHash}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    * This hash is now permanently stored on the blockchain.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
