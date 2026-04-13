import type { Department, IntranetDocument, JobRole } from '@/domain/entities';

export function sortDocumentsByRecentUpdate(documents: IntranetDocument[]) {
  return [...documents].sort(
    (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
  );
}

export function getRolesForDepartment(department: Department, roles: JobRole[]) {
  const allowedIds = new Set(department.roleIds);
  return roles.filter((role) => allowedIds.has(role.id));
}

export function canRoleApproveDocuments(role: JobRole) {
  return role.level === 'lead' || role.level === 'coordinator' || role.level === 'admin';
}
