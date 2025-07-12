import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiFolder, FiUsers, FiSettings, FiHelpCircle, FiPlus } from 'react-icons/fi';

const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
const SERVICE_URL = "http://localhost:3001";

function getRandomSlug() {
    let slug = "";
    for (let i = 0; i < 3; i++) {
        slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
    }
    return slug;
}

export const Landing = () => {
    const [language, setLanguage] = useState("node-js");
    const [replId, setReplId] = useState(getRandomSlug());
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sidebarItems = [
        { icon: FiHome, label: 'Home', active: false },
        { icon: FiFolder, label: 'Apps', active: false },
        { icon: FiUsers, label: 'Teams', active: false },
        { icon: FiSettings, label: 'Settings', active: false },
        { icon: FiHelpCircle, label: 'Help', active: false },
    ];

    const templates = [
        { name: 'Node.js', value: 'node-js', icon: '🟢', description: 'JavaScript runtime' },
        { name: 'Python', value: 'python', icon: '🐍', description: 'Python interpreter' },
        { name: 'React', value: 'react', icon: '⚛️', description: 'React application' },
        { name: 'Vue', value: 'vue', icon: '💚', description: 'Vue.js application' },
    ];

    return (
        <div className="flex h-screen bg-[#0d1117]">
            {/* Sidebar */}
            <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col">
                {/* Logo/Brand */}
                <div className="p-4 border-b border-[#30363d]">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="text-[#e6edf3] font-semibold">Replit Clone</span>
                    </div>
                </div>

                {/* Create App Button */}
                <div className="p-4">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                        <FiPlus className="w-4 h-4" />
                        <span>Create App</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2">
                    {sidebarItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 cursor-pointer transition-colors ${
                                item.active 
                                    ? 'bg-[#30363d] text-[#e6edf3]' 
                                    : 'text-[#7d8590] hover:bg-[#21262d] hover:text-[#e6edf3]'
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="p-4 border-t border-[#30363d]">
                    <div className="text-xs text-[#7d8590]">
                        <div className="mb-2">Your Starter Plan</div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Free Apps: 4/10 created</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-14 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-semibold text-[#e6edf3]">Create a new App</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search & run commands"
                                className="bg-[#21262d] border border-[#30363d] rounded-lg px-3 py-1.5 text-sm text-[#e6edf3] placeholder-[#7d8590] w-64 focus:outline-none focus:border-blue-500"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#7d8590]">
                                Ctrl ⌘
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-[#30363d] rounded-full flex items-center justify-center">
                            <span className="text-sm text-[#e6edf3]">U</span>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        {/* Tabs */}
                        <div className="flex space-x-8 mb-8 border-b border-[#30363d]">
                            <button className="pb-3 text-[#e6edf3] border-b-2 border-blue-500 font-medium">
                                Create with Replit Agent
                            </button>
                            <button className="pb-3 text-[#7d8590] hover:text-[#e6edf3] transition-colors">
                                Choose a Template
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Template Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#e6edf3] mb-4">Template</h3>
                                
                                {/* Search Templates */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Search Templates"
                                        className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-3 text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Favorites */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-[#e6edf3] mb-3">Favorites</h4>
                                    <div className="space-y-2">
                                        {templates.map((template) => (
                                            <div
                                                key={template.value}
                                                onClick={() => setLanguage(template.value)}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                    language === template.value
                                                        ? 'bg-[#1f6feb] text-white'
                                                        : 'bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3]'
                                                }`}
                                            >
                                                <span className="text-lg">{template.icon}</span>
                                                <div>
                                                    <div className="font-medium">{template.name}</div>
                                                    <div className="text-xs text-[#7d8590]">{template.description}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - App Configuration */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#e6edf3] mb-4">Title</h3>
                                
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Name your App"
                                        value={replId}
                                        onChange={(e) => setReplId(e.target.value)}
                                        className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-4 py-3 text-[#e6edf3] placeholder-[#7d8590] focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Privacy Settings */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-[#e6edf3] mb-3">Privacy</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="privacy"
                                                value="public"
                                                defaultChecked
                                                className="w-4 h-4 text-blue-600 bg-[#21262d] border-[#30363d] focus:ring-blue-500"
                                            />
                                            <div>
                                                <div className="text-[#e6edf3] font-medium">🌐 Public</div>
                                                <div className="text-xs text-[#7d8590]">Anyone can view and fork this App.</div>
                                            </div>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="privacy"
                                                value="private"
                                                className="w-4 h-4 text-blue-600 bg-[#21262d] border-[#30363d] focus:ring-blue-500"
                                            />
                                            <div>
                                                <div className="text-[#e6edf3] font-medium">🔒 Private + Core</div>
                                                <div className="text-xs text-[#7d8590]">Only you can see and edit this App.</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Usage Indicator */}
                                <div className="mb-6">
                                    <div className="text-xs text-[#7d8590] mb-2">You have 6 free apps left</div>
                                    <div className="w-full bg-[#21262d] rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                    </div>
                                </div>

                                {/* Create Button */}
                                <button
                                    disabled={loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            await axios.post(`${SERVICE_URL}/project`, { replId, language });
                                            navigate(`/coding/?replId=${replId}`);
                                        } catch (error) {
                                            console.error(error);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? "Creating App..." : "Create App"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}