'use client';

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import  { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { ArrowLeft, Building2, Trash2, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBusinessStore } from "@/stores/business.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";
import { InviteMemberDialog } from "@/components/business/invite-member-dialog";
import { PendingInvitations } from "@/components/business/pending-invitation";
import Link from "next/link";

const updateBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  industry: z
    .string()
    .trim()
    .min(2, 'Industry must be at least 2 characters'),
  phoneNumber: z
    .string()
    .trim()
    .min(7, 'Phone number is required'),
  email: z
    .string()
    .trim()
    .email('Valid business email required')
    .optional(),
  address: z
    .string()
    .trim()
    .min(2, 'Address is required')
    .max(200, 'Address must be less than 200 characters')
    .optional()
});

type UpdateBusinessForm = z.infer<typeof updateBusinessSchema>;

interface Props {
  params: Promise<{ businessId: string }>;
}

export default function BusinessSettingPage(props: Props) {
  const params = use(props.params)
  const businessId = params.businessId;
  const router = useRouter();

  const { user } = useAuthStore();
  const { businesses, fetchBusinesses, updateBusiness, deleteBusiness, isLoading } = useBusinessStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inviteRefreshTrigger, setInviteRefreshTrigger] = useState(0);

  const business = businesses.find(
    (b) => String(b._id) === String(businessId)
  );

  const canEdit = business?.role === 'owner' || business?.role === 'manager';
  const canDelete = business?.role === 'owner';
  const canInvite = business?.role === 'owner' || business?.role === 'manager';

  const form = useForm<UpdateBusinessForm>({
    resolver: zodResolver(updateBusinessSchema),
    defaultValues: {
      name: '',
      industry: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    fetchBusinesses();
  },[user, router, fetchBusinesses])

  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        industry: business.industry,
        phoneNumber: business.phoneNumber,
        email: business.email || '',
        address: business.address,
      })
    }
  }, [business, form]);

  const onSubmit = async (values: UpdateBusinessForm) => {
    if (!businessId) return;

    setIsSaving(true);
    try {
      await updateBusiness(businessId, values);
      toast.success('Business updated successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update business');
    } finally {
      setIsSaving(false);
    }

    
  };

  const handleDelete = async () => {
    if (!businessId) return;

    setIsDeleting(true);
    try {
      await deleteBusiness(businessId);
      toast.success('Business deleted successfully');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete business');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-2xl px-4">
          <Skeleton className="h-10 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-6xl px-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Business Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage your business details and preferences.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!canEdit} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!canEdit} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!canEdit} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!canEdit} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} disabled={!canEdit}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {canEdit && (
                      <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving} className={`${
                          isSaving ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}>
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  {/* <span className="text-muted-foreground">Slug</span>
                  <span className="font-mono">{business.slug}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Role</span>
                  <span className="capitalize">{business.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{
                    new Date(business.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Africa/Lagos'
                    })
                  }</span>
                </div>
              </CardContent>
            </Card>
            {canInvite && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-base">Team Members</CardTitle>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/business/${businessId}/team`}>
                        Manage Team
                      </Link>
                    </Button>
                    {/* <InviteMemberDialog
                      businessId={businessId!}
                      businessName={business.name}
                      onInviteSent={() => setInviteRefreshTrigger((prev) => prev + 1)}
                    /> */}
                  </div>
                  <CardDescription>
                    Invite team members to collaborate on this business.
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <PendingInvitations
                    businessId={businessId!}
                    refreshTrigger={inviteRefreshTrigger}
                  />
                </CardContent> */}
              </Card>
            )}

            {canDelete && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Once you delete a business, there is no going back. Please be certain.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isDeleting}
                        className={`${
                          isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete Business'}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          business "{business.name}" and remove all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}