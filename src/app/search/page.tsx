'use client';
import { useCallback, useEffect, useState, Suspense } from 'react';
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
import { useSearchParams } from 'next/navigation';
import { getProducts, Product } from '@/lib/firestore';
import { apts } from '@/config/apt';

function SearchContent() {
  const query = useSearchParams();
  const q = query.get('q');
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<typeof allItems>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchAllItems = async () => {
      const items = await getProducts();
      setAllItems(items);
      if (q) {
        const query = q.toLowerCase();
        const results = items.filter(
          item =>
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query)),
        );
        setSearchResults(results);
        setHasSearched(true);
      }
    };
    fetchAllItems();
  }, [q]);

  const handleSearch = useCallback(() => {
    if (!searchQuery?.trim()) {
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
  }, [searchQuery, allItems]);

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
    if (!acc[item.houseId]) {
      acc[item.houseId] = [];
    }
    acc[item.houseId].push(item);
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function ItemCard({ item }: { item: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          {apts.find(apt => apt.id === Number(item.houseId))?.name} /{' '}
          {item.location}
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
