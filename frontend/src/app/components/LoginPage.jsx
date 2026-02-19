import { Car, Mail, Lock, UserCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import Antigravity from "./Antigravity";

// interface LoginPageProps removed (JS file)

export function LoginPage({ onLogin }) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 via-background to-[#ec4899]/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.15),transparent_50%)]"></div>

      {/* Antigravity Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Antigravity
          count={200}
          magnetRadius={8}
          ringRadius={7}
          waveSpeed={0.3}
          waveAmplitude={1}
          particleSize={1.2}
          lerpSpeed={0.05}
          color="#ec4899"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={2}
          particleShape="capsule"
          fieldStrength={10}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <Card className="w-full max-w-md relative z-10 border-primary/20 bg-card/80 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-lg blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-[#7c3aed] to-[#ec4899] p-3 rounded-lg">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
              Welcome to Wheelio
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to access your account
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Login As</Label>
                <Select defaultValue="customer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>

                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                onClick={() => onLogin('customer')}
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                onClick={() => onLogin('customer')}
              >
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          {/* Demo Logins */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground text-center mb-3">Quick Demo Access</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onLogin('customer')}
              >
                Login as Customer
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => onLogin('admin')}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}