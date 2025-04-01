
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterParams, User, SortParams } from "@/types/table";
import { ArrowDown, ArrowUp, Clock, Calendar, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface UserTableProps {
  users: User[];
  sort: SortParams;
  onSort: (field: string) => void;
  isLoading: boolean;
  filters?: FilterParams;
}

export const UserTable = ({ users, sort, onSort, isLoading, filters }: UserTableProps) => {
  const getSortIcon = (field: string) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  const renderSortableHeader = (field: string, label: string) => (
    <div 
      className="flex cursor-pointer items-center" 
      onClick={() => onSort(field)}
    >
      {label}
      {getSortIcon(field)}
    </div>
  );

  // Determine which columns to show based on the attendance view
  const isAttendanceView = filters?.attendanceView !== undefined;
  const showDailyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'daily';
  const showMonthlyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'monthly';
  const showQuarterlyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'quarterly';
  const showLeaveTypes = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'leaves';

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              {showDailyDeviation && <TableHead>Daily Deviation</TableHead>}
              {showMonthlyDeviation && <TableHead>Monthly Deviation</TableHead>}
              {showQuarterlyDeviation && <TableHead>Quarterly Deviation</TableHead>}
              {showLeaveTypes && <TableHead>Leave on Duty</TableHead>}
              {showLeaveTypes && <TableHead>Optional Holiday</TableHead>}
              {showLeaveTypes && <TableHead>Holiday Working</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 + 
                  (showDailyDeviation ? 1 : 0) + 
                  (showMonthlyDeviation ? 1 : 0) + 
                  (showQuarterlyDeviation ? 1 : 0) + 
                  (showLeaveTypes ? 3 : 0)
                }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{renderSortableHeader('id', 'ID')}</TableHead>
            <TableHead>{renderSortableHeader('name', 'Name')}</TableHead>
            <TableHead>{renderSortableHeader('email', 'Email')}</TableHead>
            <TableHead>{renderSortableHeader('role', 'Role')}</TableHead>
            <TableHead>{renderSortableHeader('status', 'Status')}</TableHead>
            {showDailyDeviation && <TableHead className="text-center">
              <div className="flex items-center justify-center">
                <Clock className="mr-1 h-4 w-4" />
                Daily Deviation
              </div>
            </TableHead>}
            {showMonthlyDeviation && <TableHead className="text-center">
              <div className="flex items-center justify-center">
                <Calendar className="mr-1 h-4 w-4" />
                Monthly Deviation
              </div>
            </TableHead>}
            {showQuarterlyDeviation && <TableHead className="text-center">
              <div className="flex items-center justify-center">
                <CalendarDays className="mr-1 h-4 w-4" />
                Quarterly Deviation
              </div>
            </TableHead>}
            {showLeaveTypes && <TableHead className="text-center">Leave on Duty</TableHead>}
            {showLeaveTypes && <TableHead className="text-center">Optional Holiday</TableHead>}
            {showLeaveTypes && <TableHead className="text-center">Holiday Working</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5 + 
                (showDailyDeviation ? 1 : 0) + 
                (showMonthlyDeviation ? 1 : 0) + 
                (showQuarterlyDeviation ? 1 : 0) + 
                (showLeaveTypes ? 3 : 0)
              } className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'outline'}
                    className={user.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                
                {showDailyDeviation && (
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getDeviationColor(user.attendance?.dailyDeviation || 0)}`}>
                      {formatDeviation(user.attendance?.dailyDeviation)}
                    </Badge>
                  </TableCell>
                )}
                
                {showMonthlyDeviation && (
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getDeviationColor(user.attendance?.monthlyDeviation || 0)}`}>
                      {formatDeviation(user.attendance?.monthlyDeviation)}
                    </Badge>
                  </TableCell>
                )}
                
                {showQuarterlyDeviation && (
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getDeviationColor(user.attendance?.quarterlyDeviation || 0)}`}>
                      {formatDeviation(user.attendance?.quarterlyDeviation)}
                    </Badge>
                  </TableCell>
                )}
                
                {showLeaveTypes && (
                  <TableCell className="text-center">
                    {user.attendance?.leaveOnDuty || 0}
                  </TableCell>
                )}
                
                {showLeaveTypes && (
                  <TableCell className="text-center">
                    {user.attendance?.optionalHoliday || 0}
                  </TableCell>
                )}
                
                {showLeaveTypes && (
                  <TableCell className="text-center">
                    {user.attendance?.holidayWorking || 0}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to format deviation
const formatDeviation = (deviation?: number): string => {
  if (deviation === undefined) return '0h';
  
  const sign = deviation >= 0 ? '+' : '';
  return `${sign}${deviation}h`;
};

// Helper function to get color based on deviation
const getDeviationColor = (deviation: number): string => {
  if (deviation > 5) return 'bg-green-100 text-green-800 border-green-500';
  if (deviation >= 0) return 'bg-blue-100 text-blue-800 border-blue-500';
  if (deviation >= -5) return 'bg-yellow-100 text-yellow-800 border-yellow-500';
  return 'bg-red-100 text-red-800 border-red-500';
};
