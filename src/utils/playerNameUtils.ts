export function getPlayerDisplayName(
  playerName: string,
  allPlayerNames: string[] = [],
  playerIndex?: number
): string {
  const firstName = playerName.split(" ")[0];
  const lastName = playerName.split(" ")[1];

  // Check if another player has the same first name
  const hasDuplicateFirstName = allPlayerNames.some(
    (otherName, otherIndex) =>
      otherIndex !== playerIndex && otherName.split(" ")[0] === firstName
  );

  let displayName =
    firstName.length > 10 ? firstName.substring(0, 8) + "..." : firstName;

  // Add first letter of last name if there's a duplicate first name and we have a last name
  if (hasDuplicateFirstName && lastName && lastName.length > 0) {
    displayName =
      displayName.length > 10
        ? firstName.substring(0, 7) + lastName[0] + "..."
        : firstName + " " + lastName[0];
  }

  return displayName;
}

export function getPlayerDisplayNames(players: { name: string }[]): string[] {
  const allNames = players.map((p) => p.name);

  return players.map((player, index) =>
    getPlayerDisplayName(player.name, allNames, index)
  );
}
