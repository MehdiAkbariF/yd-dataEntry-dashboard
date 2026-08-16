// src/features/products/hooks/useProductProperties.ts
import { useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/axios';

interface Property {
  id: string;
  name: string;
  type: 'Input' | 'DropDown' | 'Select' | 'MultiSelect';
  isRequired?: boolean;
  [key: string]: any;
}

interface UseProductPropertiesReturn {
  properties: Property[];
  propertyValues: Record<string, string>;
  setPropertyValue: (propertyId: string, value: string) => void;
  setPropertyValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isLoading: boolean;
  loadProperties: (partId: string) => Promise<void>;
  resetProperties: () => void;
  loadPropertyValuesFromProduct: (productDetails: any[]) => void;
}

export const useProductProperties = (): UseProductPropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyValues, setPropertyValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef<string>('');

  const loadProperties = useCallback(async (partId: string) => {
    if (!partId) {
      setProperties([]);
      setPropertyValues({});
      return;
    }

    // جلوگیری از درخواست تکراری با همان partId
    if (loadingRef.current === partId) {
      console.log('⏭️ Skipping duplicate request for partId:', partId);
      return;
    }

    console.log('🔄 Loading properties for partId:', partId);
    loadingRef.current = partId;
    setIsLoading(true);
    
    try {
      // ✅ استفاده از مسیر صحیح /A_Part/Properties با پارامتر PartId
      const response = await apiClient.get('/api/A_Part/Properties', {
        params: {
          PartId: partId,
          PageNumber: 1,
          PageSize: 50
        }
      });
      
      // داده‌ها در response.items قرار دارند
      const props = response.data?.items || [];
      console.log('✅ Properties loaded:', props.length);
      setProperties(props);
    } catch (error) {
      console.error('❌ Error loading properties:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
      loadingRef.current = '';
    }
  }, []);

  const setPropertyValue = useCallback((propertyId: string, value: string) => {
    setPropertyValues(prev => ({
      ...prev,
      [propertyId]: value
    }));
  }, []);

  const resetProperties = useCallback(() => {
    setProperties([]);
    setPropertyValues({});
    loadingRef.current = '';
  }, []);

  const loadPropertyValuesFromProduct = useCallback((productDetails: any[]) => {
    if (!productDetails || productDetails.length === 0) return;
    
    const vals: Record<string, string> = {};
    productDetails.forEach((detail: any) => {
      vals[detail.propertyId] = detail.value;
    });
    setPropertyValues(vals);
    console.log('📦 Property values loaded from product:', vals);
  }, []);

  return {
    properties,
    propertyValues,
    setPropertyValue,
    setPropertyValues,
    isLoading,
    loadProperties,
    resetProperties,
    loadPropertyValuesFromProduct,
  };
};