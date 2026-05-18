import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Leaf, Wheat, ShoppingBag, Minus, Plus } from "lucide-react";
import navara from "@/assets/navara.jpg";
import bahurupi from "@/assets/bahurupi.jpg";
import bangaru from "@/assets/bangarukaddi.jpg";
import hero from "@/assets/hero-field.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sahya Heritage Rice — Navara, Bahu Rupi & Bangaru Kaddi" },
      {
        name: "description",
        content:
          "Buy traditional heritage rice direct from the farm. Navara, Bahu Rupi and Bangaru Kaddi rice with fixed prices, uses and delivery.",
      },
    ],
  }),
});

type Rice = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  price: number; // per kg INR
  uses: string;
  when: string;
  how: string;
  who: string;
};

const RICES: Rice[] = [
  {
    id: "navara",
    name: "Navara Rice",
    tagline: "The medicinal heritage grain",
    image: navara,
    price: 220,
    uses:
      "Traditional Ayurvedic medicinal rice. Helps in nourishment, post-illness recovery, and is widely used in Navarakizhi therapy for joint and muscle health.",
    when:
      "Best during recovery from illness, post-pregnancy, monsoon and winter months, or as a strengthening diet for elders and children.",
    how:
      "Soak for 30 minutes. Cook with 1:3 rice-to-water ratio. Best as kanji (porridge) with a pinch of rock salt and cumin, or as plain steamed rice with ghee.",
    who:
      "Suitable for all ages — especially elders, children, new mothers, athletes and people on Ayurvedic diets.",
  },
  {
    id: "bahurupi",
    name: "Bahu Rupi Rice",
    tagline: "A landrace blend of many colours",
    image: bahurupi,
    price: 180,
    uses:
      "A nutrient-dense multi-coloured heritage rice rich in fibre, antioxidants and minerals. Great for daily meals and immunity support.",
    when:
      "Everyday lunch and dinner — ideal for families switching from polished white rice to a healthier whole-grain option.",
    how:
      "Wash gently, soak for 20 minutes, cook 1:2.5 with water. Pairs beautifully with sambar, dal, rasam or vegetable curries.",
    who:
      "Suitable for diabetics (low GI), fitness-conscious adults and anyone wanting a wholesome daily staple.",
  },
  {
    id: "bangaru",
    name: "Bangaru Kaddi Rice",
    tagline: "Golden, aromatic, festival-grade",
    image: bangaru,
    price: 260,
    uses:
      "A premium aromatic rice with long golden grains. Perfect for biryani, pulao, ghee rice, payasam and festive meals.",
    when:
      "Festivals, weddings, special occasions, Sunday biryanis — anytime you want a fragrant, fluffy plate.",
    how:
      "Rinse till water runs clear, soak 30 minutes, cook 1:2 with water. Each grain stays separate, fluffy and aromatic.",
    who:
      "Perfect for home cooks, caterers, restaurants and anyone who loves aromatic long-grain rice.",
  },
];

function Index() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [orderOpen, setOrderOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const cart = useMemo(
    () =>
      RICES.map((r) => ({ ...r, count: qty[r.id] ?? 0 })).filter(
        (r) => r.count > 0,
      ),
    [qty],
  );
  const total = cart.reduce((s, r) => s + r.price * r.count, 0);

  const update = (id: string, delta: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + delta) }));

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all delivery details");
      return;
    }
    toast.success("Order placed! We'll call you shortly to confirm.");
    setOrderOpen(false);
    setQty({});
    setForm({ name: "", phone: "", address: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2 font-serif text-xl font-bold text-primary">
            <Wheat className="size-6" />
            Sahya Heritage Rice
          </a>
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <a href="#rices" className="hover:text-primary transition">Our Rice</a>
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#contact" className="hover:text-primary transition">Contact</a>
          </nav>
          <Button
            size="sm"
            onClick={() => cart.length ? setOrderOpen(true) : toast.info("Add some rice first")}
            className="gap-2"
          >
            <ShoppingBag className="size-4" />
            Cart ({cart.reduce((s, r) => s + r.count, 0)})
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative h-[80vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src={hero}
          alt="Paddy fields at sunset"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        <div className="relative max-w-3xl text-center px-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-primary mb-4">
            <Leaf className="size-4" /> Farm to Doorstep
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Heritage rice,<br />grown the old way.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Three traditional varieties, naturally cultivated on our family farm.
            Fixed honest prices. Delivered straight to your kitchen.
          </p>
          <Button size="lg" asChild className="mt-8 gap-2">
            <a href="#rices">
              <ShoppingBag className="size-4" /> Shop Our Rice
            </a>
          </Button>
        </div>
      </section>

      {/* Products */}
      <section id="rices" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold">Three grains. One promise.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every variety below is grown without chemicals, hand-harvested, and priced fairly per kilogram.
          </p>
        </div>

        <div className="grid gap-10">
          {RICES.map((rice, i) => {
            const count = qty[rice.id] ?? 0;
            const flip = i % 2 === 1;
            return (
              <article
                key={rice.id}
                className={`grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden border border-border shadow-sm ${
                  flip ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="aspect-square md:aspect-auto md:h-full">
                  <img
                    src={rice.image}
                    alt={rice.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <p className="text-sm uppercase tracking-widest text-accent font-semibold">
                    {rice.tagline}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold mt-2">{rice.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₹{rice.price}</span>
                    <span className="text-muted-foreground">/ kg</span>
                  </div>

                  <dl className="mt-6 space-y-4 text-sm">
                    <div>
                      <dt className="font-semibold text-foreground">Uses</dt>
                      <dd className="text-muted-foreground mt-1">{rice.uses}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">When to use</dt>
                      <dd className="text-muted-foreground mt-1">{rice.when}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">How to use</dt>
                      <dd className="text-muted-foreground mt-1">{rice.how}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-foreground">Who can use</dt>
                      <dd className="text-muted-foreground mt-1">{rice.who}</dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-2 border border-border rounded-full p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full size-9"
                        onClick={() => update(rice.id, -1)}
                        disabled={count === 0}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{count}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full size-9"
                        onClick={() => update(rice.id, 1)}
                      >
                        <Plus className="size-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground pr-3">kg</span>
                    </div>
                    <Button onClick={() => update(rice.id, 1)} className="gap-2">
                      <ShoppingBag className="size-4" /> Add to cart
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="sticky bottom-4 mt-12 mx-auto max-w-md bg-primary text-primary-foreground rounded-full shadow-lg px-6 py-3 flex items-center justify-between">
            <span className="font-semibold">
              {cart.reduce((s, r) => s + r.count, 0)} kg · ₹{total}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOrderOpen(true)}
              className="rounded-full"
            >
              Checkout
            </Button>
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-secondary py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold">Grown by our family, for yours.</h2>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            For three generations we have farmed traditional rice varieties on the
            slopes of the Western Ghats. No pesticides, no polishing, no middlemen —
            just rice the way it has always been grown, packed and shipped within
            48 hours of your order.
          </p>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-primary">
              <Wheat className="size-5" /> Sahya Heritage Rice
            </div>
            <p className="mt-3 text-muted-foreground">
              Naturally grown traditional rice, delivered with care.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Contact</p>
            <p className="text-muted-foreground">+91 98765 43210</p>
            <p className="text-muted-foreground">orders@sahyarice.in</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Delivery</p>
            <p className="text-muted-foreground">All India shipping · 3–6 days</p>
            <p className="text-muted-foreground">Cash on delivery available</p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} Sahya Heritage Rice. All rights reserved.
        </p>
      </footer>

      {/* Order dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Confirm your order</DialogTitle>
            <DialogDescription>
              We'll call to confirm before dispatch. Cash on delivery available.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 border-b border-border pb-4">
            {cart.map((r) => (
              <div key={r.id} className="flex justify-between text-sm">
                <span>{r.name} × {r.count}kg</span>
                <span className="font-medium">₹{r.price * r.count}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="address">Delivery address</Label>
              <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={placeOrder} className="w-full">Place order · ₹{total}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
