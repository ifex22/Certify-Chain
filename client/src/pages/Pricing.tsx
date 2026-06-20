import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="container mx-auto px-4 text-center mb-16">
        <h1 className="text-4xl font-bold font-heading mb-4">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Start issuing certificates today. Upgrade as you grow.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <Card className="border shadow-sm relative">
            <CardHeader>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <CardDescription>For small projects and tests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5 Issues per month</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Templates</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Community Support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth">
                 <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Tier */}
          <Card className="border-primary shadow-lg relative scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro Issuer</CardTitle>
              <CardDescription>For educational institutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Issuance</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom Branding</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Bulk CSV Upload</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Email Support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth">
                <Button className="w-full">Subscribe Now</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">Custom</div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated Smart Contract</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> API Access</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> SSO Integration</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 SLA Support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
