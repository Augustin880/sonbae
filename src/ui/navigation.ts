export type NavigationItem = {
  label: string;
  path: string;
  description: string;
  badge?: string;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Espace',
    items: [
      {
        label: 'Tableau de bord',
        path: '/',
        description: 'Priorités, alertes et raccourcis utiles.',
      },
      {
        label: 'Actualités',
        path: '/news',
        description: 'Informations du club et annonces internes.',
      },
      {
        label: 'Calendrier',
        path: '/calendar',
        description: 'Échéances, réunions et temps forts.',
      },
    ],
  },
  {
    label: 'Comprendre le club',
    items: [
      {
        label: 'Présentation',
        path: '/understand/presentation',
        description: 'Mission, identité et principes de fonctionnement.',
      },
      {
        label: 'Structure',
        path: '/understand/structure',
        description: 'Organisation et lignes fonctionnelles.',
      },
      {
        label: 'Rôles et déploiement',
        path: '/understand/roles-deployment',
        description: 'Familles de rôles, logique de déploiement et responsabilités.',
      },
      {
        label: 'Chartes et labels',
        path: '/understand/charters-labels',
        description: 'Standards internes, labels et engagements qualité.',
      },
      {
        label: 'Gouvernance et responsabilités',
        path: '/understand/governance-responsibilities',
        description: 'Décisions, escalades et redevabilité.',
      },
      {
        label: 'Documents institutionnels et juridiques',
        path: '/understand/institutional-legal-docs',
        description: 'Documents de référence, archives juridiques et dossiers institutionnels.',
      },
      {
        label: 'Annexe 6.1',
        path: '/understand/optional-annex',
        description: 'Notes complémentaires pour les futurs contenus de gouvernance.',
        badge: 'Optionnel',
      },
    ],
  },
  {
    label: 'Opérations',
    items: [
      {
        label: 'Relais fonctionnels',
        path: '/functional-relays',
        description: 'Relais internes et canaux de coordination.',
      },
      {
        label: 'Processus et évolutions',
        path: '/processes-evolutions',
        description: 'Bibliothèque de processus, changements et demandes d’amélioration.',
      },
      {
        label: 'Opérations et systèmes',
        path: '/basics/operations-systems',
        description: 'Systèmes, accès et bases opérationnelles.',
      },
      {
        label: 'Chiffres et KPI',
        path: '/basics/numbers-kpis',
        description: 'Indicateurs de performance et références de suivi.',
      },
      {
        label: 'Calculateur',
        path: '/basics/calculator',
        description: 'Estimations et outils de planification.',
      },
    ],
  },
  {
    label: 'Support',
    items: [
      {
        label: 'Contacts / support',
        path: '/contacts-support',
        description: 'Contacts, niveaux de support et demandes de service.',
      },
    ],
  },
];

export const routeItems = navigationGroups.flatMap((group) => group.items);

export function getNavigationItem(pathname: string) {
  return routeItems.find((item) => item.path === pathname);
}

export function getNavigationGroup(pathname: string) {
  return navigationGroups.find((group) => group.items.some((item) => item.path === pathname));
}
