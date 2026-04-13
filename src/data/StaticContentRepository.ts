import type { ContentRepository } from '@/data/ContentRepository';
import { parseBasicsPageContentList, type BasicsPageContent } from '@/domain/basics';
import { parseSectionContentList, type SectionContent } from '@/domain/content';
import type {
  Department,
  DepartmentId,
  IntranetDocument,
  JobRole,
  JobRoleId,
  OrgChartNode,
  Sector,
} from '@/domain/entities';
import departmentsJson from '@/content/departments.json';
import documentsJson from '@/content/documents.json';
import jobRolesJson from '@/content/jobRoles.json';
import orgChartJson from '@/content/orgChart.json';
import sectionContentJson from '@/content/sectionContent.json';
import sectorsJson from '@/content/sectors.json';
import basicsContentJson from '@/content/basicsContent.json';

const sectors = sectorsJson as Sector[];
const orgChart = orgChartJson as OrgChartNode[];
const departments = departmentsJson as Department[];
const jobRoles = jobRolesJson as JobRole[];
const documents = documentsJson as IntranetDocument[];
const sectionContents = parseSectionContentList(sectionContentJson);
const basicsPagesContent = parseBasicsPageContentList(basicsContentJson);

export class StaticContentRepository implements ContentRepository {
  getSectors(): Promise<Sector[]> {
    return Promise.resolve(sectors);
  }

  getOrgChart(): Promise<OrgChartNode[]> {
    return Promise.resolve(orgChart);
  }

  getDepartments(): Promise<Department[]> {
    return Promise.resolve(departments);
  }

  async getDepartment(id: DepartmentId): Promise<Department | null> {
    return (await this.getDepartments()).find((department) => department.id === id) ?? null;
  }

  getJobRoles(): Promise<JobRole[]> {
    return Promise.resolve(jobRoles);
  }

  async getJobRole(id: JobRoleId): Promise<JobRole | null> {
    return (await this.getJobRoles()).find((role) => role.id === id) ?? null;
  }

  getDocuments(): Promise<IntranetDocument[]> {
    return Promise.resolve(documents);
  }

  getSectionContents(): Promise<SectionContent[]> {
    return Promise.resolve(sectionContents);
  }

  async getSectionContent(path: string): Promise<SectionContent | null> {
    return (await this.getSectionContents()).find((section) => section.path === path) ?? null;
  }

  getBasicsPagesContent(): Promise<BasicsPageContent[]> {
    return Promise.resolve(basicsPagesContent);
  }

  async getBasicsPageContent(path: string): Promise<BasicsPageContent | null> {
    return (await this.getBasicsPagesContent()).find((page) => page.path === path) ?? null;
  }
}
