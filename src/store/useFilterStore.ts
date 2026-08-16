import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProductFilterState {
  page: number;
  title: string;
  productCode: string;
  isActive: string;
  creatorId: string;
  updaterId: string;
  brandId: string;
  partId: string;
}

interface BrandFilterState {
  page: number;
  name: string;
  englishTitle: string;
  creatorId: string;
  isInMain: string;
  isConfirmed: string;
  isActive: string;
}

interface PartFilterState {
  page: number;
  name: string;
  englishTitle: string;
  description: string;
  partCategoryId: string;
  creatorId: string;
  updaterId: string;
  hasSeo: string;
  hasDescription: string;
  isActive: string;
}

interface PartCategoryFilterState {
  page: number;
  name: string;
  englishTitle: string;
  parent: string;
  thumbnailAlt: string;
  creatorId: string;
  updaterId: string;
  isActive: string;
}

interface PropertyFilterState {
  page: number;
  name: string;
  type: string;
  parentId: string;
  isMain: string;
  isFilter: string;
  isActive: string;
}

interface PartDescriptionFilterState {
  activeTab: 'car' | 'carType';
  page: number;
  searchedValue: string;
  partId: string;
  creatorId: string;
  isActive: string;
}

interface CarFilterState {
  page: number;
  model: string;
  englishTitle: string;
  carManufacturerId: string;
  carTypeId: string;
  vehicleType: string;
  isAutomatic: string;
  creatorId: string;
  isActive: string;
}

interface CarTypeFilterState {
  page: number;
  name: string;
  englishTitle: string;
  carManufacturerId: string;
  isActive: string;
}

interface CarManufacturerFilterState {
  page: number;
  name: string;
  englishTitle: string;
  isActive: string;
}

interface FilterStore {
  // فیلترهای محصولات
  productFilters: ProductFilterState;
  setProductFilter: (key: keyof ProductFilterState, value: any) => void;
  resetProductFilters: () => void;

  // فیلترهای برندها
  brandFilters: BrandFilterState;
  setBrandFilter: (key: keyof BrandFilterState, value: any) => void;
  resetBrandFilters: () => void;

  // فیلترهای قطعات پایه
  partFilters: PartFilterState;
  setPartFilter: (key: keyof PartFilterState, value: any) => void;
  resetPartFilters: () => void;

  // فیلترهای دسته‌بندی قطعات
  partCategoryFilters: PartCategoryFilterState;
  setPartCategoryFilter: (key: keyof PartCategoryFilterState, value: any) => void;
  resetPartCategoryFilters: () => void;

  // فیلترهای ویژگی‌های قطعات
  propertyFilters: PropertyFilterState;
  setPropertyFilter: (key: keyof PropertyFilterState, value: any) => void;
  resetPropertyFilters: () => void;

  // فیلترهای توضیحات قطعه-خودرو
  partDescriptionFilters: PartDescriptionFilterState;
  setPartDescriptionFilter: (key: keyof PartDescriptionFilterState, value: any) => void;
  resetPartDescriptionFilters: () => void;

  // فیلترهای مدل‌های خودرو
  carFilters: CarFilterState;
  setCarFilter: (key: keyof CarFilterState, value: any) => void;
  resetCarFilters: () => void;

  // فیلترهای انواع خودرو (CarTypes)
  carTypeFilters: CarTypeFilterState;
  setCarTypeFilter: (key: keyof CarTypeFilterState, value: any) => void;
  resetCarTypeFilters: () => void;

  // فیلترهای خودروسازان (CarManufacturers)
  carManufacturerFilters: CarManufacturerFilterState;
  setCarManufacturerFilter: (key: keyof CarManufacturerFilterState, value: any) => void;
  resetCarManufacturerFilters: () => void;
}

const defaultProductFilters: ProductFilterState = {
  page: 1,
  title: '',
  productCode: '',
  isActive: '',
  creatorId: '',
  updaterId: '',
  brandId: '',
  partId: '',
};

const defaultBrandFilters: BrandFilterState = {
  page: 1,
  name: '',
  englishTitle: '',
  creatorId: '',
  isInMain: '',
  isConfirmed: '',
  isActive: '',
};

const defaultPartFilters: PartFilterState = {
  page: 1,
  name: '',
  englishTitle: '',
  description: '',
  partCategoryId: '',
  creatorId: '',
  updaterId: '',
  hasSeo: '',
  hasDescription: '',
  isActive: '',
};

const defaultPartCategoryFilters: PartCategoryFilterState = {
  page: 1,
  name: '',
  englishTitle: '',
  parent: '',
  thumbnailAlt: '',
  creatorId: '',
  updaterId: '',
  isActive: '',
};

const defaultPropertyFilters: PropertyFilterState = {
  page: 1,
  name: '',
  type: '',
  parentId: '',
  isMain: '',
  isFilter: '',
  isActive: '',
};

const defaultPartDescriptionFilters: PartDescriptionFilterState = {
  activeTab: 'car',
  page: 1,
  searchedValue: '',
  partId: '',
  creatorId: '',
  isActive: '',
};

const defaultCarFilters: CarFilterState = {
  page: 1,
  model: '',
  englishTitle: '',
  carManufacturerId: '',
  carTypeId: '',
  vehicleType: '',
  isAutomatic: '',
  creatorId: '',
  isActive: '',
};

const defaultCarTypeFilters: CarTypeFilterState = {
  page: 1,
  name: '',
  englishTitle: '',
  carManufacturerId: '',
  isActive: '',
};

const defaultCarManufacturerFilters: CarManufacturerFilterState = {
  page: 1,
  name: '',
  englishTitle: '',
  isActive: '',
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      productFilters: defaultProductFilters,
      setProductFilter: (key, value) =>
        set((state) => ({
          productFilters: {
            ...state.productFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetProductFilters: () => set({ productFilters: defaultProductFilters }),

      brandFilters: defaultBrandFilters,
      setBrandFilter: (key, value) =>
        set((state) => ({
          brandFilters: {
            ...state.brandFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetBrandFilters: () => set({ brandFilters: defaultBrandFilters }),

      partFilters: defaultPartFilters,
      setPartFilter: (key, value) =>
        set((state) => ({
          partFilters: {
            ...state.partFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetPartFilters: () => set({ partFilters: defaultPartFilters }),

      partCategoryFilters: defaultPartCategoryFilters,
      setPartCategoryFilter: (key, value) =>
        set((state) => ({
          partCategoryFilters: {
            ...state.partCategoryFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetPartCategoryFilters: () => set({ partCategoryFilters: defaultPartCategoryFilters }),

      propertyFilters: defaultPropertyFilters,
      setPropertyFilter: (key, value) =>
        set((state) => ({
          propertyFilters: {
            ...state.propertyFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetPropertyFilters: () => set({ propertyFilters: defaultPropertyFilters }),

      partDescriptionFilters: defaultPartDescriptionFilters,
      setPartDescriptionFilter: (key, value) =>
        set((state) => ({
          partDescriptionFilters: {
            ...state.partDescriptionFilters,
            [key]: value,
            ...(key !== 'page' && key !== 'activeTab' ? { page: 1 } : {}),
          },
        })),
      resetPartDescriptionFilters: () => set({ partDescriptionFilters: defaultPartDescriptionFilters }),

      carFilters: defaultCarFilters,
      setCarFilter: (key, value) =>
        set((state) => ({
          carFilters: {
            ...state.carFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetCarFilters: () => set({ carFilters: defaultCarFilters }),

      carTypeFilters: defaultCarTypeFilters,
      setCarTypeFilter: (key, value) =>
        set((state) => ({
          carTypeFilters: {
            ...state.carTypeFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetCarTypeFilters: () => set({ carTypeFilters: defaultCarTypeFilters }),

      carManufacturerFilters: defaultCarManufacturerFilters,
      setCarManufacturerFilter: (key, value) =>
        set((state) => ({
          carManufacturerFilters: {
            ...state.carManufacturerFilters,
            [key]: value,
            ...(key !== 'page' ? { page: 1 } : {}),
          },
        })),
      resetCarManufacturerFilters: () => set({ carManufacturerFilters: defaultCarManufacturerFilters }),
    }),
    {
      name: 'yadakchi-persistent-filters-v9',
    }
  )
);