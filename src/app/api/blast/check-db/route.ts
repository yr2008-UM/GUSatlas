import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// BLAST 程序路径 - 在 Docker 中使用系统安装的 BLAST
const BLAST_PROGRAM_DIR = '/usr/bin';
// BLAST 数据库根目录
const DB_ROOT = path.join(process.cwd(), 'program/blast/references');

export async function GET() {
  try {
    const databases = ['gus550', 'gus707', 'gusref114', 'references'];
    const results = {};
    
    // 检查 blastp 程序是否存在
    const blastpPath = path.join(BLAST_PROGRAM_DIR, 'blastp');
    let blastpExists = false;
    
    try {
      await fs.access(blastpPath);
      blastpExists = true;
      
      // 获取程序版本
      const { stdout } = await execPromise(`${blastpPath} -version`);
      results['blastVersion'] = stdout.trim();
    } catch (err) {
      results['blastError'] = `blastp not found at ${blastpPath}`;
    }
    
    // 检查每个数据库
    for (const db of databases) {
      const dbPath = path.join(DB_ROOT, db);
      const dbInfo = {};
      
      // 检查数据库文件
      const files = ['.phr', '.pin', '.psq'];
      for (const ext of files) {
        try {
          const filePath = `${dbPath}${ext}`;
          const stats = await fs.stat(filePath);
          dbInfo[`${ext}`] = { 
            exists: true,
            size: stats.size,
            modified: stats.mtime
          };
        } catch (err) {
          dbInfo[`${ext}`] = { exists: false, error: err.message };
        }
      }
      
      // 如果 blastp 程序存在，尝试获取数据库信息
      if (blastpExists) {
        try {
          const blastdbcmdPath = path.join(BLAST_PROGRAM_DIR, 'blastdbcmd');
          const { stdout, stderr } = await execPromise(`${blastdbcmdPath} -db ${dbPath} -info`);
          
          if (stderr) {
            dbInfo['info'] = { error: stderr };
          } else {
            dbInfo['info'] = { data: stdout };
          }
        } catch (err) {
          dbInfo['info'] = { error: err.message };
        }
      }
      
      results[db] = dbInfo;
    }
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json(
      { error: 'Error checking databases: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
