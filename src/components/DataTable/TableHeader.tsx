
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterParams } from "@/types/table";
import { AlertTriangle, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TableHeaderProps {
  onSearch: (filters: FilterParams) => void;
  isLoading: boolean;
}

export const TableHeader = ({ onSearch, isLoading }: TableHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [attendanceView, setAttendanceView] = useState<string>("all");
  const [deviationFilter, setDeviationFilter] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      status: status || undefined,
      attendanceView: attendanceView === "all" ? undefined : attendanceView,
      deviationFilter: deviationFilter || undefined
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="deviations" className="relative">
            Deviations
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">!</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full"
              />
              <Button 
                type="submit" 
                onClick={handleSearch}
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={handleSearch}
                disabled={isLoading}
              >
                Apply
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Select
                value={attendanceView}
                onValueChange={(value) => {
                  setAttendanceView(value);
                  onSearch({
                    search: searchTerm,
                    status: status || undefined,
                    attendanceView: value === "all" ? undefined : value,
                    deviationFilter: deviationFilter || undefined
                  });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View attendance by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="daily">Daily Deviation</SelectItem>
                  <SelectItem value="monthly">Monthly Deviation</SelectItem>
                  <SelectItem value="quarterly">Quarterly Deviation</SelectItem>
                  <SelectItem value="leaves">Leave Types</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="deviations" className="space-y-4">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Select
                value={deviationFilter}
                onValueChange={(value) => {
                  setDeviationFilter(value);
                  onSearch({
                    search: searchTerm,
                    status: status || undefined,
                    attendanceView: attendanceView === "all" ? undefined : attendanceView,
                    deviationFilter: value || undefined
                  });
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by deviation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Deviations</SelectItem>
                  <SelectItem value="consecutiveCrossOffice">Cross Office (5+ Days)</SelectItem>
                  <SelectItem value="consecutiveAbsent">Absent (3+ Days)</SelectItem>
                  <SelectItem value="excessiveOnDuty">Excessive On Duty (>10%)</SelectItem>
                  <SelectItem value="insufficientOnDuty">Less than 15 Days On Duty</SelectItem>
                  <SelectItem value="noLeaveInQuarter">No Leave in Quarter</SelectItem>
                  <SelectItem value="onlyCompOff">Only Comp Off (Ratnagiri)</SelectItem>
                  <SelectItem value="excessivePresent">Excessive Present (5+ Days)</SelectItem>
                  <SelectItem value="wfhMarkedAsOnDuty">WFH as On Duty</SelectItem>
                  <SelectItem value="onDutyWithLongHours">On Duty with 9+ Hours</SelectItem>
                  <SelectItem value="missingOutcomeReports">Missing Outcome Reports</SelectItem>
                  <SelectItem value="topDeviator">Top 10 Deviators</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="default" 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  setDeviationFilter("all");
                  onSearch({
                    search: searchTerm,
                    status: status || undefined,
                    attendanceView: attendanceView === "all" ? undefined : attendanceView,
                    deviationFilter: "all"
                  });
                }}
                disabled={isLoading}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Show All Deviations
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
