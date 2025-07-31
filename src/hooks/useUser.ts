import { useState, useEffect } from "react";
import { getUser } from "../api/user";
import type { User } from "../types/user";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser().then(setUser);
  }, []);
  return user;
};
