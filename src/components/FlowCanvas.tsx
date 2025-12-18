import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Connection,
    addEdge,
    useReactFlow,
    type Node,
    type Edge,
} from '@xyflow/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { useStore } from '../store';
import { Loader2 } from 'lucide-react';
import CustomNode from './CustomNode';

const nodeTypes = {
    appNode: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function FlowCanvas() {
    // Local ReactFlow state
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const { setSelectedNodeId, selectedAppId, setMobilePanelOpen } = useStore();
    const { fitView } = useReactFlow();

    // Fetch Graph Data
    const { data, isLoading, isError } = useQuery({
        queryKey: ['graph', selectedAppId],
        queryFn: () => api.fetchGraph(selectedAppId || 'default'),
    });

    // Sync API data to ReactFlow state
    useEffect(() => {
        if (data) {
            setNodes(data.nodes as Node[]);
            setEdges(data.edges as Edge[]);
            // Fit view after a tick to allow rendering
            setTimeout(() => fitView({ padding: 0.2 }), 50);
        }
    }, [data, setNodes, setEdges, fitView]);

    const { addNodeTrigger } = useStore();
    useEffect(() => {
        if (addNodeTrigger) {
            const newNode: Node = {
                id: `new-${Date.now()}`,
                type: 'appNode',
                position: { x: Math.random() * 400, y: Math.random() * 400 },
                data: { label: 'New Service', status: 'healthy', configValue: 50 },
            };
            setNodes((nds) => [...nds, newNode]);
        }
    }, [addNodeTrigger, setNodes]);

    // Auto-Save Graph
    useEffect(() => {
        if (selectedAppId && nodes.length > 0) {
            // Simple save on change. 
            // In production, we'd debounce this or use a mutation with optimistic updates.
            // For this mock, firing it is fine.
            api.saveGraph(selectedAppId, { nodes: nodes as any, edges });
        }
        // Also save if empty? Yes, if we deleted everything.
        if (selectedAppId && nodes.length === 0 && edges.length === 0) {
            api.saveGraph(selectedAppId, { nodes: [], edges: [] });
        }
    }, [nodes, edges, selectedAppId]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        setMobilePanelOpen(true);
    }, [setSelectedNodeId, setMobilePanelOpen]);

    // Deselect when clicking pane
    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
        setMobilePanelOpen(false);
    }, [setSelectedNodeId, setMobilePanelOpen]);

    // Handle Deletion - Reset selection if deleted
    const onNodesDelete = useCallback((_deleted: Node[]) => {
        setSelectedNodeId(null);
    }, [setSelectedNodeId]);


    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading Graph...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full w-full items-center justify-center text-destructive">
                Failed to load graph data.
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodesDelete={onNodesDelete}
                fitView
                nodeTypes={nodeTypes}
            >
                <Background gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}
