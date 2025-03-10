import Link from 'next/link';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProducts } from '@/lib/firestore';
import ItemCard from '@/components/item/ItemCard';

// 집 데이터 가져오기 (실제로는 데이터베이스에서 가져올 것)
function getHouse(id: string) {
  const houses = [
    { id: '1', name: '앵커' },
    { id: '2', name: '갈보리' },
    { id: '3', name: '파로스' },
    { id: '4', name: '피셔맨' },
  ];

  return houses.find(house => house.id === id);
}

// 물품 데이터 가져오기 (실제로는 데이터베이스에서 가져올 것)
function getItems(houseId: string) {
  const items = [
    {
      id: '1',
      name: '소파',
      category: '가구',
      tags: ['거실', '브라운', '가죽'],
      location: '거실',
      houseId: '1',
    },
    {
      id: '2',
      name: 'TV',
      category: '전자제품',
      tags: ['거실', '삼성', '55인치'],
      location: '거실',
      houseId: '1',
    },
    {
      id: '3',
      name: '냉장고',
      category: '전자제품',
      tags: ['주방', 'LG', '양문형'],
      location: '주방',
      houseId: '1',
    },
    {
      id: '4',
      name: '침대',
      category: '가구',
      tags: ['침실', '퀸사이즈'],
      location: '침실',
      houseId: '2',
    },
    {
      id: '5',
      name: '책상',
      category: '가구',
      tags: ['서재', '원목'],
      location: '서재',
      houseId: '3',
    },
    {
      id: '6',
      name: '의자',
      category: '가구',
      tags: ['서재', '가죽'],
      location: '서재',
      houseId: '3',
    },
    {
      id: '7',
      name: '수납장',
      category: '가구',
      tags: ['창고', '플라스틱'],
      location: '창고',
      houseId: '4',
    },
  ];

  return items.filter(item => item.houseId === houseId);
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="물품 검색..."
                className="w-[250px] pl-8"
              />
            </div>
          </div>
          <Link href={`/items/new?houseId=${houseId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />새 물품 추가
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
