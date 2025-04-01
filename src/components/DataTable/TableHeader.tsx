
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterParams } from "@/types/table";
import { Search } from "lucide-react";
import { useState } from "react";

interface TableHeaderProps {
  onSearch: (filters: FilterParams) => void;
  isLoading: boolean;
}

export const TableHeader = ({ onSearch, isLoading }: TableHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      status: status || undefined
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
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
  );
};
