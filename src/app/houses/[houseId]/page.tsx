import Link from 'next/link';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts } from '@/lib/firestore';
import ItemCard from '@/components/item/ItemCard';
import { apts } from '@/config/apt';
import { redirect } from 'next/navigation';
import SearchInput from '@/components/search/SearchInput';

// 집 데이터 가져오기 (실제로는 데이터베이스에서 가져올 것)
function getHouse(id: string) {
  return apts.find(apt => apt.id === Number(id));
}

// 카테고리별로 물품 그룹화
function groupItemsByCategory(items: any[]) {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

// 위치별로 물품 그룹화
function groupItemsByLocation(items: any[]) {
  return items.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {} as Record<string, any[]>);
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ houseId: string }>;
}) {
  const { houseId } = await params;
  const house = getHouse(houseId) as any;
  const allItems = await getProducts();
  const items = allItems.filter(item => item.houseId === houseId);
  const itemsByCategory = groupItemsByCategory(items);
  const itemsByLocation = groupItemsByLocation(items);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      redirect(`/search?q=${e.currentTarget.value}`);
    }
  };

  if (!house) {
    return <div>집을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{house.name} 물품</h1>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <SearchInput />
          </div>
          <Link href={`/items/new?houseId=${houseId}`}>
            <Button className="ml-2" variant="outline">
              <Plus className="h-4" />새 물품 추가
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">전체 물품</TabsTrigger>
            <TabsTrigger value="category">카테고리별</TabsTrigger>
            <TabsTrigger value="location">위치별</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            {Object.entries(itemsByCategory).map(
              ([category, categoryItems]) => (
                <div key={category} className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">{category}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(categoryItems as any[]).map((item: any) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ),
            )}
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            {Object.entries(itemsByLocation).map(
              ([location, locationItems]) => (
                <div key={location} className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">{location}</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {(locationItems as any[]).map((item: any) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ),
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
