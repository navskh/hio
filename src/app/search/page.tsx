'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, SearchIcon, Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 모든 물품 데이터 (실제로는 데이터베이스에서 가져올 것)
const allItems = [
  {
    id: '1',
    name: '소파',
    category: '가구',
    tags: ['거실', '브라운', '가죽'],
    location: '거실',
    houseId: '1',
    houseName: '메인 하우스',
  },
  {
    id: '2',
    name: 'TV',
    category: '전자제품',
    tags: ['거실', '삼성', '55인치'],
    location: '거실',
    houseId: '1',
    houseName: '메인 하우스',
  },
  {
    id: '3',
    name: '냉장고',
    category: '전자제품',
    tags: ['주방', 'LG', '양문형'],
    location: '주방',
    houseId: '1',
    houseName: '메인 하우스',
  },
  {
    id: '4',
    name: '침대',
    category: '가구',
    tags: ['침실', '퀸사이즈'],
    location: '침실',
    houseId: '2',
    houseName: '별장',
  },
  {
    id: '5',
    name: '책상',
    category: '가구',
    tags: ['서재', '원목'],
    location: '서재',
    houseId: '3',
    houseName: '오피스텔',
  },
  {
    id: '6',
    name: '의자',
    category: '가구',
    tags: ['서재', '가죽'],
    location: '서재',
    houseId: '3',
    houseName: '오피스텔',
  },
  {
    id: '7',
    name: '수납장',
    category: '가구',
    tags: ['창고', '플라스틱'],
    location: '창고',
    houseId: '4',
    houseName: '창고',
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof allItems>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allItems.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)),
    );

    setSearchResults(results);
    setHasSearched(true);
  };

  // 카테고리별로 결과 그룹화
  const resultsByCategory = searchResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allItems>);

  // 집별로 결과 그룹화
  const resultsByHouse = searchResults.reduce((acc, item) => {
    if (!acc[item.houseName]) {
      acc[item.houseName] = [];
    }
    acc[item.houseName].push(item);
    return acc;
  }, {} as Record<string, typeof allItems>);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">물품 검색</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="물품명, 카테고리, 태그 등으로 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button onClick={handleSearch}>검색</Button>
        </div>

        {hasSearched && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              검색 결과: {searchResults.length}개
            </h2>

            {searchResults.length > 0 ? (
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">전체 결과</TabsTrigger>
                  <TabsTrigger value="category">카테고리별</TabsTrigger>
                  <TabsTrigger value="house">집별</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="category" className="mt-6">
                  {Object.entries(resultsByCategory).map(
                    ([category, items]) => (
                      <div key={category} className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold">
                          {category}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {items.map(item => (
                            <ItemCard key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </TabsContent>

                <TabsContent value="house" className="mt-6">
                  {Object.entries(resultsByHouse).map(([houseName, items]) => (
                    <div key={houseName} className="mb-8">
                      <h2 className="mb-4 text-xl font-semibold">
                        {houseName}
                      </h2>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {items.map(item => (
                          <ItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          {item.houseName} / {item.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{item.category}</Badge>
          <div className="flex-1" />
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {item.tags.length}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
