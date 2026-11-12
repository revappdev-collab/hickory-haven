import { Heart, MapPin, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNav } from "./nav";
import {
  PROMO_VIDEO,
  addDaysISO,
  fmtISO,
  isBlocked,
  money,
  nightRate,
  parseISODate,
  partyLabel,
  prettyRange,
  quote,
  todayISO,
  type Party,
  type Property,
  type Quote,
} from "@/lib/model";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Card, Photo, Stepper } from "./ios";

export function PropertyCard({
  property,
  onOpen,
  total,
  urgent,
}: {
  property: Property;
  onOpen: () => void;
  total?: number;
  urgent?: boolean;
}) {
  const { saved, toggleSaved, requireUser, currency } = useSaved();
  const loved = saved.includes(property.id);
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <button type="button" onClick={onOpen} className="block w-full text-left" aria-label={`Open ${property.name}`}>
          <div className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar">
            {property.photos.slice(0, 4).map((p) => (
              <Photo key={p.src} name={p.src} alt={p.alt} className="h-[210px] w-full shrink-0 snap-center bg-chip" />
            ))}
          </div>
        </button>
        {property.comingSoon ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#F6F1E7] px-3 py-1 text-[12px] font-semibold text-brown">
            Coming soon
          </span>
        ) : null}
        {urgent ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-brown px-3 py-1 text-[12px] font-semibold text-[#F6F1E7]">
            Only 1 left
          </span>
        ) : null}
        <button
          type="button"
          aria-label={loved ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          aria-pressed={loved}
          onClick={() => requireUser(() => toggleSaved(property.id))}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-card/90"
        >
          <Heart size={20} className={loved ? "fill-[#8C3A36] text-[#8C3A36]" : "text-forest"} />
        </button>
      </div>
      <button type="button" onClick={onOpen} className="block w-full px-4 py-3 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-[22px] leading-none">{property.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-muted-foreground">
              <MapPin size={13} /> {property.neighborhood}
            </p>
          </div>
          {property.rating > 0 ? (
            <span className="inline-flex items-center gap-1 text-[15px] font-semibold">
              <Star size={14} className="fill-[#A68A64] text-[#A68A64]" /> {property.rating}
            </span>
          ) : (
            <span className="text-[13px] text-muted-foreground">Waitlist</span>
          )}
        </div>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {property.beds} bed · {property.baths} bath · sleeps {property.guests}
        </p>
        <p className="mt-1 text-[17px]">
          {property.comingSoon ? (
            <span className="text-muted-foreground">Opens spring 2027</span>
          ) : total ? (
            <>
              <span className="font-semibold">{money(total, currency)}</span>
              <span className="text-muted-foreground"> total</span>
            </>
          ) : (
            <>
              <span className="font-semibold">{money(property.price, currency)}</span>
              <span className="text-muted-foreground"> / night</span>
            </>
          )}
        </p>
      </button>
    </Card>
  );
}

function useSaved() {
  const store = useStore();
  const { requireUser } = useNav();
  return { saved: store.saved, toggleSaved: store.toggleSaved, currency: store.currency, requireUser };
}

export function GuestEditor({
  party,
  onChange,
  cap = 6,
}: {
  party: Party;
  onChange: (p: Party) => void;
  cap?: number;
}) {
  const rows: { key: keyof Party; label: string; hint: string; min: number }[] = [
    { key: "adults", label: "Adults", hint: "Ages 13 and up", min: 1 },
    { key: "children", label: "Children", hint: "Ages 2–12", min: 0 },
    { key: "infants", label: "Infants", hint: "Under 2, not counted in the guest limit", min: 0 },
    { key: "pets", label: "Pets", hint: "One dog, with a yes from Barb", min: 0 },
  ];
  const counted = party.adults + party.children;
  return (
    <div className="divide-y divide-line rounded-[16px] bg-card">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[17px]">{row.label}</p>
            <p className="text-[13px] text-muted-foreground">{row.hint}</p>
          </div>
          <Stepper
            label={row.label}
            value={party[row.key]}
            min={row.min}
            max={row.key === "pets" ? 1 : 8}
            onChange={(n) => onChange({ ...party, [row.key]: n })}
          />
        </div>
      ))}
      <p className="px-4 py-3 text-[13px] text-muted-foreground">
        {partyLabel(party)}. {counted > cap ? `That’s more than ${cap} — this home sleeps ${cap}.` : `This home sleeps ${cap}.`}
      </p>
    </div>
  );
}

export function RangeCalendar({
  start,
  end,
  onChange,
  isTaken,
  showPrice,
}: {
  start: string | null;
  end: string | null;
  onChange: (start: string | null, end: string | null) => void;
  isTaken: (iso: string) => boolean;
  showPrice?: boolean;
}) {
  const [cursor, setCursor] = useState(() => parseISODate(start ?? todayISO()));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const label = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const lead = first.getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const out: ({ iso: string } | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) out.push({ iso: fmtISO(new Date(year, month, d)) });
    return out;
  }, [year, month]);

  function pick(iso: string) {
    if (!start || end || iso <= start) {
      onChange(iso, null);
      return;
    }
    onChange(start, iso);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" className="h-11 px-2 text-[17px]" onClick={() => setCursor(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <p className="text-[17px] font-semibold">{label}</p>
        <button type="button" aria-label="Next month" className="h-11 px-2 text-[17px]" onClick={() => setCursor(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[12px] text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={d + i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1">
        {cells.map((cell, i) => {
          if (!cell) return <span key={`e${i}`} />;
          const taken = isTaken(cell.iso) || isBlocked(cell.iso);
          const selected = cell.iso === start || cell.iso === end;
          const inRange = start && end && cell.iso > start && cell.iso < end;
          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => pick(cell.iso)}
              aria-label={`${cell.iso}${taken ? ", booked" : ""}`}
              className={cn(
                "mx-auto flex h-11 w-11 flex-col items-center justify-center rounded-full text-[16px] text-foreground",
                selected && "bg-brown text-[#F6F1E7]",
                inRange && !selected && "bg-[#936639]/25",
                taken && !selected && "text-[#7F4F24]",
              )}
            >
              <span>{parseISODate(cell.iso).getDate()}</span>
              {taken && !selected ? (
                <span className="text-[10px] font-semibold leading-none">Held</span>
              ) : showPrice ? (
                <span className={cn("text-[13px] leading-none", selected ? "text-[#F6F1E7]" : "text-muted-foreground")}>
                  {nightRate(cell.iso)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-foreground">
        <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-brown" /> Selected</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-3 w-3 rounded-full bg-[#936639]/40" /> Your stay</span>
        <span className="inline-flex items-center gap-1.5 text-[#7F4F24]">Held · already booked</span>
      </div>
      {start ? (
        <p className="mt-2 text-[15px] font-semibold">
          {end ? prettyRange(start, end) : `Check-in ${prettyRange(start, addDaysISO(start, 0)).split("–")[0]} · choose checkout`}
        </p>
      ) : null}
    </div>
  );
}

export function Breakdown({ q, currency }: { q: Quote; currency: "USD" | "CAD" }) {
  const rows = [
    [`${money(Math.round(q.room / q.nights), currency)} × ${q.nights} nights`, q.room],
    ["Cleaning fee", q.cleaning],
    ["Service fee", q.service],
    ...(q.pet ? [["Pet fee", q.pet] as [string, number]] : []),
    ["Taxes", q.taxes],
    ...(q.discount ? [["Direct offer", -q.discount] as [string, number]] : []),
  ] as [string, number][];
  return (
    <div className="rounded-[16px] bg-card p-4">
      {rows.map(([label, amount]) => (
        <div key={label} className="flex justify-between py-1.5 text-[15px]">
          <span className="text-muted-foreground">{label}</span>
          <span>{amount < 0 ? `−${money(-amount, currency)}` : money(amount, currency)}</span>
        </div>
      ))}
      <div className="mt-2 flex justify-between border-t border-line pt-3 text-[17px] font-semibold">
        <span>Total</span>
        <span>{money(q.total, currency)}</span>
      </div>
      {q.saving > 0 ? (
        <p className="mt-3 rounded-[12px] bg-[#656D4A]/15 px-3 py-2 text-[15px] text-olive">
          Direct booking saving {money(q.saving, currency)} compared with a typical platform total.
        </p>
      ) : null}
    </div>
  );
}

export function VideoTour({ poster, posterAlt }: { poster: string; posterAlt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  return (
    <div className="overflow-hidden rounded-[20px] bg-forest">
      <div className="relative aspect-video">
        <video
          ref={ref}
          poster={undefined}
          className="h-full w-full object-cover"
          playsInline
          muted={muted}
          onError={() => setFailed(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={PROMO_VIDEO} type="video/mp4" />
        </video>
        {!playing ? <Photo name={poster} alt={posterAlt} className="absolute inset-0 h-full w-full" /> : null}
        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-3">
          <button
            type="button"
            className="min-h-11 rounded-full bg-[#F6F1E7] px-4 text-[15px] font-semibold text-forest"
            onClick={() => {
              const v = ref.current;
              if (!v) return;
              if (v.paused) void v.play().catch(() => setFailed(true));
              else v.pause();
            }}
          >
            {playing ? "Pause" : "Play tour"}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={muted ? "Unmute" : "Mute"}
              className="h-11 rounded-full bg-black/50 px-3 text-[13px] text-white"
              onClick={() => {
                setMuted((m) => !m);
                if (ref.current) ref.current.muted = !muted;
              }}
            >
              {muted ? "Muted" : "Sound"}
            </button>
            <button
              type="button"
              aria-label="Fullscreen"
              className="h-11 rounded-full bg-black/50 px-3 text-[13px] text-white"
              onClick={() => {
                const v = ref.current;
                if (!v) return;
                if (v.requestFullscreen) void v.requestFullscreen();
              }}
            >
              Full
            </button>
          </div>
        </div>
      </div>
      {failed ? (
        <p className="px-4 py-3 text-[13px] text-[#F6F1E7]">
          The tour didn’t load in this preview.{" "}
          <a className="underline" href={PROMO_VIDEO} target="_blank" rel="noreferrer">
            Open the video
          </a>
        </p>
      ) : (
        <p className="px-4 py-3 text-[13px] text-[#C2C5AA]">A walk through The Cozy Olive, filmed for guests who book direct.</p>
      )}
    </div>
  );
}

export function NeighborhoodMap({ onOpen }: { onOpen?: (id: string) => void }) {
  const pins = [
    { id: "home", x: 48, y: 58, label: "The Cozy Olive" },
    { id: "olive-rye", x: 62, y: 42, label: "Olive & Rye" },
    { id: "lantern", x: 74, y: 36, label: "The Lantern" },
    { id: "havenbrook-college", x: 28, y: 22, label: "Havenbrook College" },
    { id: "festival-grounds", x: 80, y: 70, label: "Riverfront" },
  ];
  return (
    <div className="relative h-56 overflow-hidden rounded-[20px] bg-[#C2C5AA]">
      <svg viewBox="0 0 100 70" className="h-full w-full" role="img" aria-label="Map of the Olive District and downtown Havenbrook">
        <rect width="100" height="70" fill="#C9D0B8" />
        <path d="M0 48 C 20 44, 40 52, 70 46 L 100 50 L 100 70 L 0 70 Z" fill="#A4AC86" />
        <path d="M10 20 H 90" stroke="#F6F1E7" strokeWidth="1.2" />
        <path d="M30 8 V 64" stroke="#F6F1E7" strokeWidth="1.2" />
        <path d="M58 10 V 62" stroke="#FBF8F2" strokeWidth="2" />
        <path d="M8 40 H 92" stroke="#FBF8F2" strokeWidth="1.4" />
      </svg>
      {pins.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => p.id !== "home" && onOpen?.(p.id)}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          aria-label={p.label}
        >
          <span className="block rounded-full bg-brown px-2 py-1 text-[12px] font-semibold text-[#F6F1E7] shadow">{p.label}</span>
        </button>
      ))}
    </div>
  );
}

export function quoteOrNull(start: string | null, end: string | null, promo: string, pets: number) {
  if (!start || !end) return null;
  return quote(start, end, promo, pets);
}
