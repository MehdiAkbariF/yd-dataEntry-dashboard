// src/features/page-builder/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ADD_ATTR: ['target', 'rel', 'loading', 'class', 'style', 'data-*', 'aria-*'],
    ADD_TAGS: ['iframe'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onchange'],
  });
}

export function sanitizeCss(css: string): string {
  if (!css) return '';
  return css
    .replace(/@import[^;]+;/gi, '')
    .replace(/url\(\s*['"]?\s*javascript:[^)]*\)/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/behavior\s*:/gi, '');
}