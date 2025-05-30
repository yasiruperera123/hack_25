import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form'; // Consider using a form library
// import * as yup from 'yup'; // Consider using a validation library

interface CheckoutFormProps {
  type: 'personal' | 'shipping' | 'billing';
  initialData?: { [key: string]: any }; // More specific initial data type
  onUpdate: (data: { [key: string]: any }, isValid: boolean) => void; // Updated signature to include isValid
  // Optional: onSubmit, validationSchema, etc.
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  type,
  initialData,
  onUpdate,
}) => {
  // State for form fields
  const [formData, setFormData] = useState<{ [key: string]: any }>(initialData || {});
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({}); // State for validation errors

  useEffect(() => {
    // Update internal state if initialData changes (e.g., pre-filling)
    setFormData(initialData || {});
  }, [initialData]);

  const validateForm = (data: { [key: string]: any }) => {
    // TODO: Implement validation logic based on 'type'
    const newErrors: { [key: string]: string | undefined } = {};
    let isValid = true;

    if (type === 'personal') {
      if (!data.name) { newErrors.name = 'Name is required'; isValid = false; }
      if (!data.email) { newErrors.email = 'Email is required'; isValid = false; } else if (!/^[\S]+@[\S]+\.[\S]+$/.test(data.email)) { newErrors.email = 'Invalid email format'; isValid = false; }
      // Add phone validation
    }
    if (type === 'shipping' || type === 'billing') {
      if (!data.address1) { newErrors.address1 = 'Address line 1 is required'; isValid = false; }
      if (!data.city) { newErrors.city = 'City is required'; isValid = false; }
      if (!data.state) { newErrors.state = 'State/Province is required'; isValid = false; }
      if (!data.zip) { newErrors.zip = 'Zip/Postal Code is required'; isValid = false; }
      if (!data.country) { newErrors.country = 'Country is required'; isValid = false; }
    }

    setErrors(newErrors);
    return isValid; // Return true if no errors
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    // Optional: real-time validation on input change
    // validateForm(newData);
  };

  // Inform parent component about data changes and validation status
  useEffect(() => {
    const isValid = validateForm(formData); // Validate when formData changes
    onUpdate(formData, isValid);
  }, [formData, onUpdate, type]); // Depend on formData, onUpdate, and type


  // Example JSX structure for a field
  const renderField = (name: string, label: string, type: string = 'text') => (
    <div key={name} className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={formData[name] || ''}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
      {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
    </div>
  );

  // Render form fields based on 'type'
  const renderFormFields = () => {
    if (type === 'personal') {
      return (
        <>
          {renderField('name', 'Full Name')}
          {renderField('email', 'Email Address', 'email')}
          {renderField('phone', 'Phone Number', 'tel')}
        </>
      );
    }

    if (type === 'shipping' || type === 'billing') {
      return (
        <>
          {renderField('address1', 'Address Line 1')}
          {renderField('address2', 'Address Line 2 (Optional)')}
          {renderField('city', 'City')}
          {renderField('state', 'State/Province')}
          {renderField('zip', 'Zip/Postal Code')}
          {renderField('country', 'Country')}
        </>
      );
    }

    return null;
  };



  return (
    <div>
      {renderFormFields()}
    </div>
  );
};

export default CheckoutForm; 