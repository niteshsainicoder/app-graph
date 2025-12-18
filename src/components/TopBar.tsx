import { LayoutGrid, Bell, Plus } from 'lucide-react';
import { useStore } from '../store';
import { Button } from './ui/button';

export default function TopBar() {
    const { triggerAddNode } = useStore();

    return (
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
            <div className="flex items-center gap-2 font-semibold">
                <LayoutGrid className="h-6 w-6 text-primary" />
                <span className="">GraphBuilder</span>
            </div>
            <div className="flex items-center gap-4">
                <Button size="sm" onClick={triggerAddNode} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Node
                </Button>
                <button className="rounded-full p-2 hover:bg-muted text-muted-foreground">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    JD
                </div>
            </div>
        </header>
    );
}
