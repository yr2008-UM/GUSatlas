import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TMP_DIR = path.join(process.cwd(), 'tmp');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('file');

  if (!fileName || fileName.includes('..')) {
    return NextResponse.json(
      { message: 'Invalid file name' },
      { status: 400 }
    );
  }

  const filePath = path.join(TMP_DIR, fileName);

  try {
    // 检查文件是否存在
    await fs.access(filePath);
    
    // 读取文件内容
    const fileContent = await fs.readFile(filePath);
    
    // 返回文件供下载
    const response = new NextResponse(fileContent);
    
    response.headers.set('Content-Disposition', `attachment; filename="blast_results.txt"`);
    response.headers.set('Content-Type', 'text/plain');
    
    return response;
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json(
      { message: 'Error retrieving file' },
      { status: 404 }
    );
  }
}
