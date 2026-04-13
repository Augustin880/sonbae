export type SectorId = string;
export type DepartmentId = string;
export type JobRoleId = string;
export type DocumentId = string;

export type Sector = {
  id: SectorId;
  name: string;
  summary: string;
  departmentIds: DepartmentId[];
};

export type Department = {
  id: DepartmentId;
  sectorId: SectorId;
  name: string;
  lead: string;
  summary: string;
  responsibilities: string[];
  contactPoints: Array<{
    name: string;
    role: string;
    email: string;
  }>;
  priorities: string[];
  roleIds: JobRoleId[];
};

export type JobRole = {
  id: JobRoleId;
  departmentId: DepartmentId;
  title: string;
  level: 'teacher' | 'lead' | 'coordinator' | 'admin';
  summary: string;
  responsibilities: string[];
  tools: string[];
};

export type OrgChartNode = {
  id: string;
  label: string;
  role: string;
  reportsTo: string | null;
};

export type DocumentCategory =
  | 'calendar'
  | 'charter'
  | 'guide'
  | 'institutional'
  | 'label'
  | 'legal'
  | 'policy'
  | 'template';

export type IntranetDocument = {
  id: DocumentId;
  title: string;
  category: DocumentCategory;
  linkType: 'external' | 'pdf-placeholder';
  sectionPaths: string[];
  owner: string;
  updatedAt: string;
  href: string;
  summary: string;
};
