import { useState } from "react";
import { useMockBlockchain } from "@/lib/mock-blockchain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, ExternalLink, Search } from "lucide-react";
import certIcon from "@assets/generated_images/digital_certificate_document_icon_3d.png";

export default function Verify() {
  const [certId, setCertId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const { getCertificate } = useMockBlockchain();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) return;

    setStatus("loading");
    setResult(null);
    
    try {
      const id = parseInt(certId);
      if (isNaN(id)) throw new Error("Invalid ID");
      
      const cert = await getCertificate(id);
      setResult(cert);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading mb-4">Verify Certificate</h1>
          <p className="text-muted-foreground text-lg">
            Enter the unique Certificate ID to verify its authenticity on the blockchain.
          </p>
        </div>

        <Card className="border-muted shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
          <CardHeader>
            <CardTitle>Certificate Lookup</CardTitle>
            <CardDescription>Search the registry for valid credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter Certificate ID (e.g., 101)" 
                  className="pl-10 h-12 text-lg"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {status === "success" && result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/10 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border">
                    <img src={certIcon} alt="Certificate" className="w-32 h-32 object-contain" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                      <CheckCircle className="h-6 w-6" />
                      Verified Authentic
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Certificate ID</span>
                        <p className="font-mono text-lg font-semibold">#{result.id}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issued Date</span>
                        <p className="font-medium">{new Date(result.issuedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recipient Address</span>
                        <p className="font-mono text-sm bg-muted p-2 rounded break-all">{result.to}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">IPFS Hash</span>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-muted-foreground truncate max-w-[200px]">{result.ipfsHash}</p>
                          <a href={`https://ipfs.io/ipfs/${result.ipfsHash}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1">
                            View Metadata <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "error" && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6 flex items-center gap-4 text-destructive">
                   <XCircle className="h-8 w-8" />
                   <div>
                     <h3 className="font-bold text-lg">Verification Failed</h3>
                     <p className="text-destructive/80">Could not find a certificate with that ID. It may not exist or has been revoked.</p>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
