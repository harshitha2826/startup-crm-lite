import { useState } from 'react';
import Button from '../common/Button';
import { LEAD_STAGE_OPTIONS, LEAD_SOURCE_OPTIONS, LEAD_STAGES, LEAD_SOURCES } from '../../constants';

/**
 * Props definition for the LeadForm component.
 * @typedef {Object} LeadFormProps
 * @property {Object} [initialData] - Optional lead data for edit mode.
 * @property {Function} onSubmit - Callback function triggered on successful form submission.
 * @property {Function} onCancel - Callback function triggered on form cancellation.
 */

/**
 * LeadForm Component
 * Renders a CRUD form for adding or updating lead details. Integrates manual validations.
 * 
 * @param {LeadFormProps} props - Component props.
 * @returns {React.JSX.Element}
 */
const LeadForm = ({ initialData = null, onSubmit, onCancel }) => {
  const isEditMode = !!initialData;

  const statusOptions = LEAD_STAGE_OPTIONS;
  const sourceOptions = LEAD_SOURCE_OPTIONS;

  // Form Fields State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    stage: initialData?.stage || LEAD_STAGES.NEW,
    source: initialData?.source || LEAD_SOURCES.WEBSITE,
    value: initialData?.value !== undefined ? initialData.value : '',
    notes: initialData?.notes || '',
  });

  // Validation Error State
  const [errors, setErrors] = useState({
    name: '',
    company: '',
    email: '',
  });

  // Handle Field Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset validation errors as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Basic Validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Contact Name is required.';
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company Name is required.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email address format.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submittedData = {
        ...formData,
        value: formData.value !== '' ? Number(formData.value) : 0,
      };

      if (isEditMode) {
        submittedData.id = initialData.id;
        submittedData.createdAt = initialData.createdAt;
        submittedData.history = initialData.history;
        submittedData.priority = initialData.priority || 'Medium';
        submittedData.temperature = initialData.temperature || 'Warm';
        submittedData.owner = initialData.owner || 'Alex Rivera';
      }

      onSubmit(submittedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Contact Name */}
        <div>
          <label htmlFor="lead-name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Contact Name <span className="text-danger">*</span>
          </label>
          <input
            id="lead-name"
            type="text"
            name="name"
            placeholder="e.g. Jane Smith"
            value={formData.name}
            onChange={handleChange}
            className={`w-full h-9 px-3 text-xs bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
              errors.name 
                ? 'border-danger focus:ring-danger focus:border-danger' 
                : 'border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary'
            }`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-[10px] text-danger font-medium mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="lead-company" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Company Name <span className="text-danger">*</span>
          </label>
          <input
            id="lead-company"
            type="text"
            name="company"
            placeholder="e.g. Stripe"
            value={formData.company}
            onChange={handleChange}
            className={`w-full h-9 px-3 text-xs bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
              errors.company 
                ? 'border-danger focus:ring-danger focus:border-danger' 
                : 'border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary'
            }`}
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
          />
          {errors.company && (
            <p id="company-error" className="text-[10px] text-danger font-medium mt-1">
              {errors.company}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="lead-email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            name="email"
            placeholder="e.g. jane@stripe.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full h-9 px-3 text-xs bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 ${
              errors.email 
                ? 'border-danger focus:ring-danger focus:border-danger' 
                : 'border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-[10px] text-danger font-medium mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="lead-phone" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Phone Number
          </label>
          <input
            id="lead-phone"
            type="text"
            name="phone"
            placeholder="e.g. +1 (555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-9 px-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Deal Value */}
        <div>
          <label htmlFor="lead-value" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Deal Value ($ USD)
          </label>
          <input
            id="lead-value"
            type="number"
            name="value"
            placeholder="e.g. 50000"
            value={formData.value}
            onChange={handleChange}
            className="w-full h-9 px-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label htmlFor="lead-stage" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Lead Status
          </label>
          <select
            id="lead-stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full h-9 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="md:col-span-2">
          <label htmlFor="lead-source" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Lead Source
          </label>
          <select
            id="lead-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full h-9 px-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {sourceOptions.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Notes */}
        <div className="md:col-span-2">
          <label htmlFor="lead-notes" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Summary Notes
          </label>
          <textarea
            id="lead-notes"
            name="notes"
            placeholder="Context, current status, notes..."
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          className="cursor-pointer"
        >
          {isEditMode ? 'Update Deal' : 'Save Deal'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
