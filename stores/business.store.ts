import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/components/lib/api';

export type BusinessRole = 'owner' | 'manager' | 'staff';

interface Business {
  _id: string;
  owner: string;
  name: string;
  industry: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  isActive: boolean;

  // NEW – role from BusinessStaff
  role?: BusinessRole;

  // NEW – explicit permissions from invite
  permissions?: string[];
  createdAt: string;
}

interface BusinessState {
  businesses: Business[];
  activeBusiness: Business | null;
  isLoading: boolean;
  error: string | null;

  fetchBusinesses: () => Promise<void>;
  setActiveBusiness: (business: Business | null) => void;
  createBusiness: (payload: Partial<Business>) => Promise<void>;
  updateBusiness: (id: string, payload: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  clearBusinessState: () => void;
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: [],
      activeBusiness: null,
      isLoading: false,
      error: null,

      fetchBusinesses: async () => {
        set({ isLoading: true, error: null });

        try {
          // This endpoint MUST be updated in backend
          // to return user staff role together with business
          const res = await api<{ data: Business[] }>('/business');

          const businesses = res.data.map((biz) => ({
            ...biz,
            _id: String(biz._id)
          }));

          const currentActive = get().activeBusiness;

          const activeStillValid =
            currentActive &&
            businesses.some((b) => b._id === currentActive._id);

          set({
            businesses,
            activeBusiness: activeStillValid
              ? businesses.find((b) => b._id === currentActive._id) || null
              : businesses[0] || null,
            isLoading: false
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to fetch businesses',
            isLoading: false
          });
        }
      },

      setActiveBusiness: (business) => {
        set({ activeBusiness: business });
      },

      createBusiness: async (payload) => {
        try {
          await api('/business', {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          await get().fetchBusinesses();
        } catch (error: any) {
          set({ error: error.message || 'Failed to create business' });
          throw error;
        }
      },

      updateBusiness: async (id, payload) => {
        try {
          await api(`/business/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
          });

          await get().fetchBusinesses();
        } catch (error: any) {
          set({ error: error.message || 'Failed to update business' });
          throw error;
        }
      },

      deleteBusiness: async (id) => {
        try {
          await api(`/business/${id}`, {
            method: 'DELETE'
          });

          await get().fetchBusinesses();
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete business' });
          throw error;
        }
      },

      clearBusinessState: () => {
        set({
          businesses: [],
          activeBusiness: null,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'bizkopa-business',
      partialize: (state) => ({
        activeBusiness: state.activeBusiness
      })
    }
  )
);
