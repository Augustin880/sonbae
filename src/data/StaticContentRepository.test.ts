import { describe, expect, it } from 'vitest';
import { StaticContentRepository } from '@/data/StaticContentRepository';

describe('StaticContentRepository', () => {
  it('returns local demo departments by id', async () => {
    const repository = new StaticContentRepository();

    await expect(repository.getDepartment('stem')).resolves.toMatchObject({
      id: 'stem',
      name: 'STEM',
    });
  });

  it('returns null for missing content', async () => {
    const repository = new StaticContentRepository();

    await expect(repository.getJobRole('missing')).resolves.toBeNull();
  });

  it('returns safely parsed section content by route path', async () => {
    const repository = new StaticContentRepository();

    await expect(repository.getSectionContent('/understand/presentation')).resolves.toMatchObject({
      title: 'Présentation du club',
      lastUpdated: '2026-04-08',
    });
  });

  it('returns demo calendar events with meetings and deadlines', async () => {
    const repository = new StaticContentRepository();

    const content = await repository.getSectionContent('/calendar');

    expect(content?.calendarEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'meeting', title: 'Briefing de direction hebdomadaire' }),
        expect.objectContaining({
          kind: 'deadline',
          title: 'Deadline - ajustements du calendrier d’évaluation',
        }),
      ]),
    );
  });

  it('returns safely parsed basics content by route path', async () => {
    const repository = new StaticContentRepository();

    const content = await repository.getBasicsPageContent('/basics/calculator');

    expect(content?.title).toBe('Calculateur');
    expect(content?.calculator?.currency).toBe('EUR');
  });
});
