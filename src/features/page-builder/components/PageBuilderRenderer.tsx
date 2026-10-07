// src/features/page-builder/components/PageBuilderRenderer.tsx

'use client';

import { Render } from '@measured/puck';
import { puckConfig } from '../config/puck.config';
import type { PageSchema } from '../types/schema.types';

interface PageBuilderRendererProps {
  schema: PageSchema;
}

export function PageBuilderRenderer({ schema }: PageBuilderRendererProps) {
  return (
    <div dir="rtl">
      <Render config={puckConfig} data={schema} />
    </div>
  );
}