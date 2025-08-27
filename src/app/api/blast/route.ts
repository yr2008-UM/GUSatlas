import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

// 创建临时目录,用于存储输入和输出文件
const TMP_DIR = path.join(process.cwd(), 'tmp');
// 在 Docker 环境中使用系统安装的 BLAST
const BLASTP_PATH = '/usr/bin/blastp';
// BLAST 数据库根目录
const DB_ROOT = path.join(process.cwd(), 'program/blast/references');

export async function POST(request: NextRequest) {
  try {
    // 确保临时目录存在
    try {
      await fs.access(TMP_DIR);
    } catch {
      await fs.mkdir(TMP_DIR, { recursive: true });
    }

    const { sequence, reference, evalue = "0.05", outputFormat = "6" } = await request.json();
    
    if (!sequence || typeof sequence !== 'string') {
      return NextResponse.json(
        { message: 'Invalid sequence data' },
        { status: 400 }
      );
    }

    if (!reference || typeof reference !== 'string') {
      return NextResponse.json(
        { message: 'Reference database is required' },
        { status: 400 }
      );
    }

    // 根据选择的参考数据库设置db参数
    let dbPath = path.join(DB_ROOT, reference, 'references'); 
    
    // 检查数据库文件是否存在
    try {
      // 尝试访问数据库文件（.phr，.pin，.psq 等格式文件）
      await fs.access(`${dbPath}.phr`);
      console.log(`Database files found at: ${dbPath}`);
    } catch (err) {
      console.error(`Database files not found: ${dbPath}.*`);
      return NextResponse.json(
        { message: `BLAST database not found: ${reference}` },
        { status: 500 }
      );
    }

    // 生成唯一文件名
    const sessionId = uuidv4();
    const inputFilePath = path.join(TMP_DIR, `${sessionId}_input.fasta`);
    const outputFilePath = path.join(TMP_DIR, `${sessionId}_output.txt`);
    
    // 将序列写入文件
    await fs.writeFile(inputFilePath, sequence);
    
    // 执行 BLAST 命令
    const command = `${BLASTP_PATH} -query ${inputFilePath} -db ${dbPath} -evalue ${evalue} -outfmt ${outputFormat} -num_threads 4 -out ${outputFilePath}`;
    console.log(`Executing command: ${command}`);
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error(`BLAST stderr: ${stderr}`);
    }
    
    if (stdout) {
      console.log(`BLAST stdout: ${stdout}`);
    }
    
    // 检查输出文件是否存在并有内容
    try {
      await fs.access(outputFilePath);
      const stats = await fs.stat(outputFilePath);
      
      if (stats.size === 0) {
        // 文件存在但为空，可能是没有匹配结果
        console.log('BLAST completed but no hits found');
      }
    } catch (err) {
      console.error(`Output file error: ${err}`);
      return NextResponse.json(
        { message: 'Error generating BLAST results' },
        { status: 500 }
      );
    }
    
    // 创建下载链接
    const resultUrl = `/api/blast/download?file=${sessionId}_output.txt`;
    
    return NextResponse.json({ 
      resultUrl,
      message: 'BLAST completed successfully'
    });
  } catch (error) {
    console.error('BLAST execution error:', error);
    return NextResponse.json(
      { message: 'Error executing BLAST: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
