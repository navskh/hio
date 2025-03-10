import Link from 'next/link';
import { Building, Search } from 'lucide-react';

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

export default function HomePage() {
  const houses = [
    { id: 1, name: '메인 하우스', itemCount: 120 },
    { id: 2, name: '별장', itemCount: 45 },
    { id: 3, name: '오피스텔', itemCount: 78 },
    { id: 4, name: '창고', itemCount: 210 },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">집별 물품 관리</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="물품 검색..."
                className="w-[250px] pl-8"
              />
            </div>
            <Link href="/items/new">
              <Button>새 물품 추가</Button>
            </Link>
          </div>
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
