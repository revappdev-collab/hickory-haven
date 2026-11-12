import { useEffect, useState } from "react";
import {
  COUPONS,
  money,
  partyLabel,
  prettyRange,
  rangeHeld,
  propertyById,
  quote,
  refundFor,
} from "@/lib/model";
import { useStore, type Booking } from "@/lib/store";
import { Breakdown, GuestEditor, RangeCalendar, quoteOrNull } from "./bits";
import { Alert, Button, Card, Chip, Empty, Field, Photo, Screen, Segmented, fieldClass } from "./ios";
import { useNav } from "./nav";

export function TripsScreen() {
  const { push, setSignInOpen } = useNav();
  const store = useStore();
  const [tab, setTab] = useState("upcoming");
  const mine = store.myBookings.filter((b) => store.liveStatus(b) === tab);
  return (
    <Screen title="Trips" large>
      {!store.user ? (
        <Empty title="Your trips live here" body="Sign in to see upcoming weekends, past stays, and check-in details." action="Sign in" onAction={() => setSignInOpen(true)} />
      ) : (
        <>
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { id: "upcoming", label: "Upcoming" },
              { id: "past", label: "Past" },
              { id: "cancelled", label: "Cancelled" },
            ]}
          />
          {mine.length === 0 ? (
            <Empty
              title={tab === "upcoming" ? "No upcoming trips" : tab === "past" ? "No past stays yet" : "No cancelled stays"}
              body={tab === "upcoming" ? "When you book The Cozy Olive, the countdown shows up here." : "Completed and cancelled reservations stay in this list."}
              action={tab === "upcoming" ? "Find a weekend" : undefined}
              onAction={tab === "upcoming" ? () => push({ name: "search" }) : undefined}
            />
          ) : (
            <div className="mt-4 space-y-3">
              {mine.map((b) => (
                <TripCard key={b.id} booking={b} onOpen={() => push({ name: "reservation", bookingId: b.id })} />
              ))}
            </div>
          )}
        </>
      )}
    </Screen>
  );
}

function TripCard({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const store = useStore();
  const status = store.liveStatus(booking);
  const tone = status === "cancelled" ? "text-[#8C3A36]" : status === "pending" ? "text-[#7A5B32]" : "text-olive";
  return (
    <button type="button" onClick={onOpen} className="w-full text-left">
      <Card className="overflow-hidden">
        <Photo name="cozy-olive-exterior" alt="The Cozy Olive" className="h-36 w-full bg-chip" />
        <div className="p-4">
          <p className={`text-[13px] font-semibold uppercase tracking-[0.06em] ${tone}`}>{status}</p>
          <p className="font-serif text-[22px]">The Cozy Olive</p>
          <p className="text-[15px] text-muted-foreground">{prettyRange(booking.checkIn, booking.checkOut)} · {partyLabel(booking.party)}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">{booking.confirmation}</p>
        </div>
      </Card>
    </button>
  );
}

export function SummaryScreen() {
  const { pop, push, requireUser } = useNav();
  const store = useStore();
  const d = store.draft;
  const q = quoteOrNull(d.checkIn, d.checkOut, d.promo, d.party.pets);
  const [code, setCode] = useState(d.promo);
  const home = propertyById(d.propertyId);
  const held = !!(d.checkIn && d.checkOut && rangeHeld(d.checkIn, d.checkOut, (iso) => store.isTaken(iso)));
  return (
    <Screen title="Your stay" onBack={pop}>
      {!d.checkIn || !d.checkOut || !q ? (
        <Empty title="Choose dates first" body="The price breakdown appears once check-in and checkout are set." action="Pick dates" onAction={() => push({ name: "calendar", propertyId: home.id })} />
      ) : (
        <div className="space-y-4">
          <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => push({ name: "property", propertyId: home.id })}>
            <Photo name={home.photos[0].src} alt={home.photos[0].alt} className="h-16 w-16 shrink-0 rounded-[14px] bg-chip" />
            <span className="min-w-0">
              <span className="block font-serif text-[22px] leading-tight text-foreground">{home.name}</span>
              <span className="mt-1 block text-[15px] text-foreground">{prettyRange(d.checkIn, d.checkOut)}</span>
              <span className="block text-[15px] text-foreground">{partyLabel(d.party)}</span>
            </span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => push({ name: "calendar", propertyId: home.id })}>Edit dates</Button>
            <Button variant="secondary" onClick={() => push({ name: "guests" })}>Edit guests</Button>
          </div>
          {held ? (
            <div className="rounded-[16px] bg-chip p-4">
              <p className="text-[17px] font-semibold text-foreground">These nights are already held</p>
              <p className="mt-1 text-[15px] leading-relaxed text-foreground">This is not a second booking. Pick open nights to reserve {home.name}.</p>
            </div>
          ) : (
            <Breakdown q={q} currency={store.currency} />
          )}
          {held ? null : (
            <>
              <div className="flex gap-2">
                <input className={fieldClass} placeholder="Promo code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} aria-label="Promo code" />
                <Button
                  onClick={() => {
                    store.setDraft({ promo: code.trim() });
                    store.pushToast("Code applied", code.trim() || "No code");
                  }}
                >
                  Apply
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {COUPONS.map((c) => (
                  <Chip key={c.code} on={d.promo === c.code} onClick={() => { setCode(c.code); store.setDraft({ promo: c.code }); }}>
                    {c.code}
                  </Chip>
                ))}
              </div>
            </>
          )}
          {held ? (
            <Button full onClick={() => push({ name: "calendar", propertyId: home.id })}>
              Choose open nights
            </Button>
          ) : (
            <Button full onClick={() => requireUser(() => push({ name: "guests" }))}>
              Continue
            </Button>
          )}
        </div>
      )}
    </Screen>
  );
}

export function GuestDetailsScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  const u = store.user;
  const [name, setName] = useState(u ? `${u.firstName} ${u.lastName}` : "");
  const [email, setEmail] = useState(u?.email ?? "");
  const [phone, setPhone] = useState(u?.phone ?? "");
  const [requests, setRequests] = useState(store.draft.requests);
  const [arrival, setArrival] = useState(store.draft.arrival);
  const [purpose, setPurpose] = useState(store.draft.purpose);
  const [others, setOthers] = useState(store.draft.guestNames);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const purposes = ["Parents' Weekend", "Festival Getaway", "Family Visits", "Foodie Weekend", "Date Night", "Work Trip"];
  return (
    <Screen title="Guest details" onBack={pop}>
      <div className="space-y-4">
        <Field label="Full name" error={errors.name}>
          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Mobile" error={errors.phone}>
          <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Arrival time">
          <select className={fieldClass} value={arrival} onChange={(e) => setArrival(e.target.value)}>
            {["3:00pm – 4:00pm", "4:00pm – 6:00pm", "After 6:00pm", "After 9:00pm"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Purpose of stay</p>
        <div className="flex flex-wrap gap-2">
          {purposes.map((p) => (
            <Chip key={p} on={purpose === p} onClick={() => setPurpose(p)}>{p}</Chip>
          ))}
        </div>
        <Field label="Special requests">
          <textarea className={`${fieldClass} h-24 py-3`} value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="Early kettle, a pack-and-play, a quiet check-in…" />
        </Field>
        <Field label="Other guest names" hint="Optional, separated by commas">
          <input className={fieldClass} value={others} onChange={(e) => setOthers(e.target.value)} />
        </Field>
        <div className="rounded-[16px] bg-card p-3">
          <p className="mb-2 text-[15px] font-semibold">Who’s coming</p>
          <GuestEditor party={store.draft.party} onChange={(party) => store.setDraft({ party })} />
        </div>
        <Button
          full
          onClick={() => {
            const next: Record<string, string> = {};
            if (name.trim().length < 3) next.name = "Add the name for the reservation.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Add a real email for the confirmation.";
            if (phone.replace(/\D/g, "").length < 10) next.phone = "Add a mobile number so Barb can reach you.";
            setErrors(next);
            if (Object.keys(next).length) return;
            store.setDraft({ requests, arrival, purpose, guestNames: others });
            push({ name: "payment" });
          }}
        >
          Continue to payment
        </Button>
      </div>
    </Screen>
  );
}

export function PaymentScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  const d = store.draft;
  const q = d.checkIn && d.checkOut ? quote(d.checkIn, d.checkOut, d.promo, d.party.pets) : null;
  const [number, setNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("06880");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSaved, setUseSaved] = useState(true);
  return (
    <Screen title="Payment" onBack={pop}>
      {q ? <Breakdown q={q} currency={store.currency} /> : null}
      <Button
        full
        variant="apple"
        className="mt-4"
        onClick={() => {
          if (!agree) {
            setError("Confirm the cancellation policy before paying.");
            return;
          }
          push({ name: "processing" });
        }}
      >
        Pay with Apple Pay
      </Button>
      <p className="mb-2 mt-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Saved cards</p>
      <div className="space-y-2">
        {store.cards.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => { store.setDraft({ cardId: c.id }); setUseSaved(true); }}
            className={`flex min-h-11 w-full items-center justify-between rounded-[14px] border px-4 py-3 text-left ${d.cardId === c.id && useSaved ? "border-brown bg-card" : "border-line bg-card"}`}
          >
            <span>{c.brand} ···· {c.last4}</span>
            <span className="text-[13px] text-muted-foreground">{c.exp}</span>
          </button>
        ))}
      </div>
      <button type="button" className="mt-3 text-[15px] font-semibold text-[#7F4F24]" onClick={() => setUseSaved(false)}>
        Use a different card
      </button>
      {!useSaved ? (
        <div className="mt-3 space-y-3">
          <Field label="Card number" hint="A number ending in 0000 is declined, so you can see the error.">
            <div className="flex gap-2">
              <input className={fieldClass} inputMode="numeric" placeholder="4242 4242 4242 4242" value={number} onChange={(e) => setNumber(e.target.value)} />
              <button type="button" className="min-h-11 shrink-0 rounded-[12px] border border-tan px-3 text-[13px] font-semibold text-brown" onClick={() => { setNumber("4242 4242 4242 4242"); store.pushToast("Card scanned", "Preview filled a Visa."); }}>
                Scan
              </button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expiry">
              <input className={fieldClass} placeholder="08 / 28" value={exp} onChange={(e) => setExp(e.target.value)} />
            </Field>
            <Field label="CVC">
              <input className={fieldClass} placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
            </Field>
          </div>
          <Field label="Billing ZIP">
            <input className={fieldClass} value={zip} onChange={(e) => setZip(e.target.value)} />
          </Field>
        </div>
      ) : null}
      <label className="mt-4 flex items-start gap-3 text-[15px]">
        <input type="checkbox" className="mt-1 h-5 w-5" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>I agree to the cancellation policy and the terms of stay. Dates close on Airbnb and VRBO when this payment succeeds.</span>
      </label>
      {error ? <p role="alert" className="mt-2 text-[15px] text-[#8C3A36]">{error}</p> : null}
      <p className="mt-3 text-[13px] text-muted-foreground">Payments are encrypted. Hickory & Haven never emails you to ask for a card number.</p>
      <Button
        full
        className="mt-4"
        onClick={() => {
          if (!agree) {
            setError("Please accept the cancellation policy.");
            return;
          }
          if (!useSaved && number.replace(/\D/g, "").endsWith("0000")) {
            setError("That card was declined. Try another card or Apple Pay.");
            return;
          }
          if (!useSaved && number.replace(/\D/g, "").length < 12) {
            setError("Enter the card number, or choose a saved card.");
            return;
          }
          push({ name: "processing" });
        }}
      >
        Confirm & Pay {q ? money(q.total, store.currency) : ""}
      </Button>
    </Screen>
  );
}

export function ProcessingScreen() {
  const nav = useNav();
  const store = useStore();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancel = false;
    const t = window.setTimeout(() => {
      if (cancel) return;
      const id = store.confirmBooking();
      if (!id) {
        setFailed(true);
        return;
      }
      nav.pop();
      nav.push({ name: "confirmed", bookingId: id });
    }, 1400);
    return () => {
      cancel = true;
      window.clearTimeout(t);
    };
    // run once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Screen title="Confirming">
      {failed ? (
        <Empty title="Payment didn’t go through" body="Nothing was charged and the dates are still open. You can try again." action="Back to payment" onAction={() => nav.pop()} />
      ) : (
        <div className="pt-16 text-center">
          <p className="hh-pop mx-auto h-16 w-16 rounded-full border-4 border-olive border-t-transparent animate-spin" />
          <p className="mt-6 font-serif text-[28px]">Holding the dates</p>
          <p className="mt-2 text-[15px] text-muted-foreground">We’re closing them everywhere else so the house is only yours.</p>
        </div>
      )}
    </Screen>
  );
}

export function ConfirmedScreen({ bookingId }: { bookingId: string }) {
  const { push, goHome, goTrips } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  if (!b) return <Screen title="Confirmed"><Empty title="We can’t find that stay" body="It may still be saving. Check Trips in a moment." action="Back to Home" onAction={goHome} /></Screen>;
  const share = async () => {
    const text = `We’re staying at The Cozy Olive ${prettyRange(b.checkIn, b.checkOut)} · ${b.confirmation}`;
    if (navigator.share) await navigator.share({ text }).catch(() => undefined);
    else {
      await navigator.clipboard.writeText(text);
      store.pushToast("Copied", "Share text is on your clipboard.");
    }
  };
  return (
    <Screen title="You’re booked">
      <div className="text-center">
        <p className="hh-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive text-[28px] text-[#F6F1E7]">✓</p>
        <h2 className="mt-4 font-serif text-[34px] leading-tight">Welcome home, a little early</h2>
        <p className="mt-2 text-[17px] text-muted-foreground">{b.confirmation}</p>
      </div>
      <Card className="mt-5 overflow-hidden">
        <Photo name="cozy-olive-living" alt="Living room at The Cozy Olive" className="h-40 w-full bg-chip" />
        <div className="p-4 text-left">
          <p className="font-serif text-[22px]">The Cozy Olive</p>
          <p className="text-[15px] text-muted-foreground">{prettyRange(b.checkIn, b.checkOut)}</p>
          <p className="text-[15px] text-muted-foreground">{partyLabel(b.party)} · {money(quote(b.checkIn, b.checkOut, b.promo, b.party.pets)?.total ?? 0, store.currency)} paid</p>
        </div>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => downloadIcs(b)}>Add to Calendar</Button>
        <Button variant="secondary" onClick={() => void share()}>Share</Button>
        <Button onClick={() => push({ name: "reservation", bookingId: b.id })}>View Trip</Button>
        <Button variant="secondary" onClick={() => window.open(`https://maps.apple.com/?daddr=${encodeURIComponent("418 Hickory Street, Havenbrook")}`, "_blank")}>Get Directions</Button>
      </div>
      <Button full className="mt-4" onClick={goTrips}>
        See it in Trips
      </Button>
      <Button full variant="secondary" className="mt-3" onClick={goHome}>
        Back to Home
      </Button>
    </Screen>
  );
}

function downloadIcs(b: Booking) {
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:The Cozy Olive\nDTSTART:${b.checkIn.replace(/-/g, "")}\nDTEND:${b.checkOut.replace(/-/g, "")}\nLOCATION:418 Hickory Street, Havenbrook\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cozy-olive.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export function ReservationScreen({ bookingId }: { bookingId: string }) {
  const { pop, push } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  if (!b) return <Screen title="Trip" onBack={pop}><Empty title="Trip not found" body="It may have been removed from this phone." /></Screen>;
  const status = store.liveStatus(b);
  const q = quote(b.checkIn, b.checkOut, b.promo, b.party.pets);
  const soon = status === "upcoming";
  return (
    <Screen title="Trip details" onBack={pop}>
      <Photo name="cozy-olive-exterior" alt="The Cozy Olive" className="h-44 w-full rounded-[20px] bg-chip" />
      <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-olive">{status} · {b.payment}</p>
      <h2 className="font-serif text-[28px]">The Cozy Olive</h2>
      <p className="text-[17px]">{prettyRange(b.checkIn, b.checkOut)}</p>
      <p className="text-[15px] text-muted-foreground">{partyLabel(b.party)} · {b.purpose}</p>
      <p className="mt-1 text-[15px] text-muted-foreground">Confirmation {b.confirmation} · card ···· {b.cardLast4}</p>
      {q ? <div className="mt-4"><Breakdown q={q} currency={store.currency} /></div> : null}
      <div className="mt-4 space-y-2">
        {soon ? <Button full onClick={() => push({ name: "guidebook", bookingId: b.id })}>Open guidebook</Button> : null}
        {status === "past" ? <Button full onClick={() => push({ name: "feedback", bookingId: b.id })}>Leave a review</Button> : null}
        <Button full variant="secondary" onClick={() => push({ name: "contact" })}>Contact host</Button>
        {soon ? <Button full variant="secondary" onClick={() => push({ name: "modify", bookingId: b.id })}>Modify request</Button> : null}
        {soon ? <Button full variant="danger" onClick={() => push({ name: "cancel", bookingId: b.id })}>Cancel stay</Button> : null}
        <Button full variant="tertiary" onClick={() => push({ name: "receipt", bookingId: b.id })}>Download receipt</Button>
      </div>
      {soon ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Check-in instructions unlock inside 48 hours. Until then, the door code stays hidden.
        </p>
      ) : null}
    </Screen>
  );
}

export function ModifyScreen({ bookingId }: { bookingId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  const [start, setStart] = useState<string | null>(b?.checkIn ?? null);
  const [end, setEnd] = useState<string | null>(b?.checkOut ?? null);
  const [party, setParty] = useState(b?.party ?? { adults: 2, children: 0, infants: 0, pets: 0 });
  const [sent, setSent] = useState(false);
  if (!b) return null;
  const before = quote(b.checkIn, b.checkOut, b.promo, b.party.pets);
  const after = start && end ? quote(start, end, b.promo, party.pets) : null;
  const diff = before && after ? after.total - before.total : 0;
  return (
    <Screen title="Modify stay" onBack={pop}>
      {sent ? (
        <Empty title="Request sent" body="Barb will confirm if those nights are free on every calendar. Your current reservation stands until then." />
      ) : (
        <>
          <RangeCalendar
            start={start}
            end={end}
            showPrice
            isTaken={(iso) => store.isTaken(iso, b.id)}
            onChange={(a, c) => {
              setStart(a);
              setEnd(c);
            }}
          />
          <div className="mt-4">
            <GuestEditor party={party} onChange={setParty} />
          </div>
          {after && before ? (
            <p className="mt-4 text-[17px]">
              {diff === 0 ? "The total stays the same." : diff > 0 ? `This adds ${money(diff, store.currency)}.` : `This returns ${money(-diff, store.currency)}.`}
            </p>
          ) : null}
          <Button
            full
            className="mt-4"
            disabled={!start || !end}
            onClick={() => {
              if (!start || !end) return;
              store.modifyBooking(b.id, start, end, party);
              setSent(true);
            }}
          >
            Submit request
          </Button>
        </>
      )}
    </Screen>
  );
}

export function CancelScreen({ bookingId }: { bookingId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  const [reason, setReason] = useState("Plans changed");
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  if (!b) return null;
  const refund = refundFor(b.checkIn, b.checkOut);
  const reasons = ["Plans changed", "Found another date", "Travel issue", "Something else"];
  return (
    <Screen title="Cancel stay" onBack={pop}>
      {done ? (
        <Empty title="Stay cancelled" body={`${money(refund.amount, store.currency)} is marked ${b.payment === "Refund pending" ? "refund pending" : "to return"}. ${refund.label}`} />
      ) : (
        <>
          <p className="text-[17px] leading-relaxed">{refund.label}</p>
          <p className="mt-2 text-[22px] font-semibold">{money(refund.amount, store.currency)} back to ···· {b.cardLast4}</p>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Reason</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {reasons.map((r) => (
              <Chip key={r} on={reason === r} onClick={() => setReason(r)}>{r}</Chip>
            ))}
          </div>
          <Button full variant="danger" className="mt-6" onClick={() => setOpen(true)}>
            Cancel this stay
          </Button>
          <Alert
            open={open}
            title="Cancel The Cozy Olive?"
            body={`${refund.label} The dates reopen for other guests.`}
            confirm="Cancel stay"
            cancel="Keep it"
            danger
            onClose={() => setOpen(false)}
            onConfirm={() => {
              store.cancelBooking(b.id);
              setOpen(false);
              setDone(true);
            }}
          />
        </>
      )}
    </Screen>
  );
}

export function ReceiptScreen({ bookingId }: { bookingId: string }) {
  const { pop } = useNav();
  const store = useStore();
  const b = store.bookings.find((x) => x.id === bookingId);
  if (!b) return null;
  const q = quote(b.checkIn, b.checkOut, b.promo, b.party.pets);
  return (
    <Screen title="Receipt" onBack={pop}>
      <p className="font-serif text-[28px]">Hickory & Haven</p>
      <p className="text-[15px] text-muted-foreground">Invoice {b.confirmation}</p>
      <p className="mt-3 text-[17px]">The Cozy Olive · {prettyRange(b.checkIn, b.checkOut)}</p>
      <p className="text-[15px] text-muted-foreground">Billed to {store.user?.firstName} {store.user?.lastName}</p>
      {q ? <div className="mt-4"><Breakdown q={q} currency={store.currency} /></div> : null}
      <p className="mt-3 text-[13px] text-muted-foreground">Paid with card ending {b.cardLast4}. Host: Barb Vallenari, 3arb@IvyLaneprop.com.</p>
      <Button
        full
        className="mt-4"
        onClick={() => {
          const text = `Hickory & Haven receipt ${b.confirmation}\nThe Cozy Olive ${prettyRange(b.checkIn, b.checkOut)}\nTotal ${q ? money(q.total, store.currency) : ""}\n`;
          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${b.confirmation}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Download receipt
      </Button>
    </Screen>
  );
}

export function RemindersScreen() {
  const { pop } = useNav();
  const { prefs, togglePref } = useStore();
  const rows: { key: keyof typeof prefs; label: string; detail: string }[] = [
    { key: "confirmations", label: "Booking confirmations", detail: "As soon as a stay is paid" },
    { key: "weekBefore", label: "7 days before", detail: "A gentle reminder and the guidebook" },
    { key: "twoDays", label: "48 hours before", detail: "Door code and parking notes" },
    { key: "dayOf", label: "Day of check-in", detail: "Arrival window and host line" },
    { key: "checkout", label: "Checkout reminder", detail: "The morning you leave" },
  ];
  return (
    <Screen title="Stay reminders" onBack={pop}>
      <div className="overflow-hidden rounded-[16px] bg-card">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0">
            <div>
              <p className="text-[17px]">{r.label}</p>
              <p className="text-[13px] text-muted-foreground">{r.detail}</p>
            </div>
            <input type="checkbox" className="h-5 w-5" checked={prefs[r.key]} onChange={() => togglePref(r.key)} aria-label={r.label} />
          </div>
        ))}
      </div>
    </Screen>
  );
}
