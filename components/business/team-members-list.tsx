'use client';

import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { MoreHorizontal, ShieldCheck, User, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../ui/alert-dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

import { useAuthStore } from "@/stores/auth.store";
import { useMemberStore } from "@/stores/member.store";
import type { Member } from "@/stores/member.store";
import type { BusinessRole } from "@/stores/business.store";

interface TeamMembersListProps {
  businessId: string;
  currentUserRole: BusinessRole;
}

const roleConfig: Record<
  BusinessRole,
  { label: string; icon: any; variant: 'default' | 'secondary' | 'outline' }
> = {
  owner: { label: 'Owner', icon: Crown, variant: 'default' },
  manager: { label: 'Manager', icon: ShieldCheck, variant: 'secondary' },
  staff: { label: 'Staff', icon: User, variant: 'outline' }
};

export function TeamMembersList({
  businessId,
  currentUserRole
}: TeamMembersListProps) {
  const { user } = useAuthStore();
  const {
    members,
    isLoading,
    fetchMembers,
    updateRole,
    removeMember
  } = useMemberStore();

  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const isOwner = currentUserRole === 'owner';
  const isManager = isOwner || currentUserRole === 'manager';

  useEffect(() => {
    fetchMembers(businessId);
  }, [businessId, fetchMembers]);

  const canManageMember = (member: Member) => {
    if (member.user_id === user?._id) return false;
    if (member.role === 'owner') return false;
    if (member.role === 'manager' && !isOwner) return false;
    return isManager;
  }

  const handleUpdateRole = async (
    memberId: string,
    role: BusinessRole
  ) => {
    setIsUpdating(memberId);
    try {
      await updateRole(businessId, memberId, role);
      toast.success('Role updated successfully');
      await fetchMembers(businessId);
    } catch {
      toast.error('Failed to update role');
    } finally {
      setIsUpdating(null)
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);
    try {
      await removeMember(businessId, memberToRemove._id);
      toast.success('Member removed');
      setMemberToRemove(null);
      await fetchMembers(businessId);
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setIsRemoving(false);
    }
  };

  const getInitials = (name: string | null) => 
    name 
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : '?';
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No team members found
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {members.map((member) => {
          const config = roleConfig[member.role];
          const RoleIcon = config.icon;
          const isCurrentUser = member.user_id === user?._id;

          return (
            <div
              key={member._id}
              className="rounded-xl border bg-card p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs">
                    {getInitials(member.profile.full_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-medium">
                    {member.profile.full_name || 'Unknown User'}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </p>

                  <Badge variant={config.variant} className="mt-1 gap-1 w-fit">
                    <RoleIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>

                {isManager && canManageMember(member) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {isOwner && member.role !== 'manager' && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateRole(member._id, 'manager')
                          }
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      )}

                      {isOwner && member.role === 'manager' && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleUpdateRole(member._id, 'staff')
                          }
                        >
                          <User className="mr-2 h-4 w-4" />
                          Make Member
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setMemberToRemove(member)}
                      >
                        Remove from team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Joined{' '}
                {new Date(member.joined_at).toLocaleDateString('en-NG', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= TABLET & DESKTOP ================= */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>

              {/* Desktop only */}
              <TableHead className="hidden lg:table-cell">
                Joined
              </TableHead>

              {isManager && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.map((member) => {
              const config = roleConfig[member.role];
              const RoleIcon = config.icon;
              const isCurrentUser = member.user_id === user?._id;

              return (
                <TableRow key={member._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="text-xs">
                          {getInitials(member.profile.full_name)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-medium">
                        {member.profile.full_name || 'Unknown User'}
                        {isCurrentUser && (
                          <span className="ml-1 text-muted-foreground">
                            (you)
                          </span>
                        )}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>

                  <TableCell>
                    <Badge variant={config.variant} className="gap-1">
                      <RoleIcon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {new Date(member.joined_at).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>

                  {isManager && (
                    <TableCell>
                      {canManageMember(member) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isUpdating === member._id}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {isOwner && member.role !== 'manager' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(member._id, 'manager')
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Make Admin
                              </DropdownMenuItem>
                            )}

                            {isOwner && member.role === 'manager' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(member._id, 'staff')
                                }
                              >
                                <User className="mr-2 h-4 w-4" />
                                Make Member
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setMemberToRemove(member)}
                            >
                              Remove from team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>
                {memberToRemove?.profile.full_name || 'this member'}
              </strong>{' '}
              from this business?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={isRemoving}
              className="bg-destructive"
            >
              {isRemoving ? 'Removing…' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}