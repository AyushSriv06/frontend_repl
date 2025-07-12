import { useSearchParams } from "react-router-dom";

export const Output = () => {
    const [searchParams] = useSearchParams();
    const replId = searchParams.get('replId') ?? '';
    const INSTANCE_URI = `http://${replId}.autogpt-cloud.com`;

    return (
        <div className="h-full bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
            <iframe 
                width="100%" 
                height="100%" 
                src={INSTANCE_URI}
                className="border-0"
                title="Application Output"
            />
        </div>
    );
}