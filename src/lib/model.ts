export type Party = { adults: number; children: number; infants: number; pets: number };

export type Photo = {
  src: string;
  alt: string;
  category: "Exterior" | "Living" | "Kitchen" | "Bedrooms" | "Bath" | "Outdoor" | "Workspace";
};

export const HOST = {
  name: "Barb Vallenari",
  first: "Barb",
  email: "3arb@IvyLaneprop.com",
  phone: "(555) 018-1960",
  response: "Usually replies within an hour",
};

export const COZY_PHOTOS: Photo[] = [
  {
    src: "cozy-olive-exterior",
    alt: "The Cozy Olive, a renovated 1960s brick ranch with an olive-green door at golden hour",
    category: "Exterior",
  },
  {
    src: "cozy-olive-living",
    alt: "Living room with an olive linen sofa, walnut coffee table, and cream curtains",
    category: "Living",
  },
  {
    src: "cozy-olive-kitchen",
    alt: "Kitchen with white oak cabinets, brass fixtures, and an olive tile backsplash",
    category: "Kitchen",
  },
  {
    src: "cozy-olive-bedroom",
    alt: "Primary bedroom with layered cream and olive linen bedding and a walnut headboard",
    category: "Bedrooms",
  },
  {
    src: "cozy-olive-guest-room",
    alt: "Guest bedroom with two beds dressed in cream and sand linens",
    category: "Bedrooms",
  },
  {
    src: "cozy-olive-bath",
    alt: "Bathroom with cream tile, a soaking tub, and brass fixtures",
    category: "Bath",
  },
  {
    src: "cozy-olive-nook",
    alt: "Window-seat reading nook with linen cushions and a walnut bookshelf",
    category: "Living",
  },
  {
    src: "cozy-olive-workspace",
    alt: "Quiet workspace with a walnut desk, brass lamp, and a view of the trees",
    category: "Workspace",
  },
  {
    src: "cozy-olive-porch",
    alt: "Back porch with olive-cushioned lounge chairs and mature trees",
    category: "Outdoor",
  },
];

export const MAPLE_PHOTOS: Photo[] = [
  {
    src: "maple-porch-exterior",
    alt: "The Maple Porch, a taupe 1960s cottage with a deep screened porch and a maple tree",
    category: "Exterior",
  },
  {
    src: "maple-porch-living",
    alt: "Cottage living room with sage beadboard, a leather chair, and a stone fireplace",
    category: "Living",
  },
  {
    src: "cozy-olive-porch",
    alt: "A quiet porch with linen cushions, shown as a teaser for The Maple Porch",
    category: "Outdoor",
  },
];

export type Property = {
  id: string;
  name: string;
  comingSoon?: boolean;
  neighborhood: string;
  address: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  beds: number;
  baths: number;
  guests: number;
  blurb: string;
  about: string;
  photos: Photo[];
  highlights: string[];
  sleeps: { room: string; detail: string }[];
  year: string;
};

export const PROPERTIES: Property[] = [
  {
    id: "cozy-olive",
    name: "The Cozy Olive",
    neighborhood: "Olive District",
    address: "418 Hickory Street",
    city: "Havenbrook",
    rating: 4.9,
    reviews: 38,
    price: 185,
    beds: 3,
    baths: 2,
    guests: 6,
    year: "1964, renovated 2025",
    blurb: "A renovated ranch with a real kitchen, a quiet porch, and downtown a short walk away.",
    about:
      "The Cozy Olive was a 1964 ranch on a street of mature trees. We kept the low roof, the brick, and the generous windows, then rebuilt the inside for long weekends: a cook’s kitchen, linen beds, a desk that actually works, and a porch that catches the late light. You can walk to coffee, the college gates, and the square. Parents’ Weekend, festival nights, and ordinary Sundays all feel easy here.",
    photos: COZY_PHOTOS,
    highlights: [
      "1960s renovated charm",
      "8-minute walk to downtown",
      "Driveway for two cars",
      "Fast Wi-Fi and a real desk",
      "Self check-in with a keypad",
      "Best-price direct booking",
    ],
    sleeps: [
      { room: "Primary bedroom", detail: "Queen, blackout linen, ensuite bath" },
      { room: "Guest room", detail: "Queen, or two twins on request" },
      { room: "Den", detail: "Full sofa bed, desk, and reading light" },
    ],
  },
  {
    id: "maple-porch",
    name: "The Maple Porch",
    comingSoon: true,
    neighborhood: "Cedar Avenue",
    address: "26 Cedar Avenue",
    city: "Havenbrook",
    rating: 0,
    reviews: 0,
    price: 165,
    beds: 2,
    baths: 1,
    guests: 4,
    year: "Opening spring 2027",
    blurb: "A smaller cottage, two blocks closer to campus, with a screened porch for slow mornings.",
    about:
      "The Maple Porch is our second home, still in the last months of renovation. Same era, quieter street, a deep screened porch under a maple that turns the color of the door in October. We’ll open the calendar in spring 2027. Join the waitlist and you’ll hear before anyone on Airbnb.",
    photos: MAPLE_PHOTOS,
    highlights: ["Screened porch", "Closer to both campuses", "Two bedrooms", "Same hosting, smaller scale"],
    sleeps: [
      { room: "Bedroom", detail: "Queen, morning light" },
      { room: "Bunk room", detail: "Two twins for siblings or friends" },
    ],
  },
];

export const AMENITY_GROUPS: { title: string; items: { icon: string; label: string; note: string }[] }[] = [
  {
    title: "Essentials",
    items: [
      { icon: "wifi", label: "Fast Wi-Fi", note: "CozyOlive-Guest, works for video calls" },
      { icon: "key", label: "Self check-in", note: "Keypad on the olive door. Code arrives 48 hours prior." },
      { icon: "shirt", label: "Washer and dryer", note: "In the hall closet. Detergent is under the sink." },
      { icon: "snow", label: "Heat and AC", note: "Nest thermostat. A note in the guidebook shows the easy settings." },
      { icon: "tv", label: "Smart TV", note: "Living room. Sign in, then sign out before you leave." },
    ],
  },
  {
    title: "Kitchen",
    items: [
      { icon: "utensils", label: "Full kitchen", note: "Range, oven, dishwasher, and the basics for six." },
      { icon: "coffee", label: "Coffee bar", note: "Drip maker, kettle, grinder, and a bag of local beans." },
      { icon: "spark", label: "Essentials", note: "Oil, salt, paper towels, dish soap. Help yourself." },
    ],
  },
  {
    title: "Work and outdoors",
    items: [
      { icon: "laptop", label: "Workspace", note: "Walnut desk by the window, task lamp, extra outlet." },
      { icon: "trees", label: "Back porch", note: "Two lounge chairs and an herb pot. Quiet after 9." },
      { icon: "car", label: "Free parking", note: "Driveway fits two cars. Street rules vary on festival weekends." },
      { icon: "zap", label: "EV charger", note: "A standard outdoor outlet on the driveway side. Bring your own cable." },
    ],
  },
  {
    title: "Family",
    items: [
      { icon: "paw", label: "Pets on request", note: "One well-mannered dog is welcome. Ask before you book." },
      { icon: "bed", label: "Pack and play", note: "In the den closet, with a fitted sheet." },
      { icon: "bath", label: "Two full baths", note: "Primary ensuite, and a hall bath with a tub." },
    ],
  },
];

export const RULES = [
  { icon: "moon", title: "Quiet hours", body: "10pm to 8am. The neighbors garden early and the street is residential." },
  { icon: "ban", title: "No parties or events", body: "Come to celebrate a weekend, not to host one. No extra guests after 9." },
  { icon: "smoke", title: "No smoking", body: "Not inside, and not on the porch. The sidewalk is fine." },
  { icon: "paw", title: "Pets", body: "One dog with prior approval. A $40 pet fee is added at booking. Cats stay home." },
  { icon: "users", title: "Six guests", body: "That’s the comfortable number, and the number on the booking. Infants are extra." },
  { icon: "home", title: "Be a good neighbor", body: "Shoes can stay on. Please don’t block the shared driveway apron." },
];

export const CHECKIN_STEPS = [
  {
    title: "Arrive after 3:00pm",
    body: "The morning is for turnover. If you’re early, Olive & Rye will hold your bags in spirit — grab a coffee on the square.",
    photo: "downtown-street",
    alt: "Historic downtown street a short walk from the house",
  },
  {
    title: "Park in the driveway",
    body: "Two cars, nose in. Leave the apron clear so the neighbor can reach their garage. Festival weekends: skip the street.",
    photo: "cozy-olive-exterior",
    alt: "Front walk and driveway approach of The Cozy Olive",
  },
  {
    title: "Use the keypad",
    body: "The lock is on the olive door, just right of the brass light. Enter the code, then the check mark. The door locks itself.",
    photo: "cozy-olive-exterior",
    alt: "Olive front door where the keypad lock is mounted",
  },
  {
    title: "Lights, linen, a note from Barb",
    body: "The lamp by the sofa is on a timer. Wi-Fi is on the fridge. A paper note on the counter lists anything that changed this week.",
    photo: "cozy-olive-living",
    alt: "Living room as you’ll find it at check-in",
  },
];

export const CHECKOUT_ITEMS = [
  { id: "dishes", label: "Dishes in the dishwasher, or washed and racked" },
  { id: "trash", label: "Trash and recycling to the bins by the garage" },
  { id: "lights", label: "Lights off, thermostat back to 68°" },
  { id: "lock", label: "Doors locked. The keypad rearms itself." },
  { id: "lost", label: "A last look for chargers under the sofa" },
];

export type Place = {
  id: string;
  name: string;
  category: string;
  price: string;
  minutes: string;
  distance: string;
  hours: string;
  blurb: string;
  tip: string;
  hostPick?: boolean;
  photo: string;
  alt: string;
  phone: string;
};

export const PLACES: Place[] = [
  {
    id: "olive-rye",
    name: "Olive & Rye",
    category: "Coffee",
    price: "$",
    minutes: "4 min walk",
    distance: "0.2 mi",
    hours: "7am – 4pm",
    blurb: "The corner coffee shop locals actually use. Cardamom bun before 9, or it’s gone.",
    tip: "Ask for the olive-oil cake if you’re walking back with coffee for the porch.",
    hostPick: true,
    photo: "coffee-shop",
    alt: "Sunlit coffee shop counter with ceramic cups",
    phone: "(555) 014-2201",
  },
  {
    id: "marigold",
    name: "Marigold Bakery",
    category: "Eat & Drink",
    price: "$",
    minutes: "6 min walk",
    distance: "0.3 mi",
    hours: "8am – 2pm · closed Monday",
    blurb: "Butter, fruit, and a line that moves. Worth it on Saturday.",
    tip: "The morning bun reheats well if you want breakfast at the house.",
    photo: "farmers-market",
    alt: "Market stalls with bread and fruit in warm light",
    phone: "(555) 014-2288",
  },
  {
    id: "lantern",
    name: "The Lantern",
    category: "Eat & Drink",
    price: "$$",
    minutes: "8 min walk",
    distance: "0.4 mi",
    hours: "5pm – 10pm",
    blurb: "A small supper room on the square. Seasonal plates, low light, reservations on weekends.",
    tip: "Book the early seating during Parents’ Weekend. The late one goes to alumni.",
    hostPick: true,
    photo: "restaurant-table",
    alt: "A dinner plate in a candlelit dining room",
    phone: "(555) 014-4410",
  },
  {
    id: "market",
    name: "Hickory Street Market",
    category: "Festivals & Events",
    price: "$",
    minutes: "7 min walk",
    distance: "0.3 mi",
    hours: "Saturdays 8am – 1pm",
    blurb: "Growers, flowers, and a baker under the oaks. The easiest Saturday plan in town.",
    tip: "Peaches in late summer, apples and cider doughnuts once the leaves turn.",
    hostPick: true,
    photo: "farmers-market",
    alt: "Saturday farmers market under canvas tents",
    phone: "(555) 014-1170",
  },
  {
    id: "bandbox",
    name: "The Bandbox",
    category: "Nightlife",
    price: "$$",
    minutes: "10 min walk",
    distance: "0.5 mi",
    hours: "Doors 7pm · shows 8:30",
    blurb: "A brick room with a small stage. Local bands, the occasional touring act, good sound.",
    tip: "Walk back along Hickory. It’s well lit, and you’re home in ten quiet minutes.",
    photo: "live-music",
    alt: "A small music venue seen from the back of the room",
    phone: "(555) 014-9094",
  },
  {
    id: "nightjar",
    name: "Nightjar",
    category: "Nightlife",
    price: "$$",
    minutes: "9 min walk",
    distance: "0.4 mi",
    hours: "4pm – midnight",
    blurb: "Wine, a short cocktail list, and booths that work for a date or a catch-up.",
    tip: "The olive-oil martini is a house joke that turned out well. Try it.",
    photo: "live-music",
    alt: "Warm evening interior with string lights",
    phone: "(555) 014-7733",
  },
  {
    id: "paper-pine",
    name: "Paper & Pine",
    category: "Shopping",
    price: "$$",
    minutes: "8 min walk",
    distance: "0.4 mi",
    hours: "10am – 6pm",
    blurb: "Books, cards, and the kind of gift you can pack in a tote.",
    tip: "They wrap. Useful on a campus weekend.",
    photo: "downtown-street",
    alt: "Historic downtown storefronts in late light",
    phone: "(555) 014-6162",
  },
  {
    id: "green",
    name: "Havenbrook Green",
    category: "Parks & Outdoors",
    price: "Free",
    minutes: "5 min walk",
    distance: "0.2 mi",
    hours: "Dawn to dusk",
    blurb: "A pocket park with old oaks and a lawn big enough for a blanket.",
    tip: "Evening light on the west lawn is the best free show in the neighborhood.",
    photo: "cozy-olive-porch",
    alt: "Trees and warm outdoor light near the house",
    phone: "(555) 014-1000",
  },
  {
    id: "festival-grounds",
    name: "Riverfront Grounds",
    category: "Festivals & Events",
    price: "Varies",
    minutes: "12 min walk",
    distance: "0.6 mi",
    hours: "Event days",
    blurb: "Where the harvest market, winter lights, and the food fest actually happen.",
    tip: "Walk. Festival parking fills the streets and the driveway is the calmer choice.",
    photo: "festival-crowd",
    alt: "Riverfront festival at dusk with lanterns and silhouettes",
    phone: "(555) 014-1000",
  },
  {
    id: "havenbrook-college",
    name: "Havenbrook College",
    category: "Campus & Universities",
    price: "Free to wander",
    minutes: "12 min drive",
    distance: "3.1 mi",
    hours: "Campus is open",
    blurb: "Brick halls, a green quad, and the Parents’ Weekend welcome on the library steps.",
    tip: "The visitor lot off Elm is kinder than circling the quad.",
    photo: "university-campus",
    alt: "Brick campus halls and a green quad in autumn light",
    phone: "(555) 014-3000",
  },
  {
    id: "north-state",
    name: "North State University",
    category: "Campus & Universities",
    price: "Free to wander",
    minutes: "18 min drive",
    distance: "6.4 mi",
    hours: "Campus is open",
    blurb: "The larger campus, north of downtown. Concerts, games, and a good art museum.",
    tip: "Saturday kickoff traffic is real. Leave 30 minutes earlier than the map says.",
    photo: "parents-weekend",
    alt: "A campus path with autumn trees",
    phone: "(555) 014-4000",
  },
  {
    id: "elm-play",
    name: "Little Elm Playground",
    category: "Family Friendly",
    price: "Free",
    minutes: "9 min walk",
    distance: "0.4 mi",
    hours: "Dawn to dusk",
    blurb: "A shaded playground and a splash pad that runs through September.",
    tip: "The bakery is on the way back. That’s the whole outing.",
    photo: "family-arrival",
    alt: "A family arriving at a front porch with luggage",
    phone: "(555) 014-1000",
  },
];

export const PLACE_CATEGORIES = [
  "Eat & Drink",
  "Coffee",
  "Nightlife",
  "Shopping",
  "Entertainment",
  "Festivals & Events",
  "Campus & Universities",
  "Parks & Outdoors",
  "Family Friendly",
];

export const EVENTS = [
  {
    id: "parents",
    name: "Parents’ Weekend",
    place: "Havenbrook College",
    dates: "Nov 14 – 16, 2026",
    blurb: "Welcome on the library steps Saturday at 10, department open houses, and a concert Sunday afternoon.",
    photo: "parents-weekend",
    alt: "Families walking a campus path during an autumn weekend",
  },
  {
    id: "harvest",
    name: "Harvest Night Market",
    place: "Historic downtown",
    dates: "Nov 21, 2026",
    blurb: "The square stays open late. Cider, makers, and a trio under the oaks. Streets fill by 6.",
    photo: "farmers-market",
    alt: "An outdoor market in warm afternoon light",
  },
  {
    id: "lights",
    name: "Winter Lights on the River",
    place: "Riverfront Grounds",
    dates: "Dec 12 – 14, 2026",
    blurb: "A lit walk along the water and a small choral set at 7. Coats, not heels.",
    photo: "festival-crowd",
    alt: "Dusk festival lights along a riverfront green",
  },
  {
    id: "concert",
    name: "North State chamber night",
    place: "North State University",
    dates: "Dec 5, 2026",
    blurb: "Student and faculty strings in the recital hall. Tickets are inexpensive and the room is lovely.",
    photo: "live-music",
    alt: "A warmly lit small stage",
  },
  {
    id: "food",
    name: "Maple Street Food Fest",
    place: "Downtown Havenbrook",
    dates: "Apr 18, 2027",
    blurb: "One long table of local kitchens. A good reason to book The Maple Porch when it opens.",
    photo: "restaurant-table",
    alt: "A seasonal dinner plate",
  },
];

export type Review = {
  id: string;
  name: string;
  initial: string;
  date: string;
  stars: number;
  stay: string;
  text: string;
  reply?: string;
  scores: Record<string, number>;
  photo?: string;
  photoAlt?: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Priya S.",
    initial: "P",
    date: "October 2026",
    stars: 5,
    stay: "Parents' Weekend",
    text: "We came for our daughter’s first Parents’ Weekend and exhaled the minute we walked in. The house is exactly the photos. Barb’s note about parking saved us an hour of circling, and the porch was where we actually talked.",
    reply: "Priya, I’m glad the porch did its job. Your daughter has a good spot — come back in the spring when the oaks leaf out.",
    scores: { Cleanliness: 5, Accuracy: 5, "Check-in": 5, Communication: 5, Location: 5, Value: 5 },
    photo: "cozy-olive-porch",
    photoAlt: "The back porch where Priya’s family spent the afternoon",
  },
  {
    id: "r2",
    name: "Jonah & Cam",
    initial: "J",
    date: "October 2026",
    stars: 5,
    stay: "Date Night",
    text: "Booked two nights around a show at The Bandbox. Kitchen was stocked enough to make breakfast, the bed is the kind you resent leaving, and the walk home was easy. We’ll skip the hotel next time.",
    scores: { Cleanliness: 5, Accuracy: 5, "Check-in": 5, Communication: 5, Location: 5, Value: 5 },
  },
  {
    id: "r3",
    name: "The Okonkwo family",
    initial: "O",
    date: "September 2026",
    stars: 5,
    stay: "Family Visits",
    text: "Three generations, one house, no one on a pullout in a hallway. The den sofa bed is a real bed. Kids walked to the playground. We cooked one night and let The Lantern handle the other.",
    reply: "You left the kitchen kinder than you found it. That’s the whole review I needed. Come back when the cousins do.",
    scores: { Cleanliness: 5, Accuracy: 5, "Check-in": 5, Communication: 5, Location: 4, Value: 5 },
    photo: "cozy-olive-living",
    photoAlt: "The living room set up for a family stay",
  },
  {
    id: "r4",
    name: "Maren Ellis",
    initial: "M",
    date: "September 2026",
    stars: 5,
    stay: "Work Trip",
    text: "I had two long call days and the desk by the window never dropped Wi-Fi. Evenings I walked the square. It felt like borrowing a friend’s house, which is the point.",
    scores: { Cleanliness: 5, Accuracy: 5, "Check-in": 5, Communication: 5, Location: 5, Value: 5 },
  },
  {
    id: "r5",
    name: "Luis Ortega",
    initial: "L",
    date: "August 2026",
    stars: 4,
    stay: "Festival Getaway",
    text: "Harvest weekend was busy and the street was full, exactly as Barb warned. The house itself was calm. Only note: the dryer needed a second cycle on towels. Still the right place to stay.",
    reply: "Fair note on the dryer, Luis. A new heating element is in. Thank you for telling me plainly.",
    scores: { Cleanliness: 5, Accuracy: 4, "Check-in": 5, Communication: 5, Location: 4, Value: 5 },
  },
  {
    id: "r6",
    name: "Dana Cho",
    initial: "D",
    date: "August 2026",
    stars: 5,
    stay: "Foodie Weekend",
    text: "Came for the restaurants, stayed for the morning light in the kitchen. Coffee setup is thoughtful. We walked everywhere and never wanted a car except to leave.",
    scores: { Cleanliness: 5, Accuracy: 5, "Check-in": 5, Communication: 5, Location: 5, Value: 5 },
  },
];

export const RATING_BARS = ["Cleanliness", "Accuracy", "Check-in", "Communication", "Location", "Value"] as const;

export function ratingAverage(key?: string) {
  const vals = REVIEWS.map((r) => (key ? r.scores[key] : r.stars));
  const avg = vals.reduce((s, n) => s + n, 0) / vals.length;
  return Math.round(avg * 10) / 10;
}

export const OFFERS = [
  {
    id: "parents",
    name: "Parents’ Weekend",
    code: "PARENTS",
    save: "$40 off",
    window: "Nov 13 – 16, 2026",
    detail: "For campus visits this weekend. $40 off a stay of two nights or more at The Cozy Olive. One code per booking. Not combined with HAVEN50.",
    photo: "parents-weekend",
    alt: "Parents and a student walking toward campus",
  },
  {
    id: "festival",
    name: "Festival Weekend",
    code: "OLIVE20",
    save: "10% off",
    window: "Harvest and winter lights",
    detail: "Ten percent off the nightly rate when your stay overlaps a festival weekend. The cleaning fee stays as it is. Dates still have to be open — the calendar is the same one Airbnb sees.",
    photo: "festival-crowd",
    alt: "Festival lights at dusk",
  },
  {
    id: "midweek",
    name: "Midweek Escape",
    code: "HAVEN50",
    save: "$50 off",
    window: "Sunday – Thursday nights",
    detail: "Arrive Sunday through Wednesday and take $50 off. A good fit for work days and quieter campus visits. Minimum two nights.",
    photo: "cozy-olive-nook",
    alt: "A quiet reading nook for a midweek stay",
  },
  {
    id: "summer",
    name: "Long summer light",
    code: "OLIVE20",
    save: "10% off",
    window: "June – August 2027",
    detail: "Summer weeks book from the families who already know the porch. Direct guests take ten percent off stays of three nights or more.",
    photo: "cozy-olive-porch",
    alt: "The back porch in warm light",
  },
  {
    id: "holiday",
    name: "Holiday hearth",
    code: "PARENTS",
    save: "$40 off",
    window: "Dec 10 – Jan 2",
    detail: "Between winter lights and the new year. $40 off, and the tree on the square stays lit. Book direct so the rate doesn’t pick up a platform fee.",
    photo: "downtown-street",
    alt: "Historic downtown in golden light",
  },
];

export const COUPONS = [
  { code: "PARENTS", label: "Parents’ Weekend", off: "$40 off", expires: "Nov 16, 2026" },
  { code: "OLIVE20", label: "Festival & summer", off: "10% off nights", expires: "Aug 31, 2027" },
  { code: "HAVEN50", label: "Midweek", off: "$50 off", expires: "Mar 31, 2027" },
];

export const FAQ = [
  { q: "How does booking direct stay in sync?", a: "The calendar you see is the same one that feeds Airbnb and VRBO. If a date is open here, it is open. A confirmed direct booking closes the date everywhere else within a few minutes. We don’t take two guests for one night.", group: "Booking" },
  { q: "What’s included in the nightly rate?", a: "The house, Wi-Fi, parking, linens, and the coffee bar. Cleaning is a separate $95. A small service fee covers secure payment and support. Local tax is calculated at checkout.", group: "Booking" },
  { q: "When am I charged?", a: "Your card, or Apple Pay, is charged when you confirm. You’ll get a receipt in the app and by email. Haven Rewards points post after checkout.", group: "Payment" },
  { q: "Can I pay with Apple Pay?", a: "Yes. You can also save a Visa or Mastercard for next time. We never store a full card number on this phone beyond what the payment sheet needs for the preview.", group: "Payment" },
  { q: "How does check-in work?", a: "Check-in is 3:00pm. The keypad code appears in your trip 48 hours before arrival. A short video in the guidebook shows the door.", group: "Check-in" },
  { q: "What if I arrive early?", a: "The house may still be in turnover. Walk to Olive & Rye or the Green. We’ll message you if the door can open sooner.", group: "Check-in" },
  { q: "What’s the cancellation policy?", a: "Seven days or more before check-in: a full refund except the service fee. Two to six days: half the nightly rate, plus the cleaning fee. Inside 48 hours: the cleaning fee returns, and the nights stay with the house. Festival dates follow the same rules.", group: "Cancellation" },
  { q: "Can I change dates?", a: "Send a modify request from the trip. If the new dates are open, we’ll show the price difference and hold them while Barb confirms. Nothing moves until both calendars agree.", group: "Cancellation" },
  { q: "Are pets welcome?", a: "One dog, with a yes from us before you pay, and a $40 fee. Please don’t leave a dog alone for the day. Cats and other animals aren’t a fit for this house.", group: "Pets" },
  { q: "Where do I park?", a: "The driveway fits two cars. Street parking is fine most weeks and tight during Parents’ Weekend and festival nights. Don’t block the neighbor’s apron.", group: "Parking" },
];

export const OCCASIONS = [
  "Parents' Weekend",
  "Festival Getaway",
  "Family Visits",
  "Foodie Weekend",
  "Date Night",
  "Work Trip",
];

export const PURPOSES = OCCASIONS;

export const LOCATIONS = [
  "Havenbrook",
  "Historic downtown",
  "Havenbrook College",
  "North State University",
  "The Cozy Olive",
  "Olive District",
];

export const TRAVEL_TIMES = [
  { label: "Historic downtown", time: "8 min walk" },
  { label: "Havenbrook College", time: "12 min drive" },
  { label: "North State University", time: "18 min drive" },
  { label: "Riverfront festival grounds", time: "12 min walk" },
  { label: "Olive & Rye", time: "4 min walk" },
];

const BLOCKED = new Set([
  "2026-11-21",
  "2026-11-22",
  "2026-11-27",
  "2026-11-28",
  "2026-12-05",
  "2026-12-18",
  "2026-12-19",
  "2026-12-20",
  "2026-12-21",
  "2026-12-31",
  "2027-01-01",
  "2027-02-13",
  "2027-02-14",
]);

export function fmtISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysISO(iso: string, days: number) {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return fmtISO(d);
}

export function todayISO() {
  return fmtISO(new Date());
}

export function nightsBetween(start: string, end: string) {
  const dates: string[] = [];
  let cursor = start;
  while (cursor < end) {
    dates.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }
  return dates;
}

export function rangeHeld(start: string, end: string, taken: (iso: string) => boolean) {
  return nightsBetween(start, end).some(taken);
}

/** Next stretch of open nights, starting today. */
export function nextOpenStay(taken: (iso: string) => boolean, nights = 2) {
  let start = todayISO();
  for (let i = 0; i < 120; i++) {
    const end = addDaysISO(start, nights);
    if (!rangeHeld(start, end, taken)) return { checkIn: start, checkOut: end };
    start = addDaysISO(start, 1);
  }
  return null;
}

export function isBlocked(iso: string) {
  return BLOCKED.has(iso);
}

export function rangeHitsBlocked(start: string, end: string) {
  return nightsBetween(start, end).some(isBlocked);
}

export function nightRate(iso: string) {
  const day = parseISODate(iso).getDay();
  const weekend = day === 5 || day === 6;
  if (iso >= "2026-12-18" && iso <= "2027-01-02") return 225;
  if (iso >= "2026-11-20" && iso <= "2026-11-22") return 215;
  return weekend ? 205 : 175;
}

export function minStayFor(start: string, end: string) {
  const nights = nightsBetween(start, end);
  const festival = nights.some((n) => n >= "2026-11-20" && n <= "2026-11-22");
  return festival ? 3 : 2;
}

export type Quote = {
  nights: number;
  room: number;
  cleaning: number;
  service: number;
  taxes: number;
  discount: number;
  pet: number;
  total: number;
  airbnb: number;
  saving: number;
  promo?: string;
};

export function quote(start: string, end: string, promo?: string, pets = 0): Quote | null {
  const list = nightsBetween(start, end);
  if (list.length === 0) return null;
  const room = list.reduce((s, n) => s + nightRate(n), 0);
  const cleaning = 95;
  const service = Math.round(room * 0.06);
  const pet = pets > 0 ? 40 : 0;
  const taxable = room + cleaning + service + pet;
  const taxes = Math.round(taxable * 0.08);
  let discount = 0;
  const code = promo?.trim().toUpperCase();
  if (code === "OLIVE20") discount = Math.round(room * 0.1);
  if (code === "PARENTS") discount = 40;
  if (code === "HAVEN50") discount = 50;
  if (code === "NIGHTCREDIT") discount = Math.min(185, room);
  discount = Math.min(discount, room);
  const total = Math.max(0, taxable + taxes - discount);
  const airbnb = Math.round(room * 1.14) + cleaning + pet + 49 + Math.round(room * 0.03);
  const saving = Math.max(0, airbnb - total);
  return { nights: list.length, room, cleaning, service, taxes, discount, pet, total, airbnb, saving, promo: code || undefined };
}

export function money(usd: number, currency: "USD" | "CAD" = "USD") {
  const n = currency === "CAD" ? Math.round(usd * 1.36) : usd;
  const symbol = currency === "CAD" ? "C$" : "$";
  return `${symbol}${n.toLocaleString("en-US")}`;
}

export function prettyDate(iso: string) {
  return parseISODate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function prettyRange(start: string, end: string) {
  const a = parseISODate(start);
  const b = parseISODate(end);
  const sameMonth = a.getMonth() === b.getMonth();
  const left = a.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const right = b.toLocaleDateString("en-US", sameMonth ? { day: "numeric" } : { month: "short", day: "numeric" });
  return `${left} – ${right}`;
}

export function daysUntil(iso: string, from = todayISO()) {
  const ms = parseISODate(iso).getTime() - parseISODate(from).getTime();
  return Math.round(ms / 86400000);
}

export function nextOpenRange(from = todayISO()) {
  let cursor = from < "2026-11-13" ? "2026-11-13" : from;
  for (let i = 0; i < 120; i++) {
    const end = addDaysISO(cursor, 2);
    if (!rangeHitsBlocked(cursor, end) && cursor >= from) return { start: cursor, end };
    cursor = addDaysISO(cursor, 1);
  }
  return { start: addDaysISO(from, 30), end: addDaysISO(from, 32) };
}

export function refundFor(start: string, end: string, from = todayISO()) {
  const q = quote(start, end);
  const days = daysUntil(start, from);
  if (!q) return { amount: 0, label: "This stay can’t be priced." };
  if (days >= 7)
    return {
      amount: q.total - q.service,
      label: `Full refund except the ${money(q.service)} service fee.`,
    };
  if (days >= 2) return { amount: Math.round(q.room * 0.5) + q.cleaning, label: "Half the nightly rate, plus your cleaning fee." };
  return { amount: q.cleaning, label: "Check-in is inside 48 hours, so the nights stay booked. Your cleaning fee returns." };
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function passwordScore(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}

export const PASSWORD_LABEL = ["Too short", "Weak", "Fair", "Good", "Strong"];

export const DIAL_CODES = [
  { id: "US", label: "United States", dial: "+1" },
  { id: "CA", label: "Canada", dial: "+1" },
  { id: "GB", label: "United Kingdom", dial: "+44" },
  { id: "AU", label: "Australia", dial: "+61" },
  { id: "MX", label: "Mexico", dial: "+52" },
];

export const DEMO = {
  email: "elena@havenmail.com",
  password: "Olive185!",
  code: "482913",
};

export const WIFI = { name: "CozyOlive-Guest", password: "OliveHaven26" };
export const DOOR_CODE = "1908";

export const POLICIES = {
  terms: {
    title: "Terms of Stay",
    body: [
      "A booking is a short stay in a private home, hosted by Hickory & Haven. You agree to the house rules, the guest count on the reservation, and the cancellation terms shown before you pay.",
      "The calendar is shared with Airbnb and VRBO. Confirming a stay closes those dates on every channel. We will not knowingly double-book, and we will make it right if a sync error ever slips through.",
      "You are welcome to use the kitchen, the washer, and the porch as a guest in someone’s home would. Damage beyond ordinary wear is billed at cost. Quiet hours are part of the agreement, not a suggestion.",
    ],
  },
  privacy: {
    title: "Privacy",
    body: [
      "We keep the details a host needs: your name, email, mobile, stay dates, and payment status. We don’t sell guest lists.",
      "Messages with Barb stay in the app so check-in help has a record. You can download or delete your account from Settings. Deleting removes the profile. Tax receipts for completed stays are kept as the law requires.",
      "Location is optional and only used to sort “closest to campus” while you search. Notifications are optional and can be turned off one by one.",
    ],
  },
  cancel: {
    title: "Cancellation Policy",
    body: [
      "Cancel 7 or more days before check-in for a full refund except the service fee.",
      "Cancel 2 to 6 days before check-in and we return half the nightly rate plus the cleaning fee.",
      "Inside 48 hours of check-in, the nights are not refundable. The cleaning fee still returns to your card in 5–7 days.",
      "If we have to cancel, you receive a full refund and help finding another night when we have one.",
    ],
  },
} as const;

export const TIERS = [
  { id: "Seedling", min: 0, perk: "Member rate and early notes on new homes" },
  { id: "Hickory", min: 400, perk: "Priority messages and a welcome amenity" },
  { id: "Haven Elite", min: 1000, perk: "A free night credit each year and late checkout when the calendar allows" },
] as const;

export function tierFor(points: number) {
  if (points >= 1000) return "Haven Elite" as const;
  if (points >= 400) return "Hickory" as const;
  return "Seedling" as const;
}

export function propertyById(id: string) {
  return PROPERTIES.find((p) => p.id === id) ?? PROPERTIES[0];
}

export function partyLabel(p: Party) {
  const guests = p.adults + p.children;
  const bits = [`${guests} guest${guests === 1 ? "" : "s"}`];
  if (p.infants) bits.push(`${p.infants} infant${p.infants === 1 ? "" : "s"}`);
  if (p.pets) bits.push(`${p.pets} pet${p.pets === 1 ? "" : "s"}`);
  return bits.join(" · ");
}

export const PROMO_VIDEO =
  "https://www.dropbox.com/scl/fi/ae3ao3i7n3oh2jctx29a0/Cozy-Olive-Promo-Video.mp4?rlkey=j6gy4dfmt0ieqqdbh8uoyy7pc&raw=1";
