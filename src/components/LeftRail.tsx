import { Home, Layers, PieChart, Settings, Users } from 'lucide-react';
import { cn } from '../utils';

const NAV_ITEMS = [
    { icon: Home, label: 'Home', active: false },
    { icon: Layers, label: 'Graph', active: true },
    { icon: PieChart, label: 'Analytics', active: false },
    { icon: Users, label: 'Team', active: false },
    { icon: Settings, label: 'Settings', active: false },
];

export default function LeftRail() {
    return (
        <aside className="hidden w-16 flex-col items-center border-r bg-card py-4 md:flex">
            <nav className="flex flex-1 flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted",
                            item.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        )}
                        title={item.label}
                    >
                        <item.icon className="h-5 w-5" />
                    </button>
                ))}
            </nav>
        </aside>
    );
}
