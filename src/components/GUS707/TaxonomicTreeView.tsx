'use client';
import { useState, useEffect, useMemo } from 'react';
import { 
  Box, Sheet, Typography, List, ListItem, 
  ListItemButton, IconButton, Chip, Modal, 
  ModalDialog, Table, Button
} from '@mui/joy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

interface TaxonomicTreeViewProps {
  data: GUS707Data[];
}

interface TaxonomicNode {
  name: string;
  children: Record<string, TaxonomicNode>;
  count: number;
}

interface SelectedGenusData {
  genus: string;
  data: GUS707Data[];
}

export default function TaxonomicTreeView({ data }: TaxonomicTreeViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedGenus, setSelectedGenus] = useState<SelectedGenusData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build taxonomy tree from data
  const taxonomyTree = useMemo(() => {
    const tree: TaxonomicNode = {
      name: 'root',
      children: {},
      count: 0
    };

    data.forEach(item => {
      if (!item.phylum) return;

      // Build path through taxonomy levels
      const levels = ['phylum', 'class', 'order', 'family', 'genus', 'species'];
      let currentNode = tree;

      for (const level of levels) {
        const value = item[level];
        if (!value || value === 'NA') break;

        if (!currentNode.children[value]) {
          currentNode.children[value] = {
            name: value,
            children: {},
            count: 0
          };
        }

        currentNode.children[value].count++;
        currentNode = currentNode.children[value];
      }
    });

    return tree;
  }, [data]);

  const handleToggle = (path: string) => {
    setExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleViewGenus = (genus: string) => {
    // Filter data to show only rows from this genus
    const genusData = data.filter(item => item.genus === genus);
    setSelectedGenus({
      genus,
      data: genusData
    });
    setIsModalOpen(true);
  };

  const renderTaxonomyLevel = (node: TaxonomicNode, path: string = '', level: number = 0, nodeType: string = '') => {
    const isExpanded = expanded[path];
    const indentation = level * 20;

    return (
      <Box key={path} sx={{ ml: `${indentation}px` }}>
        <ListItem 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            py: 0.5,
            borderBottom: level === 0 ? '1px solid' : 'none',
            borderColor: 'divider'
          }}
        >
          {Object.keys(node.children).length > 0 ? (
            <IconButton 
              size="sm" 
              variant="plain" 
              onClick={() => handleToggle(path)}
              sx={{ mr: 1 }}
            >
              {isExpanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} /> // Placeholder for alignment
          )}
          
          <Typography level="body-md" sx={{ flexGrow: 1 }}>
            {node.name} 
            {node.count > 0 && (
              <Chip 
                size="sm" 
                color="neutral" 
                variant="soft" 
                sx={{ ml: 1 }}
              >
                {node.count}
              </Chip>
            )}
          </Typography>

          {nodeType === 'genus' && (
            <IconButton 
              size="sm" 
              variant="outlined" 
              color="primary"
              onClick={() => handleViewGenus(node.name)}
              title="View genus entries"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
        </ListItem>
        
        {isExpanded && Object.entries(node.children).map(([childName, childNode], index) => {
          const childPath = path ? `${path}.${childName}` : childName;
          const childLevel = getChildLevel(level);
          const childType = getNodeType(level + 1);
          
          return renderTaxonomyLevel(childNode, childPath, level + 1, childType);
        })}
      </Box>
    );
  };

  // Helper function to determine child level type
  const getNodeType = (level: number): string => {
    const types = ['phylum', 'class', 'order', 'family', 'genus', 'species'];
    return types[level] || '';
  };

  const getChildLevel = (parentLevel: number): string => {
    const levels = ['phylum', 'class', 'order', 'family', 'genus', 'species'];
    return levels[parentLevel + 1] || '';
  };

  return (
    <Sheet sx={{ p: 2, borderRadius: 'sm', overflow: 'auto', maxHeight: '80vh' }}>
      <Typography level="h4" sx={{ mb: 2 }}>Taxonomic Classification</Typography>
      
      <Box sx={{ mt: 2 }}>
        <List sx={{ width: '100%' }}>
          {Object.entries(taxonomyTree.children).map(([phylumName, phylumNode]) => 
            renderTaxonomyLevel(phylumNode, phylumName, 0, 'phylum')
          )}
        </List>
      </Box>

      {/* Modal for displaying genus details */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalDialog
          sx={{
            width: '80vw',
            maxWidth: 1000,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Genus: {selectedGenus?.genus || ''} 
            <Chip sx={{ ml: 1 }}>{selectedGenus?.data.length || 0} entries</Chip>
          </Typography>
          
          <Box sx={{ mt: 2, overflow: 'auto' }}>
            {selectedGenus?.data && selectedGenus.data.length > 0 ? (
              <Table sx={{ '& th': { fontWeight: 'bold' } }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Species</th>
                    <th>TAXid</th>
                    <th>Loop</th>
                    <th>Length</th>
                    <th>Original Gene</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGenus.data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.ID}</td>
                      <td>{row.species}</td>
                      <td>{row.TAXid}</td>
                      <td>{row.Loop}</td>
                      <td>{row.Length}</td>
                      <td>{row.OriginalGene}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Typography>No data available for this genus</Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
