import { useEffect, useRef, useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { FiltersSheet, AmenitiesScreen, CalendarScreen, ExploreScreen, GalleryScreen, NeighborhoodScreen, PropertyScreen, ResultsScreen, ReviewsScreen, SavedScreen, SearchScreen, WaitlistScreen } from "./discover";
import { GateSwitch, SignInSheet } from "./gate";
import { HomeScreen } from "./home";
import { OfflineBanner, TabBar, Toasts } from "./ios";
import {
  AboutScreen,
  AddCardScreen,
  AnnouncementScreen,
  CheckinScreen,
  CheckoutScreen,
  ContactScreen,
  CouponsScreen,
  EditProfileScreen,
  EventsScreen,
  FeedbackScreen,
  GuidebookScreen,
  HelpScreen,
  InboxScreen,
  InquiryScreen,
  LocalsScreen,
  MessagesScreen,
  MyReviewsScreen,
  NotifPrefsScreen,
  OfferScreen,
  OffersScreen,
  PaymentsScreen,
  PlaceScreen,
  PolicyScreen,
  ProfileScreen,
  RebookScreen,
  RedeemScreen,
  ReferralScreen,
  RewardsScreen,
  RulesScreen,
  SettingsScreen,
  StoriesScreen,
  ThanksScreen,
  ThreadScreen,
  WifiScreen,
} from "./more";
import { NavProvider, useNav, type Screen, type TabId } from "./nav";
import {
  CancelScreen,
  ConfirmedScreen,
  GuestDetailsScreen,
  ModifyScreen,
  PaymentScreen,
  ProcessingScreen,
  ReceiptScreen,
  RemindersScreen,
  ReservationScreen,
  SummaryScreen,
  TripsScreen,
} from "./reserve";

export function HavenApp() {
  return (
    <StoreProvider>
      <NavProvider>
        <Phone />
      </NavProvider>
    </StoreProvider>
  );
}

function Phone() {
  const store = useStore();
  const nav = useNav();
  const [online, setOnline] = useState(true);
  const [systemDark, setSystemDark] = useState(false);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    setOnline(navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemDark(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      mq.removeEventListener("change", apply);
    };
  }, []);

  const mode = store.theme === "system" ? (systemDark ? "dark" : "light") : store.theme;
  const showTabs = nav.gate === "app" && nav.stack.length === 0;
  const unreadMessages = store.myThreads.reduce(
    (n, t) => n + (t.messages.some((m) => m.from === "host" && !m.read) ? 1 : 0),
    0,
  );

  return (
    <div
      className="hh relative mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-hidden shadow-[0_20px_60px_rgba(51,61,41,0.18)]"
      data-mode={mode}
      data-type={store.textSize}
      data-motion={store.reduceMotion ? "reduce" : "ok"}
      onPointerDown={(e) => {
        if (e.clientX > 28) return;
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (dx < 70) return;
        if (nav.gate === "app" && nav.stack.length) nav.pop();
        else if (nav.gate !== "app" && nav.gate !== "splash") nav.backGate();
      }}
    >
      <OfflineBanner show={!online} />
      <div className="min-h-0 flex-1">
        <div key={nav.gate + nav.tab + (nav.stack.at(-1)?.name ?? "root")} className="hh-in h-full">
          {nav.gate === "app" ? <AppBody /> : <GateSwitch />}
        </div>
      </div>
      {showTabs ? (
        <TabBar
          tab={nav.tab}
          onChange={(id) => nav.setTab(id as TabId)}
          badges={{ messages: unreadMessages, home: store.myNotes.filter((n) => !n.read).length }}
        />
      ) : null}
      <Toasts items={store.toasts} onDismiss={store.dismissToast} />
      <SignInSheet />
      <FiltersSheet />
    </div>
  );
}

function AppBody() {
  const { tab, stack } = useNav();
  const top = stack[stack.length - 1];
  if (!top) {
    if (tab === "home") return <HomeScreen />;
    if (tab === "explore") return <ExploreScreen />;
    if (tab === "trips") return <TripsScreen />;
    if (tab === "messages") return <MessagesScreen />;
    return <ProfileScreen />;
  }
  return <Pushed screen={top} />;
}

function Pushed({ screen }: { screen: Screen }) {
  switch (screen.name) {
    case "property":
      return <PropertyScreen propertyId={screen.propertyId} />;
    case "gallery":
      return <GalleryScreen propertyId={screen.propertyId} category={screen.category} />;
    case "amenities":
      return <AmenitiesScreen propertyId={screen.propertyId} />;
    case "neighborhood":
      return <NeighborhoodScreen propertyId={screen.propertyId} />;
    case "waitlist":
      return <WaitlistScreen />;
    case "saved":
      return <SavedScreen />;
    case "search":
      return <SearchScreen />;
    case "calendar":
      return <CalendarScreen propertyId={screen.propertyId} />;
    case "results":
      return <ResultsScreen />;
    case "summary":
      return <SummaryScreen />;
    case "guests":
      return <GuestDetailsScreen />;
    case "payment":
      return <PaymentScreen />;
    case "processing":
      return <ProcessingScreen />;
    case "confirmed":
      return <ConfirmedScreen bookingId={screen.bookingId} />;
    case "reservation":
      return <ReservationScreen bookingId={screen.bookingId} />;
    case "modify":
      return <ModifyScreen bookingId={screen.bookingId} />;
    case "cancel":
      return <CancelScreen bookingId={screen.bookingId} />;
    case "reminders":
      return <RemindersScreen />;
    case "guidebook":
      return <GuidebookScreen bookingId={screen.bookingId} />;
    case "checkin":
      return <CheckinScreen bookingId={screen.bookingId} />;
    case "checkout":
      return <CheckoutScreen bookingId={screen.bookingId} />;
    case "rules":
      return <RulesScreen />;
    case "wifi":
      return <WifiScreen />;
    case "locals":
      return <LocalsScreen category={screen.category} />;
    case "place":
      return <PlaceScreen placeId={screen.placeId} />;
    case "events":
      return <EventsScreen />;
    case "thread":
      return <ThreadScreen threadId={screen.threadId} />;
    case "contact":
      return <ContactScreen />;
    case "inquiry":
      return <InquiryScreen />;
    case "help":
      return <HelpScreen />;
    case "inbox":
      return <InboxScreen />;
    case "notif-prefs":
      return <NotifPrefsScreen />;
    case "announcement":
      return <AnnouncementScreen />;
    case "reviews":
      return <ReviewsScreen propertyId={screen.propertyId} />;
    case "stories":
      return <StoriesScreen />;
    case "feedback":
      return <FeedbackScreen bookingId={screen.bookingId} />;
    case "thanks":
      return <ThanksScreen />;
    case "my-reviews":
      return <MyReviewsScreen />;
    case "offers":
      return <OffersScreen />;
    case "offer":
      return <OfferScreen offerId={screen.offerId} />;
    case "coupons":
      return <CouponsScreen />;
    case "rewards":
      return <RewardsScreen />;
    case "redeem":
      return <RedeemScreen />;
    case "rebook":
      return <RebookScreen />;
    case "referral":
      return <ReferralScreen />;
    case "edit-profile":
      return <EditProfileScreen />;
    case "settings":
      return <SettingsScreen />;
    case "payments":
      return <PaymentsScreen />;
    case "add-card":
      return <AddCardScreen />;
    case "about":
      return <AboutScreen />;
    case "policy":
      return <PolicyScreen kind={screen.kind} />;
    case "receipt":
      return <ReceiptScreen bookingId={screen.bookingId} />;
    default:
      return null;
  }
}
