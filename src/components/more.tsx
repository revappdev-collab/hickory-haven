import { Bell, CircleHelp, Copy, CreditCard, Gift, Heart, Info, LogOut, Search, Settings, Star, Tag, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CHECKIN_STEPS,
  CHECKOUT_ITEMS,
  DOOR_CODE,
  EVENTS,
  FAQ,
  HOST,
  OFFERS,
  PLACE_CATEGORIES,
  PLACES,
  POLICIES,
  PURPOSES,
  REVIEWS,
  RULES,
  TIERS,
  WIFI,
  daysUntil,
  money,
  prettyRange,
  propertyById,
  tierFor,
} from "@/lib/model";
import { useStore } from "@/lib/store";
import { Button, Chip, Empty, Field, Group, Logo, Photo, Row, Screen, Segmented, Stars, Toggle, fieldClass } from "./ios";
import { useNav } from "./nav";

export function MessagesScreen() {
  const { push, setSignInOpen } = useNav();
  const { user, myThreads } = useStore();
  return (
    <Screen title="Messages" large>
      {!user ? (
        <Empty title="Say hello when you’re ready" body="Messages with Barb stay on your account." action="Sign in" onAction={() => setSignInOpen(true)} />
      ) : myThreads.length === 0 ? (
        <Empty title="No messages yet" body="Ask about dates, the door, or a restaurant. Barb usually replies within an hour." action="Contact host" onAction={() => push({ name: "contact" })} />
      ) : (
        <div className="overflow-hidden rounded-[16px] bg-card">
          {myThreads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            const unread = t.messages.some((m) => m.from === "host" && !m.read);
            return (
              <button key={t.id} type="button" onClick={() => push({ name: "thread", threadId: t.id })} className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-[#F6F1E7]">{t.who.slice(0, 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-semibold">{t.who}</span>
                    <span className="text-[12px] text-muted-foreground">{last?.at}</span>
                  </span>
                  <span className="block truncate text-[15px] text-muted-foreground">{last?.text}</span>
                </span>
                {unread ? <span className="h-2.5 w-2.5 rounded-full bg-brown" aria-label="Unread" /> : null}
              </button>
            );
          })}
        </div>
      )}
      <Button full variant="secondary" className="mt-4" onClick={() => push({ name: "inquiry" })}>
        Ask before you book
      </Button>
    </Screen>
  );
}

export function ThreadScreen({ threadId }: { threadId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const thread = store.threads.find((t) => t.id === threadId);
  const [text, setText] = useState("");
  const [quick] = useState(["What time is check-in?", "Is the driveway free?", "Any festival notes?"]);
  if (!thread) return <Screen title="Message" onBack={pop}><Empty title="Conversation closed" body="Start a new note from Contact." /></Screen>;
  return (
    <Screen
      title={thread.who}
      onBack={() => {
        store.markThreadRead(thread.id);
        pop();
      }}
      footer={
        <div className="border-t border-line bg-card p-3 pb-[max(10px,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
            {quick.map((q) => (
              <Chip key={q} onClick={() => store.sendMessage(thread.id, q)}>{q}</Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={fieldClass} placeholder="Message" value={text} onChange={(e) => setText(e.target.value)} aria-label="Message" />
            <Button
              onClick={() => {
                if (!text.trim()) return;
                store.sendMessage(thread.id, text.trim());
                setText("");
              }}
            >
              Send
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        {thread.messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "guest" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-[18px] px-3 py-2 text-[17px] leading-snug ${m.from === "guest" ? "bg-brown text-[#F6F1E7]" : "bg-card text-foreground"}`}>
              <p>{m.text}</p>
              <p className={`mt-1 text-[12px] ${m.from === "guest" ? "text-[#E4DCCB]" : "text-muted-foreground"}`}>
                {m.at}
                {m.from === "guest" ? " · Read" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function ContactScreen() {
  const { pop, push } = useNav();
  const { pushToast, myThreads } = useStore();
  return (
    <Screen title="Contact" onBack={pop}>
      <p className="font-serif text-[28px]">Barb is a person, not a desk</p>
      <p className="mt-2 text-[15px] text-muted-foreground">{HOST.response}. For anything urgent during a stay, call.</p>
      <div className="mt-4 overflow-hidden rounded-[16px] bg-card">
        <Row title="Call" detail={HOST.phone} onClick={() => pushToast("Call", HOST.phone)} />
        <Row title="Text" detail="Same number" onClick={() => pushToast("Text", "A message opens to Barb on your phone.")} />
        <Row title="Email" detail={HOST.email} onClick={() => pushToast("Email", HOST.email)} />
        <Row title="In-app message" detail="Keeps a record with your trip" onClick={() => push({ name: "thread", threadId: myThreads[0]?.id ?? "t-barb" })} />
        <Row title="Help center" detail="Booking, pets, parking" onClick={() => push({ name: "help" })} />
        <Row title="Emergency" detail="911, then call Barb" onClick={() => pushToast("Emergency", "Call 911 first. Then (555) 018-1960.")} />
      </div>
    </Screen>
  );
}

export function InquiryScreen() {
  const { pop } = useNav();
  const store = useStore();
  const [property, setProperty] = useState("The Cozy Olive");
  const [question, setQuestion] = useState("Is the weekend of the harvest market still open for four adults?");
  const [sent, setSent] = useState(false);
  return (
    <Screen title="Ask a question" onBack={pop}>
      {sent ? (
        <Empty title="Sent to Barb" body="You’ll see the reply in Messages. She usually writes within an hour." />
      ) : (
        <div className="space-y-4">
          <Field label="Property">
            <select className={fieldClass} value={property} onChange={(e) => setProperty(e.target.value)}>
              <option>The Cozy Olive</option>
              <option>The Maple Porch</option>
            </select>
          </Field>
          <Field label="Dates" hint="Optional">
            <input className={fieldClass} placeholder="Nov 21 – 23" />
          </Field>
          <Field label="Question">
            <textarea className={`${fieldClass} h-28 py-3`} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </Field>
          <Button
            full
            onClick={() => {
              if (question.trim().length < 8) {
                store.pushToast("Add a little more", "A full question helps Barb answer once.");
                return;
              }
              const thread = store.myThreads[0];
              if (thread) store.sendMessage(thread.id, `${property}: ${question.trim()}`);
              setSent(true);
            }}
          >
            Send
          </Button>
        </div>
      )}
    </Screen>
  );
}

export function HelpScreen() {
  const { pop } = useNav();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(FAQ[0].q);
  const list = FAQ.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen title="Help" onBack={pop}>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-4 text-muted-foreground" />
        <input className={`${fieldClass} pl-9`} placeholder="Search help" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search help" />
      </div>
      {list.length === 0 ? (
        <Empty title="No articles" body="Try “parking”, “pets”, or “cancel”." />
      ) : (
        <div className="mt-4 space-y-2">
          {list.map((f) => (
            <button key={f.q} type="button" onClick={() => setOpen(open === f.q ? null : f.q)} className="w-full rounded-[16px] bg-card px-4 py-3 text-left">
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{f.group}</p>
              <p className="text-[17px] font-semibold">{f.q}</p>
              {open === f.q ? <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p> : null}
            </button>
          ))}
        </div>
      )}
    </Screen>
  );
}

export function InboxScreen() {
  const { pop, push, pushOn } = useNav();
  const store = useStore();
  const groups = ["Today", "Earlier"] as const;
  function open(href: string) {
    const [kind, id] = href.split(":");
    if (kind === "reservation") pushOn("trips", { name: "reservation", bookingId: id });
    else if (kind === "feedback") pushOn("trips", { name: "feedback", bookingId: id });
    else if (kind === "offer") pushOn("profile", { name: "offer", offerId: id });
    else pushOn("home", { name: "announcement", id: "parking" });
  }
  return (
    <Screen
      title="Notifications"
      onBack={pop}
      right={
        <button type="button" className="min-h-11 px-2 text-[15px] font-semibold text-[#7F4F24]" onClick={store.markAllNotes}>
          Read all
        </button>
      }
    >
      {store.myNotes.length === 0 ? (
        <Empty title="You’re all caught up" body="Booking updates, reminders, and the occasional local note land here." action="Notification settings" onAction={() => pop()} />
      ) : (
        groups.map((g) => {
          const items = store.myNotes.filter((n) => n.group === g);
          if (!items.length) return null;
          return (
            <section key={g} className="mt-2">
              <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{g}</h2>
              <div className="space-y-2">
                {items.map((n) => (
                  <div key={n.id} className="rounded-[16px] bg-card p-3">
                    <button type="button" className="w-full text-left" onClick={() => { store.markNote(n.id, true); open(n.href); }}>
                      <p className="text-[12px] uppercase tracking-[0.06em] text-olive">{n.kind}</p>
                      <p className={`text-[17px] ${n.read ? "" : "font-semibold"}`}>{n.title}</p>
                      <p className="text-[15px] text-muted-foreground">{n.body}</p>
                      <p className="mt-1 text-[12px] text-muted-foreground">{n.time}</p>
                    </button>
                    <div className="mt-2 flex gap-2">
                      <Button variant="secondary" className="min-h-9 px-3 text-[15px]" onClick={() => store.markNote(n.id, !n.read)}>{n.read ? "Mark unread" : "Mark read"}</Button>
                      <Button variant="tertiary" className="min-h-9 px-3 text-[15px]" onClick={() => store.deleteNote(n.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
      <button type="button" className="mt-4 text-[15px] font-semibold text-[#7F4F24]" onClick={() => push({ name: "notif-prefs" })}>
        Notification preferences
      </button>
    </Screen>
  );
}

export function NotifPrefsScreen() {
  const { pop } = useNav();
  const { prefs, togglePref } = useStore();
  const rows = [
    ["confirmations", "Booking updates"],
    ["weekBefore", "Reminders"],
    ["stayAlerts", "Stay announcements"],
    ["offers", "Offers"],
    ["checkout", "Checkout reminders"],
  ] as const;
  return (
    <Screen title="Notifications" onBack={pop}>
      <div className="overflow-hidden rounded-[16px] bg-card">
        {rows.map(([key, label]) => (
          <div key={key} className="flex min-h-[52px] items-center justify-between border-b border-line px-4 last:border-0">
            <span className="text-[17px]">{label}</span>
            <Toggle label={label} on={prefs[key]} onChange={() => togglePref(key)} />
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function AnnouncementScreen() {
  const { pop } = useNav();
  return (
    <Screen title="This weekend" onBack={pop}>
      <Photo name="parents-weekend" alt="Families on a campus path" className="h-44 w-full rounded-[20px] bg-chip" />
      <h2 className="mt-4 font-serif text-[28px] leading-tight">Street parking is tight</h2>
      <p className="mt-2 text-[17px] leading-relaxed">
        Parents’ Weekend fills Hickory Street from Friday afternoon. Please use the driveway — two cars, nose in — and leave the neighbor’s apron clear. Street sweeping runs Sunday 8–11am.
      </p>
      <p className="mt-3 text-[17px] leading-relaxed">
        Festival traffic toward the river starts around 5. If you’re coming from campus, Hickory is calmer than the square.
      </p>
      <Button full className="mt-5" onClick={pop}>Got it</Button>
    </Screen>
  );
}

export function GuidebookScreen({ bookingId }: { bookingId: string }) {
  const { pop, push } = useNav();
  const sections = [
    ["Check-in", "checkin"],
    ["Check-out", "checkout"],
    ["House rules", "rules"],
    ["Wi-Fi & access", "wifi"],
    ["Appliances", "wifi"],
    ["Local recommendations", "locals"],
    ["Emergency & support", "contact"],
    ["Parking", "neighborhood"],
    ["Trash & recycling", "checkout"],
  ] as const;
  return (
    <Screen title="Guidebook" onBack={pop} bleed>
      <div className="relative h-56">
        <Photo name="cozy-olive-exterior" alt="Guidebook cover, The Cozy Olive" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#333D29] via-[#333D29]/30 to-transparent" />
        <Logo blend={false} className="absolute left-5 top-4 h-12 w-40 rounded-xl bg-[#F6F1E7] object-contain px-2" />
        <div className="absolute bottom-4 left-5 right-5 text-[#F6F1E7]">
          <p className="font-serif text-[28px] leading-none">The Cozy Olive</p>
          <p className="text-[15px]">Your house notes from Barb</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-5 pt-4">
        {sections.map(([label, dest]) => (
          <button
            key={label}
            type="button"
            className="min-h-[72px] rounded-[16px] bg-card px-3 py-3 text-left text-[15px] font-semibold"
            onClick={() => {
              if (dest === "checkin") push({ name: "checkin", bookingId });
              else if (dest === "checkout") push({ name: "checkout", bookingId });
              else if (dest === "rules") push({ name: "rules" });
              else if (dest === "wifi") push({ name: "wifi" });
              else if (dest === "locals") push({ name: "locals" });
              else if (dest === "contact") push({ name: "contact" });
              else push({ name: "neighborhood", propertyId: "cozy-olive" });
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function CheckinScreen({ bookingId }: { bookingId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  const unlocked = b ? daysUntil(b.checkIn) <= 2 && daysUntil(b.checkIn) >= -1 : false;
  return (
    <Screen title="Check-in" onBack={pop}>
      <p className="text-[17px]">Arrival from 3:00pm. {b ? `You’re planning ${b.arrival}.` : ""}</p>
      <div className="mt-4 space-y-4">
        {CHECKIN_STEPS.map((step, i) => (
          <article key={step.title}>
            <Photo name={step.photo} alt={step.alt} className="h-36 w-full rounded-[16px] bg-chip" />
            <p className="mt-2 text-[13px] font-semibold text-olive">Step {i + 1}</p>
            <h2 className="font-serif text-[22px]">{step.title}</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 rounded-[16px] bg-card p-4">
        <p className="text-[17px] font-semibold">Door code</p>
        {unlocked ? (
          <>
            <p className="mt-1 text-[15px] text-muted-foreground">Tap to reveal. It works from 3:00pm on check-in day.</p>
            <button type="button" className="mt-3 min-h-11 text-[22px] font-semibold tracking-[0.3em]" onClick={() => store.setCodeShown(!store.codeShown)}>
              {store.codeShown ? DOOR_CODE : "Show code"}
            </button>
          </>
        ) : (
          <p className="mt-1 text-[15px] text-muted-foreground">Your code appears 48 hours before check-in, so it isn’t sitting in an old screenshot.</p>
        )}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-[15px] font-semibold">Self check-in, thirty seconds</p>
        <Photo name="cozy-olive-exterior" alt="Front door used in the check-in video" className="h-40 w-full rounded-[16px] bg-chip" />
        <p className="mt-2 text-[13px] text-muted-foreground">The video tour on the home page shows the same door and keypad.</p>
      </div>
    </Screen>
  );
}

export function CheckoutScreen({ bookingId }: { bookingId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const [done, setDone] = useState(false);
  const all = CHECKOUT_ITEMS.every((item) => store.checkoutDone[item.id]);
  return (
    <Screen title="Check-out" onBack={pop}>
      <p className="text-[17px]">Please be out by 11:00am so the house can breathe before the next guests.</p>
      <div className="mt-4 overflow-hidden rounded-[16px] bg-card">
        {CHECKOUT_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0">
            <span className="text-[15px]">{item.label}</span>
            <Toggle label={item.label} on={Boolean(store.checkoutDone[item.id])} onChange={() => store.toggleCheckout(item.id)} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-[15px] text-muted-foreground">Trash and recycling bins are beside the garage. The keypad locks behind you. No key to return.</p>
      {done ? (
        <p className="mt-4 rounded-[16px] bg-olive/15 p-4 text-[15px]">Thank you. Barb has the checkout, and the points from this stay will post today.</p>
      ) : (
        <Button full className="mt-4" disabled={!all} onClick={() => { setDone(true); store.pushToast("Checked out", "Safe travels."); }}>
          I’ve checked out
        </Button>
      )}
      <p className="sr-only">{bookingId}</p>
    </Screen>
  );
}

export function RulesScreen() {
  const { pop } = useNav();
  return (
    <Screen title="House rules" onBack={pop}>
      <p className="text-[17px] leading-relaxed">Written the way we’d tell a friend, and meant the same way.</p>
      <div className="mt-4 space-y-3">
        {RULES.map((r) => (
          <div key={r.title} className="rounded-[16px] bg-card p-4">
            <p className="text-[17px] font-semibold">{r.title}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{r.body}</p>
          </div>
        ))}
      </div>
    </Screen>
  );
}

export function WifiScreen() {
  const { pop } = useNav();
  const { pushToast } = useStore();
  const cells = useMemo(() => Array.from({ length: 121 }, (_, i) => ((i * 17 + WIFI.password.length) % 7) > 2), []);
  return (
    <Screen title="Wi-Fi & access" onBack={pop}>
      <div className="rounded-[16px] bg-card p-4">
        <p className="text-[13px] text-muted-foreground">Network</p>
        <p className="text-[22px] font-semibold">{WIFI.name}</p>
        <p className="mt-3 text-[13px] text-muted-foreground">Password</p>
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-semibold">{WIFI.password}</p>
          <button type="button" aria-label="Copy Wi-Fi password" className="flex h-11 w-11 items-center justify-center" onClick={() => { void navigator.clipboard.writeText(WIFI.password); pushToast("Copied", WIFI.password); }}>
            <Copy size={18} />
          </button>
        </div>
      </div>
      <div className="mx-auto mt-4 grid w-40 grid-cols-11 gap-0.5 bg-forest p-2" role="img" aria-label={`Wi-Fi code preview for ${WIFI.name}. Password ${WIFI.password}. Use the copy button to join.`}>
        {cells.map((on, i) => (
          <span key={i} className={`h-2.5 w-2.5 ${on ? "bg-[#F6F1E7]" : "bg-transparent"}`} />
        ))}
      </div>
      <p className="mt-2 text-center text-[13px] text-muted-foreground">Show this to join, or copy the password. Thermostat likes 68–70. TV apps should be signed out before you leave.</p>
      <Group title="Quick how-tos">
        <Row title="Coffee" detail="Beans in the jar, grinder on 8, drip for a full pot." />
        <Row title="Dishwasher" detail="Tablet under the sink. Run it before checkout if it’s full." />
        <Row title="Thermostat" detail="The Nest is in the hall. Away mode is already set for checkout morning." />
        <Row title="Washer" detail="Normal, warm. Please don’t overload the towels." />
      </Group>
    </Screen>
  );
}

export function LocalsScreen({ category }: { category?: string }) {
  const { pop, push } = useNav();
  const [cat, setCat] = useState(category ?? "All");
  const [map, setMap] = useState(false);
  const list = PLACES.filter((p) => cat === "All" || p.category === cat);
  return (
    <Screen title="Around town" onBack={pop}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip on={cat === "All"} onClick={() => setCat("All")}>All</Chip>
        {PLACE_CATEGORIES.map((c) => (
          <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <div className="mt-3">
        <Segmented value={map ? "map" : "list"} onChange={(v) => setMap(v === "map")} options={[{ id: "list", label: "List" }, { id: "map", label: "Map" }]} />
      </div>
      {map ? <p className="mt-3 text-[15px] text-muted-foreground">The neighborhood map on the home page has the same pins. Distances below are from the front door.</p> : null}
      {list.length === 0 ? <Empty title="Nothing in this list" body="Try Eat & Drink or Coffee." /> : (
        <div className="mt-4 space-y-3">
          {list.map((p) => (
            <button key={p.id} type="button" onClick={() => push({ name: "place", placeId: p.id })} className="flex w-full gap-3 text-left">
              <Photo name={p.photo} alt={p.alt} className="h-20 w-20 shrink-0 rounded-[14px] bg-chip" />
              <span>
                {p.hostPick ? <span className="text-[12px] font-semibold text-olive">Host’s pick</span> : null}
                <span className="block text-[17px] font-semibold">{p.name}</span>
                <span className="block text-[13px] text-muted-foreground">{p.category} · {p.price} · {p.minutes}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </Screen>
  );
}

export function PlaceScreen({ placeId }: { placeId: string }) {
  const { pop } = useNav();
  const { pushToast } = useStore();
  const place = PLACES.find((p) => p.id === placeId) ?? PLACES[0];
  const maps = `https://maps.apple.com/?q=${encodeURIComponent(place.name + " Havenbrook")}`;
  return (
    <Screen title={place.name} onBack={pop} bleed>
      <Photo name={place.photo} alt={place.alt} className="h-56 w-full bg-chip" />
      <div className="px-5 pt-4">
        {place.hostPick ? <p className="text-[13px] font-semibold text-olive">Host’s pick</p> : null}
        <p className="text-[15px] text-muted-foreground">{place.category} · {place.price} · {place.distance}</p>
        <p className="mt-3 text-[17px] leading-relaxed">{place.blurb}</p>
        <p className="mt-3 rounded-[14px] bg-card p-3 text-[15px]"><span className="font-semibold">Barb’s note · </span>{place.tip}</p>
        <p className="mt-3 text-[15px]">Hours {place.hours}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => pushToast("Call", place.phone)}>Call</Button>
          <a href={maps} className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-brown text-[17px] font-semibold text-[#F6F1E7]">Directions</a>
        </div>
      </div>
    </Screen>
  );
}

export function EventsScreen() {
  const { pop, push } = useNav();
  return (
    <Screen title="What’s on" onBack={pop}>
      <p className="text-[17px] leading-relaxed">Campus weekends and town festivals, so you can book the nights that matter.</p>
      <div className="mt-4 space-y-4">
        {EVENTS.map((e) => (
          <article key={e.id} className="overflow-hidden rounded-[20px] bg-card">
            <Photo name={e.photo} alt={e.alt} className="h-36 w-full bg-chip" />
            <div className="p-4">
              <p className="text-[13px] text-muted-foreground">{e.dates} · {e.place}</p>
              <h2 className="font-serif text-[22px]">{e.name}</h2>
              <p className="mt-1 text-[15px] leading-relaxed">{e.blurb}</p>
              <Button className="mt-3" onClick={() => push({ name: "search" })}>Plan my stay</Button>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}

export function StoriesScreen() {
  const { pop } = useNav();
  return (
    <Screen title="Guest stories" onBack={pop}>
      {REVIEWS.filter((r) => r.photo).map((r) => (
        <article key={r.id} className="mb-5">
          <Photo name={r.photo!} alt={r.photoAlt ?? "Stay photo"} className="h-48 w-full rounded-[20px] bg-chip" />
          <p className="mt-3 font-serif text-[22px]">{r.name}</p>
          <p className="text-[13px] text-muted-foreground">{r.stay} · {r.date}</p>
          <p className="mt-2 text-[17px] leading-relaxed">{r.text}</p>
        </article>
      ))}
    </Screen>
  );
}

export function FeedbackScreen({ bookingId }: { bookingId: string }) {
  const { pop, push } = useNav();
  const store = useStore();
  const cats = ["Cleanliness", "Accuracy", "Check-in", "Communication", "Location", "Value"];
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(cats.map((c) => [c, 5])));
  const [text, setText] = useState("The porch at the end of Parents’ Weekend was the part we’ll remember.");
  const [note, setNote] = useState("Thank you for the parking note. It saved us.");
  const [recommend, setRecommend] = useState(true);
  const [error, setError] = useState<string | null>(null);
  return (
    <Screen title="How was home?" onBack={pop}>
      {cats.map((c) => (
        <div key={c} className="mb-3 flex items-center justify-between">
          <span className="text-[17px]">{c}</span>
          <span className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${c} ${n} stars`} className="h-11 w-8 text-[20px]" onClick={() => setScores({ ...scores, [c]: n })}>
                {n <= scores[c] ? "★" : "☆"}
              </button>
            ))}
          </span>
        </div>
      ))}
      <Field label="Your review" error={error ?? undefined}>
        <textarea className={`${fieldClass} h-28 py-3`} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <button type="button" className="mt-3 min-h-11 text-[15px] font-semibold text-[#7F4F24]" onClick={() => store.pushToast("Photo", "On iPhone this opens your camera roll. This preview keeps the written note.")}>
        Add a photo
      </button>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[17px]">Recommend The Cozy Olive</span>
        <Toggle label="Recommend" on={recommend} onChange={setRecommend} />
      </div>
      <Field label="Private note to Barb">
        <textarea className={`${fieldClass} mt-2 h-20 py-3`} value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <Button
        full
        className="mt-4"
        onClick={() => {
          if (text.trim().length < 12) {
            setError("A sentence or two helps the next guest.");
            return;
          }
          const stars = Math.round(Object.values(scores).reduce((s, n) => s + n, 0) / cats.length);
          store.addReview({ bookingId, stars, scores, text, recommend, privateNote: note });
          push({ name: "thanks" });
        }}
      >
        Submit review
      </Button>
    </Screen>
  );
}

export function ThanksScreen() {
  const { popRoot, setTab, goTrips } = useNav();
  const { user } = useStore();
  return (
    <Screen title="Thank you">
      <div className="pt-6 text-center">
        <p className="hh-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive text-[28px] text-[#F6F1E7]">✓</p>
        <h2 className="mt-4 font-serif text-[34px] leading-tight">That was kind</h2>
        <p className="mt-2 text-[17px] text-muted-foreground">100 Haven points are on your account{user ? `, ${user.firstName}` : ""}. You’re at {user?.points ?? 0}.</p>
        <Button full className="mt-6" onClick={goTrips}>
          Done
        </Button>
        <Button full variant="secondary" className="mt-3" onClick={() => { setTab("profile"); popRoot(); }}>
          See rewards
        </Button>
      </div>
    </Screen>
  );
}

export function MyReviewsScreen() {
  const { pop } = useNav();
  const { reviews, user } = useStore();
  const mine = reviews.filter((r) => r.userId === user?.id);
  return (
    <Screen title="My reviews" onBack={pop}>
      {mine.length === 0 ? (
        <Empty title="No reviews yet" body="After a stay, we’ll ask for a few words. Past guests of The Cozy Olive are on the home page." />
      ) : (
        mine.map((r) => (
          <article key={r.id} className="mb-3 rounded-[16px] bg-card p-4">
            <Stars value={r.stars} />
            <p className="mt-2 text-[15px]">{r.text}</p>
            <p className="mt-1 text-[13px] text-muted-foreground">{r.createdAt}</p>
          </article>
        ))
      )}
    </Screen>
  );
}

export function OffersScreen() {
  const { pop, push } = useNav();
  return (
    <Screen title="Offers" onBack={pop}>
      <div className="space-y-4">
        {OFFERS.map((o) => (
          <button key={o.id} type="button" onClick={() => push({ name: "offer", offerId: o.id })} className="block w-full overflow-hidden rounded-[20px] text-left">
            <div className="relative h-36">
              <Photo name={o.photo} alt={o.alt} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#333D29] to-transparent" />
              <div className="absolute bottom-3 left-4 text-[#F6F1E7]">
                <p className="text-[12px] font-semibold">{o.save}</p>
                <p className="font-serif text-[24px] leading-none">{o.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function OfferScreen({ offerId }: { offerId: string }) {
  const { pop, push } = useNav();
  const store = useStore();
  const offer = OFFERS.find((o) => o.id === offerId) ?? OFFERS[0];
  return (
    <Screen title={offer.name} onBack={pop} bleed>
      <Photo name={offer.photo} alt={offer.alt} className="h-52 w-full bg-chip" />
      <div className="px-5 pt-4">
        <p className="text-[15px] font-semibold text-olive">{offer.save} · {offer.code}</p>
        <p className="mt-2 text-[17px] leading-relaxed">{offer.detail}</p>
        <p className="mt-2 text-[15px] text-muted-foreground">{offer.window}</p>
        <Button
          full
          className="mt-5"
          onClick={() => {
            store.setDraft({ promo: offer.code, purpose: offer.name });
            store.pushToast("Offer ready", `${offer.code} will apply at checkout.`);
            push({ name: "search" });
          }}
        >
          Apply
        </Button>
      </div>
    </Screen>
  );
}

export function CouponsScreen() {
  const { pop } = useNav();
  const store = useStore();
  const [code, setCode] = useState("");
  return (
    <Screen title="Coupons" onBack={pop}>
      <div className="flex gap-2">
        <input className={fieldClass} placeholder="Enter a code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} aria-label="Coupon code" />
        <Button
          onClick={() => {
            const found = ["PARENTS", "OLIVE20", "HAVEN50"].includes(code);
            if (!found) {
              store.pushToast("Not recognized", "Try PARENTS, OLIVE20, or HAVEN50.");
              return;
            }
            store.setDraft({ promo: code });
            store.pushToast("Saved for checkout", code);
          }}
        >
          Add
        </Button>
      </div>
      <div className="mt-4 space-y-3">
        {["PARENTS", "OLIVE20", "HAVEN50"].map((c) => {
          const meta = c === "PARENTS" ? ["Parents’ Weekend", "$40 off", "Nov 16, 2026"] : c === "OLIVE20" ? ["Festival & summer", "10% off nights", "Aug 31, 2027"] : ["Midweek", "$50 off", "Mar 31, 2027"];
          const on = store.draft.promo === c;
          return (
            <div key={c} className="rounded-[16px] bg-card p-4">
              <p className="text-[13px] text-muted-foreground">Expires {meta[2]}</p>
              <p className="font-serif text-[22px]">{meta[0]}</p>
              <p className="text-[15px]">{meta[1]} · {c}</p>
              <p className="mt-1 text-[13px] text-olive">{on ? "Applied to your next checkout" : "Available"}</p>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

export function RewardsScreen() {
  const { pop, push } = useNav();
  const { user } = useStore();
  const points = user?.points ?? 0;
  const tier = tierFor(points);
  const next = TIERS.find((t) => t.min > points);
  const progress = next ? Math.min(100, Math.round((points / next.min) * 100)) : 100;
  return (
    <Screen title="Haven Rewards" onBack={pop}>
      <div className="rounded-[20px] bg-brown p-5 text-[#F6F1E7]">
        <p className="text-[13px] uppercase tracking-[0.08em] text-[#C2C5AA]">{tier}</p>
        <p className="font-serif text-[40px] leading-none">{points}</p>
        <p className="text-[15px]">points</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-[#C2C5AA]" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-[13px]">{next ? `${next.min - points} points to ${next.id}` : "You’re at Haven Elite."}</p>
      </div>
      <h2 className="mt-6 font-serif text-[22px]">How it works</h2>
      <p className="mt-2 text-[15px] leading-relaxed">A point for every dollar of nightly rate, after you check out. 1,000 points redeem as a night credit on a direct booking.</p>
      <div className="mt-3 space-y-2">
        {TIERS.map((t) => (
          <div key={t.id} className="rounded-[14px] bg-card px-4 py-3">
            <p className="text-[17px] font-semibold">{t.id}</p>
            <p className="text-[15px] text-muted-foreground">{t.perk}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-6 font-serif text-[22px]">History</h2>
      <History />
      <Button full className="mt-4" onClick={() => push({ name: "redeem" })}>Redeem</Button>
    </Screen>
  );
}

function History() {
  const { pointsHistory } = useStore();
  return (
    <div className="mt-2 overflow-hidden rounded-[16px] bg-card">
      {pointsHistory.map((p) => (
        <div key={p.id} className="flex items-center justify-between border-b border-line px-4 py-3 last:border-0">
          <span>
            <span className="block text-[15px]">{p.label}</span>
            <span className="text-[13px] text-muted-foreground">{p.when}</span>
          </span>
          <span className="font-semibold text-olive">+{p.points}</span>
        </div>
      ))}
    </div>
  );
}

export function RedeemScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  const points = store.user?.points ?? 0;
  return (
    <Screen title="Redeem" onBack={pop}>
      <p className="text-[17px] leading-relaxed">A free night credit costs 1,000 points. It applies to The Cozy Olive, up to {money(185, store.currency)} off the room rate.</p>
      <p className="mt-3 text-[15px]">You have {points} points.</p>
      <Button
        full
        className="mt-5"
        disabled={points < 1000}
        onClick={() => {
          if (store.redeemNight()) push({ name: "summary" });
        }}
      >
        {points < 1000 ? "Keep staying to unlock" : "Apply a free night"}
      </Button>
    </Screen>
  );
}

export function RebookScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  const past = store.myBookings.filter((b) => store.liveStatus(b) === "past");
  return (
    <Screen title="Book again" onBack={pop}>
      <div className="rounded-[20px] bg-olive/15 p-4">
        <p className="font-serif text-[26px] leading-tight">Book again and save</p>
        <p className="mt-1 text-[15px]">Returning guests can use HAVEN50 on a midweek stay, or PARENTS when campus calls.</p>
      </div>
      {past.length === 0 ? (
        <Empty title="No past stays on this account" body="After you check out, this is the shortest path back." />
      ) : (
        past.map((b) => (
          <button key={b.id} type="button" className="mt-4 w-full rounded-[16px] bg-card p-4 text-left" onClick={() => { store.setDraft({ promo: "HAVEN50", propertyId: "cozy-olive" }); push({ name: "calendar", propertyId: "cozy-olive" }); }}>
            <p className="font-serif text-[22px]">The Cozy Olive</p>
            <p className="text-[15px] text-muted-foreground">Last stay {prettyRange(b.checkIn, b.checkOut)}</p>
            <p className="mt-1 text-[15px] font-semibold text-[#7F4F24]">Rebook</p>
          </button>
        ))
      )}
    </Screen>
  );
}

export function ReferralScreen() {
  const { pop } = useNav();
  const store = useStore();
  const code = store.user?.referralCode ?? "GUEST-OLIVE";
  return (
    <Screen title="Invite a friend" onBack={pop}>
      <p className="font-serif text-[28px] leading-tight">A free night, shared</p>
      <p className="mt-2 text-[17px] leading-relaxed">When a friend books direct and completes a stay, you receive a night credit and they get $40 off.</p>
      <div className="mt-4 rounded-[16px] bg-card p-4 text-center">
        <p className="text-[13px] text-muted-foreground">Your code</p>
        <p className="font-serif text-[28px]">{code}</p>
      </div>
      <Button
        full
        className="mt-4"
        onClick={() => {
          const text = `Stay at The Cozy Olive and use ${code} for $40 off when you book direct with Hickory & Haven.`;
          if (navigator.share) void navigator.share({ text });
          else {
            void navigator.clipboard.writeText(text);
            store.pushToast("Copied", "The invite is on your clipboard.");
          }
        }}
      >
        Share
      </Button>
      <div className="mt-4 overflow-hidden rounded-[16px] bg-card">
        {store.referrals.map((r) => (
          <Row key={r.name} title={r.name} detail={r.status} />
        ))}
      </div>
      <p className="mt-3 text-[15px] text-muted-foreground">Rewards earned: one invite out, none completed yet. The credit posts after their checkout.</p>
    </Screen>
  );
}

export function ProfileScreen() {
  const { push, setSignInOpen, leaveApp, setTab } = useNav();
  const store = useStore();
  const u = store.user;
  const trips = store.myBookings.filter((b) => b.status !== "cancelled").length;
  const saved = store.saved.length;
  const account = [
    { title: "Personal info", detail: "Name, mobile, and emergency contact", icon: <UserRound size={20} />, go: () => push({ name: "edit-profile" }) },
    { title: "Payment methods", detail: "Cards used for direct bookings", icon: <CreditCard size={20} />, go: () => push({ name: "payments" }) },
    { title: "Notifications", detail: "Trips, messages, and local notes", icon: <Bell size={20} />, go: () => push({ name: "notif-prefs" }) },
    { title: "Settings", detail: "Page theme, text size, and privacy", icon: <Settings size={20} />, go: () => push({ name: "settings" }) },
  ];
  const stays = [
    { title: "Saved homes", detail: saved ? `${saved} saved` : "Homes you want to come back to", icon: <Heart size={20} />, go: () => push({ name: "saved" }) },
    { title: "Rewards", detail: u ? `${u.points} points · ${tierFor(u.points)}` : "Sign in to collect points", icon: <Gift size={20} />, go: () => (u ? push({ name: "rewards" }) : setSignInOpen(true)) },
    { title: "Offers", detail: "Direct-booking savings", icon: <Tag size={20} />, go: () => push({ name: "offers" }) },
    { title: "My reviews", detail: "Notes you’ve left for Barb", icon: <Star size={20} />, go: () => push({ name: "my-reviews" }) },
  ];
  const support = [
    { title: "Help", detail: "Answers and a note to your host", icon: <CircleHelp size={20} />, go: () => push({ name: "help" }) },
    { title: "About Hickory & Haven", detail: "The homes and the host", icon: <Info size={20} />, go: () => push({ name: "about" }) },
  ];
  return (
    <Screen title="Profile">
      {u ? (
        <div className="rounded-[20px] bg-[#333D29] p-5 text-[#F6F1E7]">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F6F1E7] font-serif text-[28px] text-[#333D29]">
              {u.firstName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-serif text-[22px] leading-tight">{u.firstName} {u.lastName}</p>
              <p className="truncate text-[15px] text-[#E7E0D2]">{u.email}</p>
              <p className="mt-1 text-[14px] font-semibold text-[#F6F1E7]">{tierFor(u.points)}</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <button type="button" onClick={() => push({ name: "rewards" })} className="rounded-[14px] bg-white/10 px-2 py-3.5 text-center">
              <span className="block text-[18px] font-semibold text-[#F6F1E7]">{u.points}</span>
              <span className="block text-[13px] text-[#E7E0D2]">Points</span>
            </button>
            <button type="button" onClick={() => setTab("trips")} className="rounded-[14px] bg-white/10 px-2 py-3.5 text-center">
              <span className="block text-[18px] font-semibold text-[#F6F1E7]">{trips}</span>
              <span className="block text-[13px] text-[#E7E0D2]">Trips</span>
            </button>
            <button type="button" onClick={() => push({ name: "saved" })} className="rounded-[14px] bg-white/10 px-2 py-3.5 text-center">
              <span className="block text-[18px] font-semibold text-[#F6F1E7]">{saved}</span>
              <span className="block text-[13px] text-[#E7E0D2]">Saved</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] bg-[#333D29] p-5 text-[#F6F1E7]">
          <p className="font-serif text-[26px] leading-tight">Browsing as a guest</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[#E7E0D2]">Sign in to keep trips, rewards, and messages with this account.</p>
          <button type="button" onClick={() => setSignInOpen(true)} className="mt-4 min-h-11 w-full rounded-[14px] bg-[#F6F1E7] text-[17px] font-semibold text-[#333D29]">
            Sign in
          </button>
        </div>
      )}

      <Group title="Account">
        {(u ? account : account.filter((item) => item.title === "Settings")).map((item) => (
          <Row key={item.title} icon={item.icon} title={item.title} detail={item.detail} onClick={item.go} trailing={<span className="text-[20px] text-foreground">›</span>} />
        ))}
      </Group>
      <Group title="Stays">
        {stays.map((item) => (
          <Row key={item.title} icon={item.icon} title={item.title} detail={item.detail} onClick={item.go} trailing={<span className="text-[20px] text-foreground">›</span>} />
        ))}
      </Group>
      <Group title="Support">
        {support.map((item) => (
          <Row key={item.title} icon={item.icon} title={item.title} detail={item.detail} onClick={item.go} trailing={<span className="text-[20px] text-foreground">›</span>} />
        ))}
      </Group>

      {u ? (
        <button
          type="button"
          className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#8C3A36] text-[17px] font-semibold text-[#8C3A36]"
          onClick={() => {
            store.logout();
            leaveApp();
          }}
        >
          <LogOut size={18} />
          Log out
        </button>
      ) : null}
    </Screen>
  );
}

export function EditProfileScreen() {
  const { pop } = useNav();
  const store = useStore();
  const u = store.user;
  const [form, setForm] = useState({
    firstName: u?.firstName ?? "",
    lastName: u?.lastName ?? "",
    email: u?.email ?? "",
    phone: u?.phone ?? "",
    dob: u?.dob ?? "",
    address: u?.address ?? "",
    emergencyName: u?.emergencyName ?? "",
    emergencyPhone: u?.emergencyPhone ?? "",
  });
  if (!u) return null;
  return (
    <Screen title="Personal info" onBack={pop}>
      <button type="button" className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-olive text-[28px] text-[#F6F1E7]" onClick={() => store.pushToast("Photo", "On iPhone this opens the camera. Your initial stays for the preview.")}>
        {u.firstName.slice(0, 1)}
      </button>
      <div className="space-y-3">
        {(
          [
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["email", "Email"],
            ["phone", "Mobile"],
            ["dob", "Date of birth"],
            ["address", "Address"],
            ["emergencyName", "Emergency contact"],
            ["emergencyPhone", "Emergency phone"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <input className={fieldClass} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </Field>
        ))}
        <div className="rounded-[16px] bg-card p-4">
          <p className="text-[17px] font-semibold">ID verification</p>
          <p className="text-[15px] text-muted-foreground">{u.verified ? "Verified for faster check-in." : "Optional. It can speed up the first stay."}</p>
          <Button variant="secondary" className="mt-3" onClick={() => store.pushToast("Verification", "This preview doesn’t upload a document.")}>
            {u.verified ? "View status" : "Start verification"}
          </Button>
        </div>
        <Button full onClick={() => { store.updateUser(form); store.pushToast("Saved", "Your profile is up to date."); pop(); }}>
          Save
        </Button>
      </div>
    </Screen>
  );
}

export function SettingsScreen() {
  const { pop, push, leaveApp } = useNav();
  const store = useStore();
  const [del, setDel] = useState(false);
  return (
    <Screen title="Settings" onBack={pop}>
      <Group title="Preferences">
        <div className="border-b border-line px-4 py-3">
          <p className="mb-2 text-[17px]">Page theme</p>
          <Segmented
            value={store.theme}
            onChange={(v) => store.setTheme(v as typeof store.theme)}
            options={[
              { id: "system", label: "System" },
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ]}
          />
        </div>
        <div className="border-b border-line px-4 py-3">
          <p className="mb-2 text-[17px]">Text size</p>
          <Segmented
            value={store.textSize}
            onChange={(v) => store.setTextSize(v as typeof store.textSize)}
            options={[
              { id: "default", label: "Default" },
              { id: "large", label: "Large" },
              { id: "xlarge", label: "Larger" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-[17px]">Reduce motion</span>
          <Toggle label="Reduce motion" on={store.reduceMotion} onChange={store.setReduceMotion} />
        </div>
        <Row title="Stay reminders" detail="Check-in notes and checkout" onClick={() => push({ name: "reminders" })} />
      </Group>
      <Group title="Region">
        <div className="border-b border-line px-4 py-3">
          <p className="mb-2 text-[15px]">Language</p>
          <Segmented value={store.language} onChange={(v) => store.setLanguage(v as typeof store.language)} options={[{ id: "English", label: "English" }, { id: "Español", label: "Español" }]} />
          {store.language === "Español" ? <p className="mt-2 text-[13px] text-muted-foreground">Navigation stays clear in English for this preview. A full Spanish edition is planned.</p> : null}
        </div>
        <div className="px-4 py-3">
          <p className="mb-2 text-[15px]">Currency</p>
          <Segmented value={store.currency} onChange={(v) => store.setCurrency(v as typeof store.currency)} options={[{ id: "USD", label: "USD" }, { id: "CAD", label: "CAD" }]} />
          {store.currency === "CAD" ? <p className="mt-2 text-[13px] text-muted-foreground">CAD amounts are approximate, at 1.36.</p> : null}
        </div>
      </Group>
      <Group title="Privacy">
        <Row title="Download my data" detail="A copy of profile and trips" onClick={() => store.pushToast("Export", "A file would download from the live app.")} />
        <Row title="Linked accounts" detail="Apple and Google, when you use them" onClick={() => store.pushToast("Linked", "No social account is connected in this preview.")} />
      </Group>
      <Button full variant="danger" className="mt-6" onClick={() => setDel(true)}>Delete account</Button>
      {del ? (
        <div className="mt-3 rounded-[16px] bg-card p-4">
          <p className="text-[17px] font-semibold">Delete this account?</p>
          <p className="mt-1 text-[15px] text-muted-foreground">Trips already paid stay on the books for taxes. The profile leaves this phone.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={() => setDel(false)}>Keep</Button>
            <Button variant="danger" onClick={() => { store.logout(); leaveApp(); }}>Delete</Button>
          </div>
        </div>
      ) : null}
    </Screen>
  );
}

export function PaymentsScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  return (
    <Screen title="Payment methods" onBack={pop}>
      {store.cards.length === 0 ? (
        <Empty title="No cards yet" body="Add a card for the next direct booking." />
      ) : (
        <div className="space-y-2">
          {store.cards.map((c) => (
            <div key={c.id} className="rounded-[16px] bg-card p-4">
              <p className="text-[17px] font-semibold">{c.brand} ···· {c.last4}</p>
              <p className="text-[13px] text-muted-foreground">Exp {c.exp} {c.isDefault ? "· Default" : ""}</p>
              <div className="mt-2 flex gap-2">
                {!c.isDefault ? <Button variant="secondary" onClick={() => store.setDefaultCard(c.id)}>Set default</Button> : null}
                <Button variant="tertiary" onClick={() => store.removeCard(c.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Button full className="mt-4" onClick={() => push({ name: "add-card" })}>Add card</Button>
    </Screen>
  );
}

export function AddCardScreen() {
  const { pop } = useNav();
  const store = useStore();
  const [brand, setBrand] = useState("Visa");
  const [last4, setLast4] = useState("");
  const [exp, setExp] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <Screen title="Add card" onBack={pop}>
      <div className="space-y-3">
        <Field label="Brand">
          <select className={fieldClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option>Visa</option>
            <option>Mastercard</option>
          </select>
        </Field>
        <Field label="Last 4" error={error ?? undefined}>
          <input className={fieldClass} inputMode="numeric" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))} />
        </Field>
        <Field label="Expiry">
          <input className={fieldClass} placeholder="08 / 28" value={exp} onChange={(e) => setExp(e.target.value)} />
        </Field>
        <Button
          full
          onClick={() => {
            if (last4.length !== 4) {
              setError("Enter the last four digits.");
              return;
            }
            store.addCard(brand, last4, exp || "12 / 28");
            pop();
          }}
        >
          Save card
        </Button>
      </div>
    </Screen>
  );
}

export function AboutScreen() {
  const { pop, push } = useNav();
  const { pushToast } = useStore();
  return (
    <Screen title="About" onBack={pop}>
      <div className="rounded-[20px] bg-[#F6F1E7] p-3">
        <Logo className="h-20 w-full object-contain" />
      </div>
      <p className="mt-4 font-serif text-[28px] leading-tight">Welcome home, even when you’re away.</p>
      <p className="mt-3 text-[17px] leading-relaxed">
        Hickory & Haven started in August 2026, when Barb Vallenari opened The Cozy Olive — a renovated 1964 ranch on a quiet street a short walk from Havenbrook’s historic downtown. We host the way we’d want our own family hosted: a real home, a fair direct rate, and a person who answers.
      </p>
      <p className="mt-3 text-[17px] leading-relaxed">
        The calendar you see is the same one Airbnb and VRBO use. A night booked here is a night that closes everywhere else. That’s the whole promise.
      </p>
      <div className="mt-4 rounded-[16px] bg-card p-4">
        <p className="text-[17px] font-semibold">Barb Vallenari</p>
        <p className="text-[15px] text-muted-foreground">Host · {HOST.email} · {HOST.phone}</p>
      </div>
      <div className="mt-3 overflow-hidden rounded-[16px] bg-card">
        <Row title="Terms of Stay" onClick={() => push({ name: "policy", kind: "terms" })} />
        <Row title="Privacy" onClick={() => push({ name: "policy", kind: "privacy" })} />
        <Row title="Cancellation policy" onClick={() => push({ name: "policy", kind: "cancel" })} />
        <Row title="Instagram" detail="@hickoryandhaven" onClick={() => pushToast("Instagram", "The live app will open @hickoryandhaven.")} />
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground">Version 1.0.0 · Havenbrook</p>
    </Screen>
  );
}

export function PolicyScreen({ kind }: { kind: "terms" | "privacy" | "cancel" }) {
  const { pop } = useNav();
  const policy = POLICIES[kind];
  return (
    <Screen title={policy.title} onBack={pop}>
      {policy.body.map((p) => (
        <p key={p.slice(0, 24)} className="mb-3 text-[17px] leading-relaxed">{p}</p>
      ))}
    </Screen>
  );
}

void propertyById;
void PURPOSES;
