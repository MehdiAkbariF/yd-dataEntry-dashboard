// src/features/products/hooks/useProductForm.ts
import { useState, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/axios';

interface Property {
  id: string;
  name: string;
  type: 'Input' | 'DropDown' | 'Select' | 'MultiSelect';
  isRequired?: boolean;
  [key: string]: any;
}

interface PropertyDropDownValue {
  id: string;
  value: string;
}

interface PropertyMultiSelectValue {
  id: string;
  value: string;
}

interface ProductFormDependencies {
  partProperties: Property[];
  propertyDropdowns: Record<string, PropertyDropDownValue[]>;
  propertyMultiSelects: Record<string, PropertyMultiSelectValue[]>;
}

export const useProductForm = () => {
  const [dependencies, setDependencies] = useState<ProductFormDependencies>({
    partProperties: [],
    propertyDropdowns: {},
    propertyMultiSelects: {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  // تابع دریافت ویژگی‌ها
  const fetchPropertiesForPart = useCallback(async (partId: string) => {
    if (!partId) {
      setDependencies((prev) => ({
        ...prev,
        partProperties: [],
        propertyDropdowns: {},
        propertyMultiSelects: {},
      }));
      return;
    }

    console.log('🔄 Fetching properties for partId:', partId);
    setPropertiesLoading(true);

    try {
      // دریافت ویژگی‌ها
      const response = await apiClient.get('/api/A_Part/Properties', {
        params: {
          PartId: partId,
          PageNumber: 1,
          PageSize: 50
        }
      });

      const properties = response.data?.items || [];
      console.log('✅ Properties loaded:', properties.length);

      setDependencies((prev) => ({
        ...prev,
        partProperties: properties,
      }));

      // دریافت مقادیر DropDown و MultiSelect
      await Promise.all(
        properties.map(async (prop: Property) => {
          const propType = prop.type as string;
          
          if (propType === 'DropDown') {
            try {
              const res = await apiClient.get('/api/A_Part/PropertyDropDown', {
                params: {
                  PropertyId: prop.id,
                  PageNumber: 1,
                  PageSize: 999
                }
              });
              const items = res.data?.items || [];
              setDependencies((prevDeps) => ({
                ...prevDeps,
                propertyDropdowns: {
                  ...prevDeps.propertyDropdowns,
                  [prop.id]: items,
                },
              }));
              console.log(`📋 Dropdown values loaded for ${prop.name}:`, items.length);
            } catch (err) {
              console.error('Error fetching dropdown values:', err);
            }
          } else if (propType === 'MultiSelect') {
            try {
              const res = await apiClient.get('/api/A_Part/PropertyMultiSelect', {
                params: {
                  PropertyId: prop.id,
                  PageNumber: 1,
                  PageSize: 999
                }
              });
              const items = res.data?.items || [];
              setDependencies((prevDeps) => ({
                ...prevDeps,
                propertyMultiSelects: {
                  ...prevDeps.propertyMultiSelects,
                  [prop.id]: items,
                },
              }));
              console.log(`📋 MultiSelect values loaded for ${prop.name}:`, items.length);
            } catch (err) {
              console.error('Error fetching multi-select values:', err);
            }
          }
        })
      );

    } catch (err) {
      console.error('❌ Error fetching properties:', err);
      setDependencies({
        partProperties: [],
        propertyDropdowns: {},
        propertyMultiSelects: {},
      });
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  const actions = useMemo(
    () => ({
      fetchPropertiesForPart,
    }),
    [fetchPropertiesForPart]
  );

  return {
    dependencies,
    actions,
    isLoading,
    propertiesLoading,
  };
};

export type UseProductFormReturn = ReturnType<typeof useProductForm>;