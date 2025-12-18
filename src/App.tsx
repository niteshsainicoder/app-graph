import { ReactFlowProvider } from '@xyflow/react';
import { useEffect } from 'react';
import { useStore } from './store';
import TopBar from './components/TopBar';
import LeftRail from './components/LeftRail';
import RightPanel from './components/RightPanel';
import FlowCanvas from './components/FlowCanvas';

function App() {
    const { isMobilePanelOpen, setMobilePanelOpen } = useStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobilePanelOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setMobilePanelOpen]);

    return (
        <ReactFlowProvider>
            <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
                <TopBar />

                <div className="flex flex-1 overflow-hidden">
                    <LeftRail />

                    <main className="relative flex-1 overflow-hidden bg-muted/20">
                        <FlowCanvas />
                    </main>

                    <RightPanel />
                </div>

                {/* Mobile Overlay */}
                {isMobilePanelOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setMobilePanelOpen(false)}
                    />
                )}
            </div>
        </ReactFlowProvider>
    );
}

export default App;
