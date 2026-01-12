'use client';

import { useEffect, useState } from "react";
import { Mail, Clock, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { api } from "../lib/api";

interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: string;
  createdAt: string;
}

interface PendingInvitationsProps {
  businessId: string;
  refreshTrigger?: number;
}

export function PendingInvitations({
  businessId,
  refreshTrigger,
}: PendingInvitationsProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const res = await api<{ data: Invitation[] }>(
        `/business-staff/${businessId}/invites?status=pending`
      );
      setInvitations(res.data || []);
    } catch (error: any) {
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [businessId, refreshTrigger]);

  const cancelInvitation = async (invitedId: string) => {
    try {
      await api(
        `/business-staff/${businessId}/invites/${invitedId}/cancel`,
        { method: 'POST'}
      );
      toast.success('Invitation cancelled');
      fetchInvitations();
    } catch {
      toast.error('Failed to cancel invitation');
    }
  };

  const resendInvitation = async (invitedId: string) => {
    try {
      await api(
        `/business-staff/${businessId}/invites/${invitedId}/resend`,
        { method: 'POST' }
      );
      toast.success('Invitation resent');
    } catch {
      toast.error('Failed to resend invitation');
    }
  };

  const isExpired = (expiresAt: string) => 
    new Date(expiresAt) < new Date();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) return null;

  return (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm font-medium">
        <Mail className="h-4 w-4 text-muted-foreground" />
        Pending Invitations
      </CardTitle>
      <CardDescription className="text-xs">
        Invitations waiting to be accepted
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-2">
      {invitations.map((invite) => {
        const expired = isExpired(invite.expiresAt);

        return (
          <div
            key={invite._id}
            className="
              group flex items-center justify-between
              rounded-md border px-3 py-2
              transition-colors
              hover:bg-muted/40
            "
          >
            {/* LEFT */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {invite.email}
              </p>

              <div className="mt-0.5 flex items-center gap-2 text-xs">
                <Badge
                  variant="outline"
                  className="capitalize text-[11px]"
                >
                  {invite.role}
                </Badge>

                {expired ? (
                  <span className="flex items-center gap-1 text-destructive">
                    <Clock className="h-3 w-3" />
                    Expired
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(invite.expiresAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Africa/Lagos'
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT – actions */}
            <div
              className="
                flex items-center gap-1
                opacity-100 lg:opacity-0
                transition-opacity
                group-hover:opacity-100
              "
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => resendInvitation(invite._id)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => cancelInvitation(invite._id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
  );


}