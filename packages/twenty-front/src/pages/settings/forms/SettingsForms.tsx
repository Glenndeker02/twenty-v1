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

export const SettingsForms = () => {
  const { t } = useLingui();
  const navigate = useNavigate();

  // TODO: Replace with actual GraphQL query
  const [forms] = useState([
    {
      id: '1',
      title: 'Contact Form',
      targetObject: 'Person',
      isActive: true,
      viewCount: 245,
      submissionCount: 42,
    },
  ]);

  const handleCreateNew = () => {
    navigate(getSettingsPath(SettingsPath.FormNew));
  };

  const handleEdit = (id: string) => {
    navigate(getSettingsPath(SettingsPath.FormDetail).replace(':formId', id));
  };

  return (
    <SubMenuTopBarContainer
      title={t`Forms`}
      links={[
        {
          children: t`Workspace`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Forms` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Forms`}
            description={t`Create public forms to collect data for your CRM`}
          />
          <Button
            Icon={IconPlus}
            title={t`New Form`}
            onClick={handleCreateNew}
          />
        </Section>

        <Section>
          {forms.length === 0 ? (
            <div>{t`No forms yet. Create your first one!`}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>{t`Title`}</TableCell>
                  <TableCell>{t`Target Object`}</TableCell>
                  <TableCell>{t`Status`}</TableCell>
                  <TableCell>{t`Views`}</TableCell>
                  <TableCell>{t`Submissions`}</TableCell>
                  <TableCell>{t`Actions`}</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>{form.title}</TableCell>
                    <TableCell>{form.targetObject}</TableCell>
                    <TableCell>
                      {form.isActive ? t`Active` : t`Inactive`}
                    </TableCell>
                    <TableCell>{form.viewCount}</TableCell>
                    <TableCell>{form.submissionCount}</TableCell>
                    <TableCell>
                      <Button
                        title={t`Edit`}
                        onClick={() => handleEdit(form.id)}
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
