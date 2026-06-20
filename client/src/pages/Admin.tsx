import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, ShieldAlert, Settings, Inbox, Trash2, UserPlus, Save, Lock, Unlock } from "lucide-react";

import { WALLET_CONFIG } from "@/wallet-config";

// Mock data for subscribers
const INITIAL_SUBSCRIBERS = [
  { id: 1, email: "jane@university.edu", plan: "Pro", status: "Active", joined: "2023-10-15" },
  { id: 2, email: "mark@bootcamp.io", plan: "Enterprise", status: "Active", joined: "2023-11-02" },
  { id: 3, email: "sarah@demo.com", plan: "Starter", status: "Expired", joined: "2023-09-20" },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminToken, setAdminToken] = useState("");

  // Admin Settings State (persisted in localStorage for prototype)
  const [demoEnabled, setDemoEnabled] = useState(true);
  const [demoDuration, setDemoDuration] = useState("30");
  const [subscribers, setSubscribers] = useState(INITIAL_SUBSCRIBERS);
  const [inboxContent, setInboxContent] = useState("");
  
  // Wallet Config
  const [evmWallet, setEvmWallet] = useState("");
  const [solWallet, setSolWallet] = useState("");
  const [isWalletLocked, setIsWalletLocked] = useState(false);

  // Check for existing admin session
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_session") === "true";
    if (isAdmin) setIsAuthenticated(true);

    // Load settings
    const savedDemo = localStorage.getItem("admin_demo_enabled");
    if (savedDemo !== null) setDemoEnabled(savedDemo === "true");
    
    const savedDuration = localStorage.getItem("admin_demo_duration");
    if (savedDuration) setDemoDuration(savedDuration);

    // Load wallets
    const savedEvm = localStorage.getItem("admin_evm_wallet");
    if (savedEvm) setEvmWallet(savedEvm);
    
    const savedSol = localStorage.getItem("admin_sol_wallet");
    if (savedSol) setSolWallet(savedSol);
    
    const savedLock = localStorage.getItem("admin_wallet_locked");
    if (savedLock === "true") setIsWalletLocked(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Token First
    if (adminToken !== WALLET_CONFIG.ADMIN_TOKEN) {
        toast({ title: "Security Alert", description: "Invalid Security Token", variant: "destructive" });
        return;
    }

    // Mock Admin Credentials
    if (adminEmail === "admin@certifychain.com" && adminPass === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_session", "true");
      toast({ title: "Welcome Admin", description: "Access granted." });
    } else {
      toast({ title: "Access Denied", description: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_session");
    setLocation("/auth");
  };

  const toggleDemo = (checked: boolean) => {
    setDemoEnabled(checked);
    localStorage.setItem("admin_demo_enabled", String(checked));
    toast({ title: "Settings Updated", description: `Demo access is now ${checked ? "Enabled" : "Disabled"}` });
  };

  const saveDuration = () => {
    localStorage.setItem("admin_demo_duration", demoDuration);
    toast({ title: "Saved", description: "Demo duration updated." });
  };

  const saveWallets = () => {
    localStorage.setItem("admin_evm_wallet", evmWallet);
    localStorage.setItem("admin_sol_wallet", solWallet);
    toast({ title: "Wallets Updated", description: "Payment destinations saved." });
  };

  const toggleWalletLock = () => {
    const newLockState = !isWalletLocked;
    setIsWalletLocked(newLockState);
    localStorage.setItem("admin_wallet_locked", String(newLockState));
    toast({ 
        title: newLockState ? "Configuration Locked" : "Configuration Unlocked", 
        description: newLockState ? "Wallet addresses are now hidden and read-only." : "You can now edit wallet addresses."
    });
  };

  const deleteSubscriber = (id: number) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    toast({ title: "Subscriber Removed", description: "User access revoked." });
  };

  const saveInbox = () => {
    // Just a mock save action
    console.log("Saved MTS:", inboxContent);
    toast({ title: "Inbox Saved", description: "Transaction data stored securely." });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/50">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
            <CardTitle className="text-xl">Admin Access Only</CardTitle>
            <CardDescription className="text-slate-400">Restricted area. Please authenticate.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input 
                  value={adminEmail} 
                  onChange={e => setAdminEmail(e.target.value)} 
                  placeholder="admin@certifychain.com"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={adminPass} 
                  onChange={e => setAdminPass(e.target.value)}
                  className="bg-slate-800 border-slate-700" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-emerald-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Security Token
                </Label>
                <Input 
                  type="password" 
                  value={adminToken} 
                  onChange={e => setAdminToken(e.target.value)}
                  placeholder="Enter secure token"
                  className="bg-slate-800 border-emerald-900/30 focus:border-emerald-500" 
                />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">Enter Console</Button>
            </form>
             <div className="mt-4 text-center text-xs text-slate-500">
              Hint: admin@certifychain.com / admin123 / {WALLET_CONFIG.ADMIN_TOKEN}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-slate-900 text-white py-4 px-6 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-bold font-heading">System Admin</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-800">
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-6xl space-y-8">
        
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribers.length}</div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Demo Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${demoEnabled ? "text-emerald-600" : "text-red-600"}`}>
                {demoEnabled ? "Active" : "Disabled"}
              </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">Normal</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="users" className="flex gap-2"><Users className="h-4 w-4" /> Subscribers</TabsTrigger>
            <TabsTrigger value="settings" className="flex gap-2"><Settings className="h-4 w-4" /> Demo Settings</TabsTrigger>
            <TabsTrigger value="inbox" className="flex gap-2"><Inbox className="h-4 w-4" /> MTS Inbox</TabsTrigger>
          </TabsList>

          {/* USER MANAGEMENT */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Subscriber Management</CardTitle>
                    <CardDescription>Manage access rights and subscription status.</CardDescription>
                </div>
                <Button size="sm"><UserPlus className="h-4 w-4 mr-2" /> Add Subscriber</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.email}</TableCell>
                        <TableCell>{sub.plan}</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === "Active" ? "default" : "destructive"} className={sub.status === "Active" ? "bg-emerald-500" : ""}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{sub.joined}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteSubscriber(sub.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DEMO SETTINGS */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Demo Access Configuration</CardTitle>
                <CardDescription>Control the public demo environment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 max-w-xl">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Public Demo Login</Label>
                    <p className="text-sm text-muted-foreground">Allow users to login with "demo@example.com" without password.</p>
                  </div>
                  <Switch checked={demoEnabled} onCheckedChange={toggleDemo} />
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                  <div className="space-y-2">
                    <Label>Demo Session Duration (Minutes)</Label>
                    <div className="flex gap-4">
                        <Input 
                            type="number" 
                            value={demoDuration} 
                            onChange={e => setDemoDuration(e.target.value)} 
                        />
                        <Button onClick={saveDuration} variant="outline"><Save className="h-4 w-4 mr-2" /> Save</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Auto-logout demo users after this time.</p>
                  </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-slate-50 relative overflow-hidden">
                  {isWalletLocked && (
                    <div className="absolute top-0 right-0 p-2">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex gap-1 items-center">
                            <Lock className="w-3 h-3" /> Secure Mode
                        </Badge>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-start gap-2">
                        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                            <strong>Security Notice:</strong> Receiving addresses are now configured securely in the codebase (<code>client/src/wallet-config.ts</code>) and cannot be changed here.
                        </div>
                    </div>
                    <div className="space-y-1 opacity-60">
                        <Label>EVM Wallet Address (ETH/BNB)</Label>
                        <Input 
                            value="Configured in codebase" 
                            disabled
                            className="bg-slate-100"
                        />
                    </div>
                    <div className="space-y-1 opacity-60">
                        <Label>Solana Wallet Address</Label>
                        <Input 
                            value="Configured in codebase" 
                            disabled
                            className="bg-slate-100"
                        />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MTS INBOX */}
          <TabsContent value="inbox">
            <Card>
              <CardHeader>
                <CardTitle>MTS / Transaction Inbox</CardTitle>
                <CardDescription>Paste bulk Message/Transaction Strings (MTS) for processing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                    placeholder="Paste MTS data here..." 
                    className="min-h-[300px] font-mono text-xs"
                    value={inboxContent}
                    onChange={e => setInboxContent(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button onClick={saveInbox}>Process & Save to Archive</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
