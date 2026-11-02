// src/features/page-builder/lib/buildPreviewDoc.ts
interface BuildDocOptions {
  html: string;
  css: string;
  includeTailwind?: boolean;
  includeFonts?: boolean;
}

export function buildPreviewDoc({
  html,
  css,
  includeTailwind = true,
  includeFonts = true,
}: BuildDocOptions): string {
  const tailwind = includeTailwind
    ? '<script src="https://cdn.tailwindcss.com"></script>'
    : '';

  const fonts = includeFonts
    ? '<link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />'
    : '';

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${fonts}
  ${tailwind}
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      font-family: 'Vazirmatn', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #111;
      background-color: #ffffff;
    }
    img { max-width: 100%; height: auto; }
    /* استایل‌های سفارشی شما */
    ${css || ''}
  </style>
</head>
<body>
  ${html || ''}
</body>
</html>`;
}