'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { MultiAsyncSelect, SelectOption } from '@/components/ui/MultiAsyncSelect';
import { Switch } from '@/components/ui/Switch';
import { PropertyListItem } from '../types';
import { propertyService } from '@/services/propertyService';
import { apiClient } from '@/lib/axios';
import { Sliders, Loader2, X, Save, Plus, Tag, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';

interface MultiSelectValueItem {
  id?: string;
  value: string;
  isActive: boolean;
  isDeleted?: boolean;
  isEdited?: boolean;
}

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

  // قطعات تخصیص داده شده
  const [partIds, setPartIds] = useState<string[]>([]);
  const [initialPartOptions, setInitialPartOptions] = useState<SelectOption[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // ⚠️ مدیریت مقادیر MultiSelect
  const [multiSelectValues, setMultiSelectValues] = useState<MultiSelectValueItem[]>([]);
  const [newValueInput, setNewValueInput] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialProperty && isOpen) {
      setName(initialProperty.name || '');
      setType(initialProperty.type || 'Input');
      setPriority(String(initialProperty.priority || 0));
      setPropertyParentId(initialProperty.propertyParentId || initialProperty.propertyParent?.id || '');
      setParentName(initialProperty.propertyParent?.name || '');
      setIsMain(initialProperty.isMain ?? true);
      setIsFilter(initialProperty.isFilter ?? true);
      setIsSearch(initialProperty.isSearch ?? true);
      setIsActive(initialProperty.isActive ?? true);

      const fetchPropertyDetails = async () => {
        setIsDataLoading(true);
        try {
          const propRes = await apiClient.get<any>('/api/A_Part/Property', {
            params: { Id: initialProperty.id },
          });
          const propData = propRes.data;
          
          if (propData?.parts && Array.isArray(propData.parts)) {
            setPartIds(propData.parts.map((p: any) => p.id));
            setInitialPartOptions(propData.parts.map((p: any) => ({ value: p.id, label: p.name })));
          }

          if (initialProperty.type === 'MultiSelect') {
            const valsRes = await apiClient.get<any>('/api/A_Part/PropertyMultiSelect', {
              params: { PropertyId: initialProperty.id, PageNumber: 1, PageSize: 9999, isDeleted: false },
            });
            const valsData = valsRes.data?.items || [];
            setMultiSelectValues(valsData.map((v: any) => ({ id: v.id, value: v.value, isActive: v.isActive ?? true })));
          }
        } catch (e) {
          console.error('Failed to fetch property details:', e);
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchPropertyDetails();
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
      setPartIds([]);
      setInitialPartOptions([]);
      setMultiSelectValues([]);
      setNewValueInput('');
    }
    setErrors({});
  }, [initialProperty, isOpen]);

  if (!isOpen) return null;

  const fetchPropertyParents = async (q: string) => {
    const res = await propertyService.getPropertyParents({ name: q, pageSize: 50 });
    return (res.items || []).map((p) => ({ value: p.id, label: p.name }));
  };

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', { params: { Name: q, PageSize: 30 } });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  // افزودن مقدار جدید
  const handleAddValue = () => {
    if (!newValueInput.trim()) return;
    if (multiSelectValues.some((v) => v.value === newValueInput.trim() && !v.isDeleted)) {
      toast.error('این مقدار قبلاً اضافه شده است.');
      return;
    }
    setMultiSelectValues([...multiSelectValues, { value: newValueInput.trim(), isActive: true }]);
    setNewValueInput('');
  };

  // حذف مقدار (در صورت داشتن آیدی علامت‌گذاری به عنوان isDeleted می‌شود تا سرور دلیت کند)
  const handleRemoveValue = (idx: number) => {
    const newVals = [...multiSelectValues];
    if (newVals[idx].id) {
      newVals[idx].isDeleted = true;
    } else {
      newVals.splice(idx, 1);
    }
    setMultiSelectValues(newVals);
  };

  // ⚠️ تغییر مقدار نام ولیو
  const handleValueNameChange = (idx: number, newVal: string) => {
    const newVals = [...multiSelectValues];
    newVals[idx].value = newVal;
    newVals[idx].isEdited = true;
    setMultiSelectValues(newVals);
  };

  // ⚠️ تغییر وضعیت فعال/غیرفعال ولیو
  const handleValueStatusToggle = (idx: number) => {
    const newVals = [...multiSelectValues];
    newVals[idx].isActive = !newVals[idx].isActive;
    newVals[idx].isEdited = true;
    setMultiSelectValues(newVals);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'عنوان ویژگی نمی‌تواند خالی باشد';
    if (!propertyParentId) errs.propertyParentId = 'انتخاب گروه ویژگی الزامی است';
    if (type === 'MultiSelect' && multiSelectValues.filter((v) => !v.isDeleted).length === 0) {
      errs.values = 'برای نوع MultiSelect حداقل یک مقدار وارد کنید';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (errs.values) toast.error(errs.values);
      return;
    }

    if (initialProperty) {
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
      
      onSave({ formData, isEdit: true, partIds, multiSelectValues });
    } else {
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
        partIds,
        multiSelectValues,
      });
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sliders className="h-4 w-4" />
            <span>{initialProperty ? 'ویرایش ویژگی فنی' : 'تعریف ویژگی جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isDataLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <span className="text-xs text-neutral-400">در حال دریافت قطعات و مقادیر مرتبط...</span>
          </div>
        ) : (
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

            {/* ⚠️ باکس مقادیر با قابلیت ویرایش نام و تاگل وضعیت */}
            {type === 'MultiSelect' && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <label className="block text-xs font-bold text-amber-400">ثبت مقادیر چندتایی (MultiSelect Values) *</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="مثلاً: قرمز، ۱۳ اینچ، بنزینی..."
                    value={newValueInput}
                    onChange={(e) => setNewValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddValue();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddValue}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 hover:bg-amber-500 hover:text-black transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2 pt-2">
                  {multiSelectValues.filter((v) => !v.isDeleted).map((v, idx) => {
                    const arrayIdx = multiSelectValues.findIndex(item => item === v);
                    return (
                      <div key={arrayIdx} className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-950 p-2">
                        <Tag className="h-3 w-3 text-neutral-500 shrink-0" />
                        <input
                          type="text"
                          value={v.value}
                          onChange={(e) => handleValueNameChange(arrayIdx, e.target.value)}
                          className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:text-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleValueStatusToggle(arrayIdx)}
                          title={v.isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'}
                          className={`flex items-center justify-center p-1 rounded-md transition-colors ${v.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-neutral-500 hover:bg-neutral-800'}`}
                        >
                          {v.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveValue(arrayIdx)}
                          className="text-neutral-500 hover:text-red-400 ml-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                  {multiSelectValues.filter((v) => !v.isDeleted).length === 0 && (
                    <span className="text-[10px] text-neutral-500">مقداری وارد نشده است.</span>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-800">
              <MultiAsyncSelect
                label="تخصیص به قطعات (اتصال همزمان)"
                placeholder="جستجو و انتخاب قطعات..."
                selectedValues={partIds}
                initialOptions={initialPartOptions}
                onChange={setPartIds}
                fetchOptions={fetchParts}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
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
        )}
      </div>
    </div>,
    document.body
  );
}