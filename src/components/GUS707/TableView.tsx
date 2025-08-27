import { useState, useEffect, useRef } from 'react';

interface GUS707Data {
  ID: string; // Changed from lowercase 'id' to uppercase 'ID' to match the page.tsx
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

interface TableViewProps {
  data: GUS707Data[];
}

export default function TableView({ data }: TableViewProps) {
  const [isClient, setIsClient] = useState(false);
  const safeData = Array.isArray(data) ? data : [];
  const [searchTerm, setSearchTerm] = useState('');
  const columnsToFilter = ['Loop', 'Length', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  
  // Modal state for sequences
  const [modalContent, setModalContent] = useState<{
    type: 'nucl' | 'prot';
    sequence: string;
    visible: boolean;
  }>({
    type: 'nucl',
    sequence: '',
    visible: false
  });

  // Refs for scroll synchronization
  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate table width based on number of columns
  const tableWidth = '3000px'; // Increased from 2500px to ensure it's wide enough

  // Improve scroll synchronization
  const handleTopScroll = () => {
    if (topScrollRef.current && tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleTableScroll = () => {
    if (topScrollRef.current && tableContainerRef.current) {
      topScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
    }
  };

  // Replace the fixed column widths with auto-adjusting approach
  const columnWidths = {
    id: 'minmax(80px, auto)',
    loop: 'minmax(100px, auto)',
    loop1: 'minmax(120px, auto)',
    loop2: 'minmax(120px, auto)',
    length: 'minmax(100px, auto)',
    originalGene: 'minmax(180px, auto)',
    taxId: 'minmax(100px, auto)',
    rank: 'minmax(100px, auto)',
    name: 'minmax(150px, auto)',
    phylum: 'minmax(120px, auto)',
    class: 'minmax(120px, auto)',
    order: 'minmax(120px, auto)',
    family: 'minmax(120px, auto)',
    genus: 'minmax(120px, auto)',
    species: 'minmax(150px, auto)',
    nuclSeq: 'minmax(100px, auto)',
    protSeq: 'minmax(100px, auto)'
  };

  // Apply filter across all specified columns
  const filteredData = safeData.filter(row => {
    if (!searchTerm) return true;
    
    // Check if any of the specified columns contains the search term
    return columnsToFilter.some(column => {
      const value = row[column as keyof GUS707Data];
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Function to handle displaying the sequence content
  const handleDisplaySequence = (type: 'nucl' | 'prot', sequence: string) => {
    setModalContent({
      type,
      sequence,
      visible: true
    });
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setModalContent(prev => ({
      ...prev,
      visible: false
    }));
  };

  return (
    <div className="container" style={{
      width: '100%',
      margin: '0 auto',
      padding: '20px 0',
      maxWidth: '1600px',
    }}>
      {/* Search bar in the top right corner */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginBottom: '16px',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '14px', marginRight: '10px', color: '#495057' }}>
          Filter table:
        </div>
        <div style={{ width: '500px', position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in Loop, Length, Phylum, Class, Order, Family, Genus, Species..."
            style={{
              width: '100%',
              padding: '8px 12px',
              paddingRight: '32px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#6c757d',
                fontSize: '14px',
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive" style={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}>
        {/* Top horizontal scrollbar - improved styling */}
        <div 
          className="top-scrollbar"
          style={{ 
            overflowX: 'auto',
            overflowY: 'hidden',
            marginBottom: '8px',
            height: '17px', // Match the height of standard scrollbars
            borderBottom: '1px solid #e9ecef'
          }}
          ref={topScrollRef}
          onScroll={handleTopScroll}
        >
          <div style={{ 
            height: '1px',
            width: tableWidth,
          }}></div>
        </div>
        
        {/* Table container with synchronized scroll */}
        <div 
          ref={tableContainerRef}
          onScroll={handleTableScroll} 
          style={{ maxHeight: '70vh', overflow: 'auto' }}
        >
          <table className="table" style={{
            width: tableWidth, // Make sure this matches the width in top scrollbar
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            tableLayout: 'fixed', // Change back to fixed for consistent widths
          }}>
            {/* Instead of using colgroup with fixed widths, we'll let the browser auto-adjust */}
            <thead>
              <tr style={{ 
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6',
              }}>
                <th style={{...tableHeaderStyle, minWidth: '80px'}}>ID</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>Loop</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Loop1</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Loop2</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>Length</th>
                <th style={{...tableHeaderStyle, minWidth: '180px'}}>Original Gene</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>TAX ID</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>Rank</th>
                <th style={{...tableHeaderStyle, minWidth: '150px'}}>Name</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Phylum</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Class</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Order</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Family</th>
                <th style={{...tableHeaderStyle, minWidth: '120px'}}>Genus</th>
                <th style={{...tableHeaderStyle, minWidth: '150px'}}>Species</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>Nucl Seq</th>
                <th style={{...tableHeaderStyle, minWidth: '100px'}}>Prot Seq</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr 
                  key={index} 
                  style={{
                    backgroundColor: isClient && index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    borderBottom: '1px solid #dee2e6',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    if (isClient) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f3f5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (isClient) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                    }
                  }}
                >
                  <td style={tableCellStyle}>{row.ID}</td>  {/* Changed from row.id to row.ID */}
                  <td style={tableCellStyle}>{row.Loop}</td>
                  <td style={{...tableCellStyle, overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.Loop1}>
                    {row.Loop1}
                  </td>
                  <td style={{...tableCellStyle, overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.Loop2}>
                    {row.Loop2}
                  </td>
                  <td style={{...tableCellStyle, overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.Length}>
                    {row.Length}
                  </td>
                  <td style={{...tableCellStyle, overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.OriginalGene}>
                    {row.OriginalGene}
                  </td>
                  <td style={tableCellStyle}>{row.TAXid}</td>
                  <td style={tableCellStyle}>{row.Rank}</td>
                  <td style={{...tableCellStyle, overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.Name}>
                    {row.Name}
                  </td>
                  <td style={tableCellStyle}>{row.phylum}</td>
                  <td style={tableCellStyle}>{row.class}</td>
                  <td style={tableCellStyle}>{row.order}</td>
                  <td style={tableCellStyle}>{row.family}</td>
                  <td style={tableCellStyle}>{row.genus}</td>
                  <td style={tableCellStyle}>{row.species}</td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => handleDisplaySequence('nucl', row.NuclSeq)}
                      style={displayButtonStyle}
                    >
                      Display
                    </button>
                  </td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => handleDisplaySequence('prot', row.ProtSeq)}
                      style={displayButtonStyle}
                    >
                      Display
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#6c757d', textAlign: 'center' }}>
        Showing {filteredData.length} of {safeData.length} results
      </div>
      
      {/* Modal for displaying sequences */}
      {modalContent.visible && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h3>{modalContent.type === 'nucl' ? 'Nucleotide Sequence' : 'Protein Sequence'}</h3>
              <button onClick={handleCloseModal} style={modalCloseButtonStyle}>×</button>
            </div>
            <div style={modalBodyStyle}>
              <div style={sequenceContainerStyle}>
                {modalContent.sequence}
              </div>
            </div>
            <div style={modalFooterStyle}>
              <button onClick={handleCloseModal} style={modalButtonStyle}>Close</button>
              <button 
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(modalContent.sequence);
                  }
                }} 
                style={{...modalButtonStyle, backgroundColor: '#007bff', color: 'white'}}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#495057',
  position: 'sticky',
  top: 0,
  backgroundColor: '#f8f9fa',
  zIndex: 1,
  whiteSpace: 'nowrap', // Keep this to prevent wrapping
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#212529',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap', // This prevents text wrapping
  maxWidth: '300px', // Add maximum width
  overflow: 'hidden',  // Hide overflow
  textOverflow: 'ellipsis', // Add ellipsis for overflow text
};

// New styles for the sequence display feature
const displayButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  backgroundColor: '#e9ecef',
  color: '#495057',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold',
  transition: 'all 0.2s ease',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  backgroundColor: '#f8f9fa',
  color: '#495057',
  border: '1px solid #ced4da',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const sequenceCellStyle: React.CSSProperties = {
  padding: 0,
};

// Modal styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
};

const modalHeaderStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalBodyStyle: React.CSSProperties = {
  padding: '16px',
  overflowY: 'auto',
  flexGrow: 1,
  maxHeight: '60vh',
};

const modalFooterStyle: React.CSSProperties = {
  padding: '16px',
  borderTop: '1px solid #eee',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
};

const modalCloseButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#6c757d',
};

const modalButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '4px',
  border: '1px solid #ced4da',
  background: '#f8f9fa',
  cursor: 'pointer',
};

const sequenceContainerStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '4px',
  border: '1px solid #e0e0e0',
  fontFamily: 'monospace',
  fontSize: '14px',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowY: 'auto',
  maxHeight: '100%',
};