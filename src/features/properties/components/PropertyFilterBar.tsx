'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { propertyService } from '@/services/propertyService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface PropertyFilterBarProps {
  name: string;
  setName: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  parentId: string;
  setParentId: (val: string) => void;
  isMain: string;
  setIsMain: (val: string) => void;
  isFilter: string;
  setIsFilter: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function PropertyFilterBar({
  name,
  setName,
  type,
  setType,
  parentId,
  setParentId,
  isMain,
  setIsMain,
  isFilter,
  setIsFilter,
  isActive,
  setIsActive,
  onReset,
}: PropertyFilterBarProps) {
  const fetchPropertyParents = async (q: string) => {
    const res = await propertyService.getPropertyParents({ name: q, pageSize: 50 });
    return (res.items || []).map((p) => ({ value: p.id, label: p.name }));
  };

  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر و جستجوی ویژگی‌های فنی</span>
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
          label="عنوان ویژگی"
          placeholder="مثال: ابعاد، وزن، رنگ..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        <Select
          label="نوع ورودی (Type)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: '', label: 'همه انواع' },
            { value: 'Input', label: 'ورودی متنی (Input)' },
            { value: 'MultiSelect', label: 'انتخاب چندتایی (MultiSelect)' },
          ]}
        />

        <AsyncSelect
          label="گروه ویژگی (PropertyParent)"
          placeholder="انتخاب گروه..."
          value={parentId}
          onChange={setParentId}
          fetchOptions={fetchPropertyParents}
        />

        <Select
          label="ویژگی اصلی (IsMain)"
          value={isMain}
          onChange={(e) => setIsMain(e.target.value)}
          options={[
            { value: '', label: 'همه' },
            { value: 'true', label: 'اصلی' },
            { value: 'false', label: 'عادی' },
          ]}
        />

        <Select
          label="قابل فیلتر (IsFilter)"
          value={isFilter}
          onChange={(e) => setIsFilter(e.target.value)}
          options={[
            { value: '', label: 'همه' },
            { value: 'true', label: 'بله' },
            { value: 'false', label: 'خیر' },
          ]}
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
      </div>
    </div>
  );
}