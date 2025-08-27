'use client';
import { useState, useRef, ChangeEvent } from 'react';
import { 
  Sheet, 
  Typography, 
  Box, 
  FormControl,
  FormLabel,
  Textarea,
  Button,
  Select,
  Option,
  Input,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  RadioGroup,
  Radio,
  CircularProgress,
  Card
} from '@mui/joy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function BlastGUSPage() {
  const [sequence, setSequence] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [evalue, setEvalue] = useState<string>("0.05");
  const [outputFormat, setOutputFormat] = useState<string>("6");
  const [title, setTitle] = useState<string>("BLAST against GUS Sequences");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleSequenceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSequence(event.target.value);
  };

  const handleReferenceChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue) setReference(newValue);
  };

  const handleEvalueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEvalue(event.target.value);
  };

  const handleOutputFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutputFormat(event.target.value);
  };

  const handleClearSequence = () => {
    setSequence('');
  };

  const handleUseExample = () => {
    setSequence('MNNSMLYPVESRTRRVVDLSGIWDFKVDVNNEGISKEYYKGLKESDFIPVPSSYNDLFTDKKIREHVGYVWYERDFYLPLEWKDMDVNIRFGCATHKAIVYINGKEVAMHIGGFTPFNAPVNEAGIFGEKNKLVVAVNNELYQTTVPCGHTETKPTGEKYIRPSFDFFNYAGLNRPIKITATNKEYINDIDILTDIKDSDGIVNYEVKASSEKGKIFVSIFDKENNEVGKSEGKKGNITIKNAKLWNPKASYLYKFVAVIKDGDELIDEYYLDFGIRTVKVEGTKLLINGKPFYFTGFGKHEDSEIAGRGYNPPVIKRDFELIKWVGANSFRTSHYPYSEEIMQAADREGIVVIDEVAAVGMFDVGSVLNPGASKMDYFSQKEVHTETKEAHKKAIEELIQRDKNHPCVVMWSLLNEPDTTKEDAVPYFEDIFNHAKKLDKQNLPKTFAAIMQSMPGKCKCMHLCDVITLNRYYGWYANGGYEIDVAEMKFREEMNLYKDINKPVIFTEFGADTMSGVHKLPSVMWSEEYQCEYYDMSFRVFDDYKFIIGEQLWNFADFQTTEGIFRVDGNKKGIFTRNRQPKAAAHFIRRRWTKLPMDYKS');
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (1MB limit)
    if (file.size > 1024 * 1024) {
      alert("File size exceeds 1MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSequence(content);
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!sequence) {
      setError("Please enter a sequence");
      return;
    }
    
    if (!reference) {
      setError("Please select a protein reference");
      return;
    }

    setLoading(true);
    setError('');
    setResultUrl(null);

    try {
      const response = await fetch('/api/blast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          sequence, 
          reference, 
          evalue, 
          outputFormat 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to execute BLAST');
      }

      setResultUrl(data.resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('BLAST error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet sx={{ p: 4, maxWidth: 1200, margin: '0 auto' }}>
      <Typography level="h1" sx={{ mb: 2 }}>BLAST against GUS Sequences</Typography>
      
      <Alert 
        color="neutral" 
        startDecorator={<InfoIcon />} 
        sx={{ mb: 3 }}
      >
        Input your amino acid sequences, select your preferred GUS reference (from GUS550, GUS707, or GUSref114), and set the BLAST parameters. You can then download the BLAST results. This tool can align up to 1000 sequences or a maximum file size of 1 MB.
      </Alert>
      
      <Box component="form" onSubmit={handleSubmit}>
        {/* Input Sequence Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography level="h4" sx={{ mr: 1 }}>Input sequence</Typography>
            <Typography color="danger" sx={{ fontWeight: 'bold' }}>*</Typography>
            <Tooltip title="Enter protein sequences to search against the GUS database">
              <IconButton variant="plain" color="neutral" size="sm">
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Sequence Type</FormLabel>
            <RadioGroup 
              orientation="horizontal" 
              value="protein" 
              sx={{ gap: 2 }}
              readOnly
            >
              <Radio value="protein" label="Protein" checked disabled />
            </RadioGroup>
          </FormControl>

          <FormControl sx={{ width: '100%', mb: 2 }}>
            <FormLabel>Paste your sequence here - or use the example sequence:</FormLabel>
            <Textarea
              placeholder="Enter protein sequence"
              minRows={8}
              maxRows={12}
              value={sequence}
              onChange={handleSequenceChange}
              sx={{ fontFamily: 'monospace' }}
              required
            />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="outlined" 
                color="primary" 
                startDecorator={<CloudUploadIcon />}
                onClick={triggerFileUpload}
              >
                Upload a file
              </Button>
              <input 
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                accept=".txt,.fasta,.fa,.seq"
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button 
                variant="plain" 
                color="primary"
                onClick={handleUseExample}
              >
                Use example
              </Button>
              <Button 
                variant="plain"
                color="neutral"
                onClick={handleClearSequence}
              >
                Clear
              </Button>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Parameters Section */}
        <Box sx={{ mb: 4 }}>
          <Typography level="h4" sx={{ mb: 2 }}>Parameters</Typography>

          <FormControl sx={{ mb: 3, width: '70%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormLabel sx={{ mr: 1 }}>Protein references</FormLabel>
              <Typography color="danger" sx={{ fontWeight: 'bold' }}>*</Typography>
            </Box>
            <Select
              placeholder="Select a reference database"
              value={reference}
              onChange={handleReferenceChange}
              required
            >
              <Option value="GUS550">GUS550 - Derived from our published manuscript[1], based on a CRC cohort comprising 571 samples.</Option>
              <Option value="GUS707">GUS707 - Also from our published manuscript[2], based on seven CRC cohorts with a total of 1,359 samples.</Option>
              <Option value="GUSref114">GUSref114 - Additionally from our manuscript[1], used as a reference for GUS identification.</Option>
            </Select>
          </FormControl>

          <FormControl sx={{ mb: 2, width: '70%' }}>
            <FormLabel>E-value</FormLabel>
            <Input 
              type="number"
              value={evalue}
              onChange={handleEvalueChange}
              placeholder="0.05"
              slotProps={{
                input: {
                  step: '0.01',
                  min: '0',
                }
              }}
            />
          </FormControl>

          <FormControl sx={{ mb: 2, width: '70%' }}>
            <FormLabel>Output format</FormLabel>
            <Input
              type="number" 
              value={outputFormat}
              onChange={handleOutputFormatChange}
              placeholder="6"
            />
          </FormControl>
        </Box>

        {/* Submit Section */}
        <Box sx={{ mb: 4 }}>
          <Button type="submit" color="primary" size="lg" loading={loading} disabled={loading}>
            {loading ? 'Processing...' : 'Submit BLAST Search'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert color="danger" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {resultUrl && (
        <Card sx={{ p: 3 }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            BLAST Results
          </Typography>
          <Typography level="body-md" sx={{ mb: 2 }}>
            Your BLAST search has completed. Click the button below to download your results.
          </Typography>
          <Button
            component="a"
            href={resultUrl}
            download="blast_results.txt"
            startDecorator={<CloudDownloadIcon />}
            color="primary"
          >
            Download Results
          </Button>
        </Card>
      )}
    </Sheet>
  );
}
