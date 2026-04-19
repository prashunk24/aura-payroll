import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { API_BASE_URL, API_DOCS, ApiEndpointMeta, SOLANA_NETWORK, SOLANA_RPC } from "@/config/api";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const methodColor: Record<string, string> = {
  GET: "text-secondary border-secondary/40 bg-secondary/10",
  POST: "text-primary border-primary/40 bg-primary/10",
  PUT: "text-accent border-accent/40 bg-accent/10",
  DELETE: "text-destructive border-destructive/40 bg-destructive/10",
  PATCH: "text-accent border-accent/40 bg-accent/10",
};

const EndpointRow = ({ ep }: { ep: ApiEndpointMeta }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `${API_BASE_URL}${ep.path}`;
  const copy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Endpoint copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass-subtle rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md border ${methodColor[ep.method]}`}>
          {ep.method}
        </span>
        <code className="font-mono text-sm flex-1 truncate">{ep.path}</code>
        <span className="text-xs text-muted-foreground hidden md:block max-w-md truncate">{ep.description}</span>
      </button>
      {open && (
        <div className="border-t border-white/10 p-5 space-y-4 animate-fade-in">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Full URL</span>
              <button onClick={copy} className="inline-flex items-center gap-1 hover:text-foreground">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="block text-xs font-mono bg-black/40 rounded-lg px-3 py-2 break-all">{fullUrl}</code>
          </div>
          <p className="text-sm text-muted-foreground">{ep.description}</p>
          {ep.request && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Request body</p>
              <pre className="text-xs font-mono bg-black/40 rounded-lg p-3 overflow-auto"><code>{JSON.stringify(ep.request, null, 2)}</code></pre>
            </div>
          )}
          {ep.response && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Response</p>
              <pre className="text-xs font-mono bg-black/40 rounded-lg p-3 overflow-auto"><code>{JSON.stringify(ep.response, null, 2)}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Developers = () => (
  <PageShell>
    <div className="mb-10 animate-fade-in-up">
      <h1 className="text-4xl font-bold tracking-tight">Developer <span className="text-gradient">API</span></h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        All endpoints are configured in <code className="text-foreground bg-white/10 rounded px-1.5 py-0.5 text-xs">src/config/api.ts</code>.
        Edit a single file to repoint to your backend — UI components consume these constants.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-5 mb-8">
      <GlassCard>
        <p className="text-xs text-muted-foreground">Base URL</p>
        <p className="mt-1 font-mono text-sm break-all">{API_BASE_URL}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-xs text-muted-foreground">Solana network</p>
        <p className="mt-1 font-mono text-sm">{SOLANA_NETWORK}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-xs text-muted-foreground">RPC</p>
        <p className="mt-1 font-mono text-sm break-all">{SOLANA_RPC}</p>
      </GlassCard>
    </div>

    <GlassCard>
      <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
      <div className="space-y-2">
        {API_DOCS.map((ep) => (
          <EndpointRow key={ep.path + ep.method} ep={ep} />
        ))}
      </div>
    </GlassCard>
  </PageShell>
);

export default Developers;
