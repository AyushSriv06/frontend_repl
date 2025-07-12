import { useEffect, useRef } from "react"
import { Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';

const fitAddon = new FitAddon();

function ab2str(buf: string) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

const OPTIONS_TERM = {
    useStyle: true,
    screenKeys: true,
    cursorBlink: true,
    cols: 120,
    rows: 24,
    theme: {
        background: "#0d1117",
        foreground: "#e6edf3",
        cursor: "#e6edf3",
        selection: "#264f78",
        black: "#0d1117",
        red: "#f85149",
        green: "#56d364",
        yellow: "#e3b341",
        blue: "#79c0ff",
        magenta: "#bc8cff",
        cyan: "#39c5cf",
        white: "#e6edf3",
        brightBlack: "#6e7681",
        brightRed: "#ff7b72",
        brightGreen: "#56d364",
        brightYellow: "#e3b341",
        brightBlue: "#79c0ff",
        brightMagenta: "#bc8cff",
        brightCyan: "#39c5cf",
        brightWhite: "#f0f6fc"
    }
};

export const TerminalComponent = ({ socket }: {socket: Socket}) => {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!terminalRef.current || !socket) {
            return;
        }

        socket.emit("requestTerminal");
        socket.on("terminal", terminalHandler)
        
        const term = new Terminal(OPTIONS_TERM)
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        
        // Fit terminal to container
        setTimeout(() => {
            fitAddon.fit();
        }, 100);

        function terminalHandler({ data }: { data: any }) {
            if (data instanceof ArrayBuffer) {
                term.write(ab2str(data))
            } else {
                term.write(data);
            }
        }

        term.onData((data) => {
            socket.emit('terminalData', { data });
        });

        socket.emit('terminalData', { data: '\n' });

        // Handle window resize
        const handleResize = () => {
            setTimeout(() => {
                fitAddon.fit();
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            socket.off("terminal", terminalHandler);
            window.removeEventListener('resize', handleResize);
            term.dispose();
        }
    }, [socket]);

    return (
        <div className="h-full w-full bg-[#0d1117] p-2">
            <div ref={terminalRef} className="h-full w-full" />
        </div>
    );
}