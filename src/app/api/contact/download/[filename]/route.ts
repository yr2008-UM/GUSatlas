import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ATTACHMENTS_DIR = path.join(process.cwd(), 'data', 'contact-submissions', 'attachments');

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(ATTACHMENTS_DIR, filename);

    // 检查文件是否存在
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // 读取文件
    const file = await fs.readFile(filePath);
    
    // 从文件名中提取原始文件名（移除提交ID前缀）
    const originalFilename = filename.split('-').slice(2).join('-');

    // 设置正确的 Content-Type 和 Content-Disposition
    const headers = new Headers();
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${originalFilename}"`);

    return new NextResponse(file, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}