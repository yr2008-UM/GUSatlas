import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data', 'contact-submissions');
const ATTACHMENTS_DIR = path.join(SUBMISSIONS_DIR, 'attachments');

async function ensureDirectoryExists(directory: string) {
  try {
    await fs.access(directory);
  } catch {
    await fs.mkdir(directory, { recursive: true });
  }
}

async function saveAttachment(file: File, submissionId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${submissionId}-${file.name}`;
  const filePath = path.join(ATTACHMENTS_DIR, fileName);
  await fs.writeFile(filePath, buffer);
  return fileName;
}

async function saveSubmission(data: {
  subject: string;
  email: string;
  message: string;
  attachments: File[];
}) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const submissionId = `submission-${timestamp}`;
  const fileName = `${submissionId}.json`;
  const filePath = path.join(SUBMISSIONS_DIR, fileName);

  // 确保目录存在
  await ensureDirectoryExists(SUBMISSIONS_DIR);
  await ensureDirectoryExists(ATTACHMENTS_DIR);

  // 保存附件
  const savedAttachments = await Promise.all(
    data.attachments.map(async (file) => {
      const savedFileName = await saveAttachment(file, submissionId);
      return {
        originalName: file.name,
        savedName: savedFileName,
        size: file.size,
        type: file.type
      };
    })
  );

  // 保存提交记录
  const submissionData = {
    subject: data.subject,
    email: data.email,
    message: data.message,
    attachments: savedAttachments,
    submittedAt: new Date().toISOString()
  };

  await fs.writeFile(filePath, JSON.stringify(submissionData, null, 2));
  return fileName;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const subject = formData.get('subject');
    const email = formData.get('email');
    const message = formData.get('message');
    const attachments = formData.getAll('attachments') as File[];

    // 验证必填字段
    if (!subject || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 保存提交记录和附件
    const fileName = await saveSubmission({
      subject: subject.toString(),
      email: email.toString(),
      message: message.toString(),
      attachments
    });

    return NextResponse.json(
      { 
        message: 'Message and attachments sent successfully',
        submissionId: fileName
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}