'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle,
  XCircle,
  Loader2,
  Building2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/components/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { useBusinessStore } from "@/stores/business.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type InvitationStatus = 
  | 'loading'
  | 'pending'
  | 'accepted'
  | 'expired'
  | 'not-found'
  | 'error';

interface InvitationDetails {
  email: string;
  role: string;
  businessName: string;
  status: string,
  expiresAt: string;
}

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { user, loading: authLoading } = useAuthStore();
  const { fetchBusinesses } = useBusinessStore();

  const [status, setStatus] = useState<InvitationStatus>('loading');
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);
  const redirectUrl = encodeURIComponent(
    `/invite/accept?token=${token}`
  );

  useEffect(() => {
    const loadInvite = async () => {
      if (!token) {
        setStatus('not-found');
        return;
      }

      try {
        const res = await api<{ data: InvitationDetails }>(`/business-staff/invites/validate?token=${token}`);
        
        const data = res.data;

        if (data.status === 'accepted') {
          setStatus('accepted');
          return;
        }

        if (data.status !== 'pending') {
          setStatus('expired');
          return;
        }

        setInvitation({
          email: data.email,
          role: data.role,
          businessName: data.businessName,
          status: data.status,
          expiresAt: data.expiresAt,
        });

        setStatus('pending');
      } catch (err: any) {
        setStatus(
          err.message?.includes('expired')
            ? 'expired'
            : 'not-found'
        );
      }
    };

    loadInvite();
  }, [token]);

  const acceptInvitation = async () => {
    if (!token || !user) return;

    setIsAccepting(true);
    try {
      await api('/business-staff/accept', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });

      setStatus('accepted');
      await fetchBusinesses();

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to accept invitation.');
      setStatus('error');
    } finally {
      setIsAccepting(false);
    }
  };

  if (authLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user && status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>You're Invited!</CardTitle>
            <CardDescription>
              You've been invited to join <strong>{invitation?.businessName}</strong> as a{' '}
              <strong>{invitation?.role}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Please sign in or create an account to accept this invitation.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={`/auth?redirect=${redirectUrl}`}>Sign In / Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'pending' && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Join {invitation?.businessName}</CardTitle>
            <CardDescription>
              You've been invited to join as a <strong className="capitalize">{invitation?.role}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invited as</span>
                <span className="font-medium">{invitation?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{invitation?.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className="font-medium">
                  {invitation?.expiresAt && new Date(invitation.expiresAt).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'Africa/Lagos'
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={acceptInvitation} disabled={isAccepting}>
                {isAccepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  'Accept Invitation'
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Decline</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

   // Already accepted
  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invitation Accepted!</h2>
            <p className="text-muted-foreground text-center mb-6">
              You've successfully joined the team. Redirecting to dashboard...
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Expired
  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invitation Expired</h2>
            <p className="text-muted-foreground text-center mb-6">
              This invitation has expired or been cancelled. Please ask for a new invitation.
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12">
          <XCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {status === 'not-found' ? 'Invitation Not Found' : 'Something Went Wrong'}
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            {error || "We couldn't find this invitation. It may have been deleted or the link is invalid."}
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

}