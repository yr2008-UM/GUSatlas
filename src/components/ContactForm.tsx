'use client';

import { FormEvent, useState } from 'react';
import { Button, FormControl, FormHelperText, FormLabel, Input, Textarea } from '@mui/joy';

interface FormData {
  subject: string;
  email: string;
  message: string;
}
export function ContactForm() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      
      attachments.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({ subject: '', email: '', message: '' });
      setAttachments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending the message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleFileAdd = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (attachments.length + files.length > 3) {
        alert('Maximum 3 files allowed');
        return;
      }
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length !== files.length) {
        alert('Some files exceed the 5MB limit');
      }
      setAttachments([...attachments, ...validFiles]);
    };
    input.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      {success && (
        <div className="text-green-500 mb-4">Message sent successfully!</div>
      )}

      <FormControl required>
        <FormLabel sx={{ color: 'inherit' }} className="text-neutral-100">Subject:</FormLabel>
        <Input 
          value={formData.subject}
          onChange={handleInputChange('subject')}
        />
      </FormControl>

      <FormControl required>
        <FormLabel sx={{ color: 'inherit' }} className="text-neutral-100">Your email address:</FormLabel>
        <Input 
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
        />
        <FormHelperText className="text-gray-100">
          An email address is required if you would like to hear back from us.
        </FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel sx={{ color: 'inherit' }} className="text-neutral-100">Attachments:</FormLabel>
        <div>
          <FormHelperText className="text-gray-100">
            <Button variant="outlined" onClick={handleFileAdd}>
              Add a file
            </Button>
            Attach up to three files (maximum 5Mb per file).
          </FormHelperText>
          {attachments.length > 0 && (
            <ul className="mt-2 space-y-1">
              {attachments.map((file, index) => (
                <li key={index} className="text-sm text-gray-100">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                </li>
              ))}
            </ul>
          )}
        </div>
      </FormControl>

      <FormControl required>
        <FormLabel sx={{ color: 'inherit' }} className="!text-inherit text-neutral-100">Message:</FormLabel>
        <Textarea 
          minRows={4}
          value={formData.message}
          onChange={handleInputChange('message')}
        />
      </FormControl>

      <Button 
        type="submit" 
        className="mt-6"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Submit message'}
      </Button>
    </form>
  );
}
