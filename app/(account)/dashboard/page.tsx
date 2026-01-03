'use client';

import { useEffect } from "react";
import { motion } from 'framer-motion';
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Leaf,
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { user, signOut, initialized, loading } = useAuthStore();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/auth');
    }
  }, [user, initialized, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/')
  };

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    { icon: FileText, title: 'Create Invoice', description: 'Generate a new invoice' },
    { icon: Users, title: 'Add Client', description: 'Add a new client to your list' },
    { icon: LayoutDashboard, title: 'View Reports', description: 'Check your analytics' },
    { icon: Settings, title: 'Settings', description: 'Manage your preferences' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Bizkopa</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user.first_name} {user.last_name}!
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your business dashboard.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{action.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-2xl">$0.00</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardDescription>Active Clients</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardDescription>Pending Invoices</CardDescription>
                <CardTitle className="text-2xl">0</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
};