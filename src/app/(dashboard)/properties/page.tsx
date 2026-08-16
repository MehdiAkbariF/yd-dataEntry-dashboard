'use client';

import { useState } from 'react';
import {
  useGetProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  useGetPropertyParents,
  useCreatePropertyParent,
  useUpdatePropertyParent,
  useDeletePropertyParent,
} from '@/features/properties/hooks/useProperties';
import { propertyService } from '@/services/propertyService';
import PropertyTable from '@/features/properties/components/PropertyTable';
import PropertyFilterBar from '@/features/properties/components/PropertyFilterBar';
import PropertyModal from '@/features/properties/components/PropertyModal';
import PropertyParentModal from '@/features/properties/components/PropertyParentModal';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { PropertyListItem, PropertyParentListItem } from '@/features/properties/types';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Sliders, Layers, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState<'properties' | 'parents'>('properties');
  const { propertyFilters, setPropertyFilter, resetPropertyFilters } = useFilterStore();

  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListItem | null>(null);

  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<PropertyParentListItem | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'property' | 'parent'>('property');

  const { data: propertiesData, isLoading: isPropertiesLoading } = useGetProperties({
    pageNumber: propertyFilters.page,
    pageSize: 20,
    name: propertyFilters.name || undefined,
    type: propertyFilters.type || undefined,
    parentId: propertyFilters.parentId || undefined,
    isMain: propertyFilters.isMain === '' ? undefined : propertyFilters.isMain === 'true',
    isFilter: propertyFilters.isFilter === '' ? undefined : propertyFilters.isFilter === 'true',
    isActive: propertyFilters.isActive === '' ? undefined : propertyFilters.isActive === 'true',
  });

  const { data: parentsData, isLoading: isParentsLoading } = useGetPropertyParents({
    pageNumber: propertyFilters.page,
    pageSize: 30,
  });

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const createParentMutation = useCreatePropertyParent();
  const updateParentMutation = useUpdatePropertyParent();
  const deleteParentMutation = useDeletePropertyParent();

  // ⚠️ عملیات ذخیره و اتصال موازی ویژگی به قطعات و مقادیر چندتایی
  const handleSaveProperty = async ({ data, formData, isEdit, partIds, multiSelectValues }: any) => {
    try {
      let currentPropertyId = selectedProperty?.id;

      if (isEdit) {
        await updatePropertyMutation.mutateAsync(formData);
        toast.success('ویژگی با موفقیت به‌روزرسانی شد.');
      } else {
        const res = await createPropertyMutation.mutateAsync(data);
        currentPropertyId = Array.isArray(res) ? res[0]?.id : res?.id;
        toast.success('ویژگی جدید ایجاد شد.');
      }

      if (currentPropertyId) {
        // ۱. اتصال به قطعات
        if (partIds && partIds.length > 0) {
          await Promise.all(partIds.map((pId: string) => propertyService.assignPropertyToPart(pId, currentPropertyId)));
        }

        // ۲. پردازش مقادیر MultiSelect
        if (multiSelectValues && multiSelectValues.length > 0) {
          const newValues = multiSelectValues.filter((v: any) => !v.id && !v.isDeleted).map((v: any) => v.value);
          const updateValues = multiSelectValues.filter((v: any) => v.id && !v.isDeleted && v.isEdited);
          const deleteValues = multiSelectValues.filter((v: any) => v.id && v.isDeleted);

          // ایجاد مقادیر جدید به صورت گروهی
          if (newValues.length > 0) {
            const form = new FormData();
            form.append('PropertyId', currentPropertyId);
            newValues.forEach((val: string) => form.append('Values', val));
            await propertyService.createPropertyMultiSelect(form);
          }

          // ویرایش مقادیر تغییر یافته (ویرایش متن یا تاگل فعال/غیرفعال)
          if (updateValues.length > 0) {
            await Promise.all(
              updateValues.map((v: any) => {
                const form = new FormData();
                form.append('Id', v.id);
                form.append('PropertyId', currentPropertyId);
                form.append('Value', v.value);
                form.append('IsActive', String(v.isActive));
                return propertyService.updatePropertyMultiSelect(form);
              })
            );
          }

          // حذف مقادیر دیلیت شده
          if (deleteValues.length > 0) {
            await Promise.all(deleteValues.map((v: any) => propertyService.deletePropertyMultiSelect(v.id)));
          }
        }
      }

      setIsPropertyModalOpen(false);
    } catch (e) {
      toast.error('خطا در پردازش اطلاعات مکمل (قطعات یا مقادیر).');
    }
  };

  const handleSaveParent = (formData: FormData) => {
    if (selectedParent) {
      updateParentMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('گروه ویژگی به‌روزرسانی شد.');
          setIsParentModalOpen(false);
        },
      });
    } else {
      createParentMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('گروه ویژگی جدید ایجاد شد.');
          setIsParentModalOpen(false);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    if (deleteType === 'property') {
      deletePropertyMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('ویژگی حذف شد.');
          setDeleteId(null);
        },
      });
    } else {
      deleteParentMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('گروه ویژگی حذف شد.');
          setDeleteId(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت ویژگی‌های قطعات (Properties)</h1>
            <p className="text-xs text-neutral-400">تعریف مشخصات فنی، ابعادی و گروه‌های اصلی ویژگی‌ها</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'properties' ? (
            <button
              onClick={() => {
                setSelectedProperty(null);
                setIsPropertyModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>تعریف ویژگی جدید</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedParent(null);
                setIsParentModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
            >
              <Plus className="h-4 w-4" />
              <span>تعریف گروه جدید</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => {
            setActiveTab('properties');
            setPropertyFilter('page', 1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'properties'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>ویژگی‌های قطعات</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('parents');
            setPropertyFilter('page', 1);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'parents'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>گروه‌های اصلی ویژگی‌ها (PropertyParents)</span>
        </button>
      </div>

      {activeTab === 'properties' && (
        <>
          <PropertyFilterBar
            name={propertyFilters.name}
            setName={(val) => setPropertyFilter('name', val)}
            type={propertyFilters.type}
            setType={(val) => setPropertyFilter('type', val)}
            parentId={propertyFilters.parentId}
            setParentId={(val) => setPropertyFilter('parentId', val)}
            isMain={propertyFilters.isMain}
            setIsMain={(val) => setPropertyFilter('isMain', val)}
            isFilter={propertyFilters.isFilter}
            setIsFilter={(val) => setPropertyFilter('isFilter', val)}
            isActive={propertyFilters.isActive}
            setIsActive={(val) => setPropertyFilter('isActive', val)}
            onReset={resetPropertyFilters}
          />

          <PropertyTable
            properties={propertiesData?.items || []}
            isLoading={isPropertiesLoading}
            onEdit={(prop) => {
              setSelectedProperty(prop);
              setIsPropertyModalOpen(true);
            }}
            onDelete={(id) => {
              setDeleteId(id);
              setDeleteType('property');
            }}
          />

          {propertiesData && (
            <Pagination
              currentPage={propertiesData.currentPage}
              totalPages={propertiesData.totalPages}
              onPageChange={(newPage) => setPropertyFilter('page', newPage)}
            />
          )}
        </>
      )}

      {activeTab === 'parents' && (
        <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
              <tr>
                <th className="p-4">عنوان گروه اصلی</th>
                <th className="p-4 text-center">اولویت</th>
                <th className="p-4 text-center">تاریخ ایجاد</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {(parentsData?.items || []).map((parent) => (
                <tr key={parent.id} className="hover:bg-neutral-800/30 transition-all">
                  <td className="p-4 font-bold text-amber-400">{parent.name}</td>
                  <td className="p-4 text-center font-mono font-bold text-neutral-300">{parent.priority}</td>
                  <td className="p-4 text-center font-mono text-[11px] dir-ltr text-right">
                    {new Date(parent.createDate).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedParent(parent);
                          setIsParentModalOpen(true);
                        }}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                        title="ویرایش گروه"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(parent.id);
                          setDeleteType('parent');
                        }}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                        title="حذف گروه"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PropertyModal
        isOpen={isPropertyModalOpen}
        initialProperty={selectedProperty}
        isLoading={createPropertyMutation.isPending || updatePropertyMutation.isPending}
        onSave={handleSaveProperty}
        onClose={() => setIsPropertyModalOpen(false)}
      />

      <PropertyParentModal
        isOpen={isParentModalOpen}
        initialParent={selectedParent}
        isLoading={createParentMutation.isPending || updateParentMutation.isPending}
        onSave={handleSaveParent}
        onClose={() => setIsParentModalOpen(false)}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف آیتم"
        description="آیا از حذف این مورد اطمینان دارید؟"
        isLoading={deletePropertyMutation.isPending || deleteParentMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}