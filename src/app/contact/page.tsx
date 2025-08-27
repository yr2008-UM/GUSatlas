import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        We appreciate your questions and feedback
      </h1>
      <p className="text-gray-800 mb-8">
        We are available to help with questions, error reports, feature requests, dataset proposals, etc.
      </p>
      <ContactForm />
    </div>
  );
}
