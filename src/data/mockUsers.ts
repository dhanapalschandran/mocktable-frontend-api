
import { User } from "@/types/table";

// Generate a list of 100 mock users
export const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const roles = ['Admin', 'Editor', 'Viewer', 'Guest'];
  const statuses: ['active', 'inactive'] = ['active', 'inactive'];
  
  // Generate a random date within the last 2 years
  const getRandomDate = () => {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  };

  // Generate a more recent date for last active
  const getRecentDate = () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  };

  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    joinDate: getRandomDate(),
    lastActive: getRecentDate(),
  };
});
