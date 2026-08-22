'use client';

import { use } from 'react';
import { useGetBlogPostById } from '@/features/blogs/hooks/useBlogs';
import BlogPostForm from '@/features/blogs/components/BlogPostForm';
import { Loader2 } from 'lucide-react';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: post, isLoading } = useGetBlogPostById(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return <BlogPostForm initialData={post} isEditMode={true} />;
}