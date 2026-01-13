import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage() {
  const navigate = useNavigate();

  useEffect((): void => {
    const verifyToken = async (): Promise<void> => {
      const token: string | null = localStorage.getItem("access_token");
      console.log(token);

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response: Response = await fetch(
          "http://localhost:8000/verify-token",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div>
      This is a protected page. Only visible to authenticated users.
    </div>
  );
}

export default ProtectedPage;
