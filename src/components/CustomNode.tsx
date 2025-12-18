import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MockNodeData } from '../types';
import { Badge } from './ui/badge';
import { Database, Activity, Server } from 'lucide-react';
import { cn } from '../utils';

const CustomNode = ({ data, selected }: NodeProps) => {
    const nodeData = data as unknown as MockNodeData;
    // Fallback label if missing
    const label = nodeData.label || 'Node';

    // Choose icon based strictly on label keyword for demo purposes, 
    // or add a 'type' field to data if we extend the type. 
    // For now, let's infer 'type' from label or data.
    const isDB = label.toLowerCase().includes('db') || label.toLowerCase().includes('database');
    const Icon = isDB ? Database : Server;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'down': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className={cn(
            "w-[180px] rounded-md border-2 bg-card p-3 shadow-md transition-all",
            selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
            "relative group"
        )}>
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground w-3 h-3" />

            <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-md bg-muted">
                    <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div className={cn("w-2.5 h-2.5 rounded-full", getStatusColor(nodeData.status))} />
            </div>

            <div className="space-y-1">
                <div className="font-semibold text-sm truncate" title={label}>{label}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">
                    {isDB ? 'Database' : 'Service'}
                </div>
            </div>

            {/* Mini-metric */}
            <div className="mt-3 h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${nodeData.configValue ?? 0}%` }}
                />
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground w-3 h-3" />
        </div>
    );
};

export default memo(CustomNode);
