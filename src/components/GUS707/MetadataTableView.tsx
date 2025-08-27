'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sheet, 
  Typography, 
  Box, 
  FormControl, 
  FormLabel,
  Input,
  Button,
  Grid,
  Divider,
  Autocomplete,
  Chip,
  Stack,
  Alert,
  Card,
  CardContent
} from '@mui/joy';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import dynamic from 'next/dynamic';

const Heatmap = dynamic(
  () => import('./Heatmap'),
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
  [key: string]: string; // For dynamic column access
}

interface MetadataTableViewProps {
  data: GUS707Data[];
}

// Define the metadata interface based on the CSV headers
interface MetadataItem {
  ID: string;
  Study: string;
  Country: string;
  Group: string;
  Stage: string;
  Disease_location: string;
  Age: string;
  Gender: string;
  BMI: string;
  Alcohol_numeric: string;
  Smoker: string;
  Brinkman_index: string;
  tnm: string;
  AJCC: string;
  fobt: string;
}

export default function MetadataTableView({ data }: MetadataTableViewProps) {
  const [metadataData, setMetadataData] = useState<MetadataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGUSData, setFilteredGUSData] = useState<GUS707Data[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [gus707FullData, setGus707FullData] = useState<GUS707Data[]>([]);
  const [displayColumns, setDisplayColumns] = useState<string[]>(["ID"]);
  
  // Filter state for each column
  const [filters, setFilters] = useState({
    ID: '',
    Study: '',
    Country: '',
    Group: '',
    Stage: '',
    Disease_location: '',
    Age: '',
    Gender: '',
    BMI: '',
    Alcohol_numeric: '',
    Smoker: '',
    Brinkman_index: '',
    tnm: '',
    AJCC: '',
    fobt: ''
  });

  // Options for select fields
  const [uniqueValues, setUniqueValues] = useState<Record<string, Set<string>>>({
    Study: new Set(),
    Country: new Set(),
    Group: new Set(),
    Stage: new Set(),
    Disease_location: new Set(),
    Gender: new Set(),
    Smoker: new Set(),
    AJCC: new Set(),
    fobt: new Set()
  });

  // Load both metadata and full GUS707 data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load metadata1359.csv
        const metadataResponse = await fetch('/downloads/metadata1359.csv');
        const metadataCsvText = await metadataResponse.text();
        
        // Load GUS707.csv for all columns
        const gus707Response = await fetch('/downloads/GUS707.csv');
        const gus707CsvText = await gus707Response.text();
        
        // Dynamically import Papa Parse
        const Papa = (await import('papaparse')).default;
        
        // Parse metadata
        const metadataResult = Papa.parse<MetadataItem>(metadataCsvText, {
          header: true,
          skipEmptyLines: true
        });

        setMetadataData(metadataResult.data);

        // Parse GUS707 data
        const gus707Result = Papa.parse<GUS707Data>(gus707CsvText, {
          header: true,
          skipEmptyLines: true
        });
        
        // Set full GUS707 data
        setGus707FullData(gus707Result.data);
        
        // Set display columns from headers in GUS707.csv
        if (gus707Result.meta.fields && gus707Result.meta.fields.length > 0) {
          // Start with ID column and add all others
          setDisplayColumns(['ID', ...gus707Result.meta.fields.filter(field => field !== 'ID')]);
        }

        // Extract unique values for select filters
        const newUniqueValues: Record<string, Set<string>> = { ...uniqueValues };
        
        for (const item of metadataResult.data) {
          for (const key of Object.keys(newUniqueValues)) {
            const value = item[key as keyof MetadataItem];
            if (value && value !== 'NA') {
              newUniqueValues[key].add(value);
            }
          }
        }
        
        setUniqueValues(newUniqueValues);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      ID: '',
      Study: '',
      Country: '',
      Group: '',
      Stage: '',
      Disease_location: '',
      Age: '',
      Gender: '',
      BMI: '',
      Alcohol_numeric: '',
      Smoker: '',
      Brinkman_index: '',
      tnm: '',
      AJCC: '',
      fobt: ''
    });
    setMatchedIds([]);
    setFilteredGUSData([]);
  };

  const applyFilters = () => {
    // Filter the metadata based on selected criteria
    const filtered = metadataData.filter(item => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue; // Skip empty filters
        
        const itemValue = item[key as keyof MetadataItem];
        if (!itemValue) return false;
        
        if (!itemValue.toString().toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
    
    // Extract matched IDs from filtered metadata
    const ids = filtered.map(item => item.ID);
    setMatchedIds(ids);
    
    // Define base columns here so they're in scope
    const baseColumns = ['ID'];
    
    // Create an object with only the columns that match the filtered IDs
    const matchedData = gus707FullData
      .map(row => {
        const matchedColumns: { [key: string]: string } = {};
        
        // Add base columns
        baseColumns.forEach(col => {
          matchedColumns[col] = row[col];
        });

        // Add any columns that match our filtered IDs
        ids.forEach(id => {
          if (row[id]) {
            matchedColumns[id] = row[id];
          }
        });

        return matchedColumns as GUS707Data;
      })
      // Only keep rows that have matching ID columns
      .filter(row => Object.keys(row).length > baseColumns.length)
      // Filter out rows where all values (except ID) are 0
      .filter(row => {
        const values = Object.entries(row)
          .filter(([key]) => key !== 'ID') // Exclude ID column
          .map(([_, value]) => parseFloat(value) || 0);
        
        return values.some(value => value !== 0); // Keep row if any value is non-zero
      });

    setFilteredGUSData(matchedData);
  };

  // Convert Set to array once for better performance
  const getOptionsArray = (field: keyof typeof uniqueValues) => {
    return Array.from(uniqueValues[field] || []).sort();
  };

  if (isLoading) {
    return (
      <Sheet sx={{ width: '100%', p: 2, borderRadius: 'sm' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Typography level="body-lg">
            Loading metadata filters...
          </Typography>
        </Box>
      </Sheet>
    );
  }

  return (
    <Sheet sx={{ width: '100%', p: 2, borderRadius: 'sm' }}>
      <Typography level="h4" sx={{ mb: 2 }}>Metadata Filters</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          {/* Study Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Study</FormLabel>
              <Autocomplete
                placeholder="Select or type study"
                options={getOptionsArray('Study')}
                value={filters.Study}
                onChange={(_, value) => handleFilterChange('Study', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* Country Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Country</FormLabel>
              <Autocomplete
                placeholder="Select or type country"
                options={getOptionsArray('Country')}
                value={filters.Country}
                onChange={(_, value) => handleFilterChange('Country', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* Group Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Group</FormLabel>
              <Autocomplete
                placeholder="Select or type group"
                options={getOptionsArray('Group')}
                value={filters.Group}
                onChange={(_, value) => handleFilterChange('Group', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* Stage Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Stage</FormLabel>
              <Autocomplete
                placeholder="Select or type stage"
                options={getOptionsArray('Stage')}
                value={filters.Stage}
                onChange={(_, value) => handleFilterChange('Stage', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* Disease Location Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Disease Location</FormLabel>
              <Autocomplete
                placeholder="Select or type location"
                options={getOptionsArray('Disease_location')}
                value={filters.Disease_location}
                onChange={(_, value) => handleFilterChange('Disease_location', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* Age Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Age</FormLabel>
              <Input
                placeholder="Enter age"
                value={filters.Age}
                onChange={(e) => handleFilterChange('Age', e.target.value)}
              />
            </FormControl>
          </Grid>

          {/* Gender Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>Gender</FormLabel>
              <Autocomplete
                placeholder="Select or type gender"
                options={getOptionsArray('Gender')}
                value={filters.Gender}
                onChange={(_, value) => handleFilterChange('Gender', value || '')}
                freeSolo
              />
            </FormControl>
          </Grid>

          {/* BMI Filter */}
          <Grid xs={12} sm={6} md={4} lg={3}>
            <FormControl size="sm" sx={{ mb: 2 }}>
              <FormLabel>BMI</FormLabel>
              <Input
                placeholder="Enter BMI"
                value={filters.BMI}
                onChange={(e) => handleFilterChange('BMI', e.target.value)}
              />
            </FormControl>
          </Grid>

          {/* Filter and Reset buttons */}
          <Grid xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="solid" 
                color="primary" 
                startDecorator={<FilterAltIcon />} 
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined" 
                color="neutral" 
                startDecorator={<RestartAltIcon />} 
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Results display */}
      <Box sx={{ mt: 4 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
          Filtered Results 
          {matchedIds.length > 0 && 
            <Typography level="body-md" component="span" sx={{ ml: 2 }}>
              ({matchedIds.length} matches found)
            </Typography>
          }
        </Typography>
        
        {matchedIds.length > 0 ? (
          <>
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {matchedIds.slice(0, 10).map(id => (
                  <Chip key={id} color="primary" variant="soft">{id}</Chip>
                ))}
                {matchedIds.length > 10 && (
                  <Chip color="neutral" variant="soft">+{matchedIds.length - 10} more</Chip>
                )}
              </Stack>
            </Box>
            
            {/* Add Heatmap component */}
            <Heatmap data={filteredGUSData} />
            
            {/* Raw data display */}
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography level="body-sm" sx={{ mb: 1, fontFamily: 'monospace' }}>
                  Matched IDs: {matchedIds.length}
                </Typography>
                <Box 
                  sx={{ 
                    maxHeight: '500px',
                    overflowY: 'auto',
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(filteredGUSData, null, 2)}
                  </pre>
                </Box>
              </CardContent>
            </Card>
          </>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography level="body-lg">
              {matchedIds.length === 0 && filters.Study === '' && filters.Country === '' ? 
                'Apply filters to see results' : 
                'No matching data found'}
            </Typography>
          </Box>
        )}
      </Box>
    </Sheet>
  );
}
