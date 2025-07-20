import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        // Use apiRequest which should include credentials
        const response = await fetch("/api/auth/user", {
          method: "GET",
          credentials: "include", // Critical - sends the auth cookie
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        return response.json();
      } catch (err) {
        console.error("Auth check failed:", err);
        return null;
      }
    },
    retry: false,
    // Don't refetch too often to avoid redirect loops
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("Auth state:", { user, isLoading, error }); // Debug log

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
