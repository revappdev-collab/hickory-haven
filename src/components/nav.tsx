import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";

export type Gate =
  | "splash"
  | "onboarding"
  | "permissions"
  | "welcome"
  | "register"
  | "login"
  | "forgot"
  | "otp"
  | "newpass"
  | "resetdone"
  | "recovery"
  | "app";

export type TabId = "home" | "explore" | "trips" | "messages" | "profile";

export type Screen =
  | { name: "property"; propertyId: string }
  | { name: "gallery"; propertyId: string; category?: string }
  | { name: "amenities"; propertyId: string }
  | { name: "neighborhood"; propertyId: string }
  | { name: "waitlist" }
  | { name: "saved" }
  | { name: "search" }
  | { name: "calendar"; propertyId?: string }
  | { name: "results" }
  | { name: "summary" }
  | { name: "guests" }
  | { name: "payment" }
  | { name: "processing" }
  | { name: "confirmed"; bookingId: string }
  | { name: "reservation"; bookingId: string }
  | { name: "modify"; bookingId: string }
  | { name: "cancel"; bookingId: string }
  | { name: "reminders" }
  | { name: "guidebook"; bookingId: string }
  | { name: "checkin"; bookingId: string }
  | { name: "checkout"; bookingId: string }
  | { name: "rules" }
  | { name: "wifi" }
  | { name: "locals"; category?: string }
  | { name: "place"; placeId: string }
  | { name: "events" }
  | { name: "thread"; threadId: string }
  | { name: "contact" }
  | { name: "inquiry" }
  | { name: "help" }
  | { name: "inbox" }
  | { name: "notif-prefs" }
  | { name: "announcement"; id: string }
  | { name: "reviews"; propertyId: string }
  | { name: "stories" }
  | { name: "feedback"; bookingId: string }
  | { name: "thanks" }
  | { name: "my-reviews" }
  | { name: "offers" }
  | { name: "offer"; offerId: string }
  | { name: "coupons" }
  | { name: "rewards" }
  | { name: "redeem" }
  | { name: "rebook" }
  | { name: "referral" }
  | { name: "edit-profile" }
  | { name: "settings" }
  | { name: "payments" }
  | { name: "add-card" }
  | { name: "about" }
  | { name: "policy"; kind: "terms" | "privacy" | "cancel" }
  | { name: "receipt"; bookingId: string };

type NavApi = {
  gate: Gate;
  go: (g: Gate) => void;
  replaceGate: (g: Gate) => void;
  backGate: () => void;
  enterApp: (tab?: TabId) => void;
  leaveApp: () => void;
  tab: TabId;
  setTab: (t: TabId) => void;
  stack: Screen[];
  push: (s: Screen) => void;
  pushOn: (tab: TabId, s: Screen) => void;
  pop: () => void;
  popRoot: () => void;
  goHome: () => void;
  goTrips: () => void;
  signInOpen: boolean;
  setSignInOpen: (v: boolean) => void;
  requireUser: (fn: () => void) => void;
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;
};

const Ctx = createContext<NavApi | null>(null);

const emptyStacks = (): Record<TabId, Screen[]> => ({
  home: [],
  explore: [],
  trips: [],
  messages: [],
  profile: [],
});

export function NavProvider({ children }: { children: ReactNode }) {
  const { user } = useStore();
  const [gates, setGates] = useState<Gate[]>(["splash"]);
  const [tab, setTab] = useState<TabId>("home");
  const [stacks, setStacks] = useState(emptyStacks);
  const [signInOpen, setSignInOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gate = gates[gates.length - 1] ?? "splash";

  const go = useCallback((g: Gate) => setGates((s) => [...s, g]), []);
  const replaceGate = useCallback((g: Gate) => setGates([g]), []);
  const backGate = useCallback(() => setGates((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const enterApp = useCallback((next?: TabId) => {
    setGates(["app"]);
    if (next) setTab(next);
  }, []);
  const leaveApp = useCallback(() => {
    setGates(["login"]);
    setStacks(emptyStacks());
    setTab("home");
  }, []);
  const push = useCallback(
    (screen: Screen) => setStacks((s) => ({ ...s, [tab]: [...s[tab], screen] })),
    [tab],
  );
  const pushOn = useCallback((next: TabId, screen: Screen) => {
    setTab(next);
    setStacks((s) => ({ ...s, [next]: [...s[next], screen] }));
  }, []);
  const pop = useCallback(() => setStacks((s) => ({ ...s, [tab]: s[tab].slice(0, -1) })), [tab]);
  const popRoot = useCallback(() => setStacks((s) => ({ ...s, [tab]: [] })), [tab]);
  const goHome = useCallback(() => {
    setStacks(emptyStacks());
    setTab("home");
  }, []);
  const goTrips = useCallback(() => {
    setStacks(emptyStacks());
    setTab("trips");
  }, []);
  const requireUser = useCallback(
    (fn: () => void) => {
      if (user) fn();
      else setSignInOpen(true);
    },
    [user],
  );

  const api = useMemo<NavApi>(
    () => ({
      gate,
      go,
      replaceGate,
      backGate,
      enterApp,
      leaveApp,
      tab,
      setTab,
      stack: stacks[tab],
      push,
      pushOn,
      pop,
      popRoot,
      goHome,
      goTrips,
      signInOpen,
      setSignInOpen,
      requireUser,
      filtersOpen,
      setFiltersOpen,
    }),
    [
      gate,
      go,
      replaceGate,
      backGate,
      enterApp,
      leaveApp,
      tab,
      stacks,
      push,
      pushOn,
      pop,
      popRoot,
      goHome,
      goTrips,
      signInOpen,
      requireUser,
      filtersOpen,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNav outside provider");
  return ctx;
}
