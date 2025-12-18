import { useReactFlow, useNodes } from '@xyflow/react';
import { useStore } from '../store';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { MockNodeData } from '../types';

export default function NodeInspector() {
    const { selectedNodeId, activeInspectorTab, setActiveInspectorTab } = useStore();
    const { setNodes } = useReactFlow();

    // Get nodes from ReactFlow store (reactive)
    const nodes = useNodes();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    if (!selectedNode) return null;

    const data = selectedNode.data as unknown as MockNodeData;

    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.target.value;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNodeId) {
                    return {
                        ...node,
                        data: { ...node.data, label: newLabel },
                    };
                }
                return node;
            })
        );
    };

    const handleConfigChange = (val: number) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNodeId) {
                    return {
                        ...node,
                        data: { ...node.data, configValue: val },
                    };
                }
                return node;
            })
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'default'; // primary
            case 'degraded': return 'secondary';
            case 'down': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="p-4 space-y-6">

            {/* Header Info */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground font-mono">ID: {selectedNode.id}</span>
                    <Badge variant={getStatusColor(data.status)} className="uppercase text-[10px]">
                        {data.status}
                    </Badge>
                </div>
                <h3 className="text-lg font-bold">{data.label}</h3>
            </div>

            <Tabs value={activeInspectorTab} onValueChange={(val) => setActiveInspectorTab(val as 'config' | 'runtime')}>
                <TabsList>
                    <TabsTrigger
                        value="config"
                        activeValue={activeInspectorTab}
                        onClick={() => setActiveInspectorTab('config')}
                    >
                        Config
                    </TabsTrigger>
                    <TabsTrigger
                        value="runtime"
                        activeValue={activeInspectorTab}
                        onClick={() => setActiveInspectorTab('runtime')}
                    >
                        Runtime
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="config" activeValue={activeInspectorTab} className="space-y-4 pt-4">

                    <div className="space-y-2">
                        <Label htmlFor="node-name">Node Name</Label>
                        <Input
                            id="node-name"
                            value={data.label}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Max Connections (0-100)</Label>
                            <span className="text-sm font-mono text-muted-foreground">{data.configValue}</span>
                        </div>

                        <Slider
                            value={[data.configValue]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={([val]) => handleConfigChange(val)}
                        />

                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={data.configValue}
                                onChange={(e) => handleConfigChange(Number(e.target.value))}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">Manual Override</span>
                        </div>
                    </div>

                </TabsContent>

                <TabsContent value="runtime" activeValue={activeInspectorTab} className="pt-4">
                    <div className="rounded-md bg-muted p-4 text-sm font-mono text-muted-foreground">
                        <p>Uptime: 99.9%</p>
                        <p>Latency: 45ms</p>
                        <p className="mt-2 text-xs">Runtime metrics are read-only.</p>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
}
