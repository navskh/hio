import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/lib/firestore';
import EditCard from '@/components/edit/EditCard';

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getProductById(itemId);

  if (!item) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/houses/${item.houseId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">물품 수정</h1>
        </div>
        <EditCard item={item} />
      </div>
    </div>
  );
}
