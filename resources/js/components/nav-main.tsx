import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [], label }: { items: NavItem[], label?: string }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            {label && <SidebarGroupLabel className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500/80">{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={item.title}
                            className="h-11 rounded-2xl px-4 font-medium text-slate-300 transition-all hover:bg-white/6 hover:text-white data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500 data-[active=true]:to-blue-600 data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-blue-500/25"
                        >
                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                {item.icon && <item.icon className="size-[18px]" />}
                                <span className="text-[13px] font-medium tracking-tight">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
