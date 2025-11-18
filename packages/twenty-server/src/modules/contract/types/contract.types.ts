export enum ContractStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export enum ESignProvider {
  DOCUSIGN = 'docusign',
  HELLOSIGN = 'hellosign',
  PANDADOC = 'pandadoc',
}

export type ContractTemplate = {
  id: string;
  name: string;
  content: string;
  variables: string[];
};

export type ContractSigner = {
  name: string;
  email: string;
  role: string;
};

export type Contract = {
  id: string;
  templateId: string;
  status: ContractStatus;
  signers: ContractSigner[];
  documentUrl?: string;
  signedAt?: Date;
  expiresAt?: Date;
  metadata: Record<string, unknown>;
};

export type SendContractRequest = {
  templateId: string;
  signers: ContractSigner[];
  subject: string;
  message?: string;
  expiresInDays?: number;
};
