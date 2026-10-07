// src/features/page-builder/components/PageBuilderEditor.tsx

'use client';

import { Puck } from '@measured/puck';
import { puckConfig } from '../config/puck.config';
import { ColorPickerField } from './Fields/ColorPickerField';
import { ImagePickerField } from './Fields/ImagePickerField';

interface PageBuilderEditorProps {
  data: any;
  onPublish: (data: any) => void | Promise<void>;
}

export function PageBuilderEditor({ data, onPublish }: PageBuilderEditorProps) {
  return (
    <Puck
      config={puckConfig}
      data={data}
      onPublish={onPublish}
      overrides={{
        fieldTypes: {
          text: ({ field, value, onChange }) => {
            // اگه label شامل کلمه رنگ بود → ColorPicker
            if (field.label?.includes('رنگ')) {
              return (
                <ColorPickerField
                  value={(value as string) || ''}
                  onChange={onChange}
                  label={field.label}
                />
              );
            }
            // اگه label شامل کلمه تصویر بود → ImagePicker
            if (
              field.label?.includes('تصویر') ||
              field.label?.includes('آدرس تصویر')
            ) {
              return (
                <ImagePickerField
                  value={(value as string) || ''}
                  onChange={onChange}
                  label={field.label}
                />
              );
            }
            // وگرنه text عادی
            return (
              <div className="space-y-1.5">
                {field.label && (
                  <label className="block text-[11px] font-medium text-neutral-300">
                    {field.label}
                  </label>
                )}
                <input
                  type="text"
                  value={(value as string) || ''}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            );
          },
        },
      }}
    />
  );
}