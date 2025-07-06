import { useState, useEffect } from "react";
import { getUser } from "../../src/api/getUser";
import { User } from "../../src/types/user";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser().then(setUser);
  }, []);
  return user;
};
