import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_blockchain_digital_certificate_verification_concept.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background z-10"></div>
            <img 
                src={heroBg} 
                alt="Blockchain Background" 
                className="w-full h-full object-cover opacity-20"
            />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Live on Mainnet
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Trust-less <span className="text-primary">Verification</span> for the Digital Age
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Issue tamper-proof certificates on the blockchain. Instant verification, zero infrastructure, complete ownership.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Start Issuing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                  Verify Certificate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Immutable Record</h3>
              <p className="text-muted-foreground">
                Certificates are minted as NFTs on the blockchain, creating a permanent, unalterable proof of achievement.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Instant Verification</h3>
              <p className="text-muted-foreground">
                Verify any certificate instantly using just the ID. No manual checks or third-party delays required.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-background border shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">Cryptographic Ownership</h3>
              <p className="text-muted-foreground">
                Recipients truly own their credentials in their own wallets. Portable, secure, and self-sovereign.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
