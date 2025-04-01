
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterParams, User, SortParams } from "@/types/table";
import { AlertTriangle, ArrowDown, ArrowUp, Clock, Calendar, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Determine which columns to show based on filters
  const isAttendanceView = filters?.attendanceView !== undefined;
  const isDeviationView = filters?.deviationFilter !== undefined;
  
  const showDailyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'daily';
  const showMonthlyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'monthly';
  const showQuarterlyDeviation = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'quarterly';
  const showLeaveTypes = !isAttendanceView || filters?.attendanceView === 'all' || filters?.attendanceView === 'leaves';
  const showDeviations = isDeviationView || filters?.deviationFilter === 'all';

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
              {showDeviations && <TableHead>Deviation Flags</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 + 
                  (showDailyDeviation ? 1 : 0) + 
                  (showMonthlyDeviation ? 1 : 0) + 
                  (showQuarterlyDeviation ? 1 : 0) + 
                  (showLeaveTypes ? 3 : 0) + 
                  (showDeviations ? 1 : 0)
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

  // Helper function to check if a user matches the deviation filter
  const matchesDeviationFilter = (user: User, filter?: string): boolean => {
    if (!filter || filter === 'all') return true;
    if (!user.attendance?.deviationFlags) return false;
    
    return !!user.attendance.deviationFlags[filter as keyof typeof user.attendance.deviationFlags];
  };

  // Filter users based on deviation filter if needed
  const filteredUsers = isDeviationView && filters?.deviationFilter && filters.deviationFilter !== 'all'
    ? users.filter(user => matchesDeviationFilter(user, filters.deviationFilter))
    : users;

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
            {showDeviations && <TableHead className="text-center">
              <div className="flex items-center justify-center">
                <AlertTriangle className="mr-1 h-4 w-4 text-red-500" />
                Deviation Flags
              </div>
            </TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5 + 
                (showDailyDeviation ? 1 : 0) + 
                (showMonthlyDeviation ? 1 : 0) + 
                (showQuarterlyDeviation ? 1 : 0) + 
                (showLeaveTypes ? 3 : 0) + 
                (showDeviations ? 1 : 0)
              } className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
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
                
                {showDeviations && (
                  <TableCell className="text-center">
                    {user.attendance?.deviationFlags ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        <TooltipProvider>
                          {user.attendance.deviationFlags.consecutiveCrossOffice && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">CO</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Cross Office for 5+ consecutive days</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.consecutiveAbsent && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">AB</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Absent for 3+ consecutive days in a month</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.excessiveOnDuty && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">EOD</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Excessive On Duty (>10% in a month)</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.insufficientOnDuty && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">IOD</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Less than 15 days On Duty in a month</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.noLeaveInQuarter && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">NLQ</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>No leave taken in a quarter</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.onlyCompOff && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">OCO</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Only comp off and no leave in month (Ratnagiri)</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.excessivePresent && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">EP</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>More than 5 days present in office in a month</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.wfhMarkedAsOnDuty && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">WFH</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Work from Home marked as On Duty</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.onDutyWithLongHours && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">9HR</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>On Duty with 9+ hours of work</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.missingOutcomeReports && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">MOR</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Missing outcome reports for On Duty</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {user.attendance.deviationFlags.topDeviator && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="destructive" className="text-xs">TOP10</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Among top 10 deviators for last 3 months</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TooltipProvider>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-green-100 text-green-800">No Deviations</Badge>
                    )}
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
