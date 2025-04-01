
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

  // Generate random attendance data
  const generateRandomAttendance = (userId: number) => {
    // Make some users have deviations based on their ID
    const hasDeviations = userId % 5 === 0 || userId % 7 === 0;
    
    const dailyDeviation = Math.floor(Math.random() * 21) - 10;
    const monthlyDeviation = Math.floor(Math.random() * 41) - 20;
    const quarterlyDeviation = Math.floor(Math.random() * 61) - 30;
    
    const leaveOnDuty = Math.floor(Math.random() * 5);
    const optionalHoliday = Math.floor(Math.random() * 3);
    const holidayWorking = Math.floor(Math.random() * 2);
    
    // Create deviation flags based on user ID to distribute different types
    const deviationFlags = hasDeviations ? {
      consecutiveCrossOffice: userId % 10 === 0,
      consecutiveAbsent: userId % 12 === 0,
      excessiveOnDuty: userId % 15 === 0,
      insufficientOnDuty: userId % 18 === 0,
      noLeaveInQuarter: userId % 20 === 0,
      onlyCompOff: userId % 22 === 0,
      excessivePresent: userId % 25 === 0,
      wfhMarkedAsOnDuty: userId % 28 === 0,
      onDutyWithLongHours: userId % 30 === 0,
      missingOutcomeReports: userId % 33 === 0,
      topDeviator: userId % 40 === 0,
    } : undefined;
    
    return {
      dailyDeviation,
      monthlyDeviation,
      quarterlyDeviation,
      leaveOnDuty,
      optionalHoliday,
      holidayWorking,
      deviationFlags
    };
  };

  return {
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: Math.random() > 0.3 ? 'active' : 'inactive',
    joinDate: getRandomDate(),
    lastActive: getRecentDate(),
    attendance: generateRandomAttendance(id)
  };
});
