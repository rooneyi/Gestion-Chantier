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
        <div className="flex w-full items-center gap-3">
            <div className="relative">
                <Avatar className="h-10 w-10 overflow-hidden rounded-full border border-white/10 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-slate-700">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-semibold text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#172038] bg-emerald-500 shadow-sm" />
            </div>
            <div className="grid flex-1 overflow-hidden text-left text-sm leading-tight">
                <span className="truncate text-[14px] font-semibold text-white">
                    {user.name}
                </span>
                <span className="truncate text-[10px] font-medium text-slate-400">
                    {String(roleInfo?.label ?? user.role)}
                </span>
                {showEmail && (
                    <span className="mt-1 w-max truncate rounded-md bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
