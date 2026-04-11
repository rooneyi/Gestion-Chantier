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
            {label && <SidebarGroupLabel className="px-4 font-black uppercase text-[10px] tracking-[0.2em] opacity-40 mb-2">{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={item.title}
                            className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary rounded-xl h-10 px-4 font-bold transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                {item.icon && <item.icon className="size-5" />}
                                <span className="text-[13px] tracking-tight">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
