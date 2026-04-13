import type { ContentRepository } from '@/data/ContentRepository';
import type { BasicsPageContent } from '@/domain/basics';
import type { SectionContent } from '@/domain/content';
import type {
  Department,
  DepartmentId,
  IntranetDocument,
  JobRole,
  JobRoleId,
  OrgChartNode,
  Sector,
} from '@/domain/entities';

export class ApiContentRepository implements ContentRepository {
  constructor(private readonly baseUrl: string) {}

  getSectors(): Promise<Sector[]> {
    return this.getJson('/sectors');
  }

  getOrgChart(): Promise<OrgChartNode[]> {
    return this.getJson('/org-chart');
  }

  getDepartments(): Promise<Department[]> {
    return this.getJson('/departments');
  }

  getDepartment(id: DepartmentId): Promise<Department | null> {
    return this.getJson(`/departments/${encodeURIComponent(id)}`);
  }

  getJobRoles(): Promise<JobRole[]> {
    return this.getJson('/job-roles');
  }

  getJobRole(id: JobRoleId): Promise<JobRole | null> {
    return this.getJson(`/job-roles/${encodeURIComponent(id)}`);
  }

  getDocuments(): Promise<IntranetDocument[]> {
    return this.getJson('/documents');
  }

  getSectionContents(): Promise<SectionContent[]> {
    return this.getJson('/sections');
  }

  getSectionContent(path: string): Promise<SectionContent | null> {
    return this.getJson(`/sections/by-path?path=${encodeURIComponent(path)}`);
  }

  getBasicsPagesContent(): Promise<BasicsPageContent[]> {
    return this.getJson('/basics');
  }

  getBasicsPageContent(path: string): Promise<BasicsPageContent | null> {
    return this.getJson(`/basics/by-path?path=${encodeURIComponent(path)}`);
  }

  private async getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }
}
