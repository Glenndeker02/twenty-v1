import { useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const FormPublic = () => {
  const { t } = useLingui();
  const { token } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/forms/${token}`);
        if (!response.ok) {
          throw new Error('Form not found');
        }
        const data = await response.json();
        setForm(data);
        // Initialize form data with default values
        const initialData: Record<string, any> = {};
        data.fields.forEach((field: any) => {
          initialData[field.fieldName] = field.defaultValue || '';
        });
        setFormData(initialData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Validate required fields
    const missingFields = form.fields.filter(
      (field: any) => field.isRequired && !formData[field.fieldName]
    );

    if (missingFields.length > 0) {
      setSubmitError(t`Please fill in all required fields`);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/forms/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      setSubmitted(true);

      // Redirect if specified
      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 2000);
      }
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const renderField = (field: any) => {
    const commonStyle = {
      width: '100%',
      padding: '12px',
      marginTop: '8px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
    };

    switch (field.fieldType) {
      case 'TEXT':
      case 'EMAIL':
      case 'PHONE':
        return (
          <input
            type={field.fieldType === 'EMAIL' ? 'email' : field.fieldType === 'PHONE' ? 'tel' : 'text'}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder || ''}
            required={field.isRequired}
            style={commonStyle}
          />
        );
      case 'NUMBER':
        return (
          <input
            type="number"
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder || ''}
            required={field.isRequired}
            style={commonStyle}
          />
        );
      case 'DATE':
      case 'DATE_TIME':
        return (
          <input
            type={field.fieldType === 'DATE_TIME' ? 'datetime-local' : 'date'}
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            required={field.isRequired}
            style={commonStyle}
          />
        );
      case 'BOOLEAN':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              checked={formData[field.fieldName] || false}
              onChange={(e) => handleFieldChange(field.fieldName, e.target.checked)}
              required={field.isRequired}
              style={{ width: 'auto' }}
            />
            <span>{field.helpText || field.label}</span>
          </label>
        );
      default:
        return (
          <textarea
            value={formData[field.fieldName] || ''}
            onChange={(e) => handleFieldChange(field.fieldName, e.target.value)}
            placeholder={field.placeholder || ''}
            required={field.isRequired}
            style={{ ...commonStyle, minHeight: '100px', resize: 'vertical' }}
          />
        );
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        {t`Loading...`}
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <h1>{t`Form Not Found`}</h1>
        <p>{error || t`The requested form does not exist or is not active.`}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '48px' }}>✓</div>
        <h1>{form.successMessage || t`Thank you for your submission!`}</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: '0 0 8px 0' }}>{form.title}</h1>
        {form.description && (
          <p style={{ margin: '0 0 32px 0', color: '#666' }}>{form.description}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {form.fields.map((field: any) => (
              <div key={field.id}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  {field.label}
                  {field.isRequired && <span style={{ color: 'red' }}> *</span>}
                </label>
                {renderField(field)}
                {field.helpText && (
                  <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                    {field.helpText}
                  </small>
                )}
              </div>
            ))}
          </div>

          {submitError && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#fee',
              borderRadius: '8px',
              color: '#c00',
            }}>
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '16px',
              backgroundColor: submitting ? '#ccc' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = '#0052a3';
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = '#0066cc';
            }}
          >
            {submitting ? t`Submitting...` : t`Submit`}
          </button>
        </form>

        <footer style={{ marginTop: '32px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
          Powered by Twenty CRM
        </footer>
      </div>
    </div>
  );
};
