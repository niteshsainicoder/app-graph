export type App = {
    id: string;
    name: string;
    createdAt: string;
};

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export type MockNodeData = {
    label: string;
    status: NodeStatus;
    configValue: number; // 0-100
};

// Response from GET /apps/:appId/graph
export type GraphResponse = {
    nodes: Array<{
        id: string;
        position: { x: number; y: number };
        data: MockNodeData;
        type?: string;
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
    }>;
};
