import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { Editor } from './Editor';
import { File, RemoteFile, Type } from './external/editor/utils/file-manager';
import { useSearchParams } from 'react-router-dom';
import { Output } from './Output';
import { TerminalComponent as Terminal } from './Terminal';
import axios from 'axios';
import { FiPlay, FiSearch, FiUser, FiSettings, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

function useSocket(replId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(`ws://${replId}.peetcode.com`);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [replId]);

    return socket;
}

export const CodingPage = () => {
    const [podCreated, setPodCreated] = useState(false);
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
    
    useEffect(() => {
        if (replId) {
            axios.post(`http://localhost:3002/start`, { replId })
                .then(() => setPodCreated(true))
                .catch((err) => console.error(err));
        }
    }, []);

    if (!podCreated) {
        return (
            <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <div className="text-[#e6edf3] text-lg">Booting environment...</div>
                    <div className="text-[#7d8590] text-sm mt-2">Setting up your development container</div>
                </div>
            </div>
        );
    }
    return <CodingPagePostPodCreation />
}

export const CodingPagePostPodCreation = () => {
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
    const [loaded, setLoaded] = useState(false);
    const socket = useSocket(replId);
    const [fileStructure, setFileStructure] = useState<RemoteFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [showOutput, setShowOutput] = useState(false);
    const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.on('loaded', ({ rootContent }: { rootContent: RemoteFile[]}) => {
                setLoaded(true);
                setFileStructure(rootContent);
            });
        }
    }, [socket]);

    const onSelect = (file: File) => {
        if (file.type === Type.DIRECTORY) {
            socket?.emit("fetchDir", file.path, (data: RemoteFile[]) => {
                setFileStructure(prev => {
                    const allFiles = [...prev, ...data];
                    return allFiles.filter((file, index, self) => 
                        index === self.findIndex(f => f.path === file.path)
                    );
                });
            });
        } else {
            socket?.emit("fetchContent", { path: file.path }, (data: string) => {
                file.content = data;
                setSelectedFile(file);
            });
        }
    };
    
    if (!loaded) {
        return (
            <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse text-[#e6edf3] text-lg">Loading workspace...</div>
                    <div className="text-[#7d8590] text-sm mt-2">Fetching project files</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#0d1117] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-12 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">R</span>
                        </div>
                        <span className="text-[#e6edf3] font-medium">{replId}</span>
                        <span className="text-xs text-[#7d8590] bg-[#21262d] px-2 py-1 rounded">0% used</span>
                    </div>
                    <button 
                        onClick={() => setShowOutput(!showOutput)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors"
                    >
                        <FiPlay className="w-3 h-3" />
                        <span>Run</span>
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7d8590] w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="bg-[#21262d] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#7d8590] w-64 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="text-[#7d8590] hover:text-[#e6edf3] p-1.5 rounded transition-colors">
                            <FiUser className="w-4 h-4" />
                        </button>
                        <button className="text-[#7d8590] hover:text-[#e6edf3] p-1.5 rounded transition-colors">
                            <FiSettings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - File Explorer */}
                <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-[#30363d]">
                        <div className="flex items-center justify-between">
                            <span className="text-[#e6edf3] font-medium text-sm">Files</span>
                            <button className="text-[#7d8590] hover:text-[#e6edf3] p-1 rounded transition-colors">
                                <FiSettings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Editor socket={socket} selectedFile={selectedFile} onSelect={onSelect} files={fileStructure} />
                    </div>
                </div>

                {/* Center - Editor */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab Bar */}
                    <div className="h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4">
                        {selectedFile && (
                            <div className="flex items-center space-x-2 bg-[#21262d] px-3 py-1.5 rounded-t-lg">
                                <span className="text-[#e6edf3] text-sm">{selectedFile.name}</span>
                                <button className="text-[#7d8590] hover:text-[#e6edf3] text-xs">×</button>
                            </div>
                        )}
                    </div>
                    
                    {/* Editor Content */}
                    <div className="flex-1 bg-[#0d1117]">
                        {selectedFile ? (
                            <Editor socket={socket} selectedFile={selectedFile} onSelect={onSelect} files={fileStructure} />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-[#7d8590] text-lg mb-2">Welcome to your workspace</div>
                                    <div className="text-[#7d8590] text-sm">Select a file from the explorer to start editing</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Output (when visible) */}
                {showOutput && (
                    <div className="w-96 bg-[#161b22] border-l border-[#30363d] flex flex-col flex-shrink-0">
                        <div className="p-3 border-b border-[#30363d]">
                            <div className="flex items-center justify-between">
                                <span className="text-[#e6edf3] font-medium text-sm">Output</span>
                                <button 
                                    onClick={() => setShowOutput(false)}
                                    className="text-[#7d8590] hover:text-[#e6edf3] p-1 rounded transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <Output />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Panel - Terminal */}
            <div className={`bg-[#161b22] border-t border-[#30363d] flex flex-col flex-shrink-0 transition-all duration-200 ${
                isTerminalMaximized ? 'h-96' : 'h-48'
            }`}>
                <div className="h-10 flex items-center justify-between px-4 border-b border-[#30363d]">
                    <div className="flex items-center space-x-4">
                        <span className="text-[#e6edf3] font-medium text-sm">Terminal</span>
                        <div className="flex items-center space-x-2 text-xs text-[#7d8590]">
                            <span>bash</span>
                            <span>•</span>
                            <span>Ln 1, Col 1</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                        className="text-[#7d8590] hover:text-[#e6edf3] p-1 rounded transition-colors"
                    >
                        {isTerminalMaximized ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <Terminal socket={socket} />
                </div>
            </div>
        </div>
    );
}