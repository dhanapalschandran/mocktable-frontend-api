
import { mockUsers } from "@/data/mockUsers";
import { FilterParams, PaginationParams, SortParams, TableResponse, User } from "@/types/table";
import { isAfter, isBefore, isWithinInterval, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to filter users based on search, status and date range
const filterUsers = (users: User[], filters: FilterParams): User[] => {
  let filteredUsers = [...users];
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status) {
    filteredUsers = filteredUsers.filter(user => user.status === filters.status);
  }
  
  // Apply date range filter if specified
  if (filters.dateRangeType || (filters.dateRange && (filters.dateRange.from || filters.dateRange.to))) {
    filteredUsers = filteredUsers.filter(user => {
      const joinDate = parseISO(user.joinDate);
      
      // Apply filter based on dateRangeType
      if (filters.dateRangeType === 'weekly' && filters.dateRange?.from) {
        const weekStart = startOfWeek(filters.dateRange.from);
        const weekEnd = endOfWeek(filters.dateRange.from);
        return isWithinInterval(joinDate, { start: weekStart, end: weekEnd });
      }
      
      if (filters.dateRangeType === 'monthly' && filters.dateRange?.from) {
        const monthStart = startOfMonth(filters.dateRange.from);
        const monthEnd = endOfMonth(filters.dateRange.from);
        return isWithinInterval(joinDate, { start: monthStart, end: monthEnd });
      }
      
      // Custom date range
      if (filters.dateRange) {
        if (filters.dateRange.from && filters.dateRange.to) {
          return isWithinInterval(joinDate, { 
            start: filters.dateRange.from, 
            end: filters.dateRange.to 
          });
        } else if (filters.dateRange.from) {
          return isAfter(joinDate, filters.dateRange.from) || joinDate.getTime() === filters.dateRange.from.getTime();
        } else if (filters.dateRange.to) {
          return isBefore(joinDate, filters.dateRange.to) || joinDate.getTime() === filters.dateRange.to.getTime();
        }
      }
      
      return true;
    });
  }
  
  return filteredUsers;
};

// Function to sort users
const sortUsers = (users: User[], sort: SortParams): User[] => {
  return [...users].sort((a, b) => {
    const aValue = a[sort.field as keyof User];
    const bValue = b[sort.field as keyof User];
    
    if (aValue < bValue) {
      return sort.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Function to paginate users
const paginateUsers = (users: User[], pagination: PaginationParams): User[] => {
  const { page, pageSize } = pagination;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return users.slice(start, end);
};

// Main function to get users with filtering, sorting, and pagination
export const getUsers = async (
  pagination: PaginationParams = { page: 1, pageSize: 10 },
  sort: SortParams = { field: 'id', direction: 'asc' },
  filters: FilterParams = {}
): Promise<TableResponse<User>> => {
  // Simulate API delay
  await delay(800);
  
  // Apply filters
  let users = filterUsers(mockUsers, filters);
  
  // Apply sorting
  users = sortUsers(users, sort);
  
  // Calculate total and pages
  const total = users.length;
  const totalPages = Math.ceil(total / pagination.pageSize);
  
  // Apply pagination
  const paginatedUsers = paginateUsers(users, pagination);
  
  // Return table response
  return {
    data: paginatedUsers,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages,
  };
};
