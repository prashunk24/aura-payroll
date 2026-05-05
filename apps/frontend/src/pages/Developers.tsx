import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { API_BASE_URL, API_DOCS, ApiEndpointMeta, SOLANA_NETWORK, SOLANA_RPC } from "@/config/api";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const methodColor: Record<string, string> = {
  GET: "text-foreground border-foreground/30 bg-muted",
  POST: "text-primary-foreground border-primary bg-primary",
  PUT: "text-foreground border-foreground/30 bg-muted",
  DELETE: "text-destructive-foreground border-destructive bg-destructive",
  PATCH: "text-foreground border-foreground/30 bg-muted",
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
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 sm:p-4 flex items-center gap-2 sm:gap-4 hover:bg-foreground/[0.04] transition-colors">
        <span className={`text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-1 rounded-md border shrink-0 ${methodColor[ep.method]}`}>
          {ep.method}
        </span>
        <code className="font-mono text-xs sm:text-sm flex-1 truncate min-w-0">{ep.path}</code>
        <span className="text-xs text-muted-foreground hidden lg:block max-w-md truncate">{ep.description}</span>
      </button>
      {open && (
        <div className="border-t border-foreground/10 p-5 space-y-4 animate-fade-in">
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
    <div className="mb-8 sm:mb-10 animate-fade-in-up">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Developer <span className="text-gradient">API</span></h1>
      <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
        All endpoints are configured in <code className="text-foreground bg-foreground/5 rounded px-1.5 py-0.5 text-xs">src/config/api.ts</code>.
        Edit a single file to repoint to your backend — UI components consume these constants.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
      <GlassCard>
        <p className="text-xs text-muted-foreground">Base URL</p>
        <p className="mt-1 font-mono text-xs sm:text-sm break-all">{API_BASE_URL}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-xs text-muted-foreground">Solana network</p>
        <p className="mt-1 font-mono text-xs sm:text-sm">{SOLANA_NETWORK}</p>
      </GlassCard>
      <GlassCard className="sm:col-span-2 md:col-span-1">
        <p className="text-xs text-muted-foreground">RPC</p>
        <p className="mt-1 font-mono text-xs sm:text-sm break-all">{SOLANA_RPC}</p>
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
