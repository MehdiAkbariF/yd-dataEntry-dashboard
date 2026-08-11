'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { Switch } from '@/components/ui/Switch';
import { PropertyListItem } from '../types';
import { propertyService } from '@/services/propertyService';
import { Sliders, Loader2, X, Save } from 'lucide-react';

interface PropertyModalProps {
  isOpen: boolean;
  initialProperty?: PropertyListItem | null;
  isLoading?: boolean;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function PropertyModal({
  isOpen,
  initialProperty,
  isLoading,
  onSave,
  onClose,
}: PropertyModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Input');
  const [priority, setPriority] = useState('0');
  const [propertyParentId, setPropertyParentId] = useState('');
  const [parentName, setParentName] = useState('');

  const [isMain, setIsMain] = useState(true);
  const [isFilter, setIsFilter] = useState(true);
  const [isSearch, setIsSearch] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProperty) {
      setName(initialProperty.name || '');
      setType(initialProperty.type || 'Input');
      setPriority(String(initialProperty.priority || 0));
      setPropertyParentId(initialProperty.propertyParentId || initialProperty.propertyParent?.id || '');
      setParentName(initialProperty.propertyParent?.name || '');
      setIsMain(initialProperty.isMain ?? true);
      setIsFilter(initialProperty.isFilter ?? true);
      setIsSearch(initialProperty.isSearch ?? true);
      setIsActive(initialProperty.isActive ?? true);
    } else {
      setName('');
      setType('Input');
      setPriority('0');
      setPropertyParentId('');
      setParentName('');
      setIsMain(true);
      setIsFilter(true);
      setIsSearch(true);
      setIsActive(true);
    }
    setErrors({});
  }, [initialProperty, isOpen]);

  if (!isOpen) return null;

  const fetchPropertyParents = async (q: string) => {
    const res = await propertyService.getPropertyParents({ name: q, pageSize: 50 });
    return (res.items || []).map((p) => ({ value: p.id, label: p.name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'عنوان ویژگی نمی‌تواند خالی باشد';
    if (!propertyParentId) errs.propertyParentId = 'انتخاب گروه ویژگی الزامی است';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (initialProperty) {
      // ویرایش با FormData
      const formData = new FormData();
      formData.append('Id', initialProperty.id);
      formData.append('Name', name);
      formData.append('Type', type);
      formData.append('Priority', priority);
      formData.append('PropertyParentId', propertyParentId);
      formData.append('IsMain', String(isMain));
      formData.append('IsFilter', String(isFilter));
      formData.append('IsSearch', String(isSearch));
      formData.append('IsActive', String(isActive));
      onSave({ formData, isEdit: true });
    } else {
      // ایجاد با JSON
      onSave({
        data: {
          name,
          type,
          priority: Number(priority),
          propertyParentId,
          isMain,
          isFilter,
          isSearch,
        },
        isEdit: false,
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sliders className="h-4 w-4" />
            <span>{initialProperty ? 'ویرایش ویژگی فنی' : 'تعریف ویژگی جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="عنوان ویژگی *"
            placeholder="مثلاً: ابعاد، وزن، طول عمر..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="نوع ورودی *"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'Input', label: 'Input (متن متغیر)' },
                { value: 'MultiSelect', label: 'MultiSelect (چندتایی)' },
              ]}
            />

            <Input
              label="اولویت نمایش"
              type="number"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              dir="ltr"
            />
          </div>

          <div>
            <AsyncSelect
              label="گروه اصلی ویژگی (PropertyParent) *"
              placeholder="انتخاب گروه..."
              value={propertyParentId}
              initialLabel={parentName}
              onChange={setPropertyParentId}
              fetchOptions={fetchPropertyParents}
            />
            {errors.propertyParentId && <p className="mt-1 text-[11px] text-red-400">{errors.propertyParentId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <Switch checked={isMain} onChange={setIsMain} label="ویژگی اصلی محصول" />
            <Switch checked={isFilter} onChange={setIsFilter} label="قابلیت استفاده در فیلتر" />
            <Switch checked={isSearch} onChange={setIsSearch} label="قابلیت جستجو" />
            {initialProperty && <Switch checked={isActive} onChange={setIsActive} label="وضعیت فعال" />}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>ذخیره ویژگی</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}