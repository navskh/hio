'use client';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

export default function SearchInput() {
  const router = useRouter();

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="물품 검색..."
        className="w-[250px] pl-8"
        onKeyDown={e => {
          if (e.key === 'Enter') {
            router.push(`/search?q=${e.currentTarget.value}`);
          }
        }}
      />
    </div>
  );
}

