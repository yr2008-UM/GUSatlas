import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data', 'contact-submissions');

// 获取所有提交记录的列表
export async function GET() {
  try {
    const files = await fs.readdir(SUBMISSIONS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const submissions = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(SUBMISSIONS_DIR, file), 'utf-8');
        const submission = JSON.parse(content);
        return {
          id: path.basename(file, '.json'),
          ...submission
        };
      })
    );
    
    // 按提交时间倒序排序
    submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}