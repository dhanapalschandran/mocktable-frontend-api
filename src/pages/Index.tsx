
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader } from "@/components/DataTable/TableHeader";
import { TablePagination } from "@/components/DataTable/TablePagination";
import { UserTable } from "@/components/DataTable/UserTable";
import { getUsers } from "@/services/apiService";
import { FilterParams, PaginationParams, SortParams, User } from "@/types/table";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  // State for table data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for pagination
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: 10,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  
  // State for sorting
  const [sort, setSort] = useState<SortParams>({
    field: 'id',
    direction: 'asc',
  });
  
  // State for filtering
  const [filters, setFilters] = useState<FilterParams>({});
  
  const { toast } = useToast();

  // Function to handle sort changes
  const handleSort = (field: string) => {
    setSort((prevSort) => ({
      field,
      direction:
        prevSort.field === field && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Function to handle page changes
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Function to handle page size changes
  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  // Function to handle search/filter changes
  const handleSearch = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Fetch users data
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers(pagination, sort, filters);
      setUsers(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.pageSize, sort, filters]);

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableHeader onSearch={handleSearch} isLoading={isLoading} />
          
          <UserTable 
            users={users} 
            sort={sort} 
            onSort={handleSort} 
            isLoading={isLoading}
            filters={filters}
          />
          
          <TablePagination
            currentPage={pagination.page}
            pageSize={pagination.pageSize}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
