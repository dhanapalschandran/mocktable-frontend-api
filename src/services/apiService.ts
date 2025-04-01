
import { mockUsers } from "@/data/mockUsers";
import { FilterParams, PaginationParams, SortParams, TableResponse, User } from "@/types/table";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to filter users based on search and status
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
