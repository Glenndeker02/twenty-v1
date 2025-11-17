import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { H2Title, H3Title } from 'twenty-ui/display';
import { Button, IconSave, IconPlus, IconTrash, Section } from 'twenty-ui/layout';

export const SettingsLinkHubDetail = () => {
  const { t } = useLingui();
  const { linkHubId } = useParams();
  const navigate = useNavigate();
  const isNew = linkHubId === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [isActive, setIsActive] = useState(true);

  const [items, setItems] = useState([
    { id: '1', title: 'Website', url: 'https://example.com', icon: 'IconGlobe', order: 0 },
  ]);

  const handleSave = async () => {
    // TODO: Implement GraphQL mutation to save link hub
    console.log('Saving link hub:', { title, slug, description, backgroundColor, textColor, isActive, items });
    navigate(getSettingsPath(SettingsPath.LinkHubs));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), title: '', url: '', icon: '', order: items.length },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <SubMenuTopBarContainer
      title={isNew ? t`New Link Hub` : t`Edit Link Hub`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: t`Link Hubs`,
          href: getSettingsPath(SettingsPath.LinkHubs),
        },
        { children: isNew ? t`New` : t`Edit` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Link Hub Settings`}
            description={t`Configure your link hub appearance and settings`}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            <div>
              <label>{t`Title`}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t`My Links`}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label>{t`Slug`}</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={t`my-links`}
                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              />
              <small>{t`Your link hub will be available at: /links/${slug}`}</small>
            </div>

            <div>
              <label>{t`Description`}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t`Check out my links`}
                style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div>
                <label>{t`Background Color`}</label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div>
                <label>{t`Text Color`}</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                {' '}{t`Active (visible to public)`}
              </label>
            </div>
          </div>
        </Section>

        <Section>
          <H3Title title={t`Links`} />
          <Button
            Icon={IconPlus}
            title={t`Add Link`}
            onClick={handleAddItem}
            style={{ marginBottom: '16px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
              >
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                  placeholder={t`Title`}
                  style={{ flex: 1, padding: '8px' }}
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => handleItemChange(item.id, 'url', e.target.value)}
                  placeholder={t`URL`}
                  style={{ flex: 2, padding: '8px' }}
                />
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => handleItemChange(item.id, 'icon', e.target.value)}
                  placeholder={t`Icon`}
                  style={{ flex: 0.5, padding: '8px' }}
                />
                <Button
                  Icon={IconTrash}
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section>
          <Button
            Icon={IconSave}
            title={t`Save Link Hub`}
            onClick={handleSave}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
