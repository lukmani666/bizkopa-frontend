'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, LogOut, FileText, Users, Settings } from 'lucide-react';

import { useAuthStore } from '@/stores/auth.store';
import { useBusinessStore } from '@/stores/business.store';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { BusinessSwitcher } from '@/components/business/business-switcher';
import { BusinessList } from '@/components/business/business-list';
import { cn } from '@/components/lib/utils';

const DashboardPage = () => {
  const router = useRouter();

  const { user, signOut, initialized, loading } = useAuthStore();
  const { activeBusiness, clearBusinessState } = useBusinessStore();

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/auth');
    }
  }, [user, initialized, loading, router]);

  const handleSignOut = async () => {
    clearBusinessState();
    await signOut();
    router.push('/');
  };

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      icon: FileText,
      title: 'Create Invoice',
      description: 'Generate a new invoice',
      disabled: !activeBusiness,
      onClick: () => router.push('/invoices/create')
    },
    {
      icon: Users,
      title: 'Add Client',
      description: 'Add a new client to your list',
      disabled: !activeBusiness,
      onClick: () => router.push('/clients/create')
    },
    {
      icon: Settings,
      title: 'Business Settings',
      description: 'Manage your business',
      disabled: !activeBusiness,
      onClick: () =>
        activeBusiness &&
        router.push(`/business/${activeBusiness._id}/settings`)
    }
  ];

  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Bizkopa</span>
            </div>

            <div className="hidden sm:block">
              <BusinessSwitcher />
            </div>
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

        <div className="sm:hidden px-4 pb-4">
          <BusinessSwitcher />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hi, {user.last_name}!
            </h1>

            <p className="text-muted-foreground">
              {activeBusiness
                ? `Managing ${activeBusiness.name}`
                : 'Select or create a business to get started.'}
            </p>
          </div>

          {activeBusiness && (
            <>

              <h2 className="text-xl font-semibold text-foreground mb-4">
                Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="text-2xl">$0.00</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardDescription>Active Clients</CardDescription>
                    <CardTitle className="text-2xl">0</CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardDescription>Pending Invoices</CardDescription>
                    <CardTitle className="text-2xl">0</CardTitle>
                  </CardHeader>
                </Card>
              </div>

            </>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Your Businesses
            </h2>

            <BusinessList />
          </div>

          {activeBusiness && (
            <>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >

                    <Card
                      className={cn(
                        'border-border/50 bg-card/50 backdrop-blur-sm transition-all group',
                        action.disabled && 'opacity-50 pointer-events-none'
                      )}
                      onClick={action.disabled ? undefined : action.onClick}
                    >

                      <CardHeader className="pb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>

                        <CardTitle className="text-lg">
                          {action.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <CardDescription>
                          {action.description}
                        </CardDescription>
                      </CardContent>

                    </Card>

                  </motion.div>
                ))}

              </div>

            </>
          )}

        </motion.div>
      </main>

    </div>
  );
};

export default DashboardPage;
