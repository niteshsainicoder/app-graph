import * as React from "react"
import { cn } from "../../utils"

// Simplified Tabs to avoid radix-ui/react-tabs dependency if possible, OR just use simple div buttons
// Prompt says "Tabs (Config, Runtime)".
// I will build a simple controlled Tabs component.

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ value, onValueChange: _onValueChange, children, className }: TabsProps) {
    return (
        <div className={cn("w-full", className)} data-value={value}>
            {children}
        </div>
    )
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, className, children, onClick, activeValue }: { value: string, className?: string, children: React.ReactNode, onClick?: () => void, activeValue?: string }) {
    // We need context or passing props. To keep it simple (noContext), we can just expect consuming component to pass onClick/active if I don't implement context.
    // Actually, Shadcn tabs uses Context.
    // I will just make this Presentational and handle state in Inspector.
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeValue === value ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
                className
            )}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, activeValue, className, children }: { value: string, activeValue?: string, className?: string, children: React.ReactNode }) {
    if (value !== activeValue) return null;
    return (
        <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    )
}
