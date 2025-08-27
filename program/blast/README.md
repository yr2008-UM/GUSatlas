# NCBI BLAST+ 安装和使用指南

本目录包含NCBI BLAST+程序，用于GUS序列的比对和分析。

## 安装说明

### 方法一：直接下载预编译版本

1. 访问NCBI BLAST+官方FTP站点获取最新版本：
   https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/

2. 根据您的操作系统选择合适的压缩包：
   - Linux: `ncbi-blast-[版本号]+-x64-linux.tar.gz`
   - macOS: `ncbi-blast-[版本号]+-x64-macosx.tar.gz`
   - Windows: `ncbi-blast-[版本号]+-win64.exe`

3. 下载压缩包后解压：
   ```bash
   # 在Linux/macOS系统下
   tar -zxvf ncbi-blast-2.16.0+-x64-linux.tar.gz -C /root/project/gusatlas/program/blast/
   ```

4. 解压后的目录结构应如下所示：
   ```
   /root/project/gusatlas/program/blast/ncbi-blast-2.16.0+/
   ├── bin/            # 包含可执行文件
   │   ├── blastn
   │   ├── blastp      # 我们使用的蛋白质序列比对工具
   │   ├── blastx
   │   ├── makeblastdb # 用于创建BLAST数据库
   │   └── ...
   ├── doc/            # 文档
   └── ...
   ```

### 方法二：通过包管理器安装

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ncbi-blast+
```

#### CentOS/RHEL
```bash
sudo yum install blast
```

#### macOS (使用Homebrew)
```bash
brew install blast
```

## 创建BLAST数据库(无需执行，已创建好)

在使用BLAST进行序列比对前，需要先创建数据库：

1. 准备参考序列文件，例如FASTA格式的`references.fasta`

2. 使用`makeblastdb`创建数据库：
```bash
/root/project/gusatlas/program/blast/ncbi-blast-2.16.0+/bin/makeblastdb \
  -in references.fasta \
  -dbtype prot \
  -out references/GUS550/references
```

其中：
- `-in`：输入参考序列文件
- `-dbtype`：数据库类型，`prot`表示蛋白质序列，`nucl`表示核酸序列
- `-out`：输出数据库文件前缀

## 项目中的数据库结构

本应用使用的BLAST数据库位于以下目录：
```
/root/project/gusatlas/program/blast/references/
├── GUS550/
│   └── references.*  # GUS550数据库文件
├── GUS707/
│   └── references.*  # GUS707数据库文件
└── GUSref114/
    └── references.*  # GUSref114数据库文件
```

## 运行BLAST搜索

运行蛋白质序列比对（blastp）：

```bash
/root/project/gusatlas/program/blast/ncbi-blast-2.16.0+/bin/blastp \
  -query input.fasta \
  -db /root/project/gusatlas/program/blast/references/GUS550/references \
  -evalue 0.05 \
  -outfmt 6 \
  -num_threads 4 \
  -out results.txt
```

参数说明：
- `-query`：查询序列文件
- `-db`：数据库路径
- `-evalue`：期望值阈值，越小越严格
- `-outfmt`：输出格式，6表示表格格式
- `-num_threads`：使用的线程数
- `-out`：输出结果文件

## 输出格式

当使用`-outfmt 6`时，输出为制表符分隔的表格格式，包含以下列：
1. 查询序列ID
2. 目标序列ID
3. 序列相似度百分比
4. 比对长度
5. 错配数量
6. 缺口数量
7. 查询序列起始位置
8. 查询序列结束位置
9. 目标序列起始位置
10. 目标序列结束位置
11. 期望值(E-value)
12. 比对得分(bit-score)

## 故障排除

### 数据库错误

如出现"Database memory map file error"错误，可能原因包括：
1. 数据库路径错误
2. 数据库文件不完整或损坏
3. 权限问题

解决方法：
- 确认数据库路径正确
- 重新运行`makeblastdb`创建数据库
- 检查文件权限

### 检查数据库状态

可以使用以下命令检查数据库状态：

```bash
/root/project/gusatlas/program/blast/ncbi-blast-2.16.0+/bin/blastdbcmd -db /root/project/gusatlas/program/blast/references/GUS550/references -info
```

## 参考资料

- [BLAST官方文档](https://www.ncbi.nlm.nih.gov/books/NBK279690/)
- [BLAST命令行应用程序用户手册](https://www.ncbi.nlm.nih.gov/books/NBK279688/)
