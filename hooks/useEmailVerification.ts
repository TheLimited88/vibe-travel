import { useEffect, useState } from 'react';

export function useEmailVerification(userId?: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const checkVerification = async () => {
      try {
        const response = await fetch('/api/auth/check-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsVerified(data.verified);
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, [userId]);

  return { isVerified, isLoading };
}
