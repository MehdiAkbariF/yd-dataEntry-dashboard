'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import CarTypePartDescriptionFilterBar from '@/features/car-type-part-descriptions/components/CarTypePartDescriptionFilterBar';
import CarTypePartDescriptionTable from '@/features/car-type-part-descriptions/components/CarTypePartDescriptionTable';
import {
  useGetCarTypePartDescriptions,
  useToggleCarTypePartDescriptionStatus,
  useDeleteCarTypePartDescription,
} from '@/features/car-type-part-descriptions/hooks/useCarTypePartDescriptions';
import { CarTypePartDescriptionFilterParams } from '@/features/car-type-part-descriptions/types';
import Pagination from '@/components/common/Pagination';

export default function CarTypePartDescriptionsPage() {
  const [partId, setPartId] = useState('');
  const [carTypeId, setCarTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [updaterId, setUpdaterId] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 30;

  const params: CarTypePartDescriptionFilterParams = {
    PageNumber: page,
    PageSize: pageSize,
    PartId: partId || undefined,
    CarTypeId: carTypeId || undefined,
    Description: description || undefined,
    IsActive: isActive === '' ? undefined : isActive === 'true',
    CreatorId: creatorId || undefined,
    UpdaterId: updaterId || undefined,
  };

  const { data, isLoading, refetch } = useGetCarTypePartDescriptions(params);
  const toggleMutation = useToggleCarTypePartDescriptionStatus();
  const deleteMutation = useDeleteCarTypePartDescription();

  const handleToggle = (id: string, current: boolean) => {
    toggleMutation.mutate(
      { id, isActive: !current },
      {
        onSuccess: () => toast.success('وضعیت تغییر کرد'),
        onError: () => toast.error('خطا در تغییر وضعیت'),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('آیا از حذف مطمئن هستید؟')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success('حذف شد'),
      onError: () => toast.error('خطا در حذف'),
    });
  };

  const handleReset = () => {
    setPartId('');
    setCarTypeId('');
    setDescription('');
    setIsActive('');
    setCreatorId('');
    setUpdaterId('');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">
          مدیریت توضیحات قطعه-خودرو
        </h1>
        <Link
          href="/car-type-part-descriptions/create"
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> افزودن جدید
        </Link>
      </div>

      <CarTypePartDescriptionFilterBar
        partId={partId} setPartId={setPartId}
        carTypeId={carTypeId} setCarTypeId={setCarTypeId}
        description={description} setDescription={setDescription}
        isActive={isActive} setIsActive={setIsActive}
        creatorId={creatorId} setCreatorId={setCreatorId}
        updaterId={updaterId} setUpdaterId={setUpdaterId}
        onReset={handleReset}
      />

      <CarTypePartDescriptionTable
        items={data?.items || []}
        isLoading={isLoading}
        onToggleStatus={handleToggle}
        onDelete={handleDelete}
        isTogglingId={toggleMutation.variables?.id ?? null}
        currentPage={page}
        pageSize={pageSize}
      />

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}