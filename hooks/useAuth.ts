import { create }          from "zustand";
import { persist }         from "zustand/middleware";
import { clearStoredAuth } from "@/lib/auth";

interface AuthState {
  token:           string | null;
  creatorId:       string | null;
  username:        string | null;
  isAuthenticated: boolean;
  setAuth:         (token: string, creatorId: string, username: string) => void;
  clearAuth:       () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token:           null,
      creatorId:       null,
      username:        null,
      isAuthenticated: false,
      setAuth: (token, creatorId, username) =>
        set({ token, creatorId, username, isAuthenticated: true }),
      clearAuth: () => {
        clearStoredAuth();
        set({ token: null, creatorId: null, username: null, isAuthenticated: false });
      },
    }),
    {
      name:       "creator_auth",
      partialize: (state) => ({
        token:     state.token,
        creatorId: state.creatorId,
        username:  state.username,
      }),
    }
  )
);
