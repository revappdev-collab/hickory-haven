import { Heart, List, Map, Search, SlidersHorizontal, Star } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AMENITY_GROUPS,
  PLACES,
  PROPERTIES,
  RATING_BARS,
  REVIEWS,
  TRAVEL_TIMES,
  money,
  nightsBetween,
  rangeHeld,
  prettyRange,
  propertyById,
  quote,
  ratingAverage,
  type Property,
} from "@/lib/model";
import { useStore } from "@/lib/store";
import { Breakdown, GuestEditor, NeighborhoodMap, PropertyCard, RangeCalendar, VideoTour, quoteOrNull } from "./bits";
import { Button, Chip, Empty, Field, IconButton, Photo, Row, Screen, Segmented, Sheet, Stars, fieldClass } from "./ios";
import { useNav, type Screen as AppScreen } from "./nav";

export function ExploreScreen() {
  const { push, setFiltersOpen } = useNav();
  const store = useStore();
  const [mode, setMode] = useState("list");
  const [sort, setSort] = useState(store.search.sort);
  const list = useMemo(() => sortHomes(PROPERTIES, sort), [sort]);
  return (
    <Screen
      title="Explore"
      large
      bleed
      right={
        <IconButton label="Filters" className="mr-2" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={18} />
        </IconButton>
      }
    >
      <div className="px-5">
        <button type="button" onClick={() => push({ name: "search" })} className="flex h-12 w-full items-center gap-2 rounded-[12px] bg-card px-3 text-left text-[17px] text-muted-foreground">
          <Search size={18} /> Search Havenbrook
        </button>
        <div className="mt-3">
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { id: "list", label: "List" },
              { id: "map", label: "Map" },
            ]}
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            ["recommended", "Recommended"],
            ["price", "Price"],
            ["rating", "Rating"],
            ["newest", "Newest"],
            ["campus", "Closest to campus"],
          ].map(([id, label]) => (
            <Chip key={id} on={sort === id} onClick={() => { setSort(id as typeof sort); store.setSearch({ sort: id as typeof store.search.sort }); }}>
              {label}
            </Chip>
          ))}
        </div>
        {mode === "map" ? (
          <div className="mt-4">
            <NeighborhoodMap onOpen={(id) => push({ name: "place", placeId: id })} />
            <p className="mt-2 text-[13px] text-muted-foreground">Pins are the house and a few walks. Tap a place, or switch to the list to book.</p>
          </div>
        ) : null}
        <div className="mt-4 space-y-4">
          {list.length === 0 ? (
            <Empty title="Nothing matches" body="Widen the filters and the homes will come back." action="Reset filters" onAction={store.resetFilters} />
          ) : (
            list.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onOpen={() => push(p.comingSoon ? { name: "waitlist" } : { name: "property", propertyId: p.id })}
              />
            ))
          )}
        </div>
        <span className="sr-only"><List /><Map /></span>
      </div>
    </Screen>
  );
}

function sortHomes(list: Property[], sort: string) {
  const copy = [...list];
  if (sort === "price") copy.sort((a, b) => a.price - b.price);
  else if (sort === "rating") copy.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") copy.sort((a, b) => Number(Boolean(b.comingSoon)) - Number(Boolean(a.comingSoon)));
  else if (sort === "campus") copy.sort((a, b) => a.name.localeCompare(b.name));
  else copy.sort((a, b) => Number(Boolean(a.comingSoon)) - Number(Boolean(b.comingSoon)));
  return copy;
}

export function FiltersSheet() {
  const { filtersOpen, setFiltersOpen } = useNav();
  const store = useStore();
  const f = store.filters;
  const amenityChoices = ["Wi-Fi", "Kitchen", "Washer", "Workspace", "Patio", "Coffee bar"];
  return (
    <Sheet open={filtersOpen} title="Filter & sort" tall onClose={() => setFiltersOpen(false)}>
      <p className="text-[15px] font-semibold">Nightly price · {money(f.price[0], store.currency)} – {money(f.price[1], store.currency)}</p>
      <input
        aria-label="Maximum nightly price"
        type="range"
        min={120}
        max={280}
        value={f.price[1]}
        onChange={(e) => store.setFilters({ price: [f.price[0], Number(e.target.value)] })}
        className="mt-3 w-full accent-[#582F0E]"
      />
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Field label="Bedrooms">
          <input className={fieldClass} inputMode="numeric" value={f.beds || ""} placeholder="Any" onChange={(e) => store.setFilters({ beds: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Baths">
          <input className={fieldClass} inputMode="numeric" value={f.baths || ""} placeholder="Any" onChange={(e) => store.setFilters({ baths: Number(e.target.value) || 0 })} />
        </Field>
        <Field label="Guests">
          <input className={fieldClass} inputMode="numeric" value={f.guests || ""} onChange={(e) => store.setFilters({ guests: Number(e.target.value) || 1 })} />
        </Field>
      </div>
      <p className="mb-2 mt-4 text-[15px] font-semibold">Amenities</p>
      <div className="flex flex-wrap gap-2">
        {amenityChoices.map((a) => (
          <Chip
            key={a}
            on={f.amenities.includes(a)}
            onClick={() =>
              store.setFilters({
                amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
              })
            }
          >
            {a}
          </Chip>
        ))}
      </div>
      {(
        [
          ["pet", "Pet friendly"],
          ["parking", "Free parking"],
          ["workspace", "Workspace"],
          ["ev", "EV charger"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="mt-3 flex min-h-11 items-center justify-between text-[17px]">
          {label}
          <input type="checkbox" checked={f[key]} onChange={(e) => store.setFilters({ [key]: e.target.checked })} />
        </label>
      ))}
      <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
        <Button variant="secondary" onClick={store.resetFilters}>Reset</Button>
        <Button onClick={() => { setFiltersOpen(false); store.pushToast("Filters applied"); }}>Apply</Button>
      </div>
    </Sheet>
  );
}

export function SearchScreen() {
  const { pop, push } = useNav();
  const store = useStore();
  const dated = !!(store.search.checkIn && store.search.checkOut);
  return (
    <Screen title="Dates and guests" onBack={pop}>
      <p className="text-[15px] text-foreground">The Cozy Olive · Havenbrook</p>
      <button type="button" className="mt-4 w-full rounded-[16px] bg-card px-4 py-3 text-left" onClick={() => push({ name: "calendar", propertyId: "cozy-olive" })}>
        <p className="text-[13px] text-muted-foreground">When</p>
        <p className="text-[17px] font-semibold">{dated ? prettyRange(store.search.checkIn!, store.search.checkOut!) : "Add check-in and checkout"}</p>
      </button>
      <div className="mt-4">
        <GuestEditor party={store.search.party} onChange={(party) => store.setSearch({ party })} />
      </div>
      <Button
        full
        className="mt-5"
        onClick={() => {
          store.setSearch({ location: "Havenbrook" });
          if (!dated) push({ name: "calendar", propertyId: "cozy-olive" });
          else push({ name: "results" });
        }}
      >
        {dated ? "See this stay" : "Check availability"}
      </Button>
    </Screen>
  );
}

export function CalendarScreen({ propertyId }: { propertyId?: string }) {
  const { pop, push } = useNav();
  const store = useStore();
  const target = propertyId ? propertyById(propertyId) : propertyById(store.draft.propertyId);
  const start = propertyId ? store.draft.checkIn : store.search.checkIn;
  const end = propertyId ? store.draft.checkOut : store.search.checkOut;
  const held = !!(start && end && rangeHeld(start, end, (iso) => store.isTaken(iso)));
  return (
    <Screen
      title="Availability"
      onBack={pop}
    >
      <p className="mb-3 text-[15px] text-foreground">{target.name} · prices shown are per night, before fees. Held nights are already booked.</p>
      <RangeCalendar
        start={start}
        end={end}
        showPrice
        isTaken={(iso) => store.isTaken(iso)}
        onChange={(a, b) => {
          if (propertyId) store.setDraft({ checkIn: a, checkOut: b, propertyId: target.id });
          store.setSearch({ checkIn: a, checkOut: b });
        }}
      />
      {held ? (
        <p className="mt-3 rounded-[12px] bg-chip px-3 py-3 text-[15px] leading-relaxed text-foreground">
          These nights are already held. You can look at the price. The stay summary will not confirm a second booking.
        </p>
      ) : null}
      <Button
        full
        className="mt-4"
        onClick={() => {
          if (propertyId) {
            store.setDraft({ propertyId: target.id, checkIn: start, checkOut: end });
            store.setSearch({ checkIn: start, checkOut: end });
            push({ name: "summary" });
          } else {
            store.setSearch({ checkIn: start, checkOut: end });
            push({ name: "results" });
          }
        }}
      >
        Continue
      </Button>
    </Screen>
  );
}

export function ResultsScreen() {
  const { pop, push, setFiltersOpen } = useNav();
  const store = useStore();
  const { checkIn, checkOut, location } = store.search;
  const known = /haven|olive|down|college|campus|north|hickory|cedar|cozy|maple/i.test(location);
  const q = checkIn && checkOut ? quote(checkIn, checkOut, "", store.search.party.pets) : null;
  const taken = checkIn && checkOut ? store.isTaken(checkIn) || nightsOverlap(checkIn, checkOut, store.isTaken) : false;
  const cozy = propertyById("cozy-olive");
  const fits =
    known &&
    cozy.price <= store.filters.price[1] &&
    cozy.beds >= store.filters.beds &&
    cozy.baths >= store.filters.baths &&
    cozy.guests >= store.filters.guests &&
    (!store.filters.pet || true) &&
    (!store.filters.parking || true);
  return (
    <Screen
      title="Stays"
      onBack={pop}
      right={
        <IconButton label="Filters" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={18} />
        </IconButton>
      }
    >
      <p className="text-[15px] text-muted-foreground">
        {known ? (fits && !taken ? "1 home" : "0 homes for these dates") : "0 homes"} · {location}
        {checkIn && checkOut ? ` · ${prettyRange(checkIn, checkOut)}` : ""}
      </p>
      {!known || !fits ? (
        <Empty
          title="No homes match"
          body="Try downtown, Havenbrook College, or clear a filter. We only show nights that are truly open."
          action="Edit search"
          onAction={pop}
        />
      ) : taken ? (
        <div className="mt-4">
          <Empty
            title="Those nights are taken"
            body="The calendar is shared with Airbnb and VRBO, so we won’t offer a date that’s already spoken for."
            action="See open dates"
            onAction={() => push({ name: "calendar", propertyId: "cozy-olive" })}
          />
          <Button full variant="secondary" className="mt-3" onClick={() => push({ name: "waitlist" })}>
            Join the waitlist
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <PropertyCard
            property={cozy}
            total={q?.total}
            urgent={Boolean(q)}
            onOpen={() => push({ name: "property", propertyId: cozy.id })}
          />
        </div>
      )}
    </Screen>
  );
}

function nightsOverlap(start: string, end: string, taken: (iso: string) => boolean) {
  return nightsBetween(start, end).some(taken);
}

export function PropertyScreen({ propertyId }: { propertyId: string }) {
  const { pop, push, requireUser } = useNav();
  const store = useStore();
  const p = propertyById(propertyId);
  const [i, setI] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const q = quoteOrNull(store.draft.checkIn, store.draft.checkOut, store.draft.promo, store.draft.party.pets);
  const loved = store.saved.includes(p.id);
  return (
    <Screen
      title={p.name}
      onBack={pop}
      bleed
      right={
        <IconButton
          label={loved ? "Unsave" : "Save"}
          className="mr-2"
          onClick={() => requireUser(() => store.toggleSaved(p.id))}
        >
          <Heart size={18} className={loved ? "fill-[#8C3A36] text-[#8C3A36]" : ""} />
        </IconButton>
      }
      footer={
        <div className="flex items-center gap-3 border-t border-line bg-card px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="min-w-0 flex-1">
            <p className="text-[17px] font-semibold">{q ? money(q.total, store.currency) : money(p.price, store.currency)}</p>
            <p className="text-[13px] text-muted-foreground">{q ? "total for your dates" : "per night before fees"}</p>
          </div>
          <Button
            onClick={() => {
              store.setDraft({ propertyId: p.id });
              if (!store.draft.checkIn || !store.draft.checkOut) push({ name: "calendar", propertyId: p.id });
              else requireUser(() => push({ name: "summary" }));
            }}
          >
            Reserve
          </Button>
        </div>
      }
    >
      <div className="relative">
        <div
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
          onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}
        >
          {p.photos.map((ph) => (
            <button key={ph.src} type="button" className="w-full shrink-0 snap-center" onClick={() => push({ name: "gallery", propertyId: p.id })}>
              <Photo name={ph.src} alt={ph.alt} className="h-[300px] w-full bg-chip" />
            </button>
          ))}
        </div>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[12px] text-white">
          {i + 1} / {p.photos.length}
        </span>
      </div>
      <div className="px-5 pt-4">
        <div className="flex gap-2">
          <Chip on={!showVideo} onClick={() => setShowVideo(false)}>Photos</Chip>
          <Chip on={showVideo} onClick={() => setShowVideo(true)}>Video tour</Chip>
        </div>
        {showVideo ? (
          <div className="mt-3">
            <VideoTour poster={p.photos[0].src} posterAlt={p.photos[0].alt} />
          </div>
        ) : null}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-[28px] leading-none">{p.name}</h2>
            <p className="mt-1 text-[15px] text-muted-foreground">{p.neighborhood}, {p.city}</p>
          </div>
          <button type="button" className="text-right" onClick={() => push({ name: "reviews", propertyId: p.id })}>
            <span className="flex items-center gap-1 font-semibold"><Star size={16} className="fill-[#A68A64] text-[#A68A64]" /> {p.rating}</span>
            <span className="text-[13px] text-muted-foreground">{p.reviews} reviews</span>
          </button>
        </div>
        <button type="button" onClick={() => push({ name: "contact" })} className="mt-4 flex w-full items-center gap-3 rounded-[16px] bg-card p-3 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-olive font-semibold text-[#F6F1E7]">B</span>
          <span>
            <span className="block text-[17px] font-semibold">Hosted by Barb Vallenari</span>
            <span className="block text-[13px] text-muted-foreground">Usually replies within an hour · 3arb@IvyLaneprop.com</span>
          </span>
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.highlights.map((h) => (
            <span key={h} className="rounded-full bg-chip px-3 py-1 text-[13px]">{h}</span>
          ))}
        </div>
        <h3 className="mt-6 font-serif text-[22px]">About this home</h3>
        <p className="mt-2 text-[17px] leading-relaxed">{p.about}</p>
        <p className="mt-3 text-[15px] text-muted-foreground">{p.beds} bedrooms · {p.baths} baths · sleeps {p.guests} · {p.year}</p>
        <h3 className="mt-6 font-serif text-[22px]">Amenities</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {AMENITY_GROUPS[0].items.slice(0, 4).map((a) => (
            <div key={a.label} className="rounded-[14px] bg-card px-3 py-3 text-[15px]">{a.label}</div>
          ))}
        </div>
        <button type="button" className="mt-3 text-[15px] font-semibold text-[#7F4F24]" onClick={() => push({ name: "amenities", propertyId: p.id })}>
          See all amenities
        </button>
        <h3 className="mt-6 font-serif text-[22px]">Where you’ll sleep</h3>
        <div className="mt-2 space-y-2">
          {p.sleeps.map((s) => (
            <div key={s.room} className="rounded-[14px] bg-card px-4 py-3">
              <p className="text-[17px] font-semibold">{s.room}</p>
              <p className="text-[15px] text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
        <button type="button" className="mt-4 block w-full rounded-[16px] bg-card px-4 py-3 text-left" onClick={() => push({ name: "rules" })}>
          <p className="text-[17px] font-semibold">House rules</p>
          <p className="text-[15px] text-muted-foreground">Quiet hours 10pm–8am · no parties · six guests</p>
        </button>
        <button type="button" className="mt-2 block w-full rounded-[16px] bg-card px-4 py-3 text-left" onClick={() => push({ name: "policy", kind: "cancel" })}>
          <p className="text-[17px] font-semibold">Cancellation</p>
          <p className="text-[15px] text-muted-foreground">Full refund, except the service fee, up to 7 days before check-in.</p>
        </button>
        <h3 className="mt-6 font-serif text-[22px]">The neighborhood</h3>
        <div className="mt-2">
          <NeighborhoodMap onOpen={(id) => push({ name: "place", placeId: id })} />
        </div>
        <ul className="mt-3 space-y-1 text-[15px]">
          {TRAVEL_TIMES.map((t) => (
            <li key={t.label} className="flex justify-between"><span>{t.label}</span><span className="text-muted-foreground">{t.time}</span></li>
          ))}
        </ul>
        <button type="button" className="mt-3 text-[15px] font-semibold text-[#7F4F24]" onClick={() => push({ name: "neighborhood", propertyId: p.id })}>
          Map, directions, and nearby
        </button>
        <h3 className="mt-6 font-serif text-[22px]">Availability</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">Live availability, always up to date.</p>
        <div className="mt-2">
          <RangeCalendar
            start={store.draft.checkIn}
            end={store.draft.checkOut}
            showPrice
            isTaken={store.isTaken}
            onChange={(a, b) => store.setDraft({ checkIn: a, checkOut: b, propertyId: p.id })}
          />
        </div>
        <h3 className="mt-6 font-serif text-[22px]">Reviews</h3>
        <div className="mt-2 flex items-center gap-2">
          <Stars value={ratingAverage()} />
          <span className="text-[15px]">{ratingAverage()} · {REVIEWS.length} recent notes</span>
        </div>
        <p className="mt-3 text-[17px] leading-relaxed">{REVIEWS[0].text}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{REVIEWS[0].name}</p>
        <button type="button" className="mt-3 mb-4 text-[15px] font-semibold text-[#7F4F24]" onClick={() => push({ name: "reviews", propertyId: p.id })}>
          Read all reviews
        </button>
      </div>
    </Screen>
  );
}

export function GalleryScreen({ propertyId, category }: { propertyId: string; category?: string }) {
  const { pop } = useNav();
  const p = propertyById(propertyId);
  const cats = ["All", "Exterior", "Living", "Kitchen", "Bedrooms", "Bath", "Outdoor", "Workspace"];
  const [cat, setCat] = useState(category ?? "All");
  const [zoom, setZoom] = useState(1);
  const photos = p.photos.filter((ph) => cat === "All" || ph.category === cat);
  return (
    <Screen title="Gallery" onBack={pop} bleed>
      <div className="flex gap-2 overflow-x-auto px-5 no-scrollbar">
        {cats.map((c) => (
          <Chip key={c} on={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <div className="mt-3 space-y-3">
        {photos.map((ph) => (
          <div key={ph.src} className="overflow-hidden bg-chip" onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2))}>
            <Photo name={ph.src} alt={ph.alt} className="w-full origin-center bg-chip" />
          </div>
        ))}
        {photos.length === 0 ? <Empty title="No photos in this room yet" body="Try All, or another category." /> : null}
      </div>
      <p className="px-5 pt-3 text-[13px] text-muted-foreground">Double-tap a photo to zoom {zoom > 1 ? "(zoomed)" : ""}. Pinch is available in the full-screen viewer on iPhone.</p>
      <div className="px-5 pt-3" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }} />
    </Screen>
  );
}

export function AmenitiesScreen({ propertyId }: { propertyId: string }) {
  const { pop } = useNav();
  const p = propertyById(propertyId);
  return (
    <Screen title="Amenities" onBack={pop}>
      <p className="mb-2 text-[15px] text-muted-foreground">{p.name}</p>
      {AMENITY_GROUPS.map((g) => (
        <section key={g.title} className="mt-4">
          <h2 className="font-serif text-[22px]">{g.title}</h2>
          <div className="mt-2 overflow-hidden rounded-[16px] bg-card">
            {g.items.map((item) => (
              <Row key={item.label} title={item.label} detail={item.note} />
            ))}
          </div>
        </section>
      ))}
    </Screen>
  );
}

export function NeighborhoodScreen({ propertyId }: { propertyId: string }) {
  const { pop, push } = useNav();
  const p = propertyById(propertyId);
  const maps = `https://maps.apple.com/?daddr=${encodeURIComponent(`${p.address}, ${p.city}`)}&dirflg=w`;
  return (
    <Screen title="Neighborhood" onBack={pop}>
      <p className="text-[17px]">{p.address}, {p.city}</p>
      <p className="mt-1 text-[15px] text-muted-foreground">A residential street of mature trees, eight quiet minutes from the square.</p>
      <div className="mt-3">
        <NeighborhoodMap onOpen={(id) => push({ name: "place", placeId: id })} />
      </div>
      <a href={maps} className="mt-3 flex min-h-11 items-center justify-center rounded-[14px] bg-brown text-[17px] font-semibold text-[#F6F1E7]">
        Get Directions
      </a>
      <div className="mt-4 overflow-hidden rounded-[16px] bg-card">
        {PLACES.map((place) => (
          <Row key={place.id} title={place.name} detail={`${place.category} · ${place.minutes}`} onClick={() => push({ name: "place", placeId: place.id })} />
        ))}
      </div>
    </Screen>
  );
}

export function WaitlistScreen() {
  const { pop } = useNav();
  const store = useStore();
  const [email, setEmail] = useState(store.user?.email ?? "");
  const [note, setNote] = useState("Parents’ weekends and fall breaks");
  const home = propertyById("maple-porch");
  return (
    <Screen title="The Maple Porch" onBack={pop} bleed>
      <Photo name={home.photos[0].src} alt={home.photos[0].alt} className="h-56 w-full bg-chip" />
      <div className="px-5 pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-olive">Coming spring 2027</p>
        <h2 className="font-serif text-[28px] leading-tight">A second home, same hosting</h2>
        <p className="mt-2 text-[17px] leading-relaxed">{home.about}</p>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {home.photos.map((ph) => (
            <Photo key={ph.src} name={ph.src} alt={ph.alt} className="h-28 w-40 shrink-0 rounded-[16px] bg-chip" />
          ))}
        </div>
        <ul className="mt-4 space-y-1 text-[15px]">
          {home.highlights.map((h) => <li key={h}>· {h}</li>)}
        </ul>
        {store.waitlist ? (
          <p className="mt-5 rounded-[16px] bg-olive/15 p-4 text-[15px]">You’re on the list. We’ll write before the calendar opens anywhere else.</p>
        ) : (
          <div className="mt-5 space-y-3">
            <Field label="Email">
              <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="What should we watch for?">
              <textarea className={`${fieldClass} h-24 py-3`} value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <Button
              full
              onClick={() => {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  store.pushToast("Add an email", "That’s where we’ll send the opening note.");
                  return;
                }
                store.setWaitlist(true);
                store.pushToast("You’re on the list", "The Maple Porch will write first to you.");
              }}
            >
              Notify me
            </Button>
          </div>
        )}
      </div>
    </Screen>
  );
}

export function SavedScreen() {
  const { pop, push } = useNav();
  const { saved } = useStore();
  const homes = PROPERTIES.filter((p) => saved.includes(p.id));
  return (
    <Screen title="Saved" onBack={pop}>
      {homes.length === 0 ? (
        <Empty title="Nothing saved yet" body="Tap the heart on a home and it will wait here for the weekend you’re planning." action="Browse homes" onAction={() => pop()} />
      ) : (
        <div className="space-y-4">
          {homes.map((p) => (
            <PropertyCard key={p.id} property={p} onOpen={() => push(p.comingSoon ? { name: "waitlist" } : { name: "property", propertyId: p.id })} />
          ))}
        </div>
      )}
    </Screen>
  );
}

export function ReviewsScreen({ propertyId }: { propertyId: string }) {
  const { pop, push } = useNav();
  const [filter, setFilter] = useState("All");
  const chips = ["All", "Parents' Weekend", "Family Visits", "With photos"];
  const list = REVIEWS.filter((r) => {
    if (filter === "All") return true;
    if (filter === "With photos") return Boolean(r.photo);
    return r.stay === filter;
  });
  return (
    <Screen title="Reviews" onBack={pop}>
      <p className="font-serif text-[40px] leading-none">{ratingAverage()}</p>
      <Stars value={ratingAverage()} />
      <p className="mt-1 text-[13px] text-muted-foreground">{propertyById(propertyId).name}</p>
      <div className="mt-4 space-y-2">
        {RATING_BARS.map((key) => (
          <div key={key} className="flex items-center gap-2 text-[13px]">
            <span className="w-28">{key}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-chip">
              <span className="block h-full bg-olive" style={{ width: `${(ratingAverage(key) / 5) * 100}%` }} />
            </span>
            <span className="w-8 text-right">{ratingAverage(key)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {chips.map((c) => (
          <Chip key={c} on={filter === c} onClick={() => setFilter(c)}>{c}</Chip>
        ))}
      </div>
      {list.length === 0 ? (
        <Empty title="No reviews in this filter" body="Try All, or another kind of stay." />
      ) : (
        <div className="mt-4 space-y-3">
          {list.map((r) => (
            <article key={r.id} className="rounded-[16px] bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-olive text-[#F6F1E7]">{r.initial}</span>
                <div>
                  <p className="text-[17px] font-semibold">{r.name}</p>
                  <p className="text-[13px] text-muted-foreground">{r.date} · {r.stay}</p>
                </div>
              </div>
              <div className="mt-2"><Stars value={r.stars} /></div>
              <p className="mt-2 text-[15px] leading-relaxed">{r.text}</p>
              {r.photo ? <Photo name={r.photo} alt={r.photoAlt ?? "A photo from the stay"} className="mt-3 h-36 w-full rounded-[12px] bg-chip" /> : null}
              {r.reply ? (
                <p className="mt-3 rounded-[12px] bg-muted px-3 py-2 text-[15px]"><span className="font-semibold">Barb · </span>{r.reply}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <button type="button" className="mt-4 text-[15px] font-semibold text-[#7F4F24]" onClick={() => push({ name: "stories" })}>
        Read guest stories
      </button>
    </Screen>
  );
}

export function isDiscover(name: AppScreen["name"]) {
  return ["search", "calendar", "results", "property", "gallery", "amenities", "neighborhood", "waitlist", "saved", "reviews"].includes(name);
}
