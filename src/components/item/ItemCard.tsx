'use client';

import { Trash2, Tag, PencilIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import Link from 'next/link';
import { deleteProduct } from '@/lib/firestore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ItemCard({ item }: { item: any }) {
  console.log('item', item);
  const router = useRouter();
  const onDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('물품이 삭제되었습니다.');
      router.refresh();
    } catch (error) {
      toast.error('물품 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    router.push(`/items/edit/${item.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {item.name}
          <div className="flex items-center space-x-2">
            <Link href={`/items/edit/${item.id}`} className="no-underline">
              <Button variant="outline" size="icon" onClick={handleEdit}>
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 이 항목을 영구적으로 삭제하고
                    모든 데이터를 제거합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item.id)}>
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <CardDescription>{item.location}</CardDescription>
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
