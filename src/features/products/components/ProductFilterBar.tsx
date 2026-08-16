'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { userService } from '@/services/userService';
import { apiClient } from '@/lib/axios';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface ProductFilterBarProps {
  title: string;
  setTitle: (val: string) => void;
  productCode: string;
  setProductCode: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  creatorId: string;
  setCreatorId: (val: string) => void;
  updaterId: string;
  setUpdaterId: (val: string) => void;
  brandId: string;
  setBrandId: (val: string) => void;
  partId: string;
  setPartId: (val: string) => void;
  onReset: () => void;
}

export default function ProductFilterBar({
  title,
  setTitle,
  productCode,
  setProductCode,
  isActive,
  setIsActive,
  creatorId,
  setCreatorId,
  updaterId,
  setUpdaterId,
  brandId,
  setBrandId,
  partId,
  setPartId,
  onReset,
}: ProductFilterBarProps) {
  const fetchUsers = async (query: string) => {
    const users = await userService.getUsers(query);
    return users.map((u) => ({
      value: u.id,
      label: u.fullName ? `${u.fullName} (${u.userName})` : u.userName,
    }));
  };

  const fetchBrands = async (query: string) => {
    const res = await apiClient.get<any[]>('/api/Admin/A_Product/BrandsName', {
      params: { Name: query },
    });
    return (res.data || []).map((b) => ({ value: b.id, label: b.name }));
  };

  const fetchParts = async (query: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', {
      params: { Name: query, PageSize: 30 },
    });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر و جستجوی جامع محصولات</span>
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
        <Input
          label="عنوان محصول"
          placeholder="جستجو در عنوان..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        <Input
          label="کد محصول"
          placeholder="مثلاً 50498128"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          dir="ltr"
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
          label="نوع قطعه پایه (Part)"
          placeholder="انتخاب قطعه پایه..."
          value={partId}
          onChange={setPartId}
          fetchOptions={fetchParts}
        />

        <AsyncSelect
          label="برند محصول"
          placeholder="انتخاب برند..."
          value={brandId}
          onChange={setBrandId}
          fetchOptions={fetchBrands}
        />

        <AsyncSelect
          label="ایجادکننده (Creator)"
          placeholder="انتخاب کاربر..."
          value={creatorId}
          onChange={setCreatorId}
          fetchOptions={fetchUsers}
        />

        <AsyncSelect
          label="ویرایش‌کننده (Updater)"
          placeholder="انتخاب کاربر..."
          value={updaterId}
          onChange={setUpdaterId}
          fetchOptions={fetchUsers}
        />
      </div>
    </div>
  );
}