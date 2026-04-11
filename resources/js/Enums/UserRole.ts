export const UserRole = {
    Manager: { value: 'manager', label: 'Directeur Général' },
    Engineer: { value: 'engineer', label: 'Ingénieur Travaux' },
    Worker: { value: 'worker', label: 'Collaborateur Terrain' },
    Magasinier: { value: 'magasinier', label: 'Gestionnaire de Stock' },
    ChefChantier: { value: 'chef_chantier', label: 'Chef de Chantier' },
} as const;

export type UserRoleValue = typeof UserRole[keyof typeof UserRole]['value'];
