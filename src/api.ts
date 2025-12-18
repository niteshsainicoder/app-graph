import { App, GraphResponse } from './types';

// Mock Data
const MOCK_APPS: App[] = [
    { id: '1', name: 'Production Cluster', createdAt: '2023-01-01' },
    { id: '2', name: 'Staging Environment', createdAt: '2023-02-15' },
    { id: '3', name: 'Dev Sandbox', createdAt: '2023-03-30' },
    { id: 'error', name: 'Broken App (Test Error)', createdAt: '2023-04-01' },
];

const MOCK_GRAPH: GraphResponse = {
    nodes: [
        { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Gateway', status: 'healthy', configValue: 80 }, type: 'appNode' },
        { id: 'n2', position: { x: 400, y: 100 }, data: { label: 'Auth Service', status: 'degraded', configValue: 45 }, type: 'appNode' },
        { id: 'n3', position: { x: 250, y: 300 }, data: { label: 'Database', status: 'down', configValue: 10 }, type: 'appNode' },
    ],
    edges: [
        { id: 'e1-2', source: 'n1', target: 'n2' },
        { id: 'e1-3', source: 'n1', target: 'n3' },
    ]
};

// In-memory storage for graphs
const GRAPHS: Record<string, GraphResponse> = {
    '1': { ...MOCK_GRAPH }, // Production starts with default
    '2': { nodes: [], edges: [] }, // Staging starts empty-ish
    '3': { nodes: [], edges: [] }, // Dev starts empty-ish
    'error': { nodes: [], edges: [] }, // Error app logic handled in fetch
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    fetchApps: async (): Promise<App[]> => {
        await delay(800); // Simulate network
        return MOCK_APPS;
    },

    fetchGraph: async (appId: string): Promise<GraphResponse> => {
        await delay(800); // Simulate network
        if (appId === 'error') throw new Error("Failed to load graph");

        // Return stored graph or initialize empty
        if (!GRAPHS[appId]) {
            GRAPHS[appId] = { nodes: [], edges: [] };
        }
        return GRAPHS[appId];
    },

    saveGraph: async (appId: string, graph: GraphResponse): Promise<void> => {
        // No delay for save to feel snappy, or small delay
        // Deep copy to ensure we don't accidentally mutate state ref reference issues
        GRAPHS[appId] = JSON.parse(JSON.stringify(graph));
    },

    addApp: async (name: string): Promise<App> => {
        await delay(500);
        const newApp: App = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date().toISOString()
        };
        MOCK_APPS.push(newApp);
        // Initialize empty graph for new app
        GRAPHS[newApp.id] = { nodes: [], edges: [] };
        return newApp;
    }
};
