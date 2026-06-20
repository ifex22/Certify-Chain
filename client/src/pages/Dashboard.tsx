import CertificateGenerator from "@/components/CertificateGenerator";
import { useMockAuth, useMockBlockchain } from "@/lib/mock-blockchain";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileUp, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { user } = useMockAuth();
  const [, setLocation] = useLocation();
  const { account, connectWallet, issueCertificate } = useMockBlockchain();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("generator");
  const [recipient, setRecipient] = useState("");
  const [ipfs, setIpfs] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    // Simple route protection
    const timer = setTimeout(() => {
        if (!user) {
            setLocation("/auth");
        }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, setLocation]);

  if (!user) return null;

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !ipfs) {
        toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
        return;
    }

    setIsIssuing(true);
    try {
        const newId = await issueCertificate(recipient, ipfs, user.email);
        toast({ 
            title: "Certificate Issued!", 
            description: `Successfully minted certificate #${newId} to ${recipient.slice(0,6)}...` 
        });
        setRecipient("");
        setIpfs("");
    } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
        setIsIssuing(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 pb-20 bg-muted/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Issuer Dashboard</h1>
            <p className="text-muted-foreground">Design, generate, and mint certificates.</p>
          </div>
          <div className="flex items-center gap-3 bg-background p-2 px-4 rounded-full border shadow-sm">
             <div className={`h-3 w-3 rounded-full ${account ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
             <span className="text-sm font-medium">
                {account ? "Wallet Connected" : "Wallet Disconnected"}
             </span>
          </div>
        </div>

        <Tabs defaultValue="generator" className="w-full space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="generator">Generator</TabsTrigger>
                <TabsTrigger value="issuance">Blockchain Issuance</TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4">
                <CertificateGenerator />
            </TabsContent>

            <TabsContent value="issuance">
                <div className="grid lg:grid-cols-3 gap-8">
                   {/* Sidebar / Status */}
                   <div className="space-y-6">
                      <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Account Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase">Email</Label>
                                <div className="font-medium">{user.email}</div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground uppercase">Wallet</Label>
                                {account ? (
                                    <div className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                                        {account}
                                    </div>
                                ) : (
                                    <Button onClick={connectWallet} variant="outline" size="sm" className="w-full mt-2">
                                        Connect Wallet
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                      </Card>
                   </div>

                   {/* Main Issuance Form */}
                   <div className="lg:col-span-2">
                      <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Issue New Certificate</CardTitle>
                            <CardDescription>Mint a new NFT certificate to a recipient's wallet address.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleIssue} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="recipient">Recipient Wallet Address</Label>
                                    <Input 
                                        id="recipient" 
                                        placeholder="0x..." 
                                        value={recipient}
                                        onChange={e => setRecipient(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground">The address that will own the NFT.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ipfs">Metadata Hash (IPFS CID)</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            id="ipfs" 
                                            placeholder="Qm..." 
                                            value={ipfs}
                                            onChange={e => setIpfs(e.target.value)}
                                        />
                                        <Button type="button" variant="outline" size="icon" title="Upload JSON (Mock)">
                                            <FileUp className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        The Content Identifier for the certificate metadata JSON hosted on IPFS.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        className="w-full sm:w-auto min-w-[150px]" 
                                        disabled={isIssuing || !account}
                                    >
                                        {isIssuing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Minting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" /> Issue Certificate
                                            </>
                                        )}
                                    </Button>
                                    {!account && (
                                        <p className="text-xs text-destructive mt-2">
                                            * You must connect your wallet to issue certificates.
                                        </p>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                      </Card>
                   </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
