"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandButton } from "@/components/shared/buttons";
import { PageShell, ContentCard } from "@/components/shared/section-shell";
import { cn } from "@/lib/utils";
import {
  ScrollText,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Download,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  Hash,
  Globe,
} from "lucide-react";

type AuditLog = {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  changes: string | null;
  ipAddress: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string; role: string } | null;
};

const ACTION_CONFIG: Record<
  string,
  { icon: typeof LogIn; bg: string; ring: string; text: string; label: string }
> = {
  CREATE: {
    icon: Plus,
    bg: "bg-emerald-100 dark:bg-emerald-500/15",
    ring: "ring-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Create",
  },
  UPDATE: {
    icon: Pencil,
    bg: "bg-blue-100 dark:bg-blue-500/15",
    ring: "ring-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    label: "Update",
  },
  DELETE: {
    icon: Trash2,
    bg: "bg-rose-100 dark:bg-rose-500/15",
    ring: "ring-rose-500/20",
    text: "text-rose-700 dark:text-rose-400",
    label: "Delete",
  },
  LOGIN: {
    icon: LogIn,
    bg: "bg-cyan-100 dark:bg-cyan-500/15",
    ring: "ring-cyan-500/20",
    text: "text-cyan-700 dark:text-cyan-400",
    label: "Login",
  },
  LOGOUT: {
    icon: LogOut,
    bg: "bg-violet-100 dark:bg-violet-500/15",
    ring: "ring-violet-500/20",
    text: "text-violet-700 dark:text-violet-400",
    label: "Logout",
  },
  EXPORT: {
    icon: Download,
    bg: "bg-stone-100 dark:bg-stone-500/15",
    ring: "ring-stone-500/20",
    text: "text-stone-700 dark:text-stone-400",
    label: "Export",
  },
};

const DEFAULT_ACTION = {
  icon: ScrollText,
  bg: "bg-gray-100 dark:bg-gray-500/15",
  ring: "ring-gray-500/20",
  text: "text-gray-700 dark:text-gray-400",
  label: "Action",
};

function getActionConfig(action: string) {
  return ACTION_CONFIG[action] ?? DEFAULT_ACTION;
}

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return { date, time };
}

export function AuditLogSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (entityFilter !== "all") params.set("entityType", entityFilter);
      params.set("limit", "100");
      const res = await fetch(`/api/audit?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load audit logs");
      const data = await res.json();
      let filtered = data.logs ?? [];
      if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter((l: AuditLog) =>
          l.summary.toLowerCase().includes(q) ||
          l.actor?.name?.toLowerCase().includes(q) ||
          l.actor?.email?.toLowerCase().includes(q) ||
          l.entityType.toLowerCase().includes(q)
        );
      }
      setLogs(filtered);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchLogs, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [actionFilter, entityFilter, search]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <PageShell>
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Audit Log
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <ShieldCheck className="h-3 w-3" />
            Compliance
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Every admin and instructor action is recorded here for compliance.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <ContentCard className="!p-3 sm:!p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by summary, actor, or entity…"
              className="pl-10 h-9 text-sm bg-muted/40"
            />
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm bg-muted/40">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-full sm:w-[150px] h-9 text-sm bg-muted/40">
              <SelectValue placeholder="Entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              {["user", "student", "exercise", "quiz", "capstone", "cohort"].map((e) => (
                <SelectItem key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <BrandButton variant="outline" size="sm" onClick={fetchLogs} loading={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </BrandButton>
        </div>
      </ContentCard>

      {/* ── Error ── */}
      {error && (
        <ContentCard className="flex items-center gap-3 !p-4 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-rose-800 dark:text-rose-300">Failed to load</p>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">{error}</p>
          </div>
          <button onClick={fetchLogs} className="text-sm font-medium text-rose-700 dark:text-rose-400 hover:underline shrink-0">
            Retry
          </button>
        </ContentCard>
      )}

      {/* ── Loading ── */}
      {loading && (
        <ContentCard className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-sm text-muted-foreground">Loading audit logs…</span>
        </ContentCard>
      )}

      {/* ── Empty ── */}
      {!loading && !error && logs.length === 0 && (
        <ContentCard className="flex flex-col items-center justify-center py-16 text-center">
          <ScrollText className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">No audit logs found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
        </ContentCard>
      )}

      {/* ── Log list ── */}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-2">
          {logs.map((log) => {
            const config = getActionConfig(log.action);
            const Icon = config.icon;
            const { date, time } = formatTimestamp(log.createdAt);
            const isExpanded = expandedId === log.id;

            return (
              <ContentCard key={log.id} hoverable className="!p-0">
                <button
                  onClick={() => toggleExpand(log.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-3 p-3 sm:p-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                        config.bg,
                        config.ring
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.text)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-snug text-foreground">
                          {log.summary}
                        </p>
                        <div className="flex shrink-0 flex-col items-end gap-0.5 text-right">
                          <span className="text-[11px] font-medium text-foreground/80 whitespace-nowrap">
                            {date}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                            <Clock className="h-2.5 w-2.5" />
                            {time}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                            config.bg,
                            config.ring,
                            config.text
                          )}
                        >
                          {config.label}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground/80">
                          <Hash className="mr-0.5 h-2.5 w-2.5" />
                          {log.entityType}
                        </Badge>
                        {log.actor && (
                          <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground/80">
                            <User className="mr-0.5 h-2.5 w-2.5" />
                            {log.actor.name}
                          </Badge>
                        )}
                        {log.ipAddress && (
                          <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground/60">
                            <Globe className="mr-0.5 h-2.5 w-2.5" />
                            {log.ipAddress}
                          </Badge>
                        )}

                        {log.changes && (
                          <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            Changes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {log.changes && isExpanded && (
                  <div className="border-t border-border/50 px-4 pb-4 pt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Change Details
                      </span>
                    </div>
                    <pre className="text-[11px] leading-relaxed text-muted-foreground bg-muted/50 rounded-lg p-3 overflow-x-auto font-mono whitespace-pre-wrap break-all border border-border/40">
                      {log.changes}
                    </pre>
                  </div>
                )}
              </ContentCard>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
