import { useStore } from '../store';
import { cn } from '../utils';
import NodeInspector from './NodeInspector';
import { X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

export default function RightPanel() {
    const { selectedNodeId, isMobilePanelOpen, setMobilePanelOpen } = useStore();

    const AppSelector = () => {
        const { selectedAppId, setSelectedAppId } = useStore();
        const queryClient = useQueryClient();

        // Fetch Apps via Query
        const { data: apps, isLoading, isError } = useQuery({
            queryKey: ['apps'],
            queryFn: api.fetchApps,
        });

        const addAppMutation = useMutation({
            mutationFn: api.addApp,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['apps'] });
            },
        });

        const handleCreateApp = () => {
            const name = prompt("Enter App Name:");
            if (name) {
                addAppMutation.mutate(name);
            }
        }

        if (isLoading) {
            return <div className="p-4 text-sm text-muted-foreground">Loading apps...</div>;
        }

        if (isError) {
            return <div className="p-4 text-sm text-destructive">Failed to load apps.</div>;
        }

        return (
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-muted-foreground">Applications</h3>
                    <button onClick={handleCreateApp} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90">
                        + New
                    </button>
                </div>
                <div className="space-y-1">
                    {apps?.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                selectedAppId === app.id
                                    ? "bg-secondary text-secondary-foreground font-medium"
                                    : "hover:bg-muted text-muted-foreground"
                            )}
                        >
                            {app.name}
                        </button>
                    ))}
                </div>
                <div className="pt-4 border-t text-xs text-muted-foreground">
                    <p>Select an app to view its graph.</p>
                </div>
            </div>
        );
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 right-0 z-50 w-80 transform border-l bg-card transition-transform duration-300 ease-in-out md:static md:translate-x-0",
                isMobilePanelOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
            )}
        >
            <div className="flex h-14 items-center justify-between border-b px-4">
                <h2 className="font-semibold">
                    {selectedNodeId ? 'Inspector' : 'Apps'}
                </h2>
                <button
                    onClick={() => setMobilePanelOpen(false)}
                    className="md:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
                {selectedNodeId ? <NodeInspector /> : <AppSelector />}
            </div>
        </aside>
    );
}
