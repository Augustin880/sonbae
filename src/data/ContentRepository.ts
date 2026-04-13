import type {
  Department,
  DepartmentId,
  IntranetDocument,
  JobRole,
  JobRoleId,
  OrgChartNode,
  Sector,
} from '@/domain/entities';
import type { BasicsPageContent } from '@/domain/basics';
import type { SectionContent } from '@/domain/content';

export type ContentRepository = {
  getSectors(): Promise<Sector[]>;
  getOrgChart(): Promise<OrgChartNode[]>;
  getDepartment(id: DepartmentId): Promise<Department | null>;
  getDepartments(): Promise<Department[]>;
  getJobRole(id: JobRoleId): Promise<JobRole | null>;
  getJobRoles(): Promise<JobRole[]>;
  getDocuments(): Promise<IntranetDocument[]>;
  getSectionContent(path: string): Promise<SectionContent | null>;
  getSectionContents(): Promise<SectionContent[]>;
  getBasicsPageContent(path: string): Promise<BasicsPageContent | null>;
  getBasicsPagesContent(): Promise<BasicsPageContent[]>;
};
