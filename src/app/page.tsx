import Link from 'next/link';
import { Building } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apts } from '@/config/apt';
import { getProducts } from '@/lib/firestore';
import SearchInput from '@/components/search/SearchInput';

export default async function HomePage() {
  const allItems = await getProducts();
  const houses = apts.map(apt => ({
    id: apt.id,
    name: apt.name,
    itemCount: allItems.filter(item => item.houseId === apt.id.toString())
      .length,
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">APT 물품 관리</h1>
        <div className="flex items-center justify-end gap-2">
          <SearchInput />
          <Link href="/items/new">
            <Button variant="outline">새 물품 추가</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {houses.map(house => (
            <Link href={`/houses/${house.id}`} key={house.id}>
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {house.name}
                  </CardTitle>
                  <CardDescription>
                    총 {house.itemCount}개의 물품
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    이 집에 보관된 모든 물품을 확인하고 관리하세요.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full">
                    물품 보기
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
