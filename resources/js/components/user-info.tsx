import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import { UserRole } from '@/Enums/UserRole';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();
    const roleInfo = Object.values(UserRole).find(r => r.value === user.role);

    return (
        <div className="flex items-center gap-3 w-full">
            <div className="relative group">
                <Avatar className="h-10 w-10 overflow-hidden rounded-2xl shadow-sm border-2 border-white dark:border-slate-800 transition-transform group-hover:scale-105 duration-300">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 font-black">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></div>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                <span className="truncate font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight text-[13px]">{user.name}</span>
                <span className="truncate text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">
                    {roleInfo?.label || user.role}
                </span>
                {showEmail && (
                    <span className="truncate text-[10px] text-muted-foreground mt-1 font-medium bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md w-max">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
