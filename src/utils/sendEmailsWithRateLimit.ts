// Add this helper function above the useCreateLeague hook
const sendEmailsWithRateLimit = async (
  players: Player[],
  leagueName: string,
  user: any
) => {
  const results = [];

  for (const player of players) {
    try {
      await sendEmail({
        to: player.email,
        subject: `You've been added to ${leagueName}`,
        html: `
          <p>You've been added to ${leagueName} by ${user?.name || user?.email}.</p>
          <p>You can view the league and manage your settings by downloading the Club Season app in the app store.</p>
          `,
      });
      results.push({ success: true, email: player.email });

      // Wait 600ms between emails (allows ~1.67 emails per second, under the 2/second limit)
      if (players.indexOf(player) < players.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
    } catch (error) {
      console.error(`Failed to send email to ${player.email}:`, error);
      results.push({
        success: false,
        email: player.email,
        error: error.message,
      });
    }
  }

  return results;
};
