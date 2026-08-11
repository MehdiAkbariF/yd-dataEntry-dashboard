'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { carService } from '@/services/carService';
import { userService } from '@/services/userService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface CarFilterBarProps {
  model: string;
  setModel: (val: string) => void;
  englishTitle: string;
  setEnglishTitle: (val: string) => void;
  carManufacturerId: string;
  setCarManufacturerId: (val: string) => void;
  carTypeId: string;
  setCarTypeId: (val: string) => void;
  vehicleType: string;
  setVehicleType: (val: string) => void;
  isAutomatic: string;
  setIsAutomatic: (val: string) => void;
  creatorId: string;
  setCreatorId: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function CarFilterBar({
  model,
  setModel,
  englishTitle,
  setEnglishTitle,
  carManufacturerId,
  setCarManufacturerId,
  carTypeId,
  setCarTypeId,
  vehicleType,
  setVehicleType,
  isAutomatic,
  setIsAutomatic,
  creatorId,
  setCreatorId,
  isActive,
  setIsActive,
  onReset,
}: CarFilterBarProps) {
  // دریافت لیست شرکت‌های خودروساز
  const fetchManufacturers = async (q: string) => {
    const list = await carService.getCarManufacturers(q);
    return list.map((m: any) => ({ value: m.id, label: m.name }));
  };

  // دریافت لیست نوع خودروها
  const fetchCarTypes = async (q: string) => {
    const list = await carService.getCarTypes(q);
    return list.map((t: any) => ({ value: t.id, label: t.name }));
  };

  // دریافت لیست کاربران
  const fetchUsers = async (q: string) => {
    const users = await userService.getUsers(q);
    return users.map((u) => ({
      value: u.id,
      label: u.fullName ? `${u.fullName} (${u.userName})` : u.userName,
    }));
  };

  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر و جستجوی مدل‌های خودرو (Car Filters)</span>
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
        {/* ۱. مدل خودرو */}
        <Input
          label="مدل خودرو (فارسی)"
          placeholder="مثال: پژو 206 SD"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        {/* ۲. عنوان انگلیسی */}
        <Input
          label="عنوان انگلیسی"
          placeholder="peugeot 206 SD"
          value={englishTitle}
          onChange={(e) => setEnglishTitle(e.target.value)}
          dir="ltr"
        />

        {/* ۳. شرکت خودروساز */}
        <AsyncSelect
          label="شرکت خودروساز"
          placeholder="انتخاب خودروساز..."
          value={carManufacturerId}
          onChange={setCarManufacturerId}
          fetchOptions={fetchManufacturers}
        />

        {/* ۴. نوع خودرو (CarType) */}
        <AsyncSelect
          label="نوع خودرو (CarType)"
          placeholder="انتخاب نوع خودرو..."
          value={carTypeId}
          onChange={setCarTypeId}
          fetchOptions={fetchCarTypes}
        />

        {/* ۵. کلاس کاربری (سبک / سنگین) */}
        <Select
          label="کلاس کاربری"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          options={[
            { value: '', label: 'همه کلاس‌ها' },
            { value: 'خودروسبک', label: 'خودرو سبک' },
            { value: 'خودروسنگین', label: 'خودرو سنگین' },
          ]}
        />

        {/* ۶. نوع گیربکس (اتوماتیک / دستی) */}
        <Select
          label="نوع گیربکس"
          value={isAutomatic}
          onChange={(e) => setIsAutomatic(e.target.value)}
          options={[
            { value: '', label: 'همه گیربکس‌ها' },
            { value: 'true', label: 'اتوماتیک' },
            { value: 'false', label: 'دنده‌ای (دستی)' },
          ]}
        />

        {/* ۷. ایجادکننده */}
        <AsyncSelect
          label="ایجادکننده (Creator)"
          placeholder="انتخاب کاربر..."
          value={creatorId}
          onChange={setCreatorId}
          fetchOptions={fetchUsers}
        />

        {/* ۸. وضعیت نمایش */}
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