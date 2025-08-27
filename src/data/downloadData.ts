interface DownloadItem {
  file: string;
  description: string;
  size: string;
  downloadLink: string;
}

export const downloadData: DownloadItem[] = [
  {
    file: 'GUS550',
    description: 'CSV format.\nDerived from our published manuscript[1], based on a CRC cohort comprising 571 samples.\nIt includes features such as: loop category, Loop1 and Loop2 regions, sequence length, taxonomic information, and both nucleotide and amino acid sequences.',
    size: '2M',
    downloadLink: 'GUS550.csv'
  },
  {
    file: 'GUS707',
    description: 'CSV format.\nAlso from our published manuscript[2], based on seven CRC cohorts with a total of 1,359 samples.\nIt includes features such as: loop category, Loop1 and Loop2 regions, sequence length, taxonomic information, and both nucleotide and amino acid sequences.',
    size: '2.6M',
    downloadLink: 'GUS707.csv'
  },
  {
    file: 'GUSref1144',
    description: 'CSV format.\nAdditionally from our manuscript[1], used as a reference for GUS identification.\nIt includes features such as: loop category, Loop1 and Loop2 regions, sequence length, taxonomic information, and both nucleotide and amino acid sequences.',
    size: '88K',
    downloadLink: 'GUSref1144.csv'
  },
  {
    file: "Loopref12",
    description: 'FASTA format.\nUsed as references for loop classification.',
    size: '9.2K',
    downloadLink: 'Loopref12.fa'
  },
  {
    file: "metadata1359",
    description: 'CSV format.\nmetadata for a total of 1,359 samples (including the 571 samples), featuring information on country, group information, CRC stage, disease location, age, gender, BMI, alcohol consumption, smoking status, Brinkman index, TNM, AJCC, and FOBT.',
    size: '9380K',
    downloadLink: 'metadata1359.csv'
  }
];