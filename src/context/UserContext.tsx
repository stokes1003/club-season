import React, { createContext, useContext, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getUser } from "../api/user";
import { User } from "../types/user";
import { linkUserToInvites } from "../api/linkUserToInvites";

type UserContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshTrigger: number;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUser = async () => {
    if (session?.user) {
      const user = await getUser();
      setUser(user);
      // Increment trigger to notify other contexts
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // This is used to link users to their invites. It is called when the user is logged in.
  useEffect(() => {
    if (session?.user) {
      getUser().then(async (user) => {
        setUser(user);
        if (user?.email && user?.id) {
          try {
            const inviteResult = await linkUserToInvites(user.email, user.id);
            if (inviteResult.claimedCount > 0) {
              // Increment trigger to notify other contexts
              setRefreshTrigger((prev) => prev + 1);
            }
          } catch (error) {
            console.error("Failed to claim pending invites:", error);
          }
        }
      });
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <UserContext.Provider
      value={{ user, session, loading, refreshTrigger, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
