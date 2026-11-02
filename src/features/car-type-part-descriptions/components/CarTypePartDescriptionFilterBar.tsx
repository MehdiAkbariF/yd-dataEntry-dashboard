'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { userService } from '@/services/userService';
import { apiClient } from '@/lib/axios';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface Props {
  partId: string;
  setPartId: (v: string) => void;
  carTypeId: string;
  setCarTypeId: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  isActive: string;
  setIsActive: (v: string) => void;
  creatorId: string;
  setCreatorId: (v: string) => void;
  updaterId: string;
  setUpdaterId: (v: string) => void;
  onReset: () => void;
}

export default function CarTypePartDescriptionFilterBar({
  partId, setPartId,
  carTypeId, setCarTypeId,
  description, setDescription,
  isActive, setIsActive,
  creatorId, setCreatorId,
  updaterId, setUpdaterId,
  onReset,
}: Props) {
  const fetchUsers = async (q: string) => {
    const users = await userService.getUsers(q);
    return users.map((u) => ({
      value: u.id,
      label: u.fullName ? `${u.fullName} (${u.userName})` : u.userName,
    }));
  };

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', {
      params: { Name: q, PageSize: 30 },
    });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  const fetchCarTypes = async (q: string) => {
    // فرض: از همان endpoint CarsName استفاده می‌کنیم
    const res = await apiClient.get<any>('/api/Admin/A_Product/CarsName', {
      params: { Model: q, PageSize: 30 },
    });
    return (res.data || []).map((c: any) => ({
      value: c.id,
      label: `${c.model} (${c.englishTitle || ''})`,
    }));
  };

  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر توضیحات قطعه-خودرو</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>ریست فیلترها</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AsyncSelect
          label="قطعه (Part)"
          placeholder="انتخاب قطعه..."
          value={partId}
          onChange={setPartId}
          fetchOptions={fetchParts}
        />
        <AsyncSelect
          label="نوع خودرو (CarType)"
          placeholder="انتخاب خودرو..."
          value={carTypeId}
          onChange={setCarTypeId}
          fetchOptions={fetchCarTypes}
        />
        <Input
          label="توضیحات"
          placeholder="جستجو در توضیحات..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />
        <Select
          label="وضعیت نمایش"
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          options={[
            { value: '', label: 'همه وضعیت‌ها' },
            { value: 'true', label: 'فعال' },
            { value: 'false', label: 'غیرفعال' },
          ]}
        />
        <AsyncSelect
          label="ایجادکننده"
          placeholder="انتخاب کاربر..."
          value={creatorId}
          onChange={setCreatorId}
          fetchOptions={fetchUsers}
        />
        <AsyncSelect
          label="ویرایش‌کننده"
          placeholder="انتخاب کاربر..."
          value={updaterId}
          onChange={setUpdaterId}
          fetchOptions={fetchUsers}
        />
      </div>
    </div>
  );
}