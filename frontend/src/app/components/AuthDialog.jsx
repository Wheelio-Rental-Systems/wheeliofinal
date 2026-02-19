import { Car, Mail, Lock, UserCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";

export function AuthDialog({ open, onOpenChange, onLogin }) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const determineRole = (email) => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('admin')) return 'admin';
    if (lowerEmail.includes('staff')) return 'staff';
    return 'customer';
  };

  const handleLogin = () => {
    const role = determineRole(email);
    onLogin(role);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-primary/20">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#ec4899] rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-[#7c3aed] to-[#ec4899] p-3 rounded-lg">
                  <Car className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div>
              <DialogTitle className="text-3xl bg-gradient-to-r from-[#7c3aed] to-[#ec4899] bg-clip-text text-transparent">
                Welcome to Wheelio
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access your account
              </p>
            </div>
          </DialogHeader>

          <Tabs defaultValue="login" className="space-y-6 mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <Button
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:opacity-90"
                onClick={handleLogin}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleLogin}
              >
                Create Account
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground text-center mb-3">Quick Demo Access</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  onLogin('customer');
                  onOpenChange(false);
                }}
              >
                Demo as Customer
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  onLogin('staff');
                  onOpenChange(false);
                }}
              >
                Demo as Staff
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  onLogin('admin');
                  onOpenChange(false);
                }}
              >
                Demo as Admin
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </>
  );
}
