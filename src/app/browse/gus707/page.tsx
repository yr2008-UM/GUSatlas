'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@mui/joy';
import dynamic from 'next/dynamic';
import { Sheet, Typography } from '@mui/joy';

// Dynamically import TableView with no SSR to avoid hydration mismatch
const TableView = dynamic(
  () => import('@/components/GUS707/TableView'),
  { ssr: false }
);

// Dynamically import MetadataTableView with no SSR
const MetadataTableView = dynamic(
  () => import('@/components/GUS707/MetadataTableView'),
  { ssr: false }
);

// Dynamically import TaxonomicTreeView with no SSR
const TaxonomicTreeView = dynamic(
  () => import('@/components/GUS707/TaxonomicTreeView'),
  { ssr: false }
);

interface GUS707Data {
  ID: string;
  Loop: string;
  Loop1: string;
  Loop2: string;
  Length: string;
  OriginalGene: string;
  TAXid: string;
  Rank: string;
  Name: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  NuclSeq: string;
  ProtSeq: string;
}

export default function GUS707Page() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tableData, setTableData] = useState<GUS707Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/downloads/GUS707.csv');
        const csvText = await response.text();
        
        // Dynamically import Papa Parse to avoid SSR issues
        const Papa = (await import('papaparse')).default;
        const result = Papa.parse<GUS707Data>(csvText, {
          header: true,
          skipEmptyLines: true
        });

        const filteredData = result.data.map(row => ({
          ID: row.ID,
          Loop: row.Loop,
          Loop1: row.Loop1,
          Loop2: row.Loop2,
          Length: row.Length,
          OriginalGene: row.OriginalGene,
          TAXid: row.TAXid,
          Rank: row.Rank,
          Name: row.Name,
          phylum: row.phylum,
          class: row.class,
          order: row.order,
          family: row.family,
          genus: row.genus,
          species: row.species,
          NuclSeq: row.NuclSeq,
          ProtSeq: row.ProtSeq
        }));

        setTableData(filteredData);
            } catch (error) {
        console.error('Error loading CSV data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 确保在服务器端和客户端渲染时内容一致
  if (!mounted) {
    return (
      <Sheet sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
        <Typography level="h1">Loading...</Typography>
      </Sheet>
    );
  }

  return (
    <Sheet sx={{ p: 4, maxWidth: 1600, margin: '0 auto' }}>
      <Typography level="h1">GUS707</Typography>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">GUS707 Database</h1>
        
        <Tabs
          value={selectedTab}
          onChange={(event, value) => setSelectedTab(value as number)}
          sx={{ backgroundColor: 'background.surface' }}
        >
          <TabList>
            <Tab>View by tabular</Tab>
            <Tab>View by taxtree</Tab>
          </TabList>
          <TabPanel value={0}>
            <div className="py-4">
              <h2 className="text-2xl font-semibold mb-4">Filter by features of GUS</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  Loading data...
                </div>
              ) : (
                <TableView data={tableData} />
              )}
            </div>
            <div className="py-4 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Filter by metadata of samples</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  Loading metadata...
                </div>
              ) : (
                <MetadataTableView data={tableData} />
              )}
            </div>
          </TabPanel>
          <TabPanel value={1}>
            <div className="py-4">
              <h2 className="text-xl font-semibold mb-4">Taxonomic Tree View</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  Loading taxonomy data...
                </div>
              ) : (
                <TaxonomicTreeView data={tableData} />
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </Sheet>
  );
}