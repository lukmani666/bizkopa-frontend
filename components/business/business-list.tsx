'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Settings, Users, Crown, Shield, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useBusinessStore } from "@/stores/business.store";
import { cn } from "../lib/utils";
import { CreateBusinessDialog } from "./create-business-dialog";

type BusinessRole = 'owner' | 'manager' | 'staff';

const roleIcons: Record<BusinessRole, React.ReactNode> = {
  owner: <Crown className="h-3 w-3" />,
  manager: <Shield className="h-3 w-3" />,
  staff: <User className="h-3 w-4" />,
};

const roleStyles: Record<BusinessRole, string> = {
  owner: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  manager: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  staff: 'bg-muted text-muted-foreground',
};

export function BusinessList() {
  const router = useRouter();

  const {
    businesses,
    activeBusiness,
    fetchBusinesses,
    setActiveBusiness,
    isLoading,
  } = useBusinessStore();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleSelectBusiness = (businessId: string) => {
    const selected = businesses.find((b) => String(b._id) === businessId);

    if (selected) {
      setActiveBusiness(selected);
      router.push(`/business/${businessId}`);
    }
  };

  const handleSettings = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/business/${businessId}/settings`);
  };

  const handleMembers = (businessId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/business/${businessId}/team`);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No businesses yet</h3>
          <p className="text-muted-foreground text-center mb-6">
            Create your first business to start managing invoices and clients.
          </p>
          {/* <Button onClick={() => router.push('/business/create')}>
            Create Business
          </Button> */}
          <CreateBusinessDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => {
        const id = String(business._id);

        return (
          <Card
            key={id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              String(activeBusiness?._id) === id && 'ring-2 ring-primary'
            )}
            onClick={() => handleSelectBusiness(id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                </div>

                <Badge
                  variant="outline"
                  className={roleStyles[business.role as BusinessRole]}
                >
                  {roleIcons[business.role as BusinessRole]}
                  <span className="ml-1 capitalize">{business.role}</span>
                </Badge>
              </div>

              {business.industry && (
                <CardDescription className="line-clamp-2">
                  {business.industry}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer"
                  onClick={(e) => handleSettings(id, e)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>

                {(business.role === 'owner' || business.role === 'manager') && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => handleMembers(id, e)}
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card
        className={cn(
          "border-dashed cursor-pointer transition-all duration-200",
          "hover:border-primary/50 hover:bg-card/80"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-45 cursor-pointer">
          <div
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Building2 className="h-8 w-8 mb-2" />
            {/* <span className="text-sm font-medium">Add Business</span> */}
            <CreateBusinessDialog />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}