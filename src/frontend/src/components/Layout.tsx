import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  UserRole,
  useGetCallerUserProfile,
  useGetCallerUserRole,
} from "../hooks/useQueries";

export function Layout({ children }: { children: React.ReactNode }) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: userRole } = useGetCallerUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Package size={16} /> },
    ...(isAuthenticated
      ? [
          ...(userRole !== UserRole.admin && userRole !== UserRole.guest
            ? [
                {
                  to: "/dashboard",
                  label: "My Parcels",
                  icon: <LayoutDashboard size={16} />,
                },
                {
                  to: "/book",
                  label: "Book Parcel",
                  icon: <Package size={16} />,
                },
              ]
            : []),
          ...(userRole !== UserRole.admin
            ? [
                {
                  to: "/rider",
                  label: "Rider Portal",
                  icon: <Truck size={16} />,
                },
              ]
            : []),
          ...(userRole === UserRole.admin
            ? [
                {
                  to: "/admin",
                  label: "Admin",
                  icon: <ShieldCheck size={16} />,
                },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-sidebar/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Package size={18} className="text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              RDS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to + link.label}
                to={link.to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-primary bg-primary/10" }}
                data-ocid="nav.link"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {userProfile?.name ?? "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  data-ocid="nav.logout_button"
                >
                  <LogOut size={14} className="mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="nav.login_button"
              >
                {loginStatus === "logging-in" ? "Logging in..." : "Login"}
              </Button>
            )}
            <button
              type="button"
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-sidebar"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMobileOpen(false)}
                    data-ocid="nav.link"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="nav.login_button"
                  >
                    Login
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-sidebar/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
