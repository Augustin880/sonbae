import { describe, expect, it } from 'vitest';
import { canRoleApproveDocuments, sortDocumentsByRecentUpdate } from '@/domain/businessRules';
import type { IntranetDocument, JobRole } from '@/domain/entities';

describe('business rules', () => {
  it('sorts documents with most recent updates first', () => {
    const documents: IntranetDocument[] = [
      {
        id: 'older',
        title: 'Older',
        category: 'guide',
        linkType: 'pdf-placeholder',
        sectionPaths: ['/documents'],
        owner: 'Ops',
        updatedAt: '2026-01-01',
        href: '#',
        summary: 'Older document',
      },
      {
        id: 'newer',
        title: 'Newer',
        category: 'policy',
        linkType: 'pdf-placeholder',
        sectionPaths: ['/documents'],
        owner: 'Ops',
        updatedAt: '2026-04-01',
        href: '#',
        summary: 'Newer document',
      },
    ];

    expect(sortDocumentsByRecentUpdate(documents).map((document) => document.id)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('allows lead roles to approve documents', () => {
    const role: JobRole = {
      id: 'lead',
      departmentId: 'operations',
      title: 'Lead',
      level: 'lead',
      summary: 'Approves documents',
      responsibilities: [],
      tools: [],
    };

    expect(canRoleApproveDocuments(role)).toBe(true);
  });
});
