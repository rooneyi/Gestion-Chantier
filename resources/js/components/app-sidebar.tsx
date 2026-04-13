import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    CalendarDays,
    Users,
    Package,
    ClipboardCheck,
    TrendingUp,
    ShieldAlert,
    HardHat,
    History,
    Settings,
    HelpCircle,
    FileText,
    BarChart3,
    Clock
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarRail,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as projectsIndex } from '@/actions/App/Http/Controllers/Api/ProjectController';
import { index as usersIndex } from '@/actions/App/Http/Controllers/UserController';
import { index as activityLogsIndex } from '@/actions/App/Http/Controllers/ActivityLogController';
import { index as reportsIndex } from '@/actions/App/Http/Controllers/ReportController';
import type { NavItem } from '@/types';
import { UserRole } from '@/Enums/UserRole';

const roleNavItems: Record<string, NavItem[]> = {
    [UserRole.Manager.value]: [
        { title: 'Vue d\'ensemble', href: dashboard(), icon: LayoutGrid },
        { title: 'Chantiers', href: projectsIndex(), icon: TrendingUp },
        { title: 'Ressources Humaines', href: usersIndex(), icon: Users },
        { title: 'Présence', href: '/attendance', icon: Clock },
        { title: 'Rapports', href: reportsIndex(), icon: BarChart3 },
        { title: 'Audit & Logs', href: activityLogsIndex(), icon: History },
    ],
    [UserRole.Engineer.value]: [
        { title: 'Mes Projets', href: dashboard(), icon: LayoutGrid },
        { title: 'Planification', href: '#', icon: CalendarDays },
        { title: 'Contrôle Équipes', href: '#', icon: HardHat },
        { title: 'Rapports Terrain', href: '#', icon: ClipboardCheck },
    ],
    [UserRole.Worker.value]: [
        { title: 'Ma Mission', href: dashboard(), icon: CalendarDays },
        { title: 'Pointages', href: '#', icon: ShieldAlert },
        { title: 'Historique', href: '#', icon: History },
    ],
    [UserRole.Magasinier.value]: [
        { title: 'Stock Matériaux', href: dashboard(), icon: Package },
        { title: 'Bons de Sortie', href: '#', icon: FileText },
        { title: 'Inventaire', href: '#', icon: ClipboardCheck },
    ],
};

const systemNavItems: NavItem[] = [
    { title: 'Paramètres', href: '#', icon: Settings },
    { title: 'Centre d\'Aide', href: '#', icon: HelpCircle },
];

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage().props as any;
    const userRole = (auth.user?.role as string) || UserRole.Worker.value;
    const mainNavItems = roleNavItems[userRole] || roleNavItems[UserRole.Worker.value];

    return (
        <Sidebar collapsible="icon" className={className} {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Navigation" />
                <NavMain items={systemNavItems} label="Système" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
