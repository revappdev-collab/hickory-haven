import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEMO,
  isBlocked,
  quote,
  todayISO,
  type Party,
} from "./model";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dial: string;
  password: string;
  marketing: boolean;
  dob: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  points: number;
  referralCode: string;
  verified: boolean;
  faceId: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: string;
  checkOut: string;
  party: Party;
  status: "upcoming" | "past" | "cancelled" | "pending";
  confirmation: string;
  purpose: string;
  arrival: string;
  requests: string;
  guestNames: string[];
  promo?: string;
  payment: string;
  cardLast4: string;
};

export type ChatMessage = {
  id: string;
  from: "guest" | "host";
  text: string;
  at: string;
  read: boolean;
};

export type Thread = {
  id: string;
  userId: string;
  title: string;
  who: string;
  messages: ChatMessage[];
};

export type Note = {
  id: string;
  userId: string;
  group: "Today" | "Earlier";
  kind: "booking" | "reminder" | "stay" | "offer";
  title: string;
  body: string;
  time: string;
  read: boolean;
  href: string;
};

export type Card = { id: string; brand: string; last4: string; exp: string; isDefault: boolean };

export type GuestReview = {
  id: string;
  userId: string;
  bookingId: string;
  stars: number;
  scores: Record<string, number>;
  text: string;
  recommend: boolean;
  privateNote: string;
  createdAt: string;
};

export type Toast = { id: number; title: string; body?: string };

export type Prefs = {
  confirmations: boolean;
  weekBefore: boolean;
  twoDays: boolean;
  dayOf: boolean;
  checkout: boolean;
  offers: boolean;
  stayAlerts: boolean;
  faceId: boolean;
};

const ELENA: User = {
  id: "u-elena",
  firstName: "Elena",
  lastName: "Marlowe",
  email: DEMO.email,
  phone: "(555) 014-2281",
  dial: "+1",
  password: DEMO.password,
  marketing: true,
  dob: "1979-04-12",
  address: "184 Cedar Court, Brookfield",
  emergencyName: "Mark Marlowe",
  emergencyPhone: "(555) 014-2290",
  points: 640,
  referralCode: "ELENA-OLIVE",
  verified: true,
  faceId: true,
};

const seedBookings: Booking[] = [
  {
    id: "b-upcoming",
    userId: "u-elena",
    propertyId: "cozy-olive",
    checkIn: "2026-11-14",
    checkOut: "2026-11-16",
    party: { adults: 2, children: 0, infants: 0, pets: 0 },
    status: "upcoming",
    confirmation: "HH-184226",
    purpose: "Parents' Weekend",
    arrival: "After 6:00pm",
    requests: "We’ll come from the Saturday welcome on campus. A kettle on would be lovely.",
    guestNames: ["Elena Marlowe", "Mark Marlowe"],
    payment: "Paid",
    cardLast4: "4242",
  },
  {
    id: "b-past",
    userId: "u-elena",
    propertyId: "cozy-olive",
    checkIn: "2026-09-18",
    checkOut: "2026-09-21",
    party: { adults: 2, children: 1, infants: 0, pets: 0 },
    status: "past",
    confirmation: "HH-090188",
    purpose: "Family Visits",
    arrival: "3:30pm",
    requests: "",
    guestNames: ["Elena Marlowe"],
    payment: "Paid",
    cardLast4: "4242",
  },
  {
    id: "b-cancelled",
    userId: "u-elena",
    propertyId: "cozy-olive",
    checkIn: "2026-10-02",
    checkOut: "2026-10-04",
    party: { adults: 2, children: 0, infants: 0, pets: 0 },
    status: "cancelled",
    confirmation: "HH-100244",
    purpose: "Work Trip",
    arrival: "4:00pm",
    requests: "",
    guestNames: [],
    payment: "Refunded",
    cardLast4: "4242",
  },
];

const seedThreads: Thread[] = [
  {
    id: "t-barb",
    userId: "u-elena",
    title: "The Cozy Olive",
    who: "Barb Vallenari",
    messages: [
      {
        id: "m1",
        from: "host",
        text: "Elena, the house is ready for Parents’ Weekend. Code appears in your trip tomorrow morning, and the driveway is yours.",
        at: "9:14 AM",
        read: true,
      },
      {
        id: "m2",
        from: "guest",
        text: "Thank you, Barb. We’ll be in after the welcome on campus, probably closer to 6.",
        at: "9:41 AM",
        read: true,
      },
      {
        id: "m3",
        from: "host",
        text: "Perfect. I’ll leave the porch light on. If the street is full, ignore it and pull straight into the driveway.",
        at: "9:46 AM",
        read: false,
      },
    ],
  },
  {
    id: "t-support",
    userId: "u-elena",
    title: "Hickory & Haven",
    who: "Guest support",
    messages: [
      {
        id: "s1",
        from: "host",
        text: "Your September stay earned 585 Haven points. They’re on your profile whenever you want to put them toward a night.",
        at: "Sep 22",
        read: true,
      },
    ],
  },
];

const seedNotes: Note[] = [
  {
    id: "n1",
    userId: "u-elena",
    group: "Today",
    kind: "stay",
    title: "Street parking is tight this weekend",
    body: "Parents’ Weekend fills Hickory Street. Use the driveway. Sweeping runs Sunday 8–11am.",
    time: "8:05 AM",
    read: false,
    href: "announcement:parking",
  },
  {
    id: "n2",
    userId: "u-elena",
    group: "Today",
    kind: "reminder",
    title: "You check in tomorrow",
    body: "The Cozy Olive · Nov 14–16. Your door code unlocks inside 48 hours.",
    time: "7:30 AM",
    read: false,
    href: "reservation:b-upcoming",
  },
  {
    id: "n3",
    userId: "u-elena",
    group: "Earlier",
    kind: "booking",
    title: "Booking confirmed",
    body: "HH-184226 · The Cozy Olive · two nights, booked direct.",
    time: "Nov 2",
    read: true,
    href: "reservation:b-upcoming",
  },
  {
    id: "n4",
    userId: "u-elena",
    group: "Earlier",
    kind: "offer",
    title: "A midweek reason to come back",
    body: "HAVEN50 takes $50 off Sunday–Thursday stays.",
    time: "Oct 28",
    read: true,
    href: "offer:midweek",
  },
  {
    id: "n5",
    userId: "u-elena",
    group: "Earlier",
    kind: "stay",
    title: "How was the porch?",
    body: "Your September stay is ready for a few words, and 100 bonus points.",
    time: "Sep 22",
    read: false,
    href: "feedback:b-past",
  },
];

const DEFAULT_PREFS: Prefs = {
  confirmations: true,
  weekBefore: true,
  twoDays: true,
  dayOf: true,
  checkout: true,
  offers: true,
  stayAlerts: true,
  faceId: true,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

type Store = {
  ready: boolean;
  user: User | null;
  guest: boolean;
  users: User[];
  bookings: Booking[];
  threads: Thread[];
  notes: Note[];
  saved: string[];
  cards: Card[];
  reviews: GuestReview[];
  prefs: Prefs;
  theme: "system" | "light" | "dark";
  textSize: "default" | "large" | "xlarge";
  currency: "USD" | "CAD";
  language: "English" | "Español";
  reduceMotion: boolean;
  onboarded: boolean;
  draft: {
    propertyId: string;
    checkIn: string | null;
    checkOut: string | null;
    party: Party;
    promo: string;
    purpose: string;
    arrival: string;
    requests: string;
    guestNames: string;
    cardId: string;
  };
  search: {
    location: string;
    checkIn: string | null;
    checkOut: string | null;
    party: Party;
    sort: "recommended" | "price" | "rating" | "newest" | "campus";
    recents: string[];
  };
  filters: {
    price: [number, number];
    beds: number;
    baths: number;
    guests: number;
    amenities: string[];
    pet: boolean;
    parking: boolean;
    workspace: boolean;
    ev: boolean;
  };
  checkoutDone: Record<string, boolean>;
  codeShown: boolean;
  waitlist: boolean;
  toasts: Toast[];
  pointsHistory: { id: string; label: string; points: number; when: string }[];
  referrals: { name: string; status: string }[];
  login: (email: string, password: string) => string | null;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dial: string;
    password: string;
    marketing: boolean;
  }) => string | null;
  logout: () => void;
  continueAsGuest: () => void;
  markOnboarded: () => void;
  updateUser: (patch: Partial<User>) => void;
  setTheme: (t: Store["theme"]) => void;
  setTextSize: (t: Store["textSize"]) => void;
  setCurrency: (c: Store["currency"]) => void;
  setLanguage: (l: Store["language"]) => void;
  setReduceMotion: (v: boolean) => void;
  togglePref: (k: keyof Prefs) => void;
  setDraft: (patch: Partial<Store["draft"]>) => void;
  setSearch: (patch: Partial<Store["search"]>) => void;
  setFilters: (patch: Partial<Store["filters"]>) => void;
  resetFilters: () => void;
  toggleSaved: (id: string) => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
  isTaken: (iso: string, ignoreBookingId?: string) => boolean;
  confirmBooking: () => string | null;
  modifyBooking: (id: string, checkIn: string, checkOut: string, party: Party) => void;
  cancelBooking: (id: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
  markNote: (id: string, read: boolean) => void;
  deleteNote: (id: string) => void;
  markAllNotes: () => void;
  addCard: (brand: string, last4: string, exp: string) => void;
  setDefaultCard: (id: string) => void;
  removeCard: (id: string) => void;
  redeemNight: () => boolean;
  addReview: (review: Omit<GuestReview, "id" | "userId" | "createdAt">) => void;
  toggleCheckout: (id: string) => void;
  setCodeShown: (v: boolean) => void;
  setWaitlist: (v: boolean) => void;
  myBookings: Booking[];
  myThreads: Thread[];
  myNotes: Note[];
  liveStatus: (b: Booking) => Booking["status"];
};

const Ctx = createContext<Store | null>(null);

const emptyParty: Party = { adults: 2, children: 0, infants: 0, pets: 0 };

const defaultFilters: Store["filters"] = {
  price: [120, 280],
  beds: 0,
  baths: 0,
  guests: 1,
  amenities: [],
  pet: false,
  parking: false,
  workspace: false,
  ev: false,
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([ELENA]);
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [notes, setNotes] = useState<Note[]>(seedNotes);
  const [saved, setSaved] = useState<string[]>([]);
  const [cards, setCards] = useState<Card[]>([
    { id: "c1", brand: "Visa", last4: "4242", exp: "08 / 28", isDefault: true },
    { id: "c2", brand: "Mastercard", last4: "5512", exp: "02 / 27", isDefault: false },
  ]);
  const [reviews, setReviews] = useState<GuestReview[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [theme, setThemeState] = useState<Store["theme"]>("system");
  const [textSize, setTextSizeState] = useState<Store["textSize"]>("default");
  const [currency, setCurrencyState] = useState<Store["currency"]>("USD");
  const [language, setLanguageState] = useState<Store["language"]>("English");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [ready, setReady] = useState(false);
  const [draft, setDraftState] = useState<Store["draft"]>({
    propertyId: "cozy-olive",
    checkIn: null,
    checkOut: null,
    party: emptyParty,
    promo: "",
    purpose: "Parents' Weekend",
    arrival: "4:00pm – 6:00pm",
    requests: "",
    guestNames: "",
    cardId: "c1",
  });
  const [search, setSearchState] = useState<Store["search"]>({
    location: "Havenbrook",
    checkIn: null,
    checkOut: null,
    party: emptyParty,
    sort: "recommended",
    recents: ["Havenbrook", "Havenbrook College"],
  });
  const [filters, setFiltersState] = useState(defaultFilters);
  const [checkoutDone, setCheckoutDone] = useState<Record<string, boolean>>({});
  const [codeShown, setCodeShown] = useState(false);
  const [waitlist, setWaitlist] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pointsHistory, setPointsHistory] = useState([
    { id: "p1", label: "September stay at The Cozy Olive", points: 585, when: "Sep 22, 2026" },
    { id: "p2", label: "Welcome to Haven Rewards", points: 55, when: "Aug 2026" },
  ]);
  const [referrals] = useState([
    { name: "Claire M.", status: "Invite sent" },
    { name: "Andre P.", status: "Joined · stay pending" },
  ]);

  useEffect(() => {
    const extra = read<User[]>("hh-users", []);
    const all = [ELENA, ...extra.filter((u) => u.id !== ELENA.id)];
    setUsers(all);
    const sid = read<string | null>("hh-session", null);
    if (sid === "guest") setGuest(true);
    else if (sid) setUser(all.find((u) => u.id === sid) ?? null);
    setBookings(read("hh-bookings", seedBookings));
    setSaved(read("hh-saved", []));
    setOnboarded(read("hh-onboarded", false));
    setThemeState(read("hh-theme", "system"));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    write("hh-users", users.filter((u) => u.id !== ELENA.id));
    write("hh-session", guest ? "guest" : user?.id ?? null);
    write("hh-bookings", bookings);
    write("hh-saved", saved);
    write("hh-onboarded", onboarded);
    write("hh-theme", theme);
  }, [ready, users, user, guest, bookings, saved, onboarded, theme]);

  const pushToast = (title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, body }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const liveStatus = (b: Booking): Booking["status"] => {
    if (b.status === "cancelled" || b.status === "pending") return b.status;
    if (b.checkOut <= todayISO()) return "past";
    return "upcoming";
  };

  const isTaken = (iso: string, ignoreBookingId?: string) => {
    if (
      bookings.some(
        (b) => b.id !== ignoreBookingId && b.status !== "cancelled" && iso >= b.checkIn && iso < b.checkOut,
      )
    ) {
      return true;
    }
    return isBlocked(iso);
  };

  const value = useMemo<Store>(() => {
    const myBookings = user ? bookings.filter((b) => b.userId === user.id) : [];
    const myThreads = user ? threads.filter((t) => t.userId === user.id) : [];
    const myNotes = user ? notes.filter((n) => n.userId === user.id) : [];

    return {
      ready,
      user,
      guest,
      users,
      bookings,
      threads,
      notes,
      saved,
      cards,
      reviews,
      prefs,
      theme,
      textSize,
      currency,
      language,
      reduceMotion,
      onboarded,
      draft,
      search,
      filters,
      checkoutDone,
      codeShown,
      waitlist,
      toasts,
      pointsHistory,
      referrals,
      myBookings,
      myThreads,
      myNotes,
      liveStatus,
      login: (email, password) => {
        const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) return "That email and password don’t match.";
        setUser(found);
        setGuest(false);
        return null;
      },
      register: (input) => {
        if (users.some((u) => u.email.toLowerCase() === input.email.trim().toLowerCase())) {
          return "An account with that email already exists. Try signing in.";
        }
        const created: User = {
          id: `u-${Date.now()}`,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          dial: input.dial,
          password: input.password,
          marketing: input.marketing,
          dob: "",
          address: "",
          emergencyName: "",
          emergencyPhone: "",
          points: 100,
          referralCode: `${input.firstName.slice(0, 6).toUpperCase()}-OLIVE`,
          verified: false,
          faceId: false,
        };
        setUsers((list) => [...list, created]);
        setUser(created);
        setGuest(false);
        setPointsHistory((h) => [{ id: `p-${Date.now()}`, label: "Welcome points", points: 100, when: "Today" }, ...h]);
        return null;
      },
      logout: () => {
        setUser(null);
        setGuest(false);
      },
      continueAsGuest: () => {
        setUser(null);
        setGuest(true);
      },
      markOnboarded: () => setOnboarded(true),
      updateUser: (patch) => {
        if (!user) return;
        setUser({ ...user, ...patch });
        setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, ...patch } : u)));
      },
      setTheme: setThemeState,
      setTextSize: setTextSizeState,
      setCurrency: setCurrencyState,
      setLanguage: setLanguageState,
      setReduceMotion,
      togglePref: (k) => setPrefs((p) => ({ ...p, [k]: !p[k] })),
      setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
      setSearch: (patch) => setSearchState((s) => ({ ...s, ...patch })),
      setFilters: (patch) => setFiltersState((f) => ({ ...f, ...patch })),
      resetFilters: () => setFiltersState(defaultFilters),
      toggleSaved: (id) => setSaved((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])),
      pushToast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      isTaken,
      confirmBooking: () => {
        if (!user || !draft.checkIn || !draft.checkOut) return null;
        const q = quote(draft.checkIn, draft.checkOut, draft.promo, draft.party.pets);
        if (!q) return null;
        const id = `b-${Date.now()}`;
        const confirmation = `HH-${Math.floor(100000 + Math.random() * 899999)}`;
        const card = cards.find((c) => c.id === draft.cardId) ?? cards[0];
        const booking: Booking = {
          id,
          userId: user.id,
          propertyId: draft.propertyId,
          checkIn: draft.checkIn,
          checkOut: draft.checkOut,
          party: draft.party,
          status: "upcoming",
          confirmation,
          purpose: draft.purpose,
          arrival: draft.arrival,
          requests: draft.requests,
          guestNames: draft.guestNames.split(",").map((s) => s.trim()).filter(Boolean),
          promo: q.promo,
          payment: "Paid",
          cardLast4: card?.last4 ?? "4242",
        };
        setBookings((list) => [booking, ...list]);
        if (q.promo === "NIGHTCREDIT") {
          setUser((u) => (u ? { ...u, points: Math.max(0, u.points - 1000) } : u));
        }
        const earned = q.room;
        setPointsHistory((h) => [
          { id: `p-${id}`, label: "Points pending for this stay", points: earned, when: "After checkout" },
          ...h,
        ]);
        pushToast("You’re booked", confirmation);
        return id;
      },
      modifyBooking: (id, checkIn, checkOut, party) => {
        setBookings((list) =>
          list.map((b) => (b.id === id ? { ...b, checkIn, checkOut, party, status: "pending" } : b)),
        );
        pushToast("Request sent", "Barb will confirm if those nights are still yours alone.");
      },
      cancelBooking: (id) => {
        setBookings((list) => list.map((b) => (b.id === id ? { ...b, status: "cancelled", payment: "Refund pending" } : b)));
        pushToast("Stay cancelled", "We’ll email the refund timeline.");
      },
      sendMessage: (threadId, text) => {
        const msg: ChatMessage = { id: `m-${Date.now()}`, from: "guest", text, at: "Now", read: true };
        setThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg] } : t)));
        window.setTimeout(() => {
          const reply: ChatMessage = {
            id: `m-${Date.now()}-r`,
            from: "host",
            text: "Got it. I’ll follow up here if anything about the house changes before you arrive.",
            at: "Now",
            read: false,
          };
          setThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, reply] } : t)));
        }, 900);
      },
      markThreadRead: (threadId) => {
        setThreads((list) =>
          list.map((t) =>
            t.id === threadId ? { ...t, messages: t.messages.map((m) => ({ ...m, read: true })) } : t,
          ),
        );
      },
      markNote: (id, read) => setNotes((list) => list.map((n) => (n.id === id ? { ...n, read } : n))),
      deleteNote: (id) => setNotes((list) => list.filter((n) => n.id !== id)),
      markAllNotes: () => setNotes((list) => list.map((n) => (user && n.userId === user.id ? { ...n, read: true } : n))),
      addCard: (brand, last4, exp) => {
        setCards((list) => [...list, { id: `c-${Date.now()}`, brand, last4, exp, isDefault: list.length === 0 }]);
        pushToast("Card saved");
      },
      setDefaultCard: (id) => setCards((list) => list.map((c) => ({ ...c, isDefault: c.id === id }))),
      removeCard: (id) => setCards((list) => list.filter((c) => c.id !== id)),
      redeemNight: () => {
        if (!user || user.points < 1000) return false;
        setDraftState((d) => ({ ...d, promo: "NIGHTCREDIT" }));
        pushToast("Night credit applied", "It will show on the price breakdown.");
        return true;
      },
      addReview: (review) => {
        if (!user) return;
        setReviews((list) => [
          { ...review, id: `rv-${Date.now()}`, userId: user.id, createdAt: "Today" },
          ...list,
        ]);
        const bonus = 100;
        setUser((u) => (u ? { ...u, points: u.points + bonus } : u));
        setUsers((list) => list.map((u) => (u.id === user.id ? { ...u, points: u.points + bonus } : u)));
        setPointsHistory((h) => [{ id: `p-rv-${Date.now()}`, label: "Thank you for the review", points: bonus, when: "Today" }, ...h]);
      },
      toggleCheckout: (id) => setCheckoutDone((m) => ({ ...m, [id]: !m[id] })),
      setCodeShown,
      setWaitlist,
    };
    // liveStatus and isTaken close over latest bookings via state in this render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    user,
    guest,
    users,
    bookings,
    threads,
    notes,
    saved,
    cards,
    reviews,
    prefs,
    theme,
    textSize,
    currency,
    language,
    reduceMotion,
    onboarded,
    draft,
    search,
    filters,
    checkoutDone,
    codeShown,
    waitlist,
    toasts,
    pointsHistory,
    referrals,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}

export function useOptionalStore() {
  return useContext(Ctx);
}
