import React, { useState, useEffect } from 'react';

interface UserProfileProps {
  userId: string;
}

interface User {
  name: string;
  email: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData: User = await response.json();
        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      }
    };
    fetchData();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
