import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CreditCard, Gift, PiggyBank, TrendingUp } from "lucide-react";

type Transaction = {
  id: string;
  date: string; // ISO or display
  merchant: string;
  category: string;
  amount: number; // positive means spent
};

type Offer = {
  id: string;
  title: string;
  description: string;
  target: number; // amount to unlock or spend goal
  current: number; // current progress
  reward: string; // e.g., "10% cashback"
  status: "availed" | "available" | "completed";
  expiry?: string;
  transactions: Transaction[];
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

const initialAvailed: Offer[] = [
  {
    id: "offer-grocery-10",
    title: "10% Back on Groceries",
    description: "Spend ₹15,000 on groceries this month to earn 10% cashback",
    target: 15000,
    current: 11250,
    reward: "Up to ₹1,500 cashback",
    status: "availed",
    expiry: "2025-12-31",
    transactions: [
      { id: "t1", date: "2025-09-01", merchant: "BigBasket", category: "Groceries", amount: 3200 },
      { id: "t2", date: "2025-09-08", merchant: "Reliance Smart", category: "Groceries", amount: 4500 },
      { id: "t3", date: "2025-09-17", merchant: "D-Mart", category: "Groceries", amount: 3550 },
    ],
  },
  {
    id: "offer-dine-20",
    title: "Dine-Out Delight 20%",
    description: "Dine for ₹8,000 to unlock 20% off next month",
    target: 8000,
    current: 5900,
    reward: "20% off dining bill",
    status: "availed",
    expiry: "2025-10-15",
    transactions: [
      { id: "t4", date: "2025-09-03", merchant: "Social", category: "Dining", amount: 2100 },
      { id: "t5", date: "2025-09-13", merchant: "Barbeque Nation", category: "Dining", amount: 2650 },
      { id: "t6", date: "2025-09-20", merchant: "Mavs Pizzeria", category: "Dining", amount: 1150 },
    ],
  },
];

const initialAvailable: Offer[] = [
  {
    id: "offer-fuel-5",
    title: "Fuel Saver 5%",
    description: "Get 5% cashback on fuel spends up to ₹500",
    target: 10000,
    current: 0,
    reward: "₹500 cashback",
    status: "available",
    expiry: "2025-12-31",
    transactions: [],
  },
  {
    id: "offer-online-7",
    title: "Online Shopping 7%",
    description: "Earn 7% back on online shopping up to ₹2,000",
    target: 25000,
    current: 0,
    reward: "Up to ₹2,000",
    status: "available",
    expiry: "2025-12-31",
    transactions: [],
  },
  {
    id: "offer-travel-12",
    title: "Travel Frenzy 12%",
    description: "Book flights or hotels and get 12% off",
    target: 30000,
    current: 0,
    reward: "12% instant discount",
    status: "available",
    expiry: "2026-01-31",
    transactions: [],
  },
];

export default function Index() {
  const [availed, setAvailed] = useState<Offer[]>(initialAvailed);
  const [available, setAvailable] = useState<Offer[]>(initialAvailable);

  const totalSpent = useMemo(
    () =>
      availed.reduce((sum, o) => sum + o.transactions.reduce((s, t) => s + t.amount, 0), 0),
    [availed]
  );

  const activeOffers = availed.length;
  const rewardsPotential = useMemo(() => {
    const saved = availed.reduce((s, o) => s + Math.min(o.current, o.target) * 0.02, 0);
    return Math.round(saved);
  }, [availed]);

  const handleAvail = (offer: Offer) => {
    setAvailable((prev) => prev.filter((o) => o.id !== offer.id));
    setAvailed((prev) => [
      ...prev,
      { ...offer, status: "availed", current: 0, transactions: [] },
    ]);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero */}
      <section className="container pt-10 pb-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, Shreya</h1>
            <p className="text-muted-foreground">Your personalized spending and offers dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Download Statement</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add Card</Button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="container grid gap-4 md:grid-cols-3 pb-6">
        <StatCard
          title="Amount Spent"
          value={currency(totalSpent)}
          description="This month across all categories"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          title="Active Offers"
          value={`${activeOffers}`}
          description="Offers you're currently availing"
          icon={<Gift className="h-5 w-5" />}
        />
        <StatCard
          title="Rewards Earned"
          value={currency(rewardsPotential)}
          description="Estimated savings so far"
          icon={<PiggyBank className="h-5 w-5" />}
        />
      </section>

      {/* Content grid */}
      <section className="container grid gap-6 lg:grid-cols-3 pb-12">
        {/* Offers availed with progress and transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="gap-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Offers Availed — Progress Tracker
            </CardTitle>
            <CardDescription>Track your progress and view transactions under each offer</CardDescription>
          </CardHeader>
          <CardContent>
            {availed.length === 0 ? (
              <div className="text-sm text-muted-foreground">No active offers yet. Avail an offer to get started.</div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {availed.map((offer) => {
                  const pct = Math.min(100, Math.round((offer.current / offer.target) * 100));
                  const completed = pct >= 100 || offer.status === "completed";
                  return (
                    <AccordionItem key={offer.id} value={offer.id} className="border-b">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="w-full text-left">
                          <div className="flex items-center gap-2">
                            <span className={cn("h-2 w-2 rounded-full", completed ? "bg-emerald-500" : "bg-primary")} />
                            <span className="font-medium">{offer.title}</span>
                            <Badge variant={completed ? "default" : "secondary"}>{completed ? "Completed" : "In progress"}</Badge>
                            {offer.expiry && (
                              <span className="ml-auto text-xs text-muted-foreground">Expires {new Date(offer.expiry).toLocaleDateString()}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{offer.description}</p>
                          <div className="mt-3">
                            <Progress value={pct} />
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{currency(offer.current)} of {currency(offer.target)}</span>
                              <span>{pct}%</span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-4 rounded-lg border bg-card">
                          <div className="flex items-center justify-between px-4 py-3">
                            <div className="text-sm">
                              <div className="font-medium">Transactions under this offer</div>
                              <div className="text-muted-foreground">Eligible spends contributing to progress</div>
                            </div>
                            <Badge variant="secondary">{offer.transactions.length} transactions</Badge>
                          </div>
                          <ScrollArea className="max-h-[280px]">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Merchant</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {offer.transactions.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">No transactions yet</TableCell>
                                  </TableRow>
                                ) : (
                                  offer.transactions.map((t) => (
                                    <TableRow key={t.id}>
                                      <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                      <TableCell>{t.merchant}</TableCell>
                                      <TableCell>{t.category}</TableCell>
                                      <TableCell className="text-right">{currency(t.amount)}</TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Offers available to avail */}
        <Card>
          <CardHeader>
            <CardTitle>Offers You Can Avail</CardTitle>
            <CardDescription>Boost your savings with personalized offers</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {available.length === 0 && (
              <div className="text-sm text-muted-foreground">You're availing all recommended offers.</div>
            )}
            {available.map((offer) => (
              <div key={offer.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{offer.title}</span>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{offer.reward}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Spend goal: {currency(offer.target)} • Expires {offer.expiry ? new Date(offer.expiry).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <Button onClick={() => handleAvail(offer)} className="shrink-0">Avail</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
