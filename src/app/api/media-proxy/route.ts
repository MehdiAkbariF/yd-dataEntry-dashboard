// src/app/api/media-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get('path');

  if (!targetPath) {
    return new NextResponse('پارامتر path ارسال نشده است.', { status: 400 });
  }

  // بررسی اینکه مسیر نسبی است یا کامل
  const imageUrl = targetPath.startsWith('http')
    ? targetPath
    : `${API_BASE_URL}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        // می‌توانید هدرهای لازم مانند توکن یا User-Agent را اینجا اضافه کنید
        'Accept': 'image/*, */*',
      },
    });

    if (!response.ok) {
      return new NextResponse('خطا در دریافت تصویر از سرور مقصد', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // کش کردن تصویر در مرورگر به مدت ۱ روز جهت سرعت فوق‌العاده
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return new NextResponse('خطای سرور پروکسی در دریافت تصویر', { status: 500 });
  }
}