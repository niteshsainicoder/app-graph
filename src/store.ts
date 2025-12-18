import { create } from 'zustand';
import { App } from './types';

type AppState = {
    selectedAppId: string | null;
    selectedNodeId: string | null;
    isMobilePanelOpen: boolean;
    activeInspectorTab: 'config' | 'runtime';

    apps: App[];
    // If we had real persistent state we'd use these, but for now we just use them in memory
    addApp: (name: string) => void;
    // Trigger for FlowCanvas to add a node (timestamp or null)
    addNodeTrigger: number | null;
    triggerAddNode: () => void;

    setSelectedAppId: (id: string | null) => void;
    setSelectedNodeId: (id: string | null) => void;
    setMobilePanelOpen: (isOpen: boolean) => void;
    setActiveInspectorTab: (tab: 'config' | 'runtime') => void;
};

export const useStore = create<AppState>((set) => ({
    selectedAppId: '1',
    selectedNodeId: null,
    isMobilePanelOpen: false,
    activeInspectorTab: 'config',
    apps: [],
    addNodeTrigger: null,

    addApp: (name) => set((state) => ({
        apps: [...state.apps, { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }]
    })),
    triggerAddNode: () => set({ addNodeTrigger: Date.now() }),

    setSelectedAppId: (id) => set({ selectedAppId: id }),
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),
    setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
    setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}));
