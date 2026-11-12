import { Bell, CalendarDays, ChevronRight, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  EVENTS,
  OCCASIONS,
  OFFERS,
  PLACES,
  REVIEWS,
  daysUntil,
  greeting,
  money,
  nextOpenStay,
  prettyRange,
  propertyById,
} from "@/lib/model";
import { useStore } from "@/lib/store";
import { useNav } from "./nav";
import { Bone, Button, Card, Chip, IconButton, Photo, Screen, Stars } from "./ios";

let homeReady = false;

function partyLabel(party: { adults: number; children: number; infants: number; pets: number }) {
  const guests = party.adults + party.children;
  const bits = [`${guests} guest${guests === 1 ? "" : "s"}`];
  if (party.infants) bits.push(`${party.infants} infant${party.infants === 1 ? "" : "s"}`);
  if (party.pets) bits.push(party.pets === 1 ? "a pet" : `${party.pets} pets`);
  return bits.join(", ");
}

export function HomeScreen() {
  const { push } = useNav();
  const store = useStore();
  const [loading, setLoading] = useState(!homeReady);
  const [more, setMore] = useState(false);
  useEffect(() => {
    if (homeReady) return;
    const t = window.setTimeout(() => {
      homeReady = true;
      setLoading(false);
    }, 650);
    return () => window.clearTimeout(t);
  }, []);
  const name = store.user?.firstName;
  const trip = store.myBookings.find((b) => store.liveStatus(b) === "upcoming");
  const unread = store.myNotes.filter((n) => !n.read).length;
  const cozy = propertyById("cozy-olive");
  const open = nextOpenStay((iso) => store.isTaken(iso));
  const dates =
    store.search.checkIn && store.search.checkOut
      ? prettyRange(store.search.checkIn, store.search.checkOut)
      : open
        ? prettyRange(open.checkIn, open.checkOut)
        : "Add dates";

  if (loading) {
    window.setTimeout(() => setLoading(false), 700);
  }

  function checkAvailability() {
    const checkIn = store.search.checkIn ?? open?.checkIn ?? null;
    const checkOut = store.search.checkOut ?? open?.checkOut ?? null;
    store.setSearch({ location: "Havenbrook", checkIn, checkOut });
    store.setDraft({ propertyId: "cozy-olive", checkIn, checkOut });
    push({ name: "calendar", propertyId: "cozy-olive" });
  }

  return (
    <Screen
      title={name ? `${greeting()}, ${name}` : greeting()}
      large
      bleed
      onRefresh={() => {
        setLoading(true);
        window.setTimeout(() => setLoading(false), 700);
        store.pushToast("Updated", "Availability is current.");
      }}
      right={
        <span className="relative">
          <IconButton label="Notifications" onClick={() => push({ name: "inbox" })}>
            <Bell size={20} />
          </IconButton>
          {unread > 0 ? (
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-brown" aria-label={`${unread} unread`} />
          ) : null}
        </span>
      }
    >
      {loading ? (
        <div className="space-y-4 px-5">
          <Bone className="h-28 w-full" />
          <Bone className="h-64 w-full" />
        </div>
      ) : (
        <div className="px-5 pb-4">
          {store.myNotes.some((n) => n.id === "n1" && !n.read) ? (
            <button
              type="button"
              onClick={() => push({ name: "announcement", id: "parking" })}
              className="mb-4 w-full rounded-[16px] bg-card px-4 py-3 text-left"
            >
              <p className="text-[13px] font-semibold text-muted-foreground">Stay note</p>
              <p className="text-[17px] font-semibold text-foreground">Street parking is tight this weekend</p>
            </button>
          ) : null}

          {trip ? (
            <button type="button" onClick={() => push({ name: "reservation", bookingId: trip.id })} className="mb-4 block w-full text-left">
              <Card className="flex items-center gap-3 p-3">
                <Photo name="cozy-olive-exterior" alt="The Cozy Olive" className="h-[72px] w-[72px] shrink-0 rounded-[14px] bg-chip" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-muted-foreground">Your trip</span>
                  <span className="block font-serif text-[22px] leading-tight text-foreground">The Cozy Olive</span>
                  <span className="mt-1 block text-[15px] text-foreground">
                    {daysUntil(trip.checkIn) <= 0 ? "Check-in is today" : `${daysUntil(trip.checkIn)} day${daysUntil(trip.checkIn) === 1 ? "" : "s"} to check-in`}
                    {" · "}
                    {prettyRange(trip.checkIn, trip.checkOut)}
                  </span>
                </span>
                <ChevronRight className="shrink-0 text-foreground" />
              </Card>
            </button>
          ) : (
            <Card className="mb-4 overflow-hidden">
              <button type="button" onClick={() => push({ name: "calendar", propertyId: "cozy-olive" })} className="flex min-h-[64px] w-full items-center gap-3 border-b border-line px-4 py-2 text-left">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <CalendarDays size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-muted-foreground">When</span>
                  <span className="block truncate text-[17px] font-semibold text-foreground">{dates}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-foreground" />
              </button>
              <button type="button" onClick={() => push({ name: "search" })} className="flex min-h-[64px] w-full items-center gap-3 px-4 py-2 text-left">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <Users size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-muted-foreground">Who</span>
                  <span className="block truncate text-[17px] font-semibold text-foreground">{partyLabel(store.search.party)}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-foreground" />
              </button>
            </Card>
          )}

          <Card className="overflow-hidden">
            <button type="button" className="block w-full text-left" onClick={() => push({ name: "property", propertyId: "cozy-olive" })}>
              <Photo name={cozy.photos[0].src} alt={cozy.photos[0].alt} className="h-[220px] w-full bg-chip" />
              <div className="space-y-1 p-4 pb-2">
                <p className="font-serif text-[22px] leading-tight text-foreground">The Cozy Olive</p>
                <p className="text-[15px] text-foreground">{cozy.neighborhood} · {cozy.beds} bed · sleeps {cozy.guests}</p>
                <p className="text-[15px] text-foreground">Next open · {open ? prettyRange(open.checkIn, open.checkOut) : "Ask Barb"}</p>
                <p className="text-[17px] font-semibold text-foreground">From {money(cozy.price, store.currency)} / night · {cozy.rating}</p>
                <p className="text-[13px] text-muted-foreground">Best rate when you book here. No platform fee.</p>
              </div>
            </button>
            <div className="p-4 pt-2">
              <Button full onClick={checkAvailability}>Check availability</Button>
            </div>
          </Card>

          <button type="button" className="mt-5 min-h-11 text-[17px] font-semibold text-[#7F4F24]" onClick={() => setMore((v) => !v)}>
            {more ? "Hide while you’re here" : "While you’re here"}
          </button>
          {more ? (
            <div className="mt-3 space-y-5">
              <div>
                <p className="mb-2 font-serif text-[22px] text-foreground">Offers</p>
                <div className="flex snap-x gap-3 overflow-x-auto no-scrollbar">
                  {OFFERS.slice(0, 3).map((o) => (
                    <button key={o.id} type="button" onClick={() => push({ name: "offer", offerId: o.id })} className="relative h-36 w-[240px] shrink-0 snap-start overflow-hidden rounded-[16px] text-left">
                      <Photo name={o.photo} alt={o.alt} className="absolute inset-0 h-full w-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#333D29] to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-[#F6F1E7]">
                        <p className="text-[13px] font-semibold">{o.save}</p>
                        <p className="font-serif text-[22px] leading-none">{o.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-serif text-[22px] text-foreground">Occasions</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {OCCASIONS.map((o) => (
                    <Chip key={o} on={store.draft.purpose === o} onClick={() => { store.setDraft({ purpose: o }); push({ name: "search" }); }}>
                      {o}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-serif text-[22px] text-foreground">Around town</p>
                <div className="flex snap-x gap-3 overflow-x-auto no-scrollbar">
                  {PLACES.slice(0, 4).map((p) => (
                    <button key={p.id} type="button" onClick={() => push({ name: "place", placeId: p.id })} className="w-[160px] shrink-0 snap-start text-left">
                      <Photo name={p.photo} alt={p.alt} className="h-24 w-full rounded-[16px] bg-chip" />
                      <p className="mt-2 text-[15px] font-semibold text-foreground">{p.name}</p>
                      <p className="text-[13px] text-muted-foreground">{p.category} · {p.minutes}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex snap-x gap-3 overflow-x-auto no-scrollbar">
                {REVIEWS.slice(0, 2).map((r) => (
                  <Card key={r.id} className="w-[240px] shrink-0 snap-start p-4">
                    <Stars value={r.stars} />
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-foreground">{r.text}</p>
                    <p className="mt-2 text-[13px] font-semibold text-foreground">{r.name}</p>
                  </Card>
                ))}
              </div>
              <button type="button" onClick={() => push({ name: "referral" })} className="w-full rounded-[16px] bg-card p-4 text-left">
                <p className="text-[13px] font-semibold text-muted-foreground">Haven Rewards</p>
                <p className="mt-1 font-serif text-[22px] leading-tight text-foreground">Invite a friend, get a free night credit</p>
              </button>
              {EVENTS[0] ? (
                <button type="button" onClick={() => push({ name: "events" })} className="flex w-full items-center gap-3 rounded-[16px] bg-card p-3 text-left">
                  <Photo name="parents-weekend" alt="Campus weekend" className="h-14 w-14 rounded-[12px] bg-chip" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-muted-foreground">This weekend</span>
                    <span className="block text-[17px] font-semibold text-foreground">Parents’ Weekend at Havenbrook College</span>
                  </span>
                  <ChevronRight className="text-foreground" />
                </button>
              ) : null}
              <button type="button" onClick={() => push({ name: "contact" })} className="min-h-11 w-full text-center text-[17px] font-semibold text-[#7F4F24]">
                Need help? Message your host
              </button>
            </div>
          ) : null}
        </div>
      )}
    </Screen>
  );
}
