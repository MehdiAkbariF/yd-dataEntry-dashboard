// src/features/page-builder/lib/legacyMigration.ts
import type { PageContent } from '../types/schema.types';

/**
 * تشخیص اینکه محتوا Puck قدیمی است یا خیر
 */
export function isLegacyPuckContent(raw: string): boolean {
  return (
    typeof raw === 'string' &&
    (raw.startsWith('__PUCK__:') || raw.trim().startsWith('{"root":'))
  );
}

/**
 * تبدیل Puck JSON قدیمی به HTML/CSS معادل
 */
export function migratePuckToHtml(raw: string): PageContent {
  try {
    const jsonStr = raw.startsWith('__PUCK__:')
      ? raw.slice('__PUCK__:'.length)
      : raw;
    const data = JSON.parse(jsonStr);

    const rootProps = data?.root?.props || {};
    const items = Array.isArray(data?.content) ? data.content : [];

    const htmlParts = items
      .map((node: any) => renderNode(node))
      .filter(Boolean);

    // استخراج تنظیمات root
    const maxWidth = rootProps?.maxWidth || 'lg';
    const bg = rootProps?.backgroundColor || '';

    const MAX_WIDTH_MAP: Record<string, string> = {
      sm: 'max-w-2xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-full',
    };

    const containerClass = MAX_WIDTH_MAP[maxWidth] || 'max-w-6xl';

    const html = `<div${bg ? ` style="background-color:${bg};"` : ''}>
  <div class="page-container ${containerClass}">
${htmlParts.map((p) => `    ${p}`).join('\n')}
  </div>
</div>`;

    const css = `.page-container {
  margin: 0 auto;
  padding: 2rem 1rem;
}`;

    return { html, css };
  } catch (e) {
    console.error('[legacyMigration] failed:', e);
    return { html: '', css: '' };
  }
}

// ─────────────────────────────────────────
// Renderer هر node
// ─────────────────────────────────────────
function renderNode(node: any): string {
  if (!node || !node.type) return '';
  const props = node.props || {};

  switch (node.type) {
    case 'Heading':
      return renderHeading(props);
    case 'Text':
      return renderText(props);
    case 'Button':
      return renderButton(props);
    case 'Image':
      return renderImage(props);
    case 'Divider':
      return renderDivider(props);
    case 'Spacer':
      return renderSpacer(props);
    case 'Section':
      return renderSection(props);
    case 'RawHtml':
      return props.html || '';
    default:
      return `<!-- unsupported block: ${node.type} -->`;
  }
}

function alignClass(align: string): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'left':
      return 'text-left';
    case 'right':
    default:
      return 'text-right';
  }
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHeading(props: any): string {
  const level = props.level || 'h2';
  const text = escapeHtml(props.text || '');
  const color = props.color ? ` style="color:${props.color};"` : '';
  const align = alignClass(props.align);
  return `<${level} class="${align}"${color}>${text}</${level}>`;
}

function renderText(props: any): string {
  const content = escapeHtml(props.content || '');
  const align = alignClass(props.align);
  const color = props.color ? ` style="color:${props.color};"` : '';
  return `<p class="${align}"${color}>${content}</p>`;
}

function renderButton(props: any): string {
  const label = escapeHtml(props.label || 'دکمه');
  const href = escapeHtml(props.href || '#');
  const align = alignClass(props.align);
  return `<div class="${align}"><a href="${href}" class="btn">${label}</a></div>`;
}

function renderImage(props: any): string {
  if (!props.src) return '';
  const src = escapeHtml(props.src);
  const alt = escapeHtml(props.alt || '');
  const caption = props.caption
    ? `<figcaption>${escapeHtml(props.caption)}</figcaption>`
    : '';
  return `<figure><img src="${src}" alt="${alt}" />${caption}</figure>`;
}

function renderDivider(props: any): string {
  const style = props.style || 'solid';
  const color = props.color || 'currentColor';
  const thickness = props.thickness || 1;
  const spacing = props.spacing ?? 16;
  return `<hr style="border-style:${style};border-color:${color};border-top-width:${thickness}px;margin:${spacing}px 0;" />`;
}

function renderSpacer(props: any): string {
  const height = props.height || 32;
  return `<div style="height:${height}px;"></div>`;
}

function renderSection(props: any): string {
  const children = Array.isArray(props.content)
    ? props.content.map(renderNode).join('\n')
    : '';
  return `<section>${children}</section>`;
}