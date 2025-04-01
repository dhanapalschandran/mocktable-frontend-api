
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterParams } from "@/types/table";
import { AlertTriangle, Calendar, CalendarDays, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TableHeaderProps {
  onSearch: (filters: FilterParams) => void;
  isLoading: boolean;
}

export const TableHeader = ({ onSearch, isLoading }: TableHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");
  const [attendanceView, setAttendanceView] = useState<string>("all");
  const [deviationFilter, setDeviationFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [dateRangeType, setDateRangeType] = useState<"custom" | "weekly" | "monthly">("custom");

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      status: status || undefined,
      attendanceView: attendanceView === "all" ? undefined : attendanceView,
      deviationFilter: deviationFilter || undefined,
      dateRange,
      dateRangeType
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handler for date range type selection
  const handleDateRangeTypeChange = (value: "custom" | "weekly" | "monthly") => {
    setDateRangeType(value);
    
    // When switching to weekly or monthly, default to current period if no date is selected
    if ((value === "weekly" || value === "monthly") && !dateRange.from) {
      setDateRange({ from: new Date(), to: undefined });
    }
    
    // Apply filter after changing the type
    onSearch({
      search: searchTerm,
      status: status || undefined,
      attendanceView: attendanceView === "all" ? undefined : attendanceView,
      deviationFilter: deviationFilter || undefined,
      dateRange,
      dateRangeType: value
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="dateRange">Date Range</TabsTrigger>
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
        
        <TabsContent value="dateRange" className="space-y-4">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col space-y-4 w-full">
              <RadioGroup 
                defaultValue="custom" 
                value={dateRangeType}
                onValueChange={(value) => handleDateRangeTypeChange(value as "custom" | "weekly" | "monthly")}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom Range</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
              
              <div className="flex flex-wrap gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRangeType === "weekly" ? (
                          `Week of ${format(dateRange.from, "PP")}`
                        ) : dateRangeType === "monthly" ? (
                          format(dateRange.from, "MMMM yyyy")
                        ) : (
                          format(dateRange.from, "PPP")
                        )
                      ) : (
                        <span>Pick a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => {
                        setDateRange(prev => ({ ...prev, from: date }));
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                {dateRangeType === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "PPP") : <span>Pick an end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => {
                          setDateRange(prev => ({ ...prev, to: date }));
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                <Button 
                  variant="default" 
                  onClick={handleSearch}
                  disabled={isLoading || (!dateRange.from && !dateRange.to)}
                >
                  Apply Date Filter
                </Button>
                
                {(dateRange.from || dateRange.to) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDateRange({});
                      onSearch({
                        search: searchTerm,
                        status: status || undefined,
                        attendanceView: attendanceView === "all" ? undefined : attendanceView,
                        deviationFilter: deviationFilter || undefined
                      });
                    }}
                  >
                    Clear Dates
                  </Button>
                )}
              </div>
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
                    deviationFilter: deviationFilter || undefined,
                    dateRange,
                    dateRangeType
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
                    deviationFilter: value || undefined,
                    dateRange,
                    dateRangeType
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
                  <SelectItem value="excessiveOnDuty">Excessive On Duty ({">"}10%)</SelectItem>
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
                    deviationFilter: "all",
                    dateRange,
                    dateRangeType
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
