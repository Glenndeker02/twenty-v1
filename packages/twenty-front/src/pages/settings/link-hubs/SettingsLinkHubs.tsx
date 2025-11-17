import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { H2Title } from 'twenty-ui/display';
import { Button, IconPlus, Section } from 'twenty-ui/layout';
import { Table } from '@/ui/layout/table/components/Table';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableBody } from '@/ui/layout/table/components/TableBody';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { TableCell } from '@/ui/layout/table/components/TableCell';

export const SettingsLinkHubs = () => {
  const { t } = useLingui();
  const navigate = useNavigate();

  // TODO: Replace with actual GraphQL query
  const [linkHubs] = useState([
    {
      id: '1',
      title: 'My Links',
      slug: 'my-links',
      isActive: true,
      viewCount: 125,
      itemCount: 5,
    },
  ]);

  const handleCreateNew = () => {
    navigate(getSettingsPath(SettingsPath.LinkHubNew));
  };

  const handleEdit = (id: string) => {
    navigate(getSettingsPath(SettingsPath.LinkHubDetail).replace(':linkHubId', id));
  };

  return (
    <SubMenuTopBarContainer
      title={t`Link Hubs`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Link Hubs` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Link Hubs`}
            description={t`Create Linktree-style pages to share your links`}
          />
          <Button
            Icon={IconPlus}
            title={t`New Link Hub`}
            onClick={handleCreateNew}
          />
        </Section>

        <Section>
          {linkHubs.length === 0 ? (
            <div>{t`No link hubs yet. Create your first one!`}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>{t`Title`}</TableCell>
                  <TableCell>{t`Slug`}</TableCell>
                  <TableCell>{t`Status`}</TableCell>
                  <TableCell>{t`Views`}</TableCell>
                  <TableCell>{t`Links`}</TableCell>
                  <TableCell>{t`Actions`}</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkHubs.map((hub) => (
                  <TableRow key={hub.id}>
                    <TableCell>{hub.title}</TableCell>
                    <TableCell>{hub.slug}</TableCell>
                    <TableCell>
                      {hub.isActive ? t`Active` : t`Inactive`}
                    </TableCell>
                    <TableCell>{hub.viewCount}</TableCell>
                    <TableCell>{hub.itemCount}</TableCell>
                    <TableCell>
                      <Button
                        title={t`Edit`}
                        onClick={() => handleEdit(hub.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
