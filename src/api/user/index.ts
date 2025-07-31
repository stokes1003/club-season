import { getAuthUser } from "./getAuthUser";
import { getLeagueMemberships } from "./getLeagueMemberships";
import { transformUserData } from "./transformUserData";

export async function getUser() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      console.error("No auth user found");
      return null;
    }

    const leaguePlayers = await getLeagueMemberships(authUser.id);

    // Always return a valid user object, even if league data fails
    return transformUserData(authUser, leaguePlayers || []);
  } catch (error) {
    console.error("Unexpected error in getUser:", error);
    return null;
  }
}
