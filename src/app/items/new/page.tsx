'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { addProduct } from '@/lib/firestore';
import { apts } from '@/config/apt';

export default function NewItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const houseId = searchParams.get('houseId') || '';

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const houses = apts.map(apt => ({
    id: apt.id,
    name: apt.name,
  }));

  const categories = [
    '가구',
    '전자제품',
    '주방용품',
    '의류',
    '도서',
    '장난감',
    '공구',
    '기타',
  ];
  const locations = [
    '거실',
    '주방',
    '침실',
    '서재',
    '욕실',
    '창고',
    '베란다',
    '기타',
  ];

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

    // 여기서 실제로는 데이터베이스에 저장하는 로직이 들어갈 것
    console.log({
      name,
      category,
      location,
      description,
      tags,
      houseId: houseId || undefined,
    });

    const newId = await addProduct({
      name,
      category,
      location,
      description,
      tags,
      houseId: houseId || '',
    });

    toast.success(`${name}이(가) 성공적으로 추가되었습니다.`);

    // 해당 집 페이지로 리다이렉트
    if (houseId) {
      router.push(`/houses/${houseId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={houseId ? `/houses/${houseId}` : '/'}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">새 물품 추가</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>물품 정보</CardTitle>
              <CardDescription>
                새로운 물품의 정보를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="house">집</Label>
                <Select
                  value={houseId}
                  onValueChange={value =>
                    router.push(`/items/new?houseId=${value}`)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="집을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {houses.map(house => (
                      <SelectItem key={house.id} value={house.id.toString()}>
                        {house.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="카테고리를 입력하세요"
                    required
                  />
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
                onClick={() =>
                  router.push(houseId ? `/houses/${houseId}` : '/')
                }
              >
                취소
              </Button>
              <Button type="submit">저장</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
