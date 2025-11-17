import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { H2Title, H3Title } from 'twenty-ui/display';
import { Button, IconSave, IconPlus, IconTrash, Section } from 'twenty-ui/layout';

export const SettingsFormDetail = () => {
  const { t } = useLingui();
  const { formId } = useParams();
  const navigate = useNavigate();
  const isNew = formId === 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetObjectId, setTargetObjectId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [fields, setFields] = useState([
    { id: '1', targetFieldId: '', label: 'Name', placeholder: 'Enter your name', isRequired: true, order: 0 },
  ]);

  // TODO: Fetch available objects from GraphQL
  const availableObjects = [
    { id: '1', nameSingular: 'person', labelSingular: 'Person' },
    { id: '2', nameSingular: 'company', labelSingular: 'Company' },
  ];

  const handleSave = async () => {
    // TODO: Implement GraphQL mutation to save form
    console.log('Saving form:', {
      title,
      description,
      targetObjectId,
      successMessage,
      redirectUrl,
      requireCaptcha,
      isActive,
      fields,
    });
    navigate(getSettingsPath(SettingsPath.Forms));
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        targetFieldId: '',
        label: '',
        placeholder: '',
        isRequired: false,
        order: fields.length,
      },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleFieldChange = (id: string, field: string, value: string | boolean) => {
    setFields(
      fields.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      )
    );
  };

  return (
    <SubMenuTopBarContainer
      title={isNew ? t`New Form` : t`Edit Form`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: t`Forms`,
          href: getSettingsPath(SettingsPath.Forms),
        },
        { children: isNew ? t`New` : t`Edit` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Form Settings`}
            description={t`Configure your form and map fields to CRM objects`}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div>
              <label>{t`Title`}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t`Contact Form`}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label>{t`Description`}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t`Get in touch with us`}
                style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '60px' }}
              />
            </div>

            <div>
              <label>{t`Target Object`}</label>
              <select
                value={targetObjectId}
                onChange={(e) => setTargetObjectId(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              >
                <option value="">{t`Select an object...`}</option>
                {availableObjects.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.labelSingular}
                  </option>
                ))}
              </select>
              <small>{t`Form submissions will create records in this object`}</small>
            </div>

            <div>
              <label>{t`Success Message`}</label>
              <input
                type="text"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                placeholder={t`Thank you for your submission!`}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label>{t`Redirect URL (optional)`}</label>
              <input
                type="text"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder={t`https://example.com/thank-you`}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={requireCaptcha}
                  onChange={(e) => setRequireCaptcha(e.target.checked)}
                />
                {' '}{t`Require CAPTCHA`}
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                {' '}{t`Active (accepting submissions)`}
              </label>
            </div>
          </div>
        </Section>

        <Section>
          <H3Title title={t`Form Fields`} />
          <Button
            Icon={IconPlus}
            title={t`Add Field`}
            onClick={handleAddField}
            style={{ marginBottom: '16px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fields.map((field) => (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange(field.id, 'label', e.target.value)}
                    placeholder={t`Field Label`}
                    style={{ flex: 1, padding: '8px' }}
                  />
                  <input
                    type="text"
                    value={field.placeholder}
                    onChange={(e) => handleFieldChange(field.id, 'placeholder', e.target.value)}
                    placeholder={t`Placeholder`}
                    style={{ flex: 1, padding: '8px' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) => handleFieldChange(field.id, 'isRequired', e.target.checked)}
                    />
                    {t`Required`}
                  </label>
                  <Button
                    Icon={IconTrash}
                    onClick={() => handleRemoveField(field.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <Button
            Icon={IconSave}
            title={t`Save Form`}
            onClick={handleSave}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
