import { create } from "zustand";
import { api } from "@/components/lib/api";
import type { BusinessRole } from "./business.store";
import type { ApiResponse } from "@/components/lib/api";

export interface Member {
  _id: string;
  user_id: string;
  email?: string;
  role: BusinessRole;
  status: 'active' | 'inactive';
  joined_at: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface MemberState {
  members: Member[];
  isLoading: boolean;
  error: string | null;

  fetchMembers: (businessId: string) => Promise<void>;
  updateRole: (
    businessId: string,
    staffId: string,
    role: Member['role']
  ) => Promise<void>;
  removeMember: (businessId: string, staffId: string) => Promise<void>;
  clear: () => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async (businessId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api<ApiResponse<Member[]>>(
        `/business-staff/${businessId}/staff`
      );

      set({ members: res.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch members',
        isLoading: false
      });
    }
  },

  updateRole: async (businessId, staffId, role) => {
    await api(
      `/business-staff/${businessId}/staff/${staffId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ role })
      }
    );
  },

  removeMember: async (businessId, staffId) => {
    await api(
      `/business-staff/${businessId}/staff/${staffId}`,
      { method: 'DELETE' }
    );
  },

  clear: () => set({ members: [], error: null })
}))