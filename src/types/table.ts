
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
  lastActive: string;
  attendance?: AttendanceMetrics;
}

export interface AttendanceMetrics {
  dailyDeviation?: number;
  monthlyDeviation?: number;
  quarterlyDeviation?: number;
  leaveOnDuty?: number;
  optionalHoliday?: number;
  holidayWorking?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  attendanceView?: string;
}

export interface TableResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
