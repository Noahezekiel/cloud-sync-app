// hooks/useTokenRefresher.js
import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export function useTokenRefresher(intervalMs = 45 * 60 * 1000) {
  useEffect(() => {
    const refresh = async () => {
      try {
        // 👇 Check if a user session exists
        const session = await fetchAuthSession();
        if (!session || !session.tokens) {
          console.log("⚠️ No active session, skipping token refresh.");
          return;
        }

        // Force refresh if logged in
        await fetchAuthSession({ forceRefresh: true });
        console.log("✅ Tokens refreshed");
      } catch (err) {
        console.error("⚠️ Failed to refresh tokens", err);
      }
    };

    // Run immediately + schedule interval
    refresh();
    const id = setInterval(refresh, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);
}
