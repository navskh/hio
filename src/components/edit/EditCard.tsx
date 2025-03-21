'use client';
import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Product, updateProduct } from '@/lib/firestore';

export default function EditCard({ item }: { item: Product }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setLocation(item.location);
      setDescription(item.description || '');
      setTags(item.tags);
    }
  }, [item]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProduct(item.id, {
        name,
        category,
        location,
        description,
        tags,
      });
      toast.success(`${name}이(가) 성공적으로 수정되었습니다.`);
    } catch (error) {
      toast.error('물품 수정에 실패했습니다.');
    }

    // 해당 집 페이지로 리다이렉트
    router.push(`/houses/${item.houseId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>물품 정보</CardTitle>
          <CardDescription>물품의 정보를 수정하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">물품명</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="물품명을 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="카테고리를 입력하세요"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="위치를 입력하세요"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="물품에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="태그를 입력하고 추가 버튼을 누르세요"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/houses/${item.houseId}`)}
          >
            취소
          </Button>
          <Button type="submit">저장</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
