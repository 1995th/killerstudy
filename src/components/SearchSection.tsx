import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MobileTimer } from './MobileTimer';
import { useViewport } from '@/hooks/use-viewport';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string, filter: string) => void;
  activeTab: string;
}

export function SearchSection({ onSearch, activeTab }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { isMobile } = useViewport();

  const handleSearch = () => {
    if (!query.trim()) return;
    onSearch(query, filter);
  };

  const showMobileTimer = isMobile && activeTab !== 'goals' && activeTab !== 'settings';

  if (isMobile) {
    return showMobileTimer ? (
      <div className="flex justify-end">
        <MobileTimer />
      </div>
    ) : null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes and flashcards..."
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[100px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="flashcards">Cards</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  );
}