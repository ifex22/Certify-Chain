import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMockBlockchain, useMockAuth } from "@/lib/mock-blockchain";
import { Hexagon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const { account, connectWallet, isConnecting } = useMockBlockchain();
  const { user, logout } = useMockAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link href="/" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}>
        Home
      </Link>
      <Link href="/verify" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/verify') ? 'text-primary' : 'text-muted-foreground'}`}>
        Verify
      </Link>
      <Link href="/pricing" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/pricing') ? 'text-primary' : 'text-muted-foreground'}`}>
        Pricing
      </Link>
      {user && (
        <Link href="/dashboard" onClick={onClick} className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Hexagon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight">CertifyChain</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden lg:inline-block">{user.email}</span>
              <Button variant="ghost" onClick={logout} size="sm">Logout</Button>
            </div>
          ) : (
             <Link href="/auth">
               <Button variant="ghost" size="sm">Login</Button>
             </Link>
          )}
          
          <Button 
            onClick={connectWallet} 
            variant={account ? "outline" : "default"}
            disabled={isConnecting}
            className="font-medium"
          >
            {isConnecting ? "Connecting..." : account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
             <Button 
                onClick={connectWallet} 
                variant={account ? "outline" : "default"}
                size="sm"
                disabled={isConnecting}
                className="mr-2"
              >
                {account ? "Connected" : "Connect"}
              </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 mt-8">
                  <NavLinks onClick={() => setIsMobileMenuOpen(false)} />
                  <div className="border-t pt-4">
                    {user ? (
                      <Button variant="secondary" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full">Logout</Button>
                    ) : (
                      <Link href="/auth">
                        <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Login / Signup</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
