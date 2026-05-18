import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Wheat, LogOut, RefreshCw, ShieldAlert } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type Status = Database["public"]["Enums"]["order_status"];
type Item = { id: string; name: string; price: number; qty: number };

const STATUSES: Status[] = ["pending", "confirmed", "packed", "shipped", "cancelled"];

const statusStyles: Record<Status, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-accent/20 text-accent-foreground",
  packed: "bg-primary/10 text-primary",
  shipped: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · Orders — Sahya Heritage Rice" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setOrders(data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      setUserId(session.user.id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) await load();
      setLoading(false);
    })();
  }, [navigate, load]);

  const updateStatus = async (id: string, status: Status) => {
    const prev = orders;
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      setOrders(prev);
      toast.error("Update failed");
    } else {
      toast.success(`Marked as ${status}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-secondary">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8">
          <ShieldAlert className="size-10 mx-auto text-destructive" />
          <h1 className="font-serif text-2xl font-bold mt-4">Not an admin yet</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            You're signed in but don't have the admin role. Ask the site owner
            to grant the <code className="text-foreground">admin</code> role to
            your user ID:
          </p>
          <code className="block mt-3 text-xs bg-muted p-2 rounded break-all">{userId}</code>
          <div className="mt-6 flex gap-2 justify-center">
            <Button variant="outline" onClick={signOut}><LogOut className="size-4 mr-2" />Sign out</Button>
            <Button asChild><Link to="/">Back home</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" />
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <Wheat className="size-5" /> Admin · Orders
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load}>
              <RefreshCw className="size-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-bold">Incoming orders</h1>
        <p className="text-muted-foreground mt-1">{orders.length} total</p>

        {orders.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl py-16">
            No orders yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {orders.map((o) => {
              const items = (o.items as unknown as Item[]) ?? [];
              return (
                <article key={o.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-lg">{o.customer_name}</h2>
                        <Badge className={statusStyles[o.status]}>{o.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {o.phone} · {new Date(o.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm mt-2 whitespace-pre-wrap">{o.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">₹{o.total_amount}</div>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as Status)}>
                        <SelectTrigger className="mt-2 w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <ul className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
                    {items.map((it, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{it.name} × {it.qty}kg</span>
                        <span className="text-muted-foreground">₹{it.price * it.qty}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
