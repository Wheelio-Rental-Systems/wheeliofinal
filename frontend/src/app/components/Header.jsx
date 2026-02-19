import { Car, Menu, Bell, User, LogOut, LogIn, Home as HomeIcon, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

export function Header({ onNavigate, currentPage, userRole, isLoggedIn = false, onShowAuth, onShowHost, onLogout, onShowSupport }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-primary to-accent p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent tracking-tight">
            Wheelio
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Vehicles'].map((page) => (
            <button
              key={page}
              onClick={() => onNavigate(page.toLowerCase())}
              className={`relative text-sm font-medium tracking-wide transition-colors hover:text-primary ${currentPage === page.toLowerCase() ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              {page}
              {currentPage === page.toLowerCase() && (
                <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}

          {isLoggedIn && ['Dashboard', 'Admin', 'Inspection'].map((page) => {
            const pageKey = page.toLowerCase();
            if (page === 'Dashboard' && userRole !== 'customer') return null;
            if (page === 'Admin' && userRole !== 'admin') return null;


            return (
              <button
                key={page}
                onClick={() => onNavigate(pageKey)}
                className={`relative text-sm font-medium tracking-wide transition-colors hover:text-primary ${currentPage === pageKey ? 'text-primary' : 'text-muted-foreground'
                  }`}
              >
                {page === 'Dashboard' ? 'My Bookings' : page === 'Inspection' ? 'Inspections' : `${page} Panel`}
                {currentPage === pageKey && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                onClick={onShowHost}
                className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Become a Host
              </Button>
              <Button variant="ghost" size="icon" onClick={onShowSupport}>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button
                onClick={onShowAuth}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p>John Doe</p>
                      <p className="text-xs text-muted-foreground">
                        john.doe@wheelio.com
                      </p>
                      <Badge className="w-fit mt-1 bg-primary/20 text-primary hover:bg-primary/30">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowHost}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Become a Host
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}