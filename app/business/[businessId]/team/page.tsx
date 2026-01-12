'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { TeamMembersList } from "@/components/business/team-members-list";
import { InviteMemberDialog } from "@/components/business/invite-member-dialog";
import { PendingInvitations } from "@/components/business/pending-invitation";

import { useBusinessStore } from "@/stores/business.store";
import { useAuthStore } from "@/stores/auth.store";
import { BusinessRole } from "@/stores/business.store";

export default function TeamMembersPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const router = useRouter();

  const { user } = useAuthStore();
  const { businesses, fetchBusinesses, isLoading } = useBusinessStore();

  const [inviteRefreshTrigger, setInviteRefreshTrigger] = useState(0);

  const business = businesses.find(b => b._id === businessId);
  const canInvite = business?.role === 'owner' || business?.role === 'manager';

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    fetchBusinesses();
  }, [user, fetchBusinesses, router]);

  if (isLoading || !business) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 sm:px-6 max-w-5xl py-6">
          <Skeleton className="mb-6 h-10 w-40" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop centering wrapper */}
      <div className="flex min-h-screen justify-center lg:items-start">
        <div className="w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="w-full sm:w-auto justify-start"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/business/${businessId}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Business Settings
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Manage team members for {business.name}
                      </CardDescription>
                    </div>
                  </div>

                  {canInvite && (
                    <InviteMemberDialog
                      businessId={businessId}
                      businessName={business.name}
                      onInviteSent={() =>
                        setInviteRefreshTrigger(v => v + 1)
                      }
                    />
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-0 sm:px-6">
                <TeamMembersList
                  businessId={businessId}
                  currentUserRole={business.role as BusinessRole}
                />
              </CardContent>
            </Card>

            {/* Pending Invitations */}
            {canInvite && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Pending Invitations
                  </CardTitle>
                  <CardDescription>
                    Invitations that haven’t been accepted yet
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                  <PendingInvitations
                    businessId={businessId}
                    refreshTrigger={inviteRefreshTrigger}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}
