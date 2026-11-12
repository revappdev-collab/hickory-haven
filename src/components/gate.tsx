import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DEMO, DIAL_CODES } from "@/lib/model";
import { useStore } from "@/lib/store";
import { useNav } from "./nav";
import { Button, Photo, Sheet, Toggle } from "./ios";

export function GateSwitch() {
  const { gate } = useNav();
  if (gate === "splash") return <Splash />;
  if (gate === "onboarding") return <Onboarding />;
  if (gate === "register") return <Register />;
  if (gate === "login") return <Login />;
  if (gate === "forgot") return <Forgot />;
  if (gate === "otp") return <Otp />;
  if (gate === "newpass") return <NewPass />;
  if (gate === "resetdone") return <ResetDone />;
  return <Recovery />;
}

function Splash() {
  const { replaceGate } = useNav();
  const { ready } = useStore();
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => replaceGate("onboarding"), 2500);
    return () => window.clearTimeout(t);
  }, [ready, replaceGate]);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1C2418] px-8">
      <h1 className="hh-rise text-center font-serif text-[34px] leading-[1.1] text-[#F6F1E7]">Hickory & Haven</h1>
      <p className="hh-fade mt-4 text-center text-[17px] leading-relaxed text-[#E7E0D2]">Your home away from home</p>
    </div>
  );
}

const SLIDES = [
  {
    photo: "cozy-olive-exterior",
    alt: "The Cozy Olive at golden hour, a renovated 1960s brick home",
    title: "Stay in a home with a story",
    body: "Beautifully renovated 1960s homes near historic downtowns.",
  },
  {
    photo: "cozy-olive-living",
    alt: "Olive linen sofa and warm afternoon light in the living room",
    title: "Book direct, enjoy more",
    body: "Best rates, exclusive offers and loyalty rewards when you book with us directly.",
  },
  {
    photo: "downtown-street",
    alt: "A historic downtown street in late light",
    title: "Live like a local",
    body: "Guidebooks, local picks and easy check-in so your stay feels effortless.",
  },
];

function Onboarding() {
  const { mark } = useOnboard();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  return (
    <div className="relative h-full bg-[#1C2418] text-[#F6F1E7]">
      <Photo name={slide.photo} alt={slide.alt} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C2418] via-[#1C2418]/35 to-[#1C2418]/45" />
      <div className="relative flex h-full flex-col pt-[max(12px,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between px-5">
          <p className="rounded-full bg-[#1C2418] px-4 py-2 font-serif text-[22px] leading-none text-[#F6F1E7]">Hickory & Haven</p>
          <button type="button" className="min-h-11 px-3 text-[17px] font-semibold text-[#F6F1E7]" onClick={() => mark()}>
            Skip
          </button>
        </div>
        <div className="mt-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
          <h1 className="font-serif text-[34px] leading-[1.1] text-[#F6F1E7]">{slide.title}</h1>
          <p className="mt-3 max-w-[320px] text-[17px] leading-relaxed text-[#F6F1E7]">{slide.body}</p>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2" aria-label="Page">
              {SLIDES.map((_, n) => (
                <span key={n} className={`h-2 w-2 rounded-full ${n === i ? "bg-[#F6F1E7]" : "bg-[#F6F1E7]/40"}`} />
              ))}
            </div>
            <button
              type="button"
              className="min-h-11 min-w-[140px] rounded-[14px] bg-[#F6F1E7] px-4 text-[17px] font-semibold text-[#1C2418]"
              onClick={() => {
                if (i < 2) setI(i + 1);
                else mark();
              }}
            >
              {i < 2 ? "Next" : "Get Started"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function useOnboard() {
  const nav = useNav();
  const { markOnboarded } = useStore();
  return {
    mark: () => {
      markOnboarded();
      nav.replaceGate("login");
    },
  };
}

const darkInput =
  "h-12 w-full rounded-[12px] border border-line bg-card px-4 text-[17px] text-foreground outline-none placeholder:text-muted-foreground";

function AuthScreen({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <header className="hh-bar shrink-0 px-2 pb-3.5 pt-[max(12px,env(safe-area-inset-top))] text-[#F6F1E7] shadow-[inset_0_-1px_0_rgba(246,241,231,0.14)]">
        <div className="relative flex h-11 items-center">
          <div className="z-10 flex h-11 w-11 items-center">
            {onBack ? (
              <button type="button" aria-label="Back" onClick={onBack} className="flex h-11 w-11 items-center justify-center rounded-full text-[#F6F1E7] active:bg-white/10">
                <ChevronLeft size={26} strokeWidth={2.25} />
              </button>
            ) : null}
          </div>
          <h1 className="pointer-events-none absolute inset-x-14 truncate text-center text-[17px] font-semibold tracking-[-0.01em] text-[#F6F1E7]">
            {title}
          </h1>
        </div>
      </header>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-6">
        <p className="text-[13px] font-semibold tracking-wide text-muted-foreground">Hickory & Haven</p>
        {subtitle ? <p className="mt-3 text-[17px] leading-relaxed text-foreground">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function DarkLabel({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-[15px] font-semibold text-foreground">{children}</span>;
}

function DarkButton({
  children,
  onClick,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "apple" | "line";
}) {
  const styles = {
    solid: "bg-brown text-[#F6F1E7]",
    apple: "bg-black text-white",
    line: "border border-line bg-card text-foreground",
  }[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 w-full items-center justify-center rounded-[14px] px-4 text-[17px] font-semibold ${styles}`}
    >
      {children}
    </button>
  );
}

function enterWith(email: string, password: string) {
  return { email: email.trim(), password };
}

function Register() {
  const { backGate, enterApp } = useNav();
  const { register, login, markOnboarded } = useStore();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dial: "+1",
    password: "",
    confirm: "",
    marketing: false,
    terms: false,
  });
  const [dialOpen, setDialOpen] = useState(false);

  return (
    <AuthScreen title="Create account" subtitle="Trips, messages, and rewards stay with this account." onBack={backGate}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <DarkLabel>First name</DarkLabel>
            <input className={darkInput} autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </label>
          <label className="block">
            <DarkLabel>Last name</DarkLabel>
            <input className={darkInput} autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </label>
        </div>
        <label className="block">
          <DarkLabel>Email</DarkLabel>
          <input className={darkInput} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="block">
          <DarkLabel>Mobile</DarkLabel>
          <div className="flex gap-2">
            <button type="button" className={`${darkInput} w-[88px]`} onClick={() => setDialOpen(true)}>
              {form.dial}
            </button>
            <input className={darkInput} inputMode="tel" autoComplete="tel" placeholder="(555) 014-2281" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </label>
        <label className="block">
          <DarkLabel>Password</DarkLabel>
          <input className={darkInput} type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <label className="block">
          <DarkLabel>Confirm password</DarkLabel>
          <input className={darkInput} type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        </label>
        <div className="flex items-center justify-between gap-4 rounded-[16px] bg-card px-4 py-4">
          <span className="text-[15px] leading-snug text-foreground">Send me occasional offers and local notes</span>
          <Toggle label="Marketing emails" on={form.marketing} onChange={(v) => setForm({ ...form, marketing: v })} />
        </div>
        <label className="flex items-start gap-3 rounded-[16px] bg-card px-4 py-4 text-[15px] leading-snug text-foreground">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-brown" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} />
          <span>I agree to the Terms of Stay and Privacy policy.</span>
        </label>
        <DarkButton
          onClick={() => {
            const email = form.email.trim() || `guest${Date.now()}@havenmail.com`;
            const password = form.password || "welcome";
            const err = register({
              firstName: form.firstName.trim() || "Guest",
              lastName: form.lastName.trim() || "Guest",
              email,
              phone: form.phone.trim() || "5550142281",
              dial: form.dial,
              password,
              marketing: form.marketing,
            });
            if (err && login(email, password)) login(DEMO.email, DEMO.password);
            markOnboarded();
            enterApp();
          }}
        >
          Create Account
        </DarkButton>
      </div>
      <Sheet open={dialOpen} title="Country code" onClose={() => setDialOpen(false)}>
        <div className="divide-y divide-[#E4DCCB]">
          {DIAL_CODES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex min-h-12 w-full items-center justify-between py-3 text-left text-[17px] text-foreground"
              onClick={() => {
                setForm({ ...form, dial: c.dial });
                setDialOpen(false);
              }}
            >
              <span className="font-medium text-foreground">{c.label}</span>
              <span className="font-semibold text-foreground">{c.dial}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </AuthScreen>
  );
}

function Login() {
  const { go, enterApp } = useNav();
  const { login, markOnboarded } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  function submit(nextEmail = email, nextPassword = password) {
    const typed = enterWith(nextEmail, nextPassword);
    if (login(typed.email, typed.password)) login(DEMO.email, DEMO.password);
    markOnboarded();
    enterApp();
  }

  return (
    <AuthScreen title="Sign in" subtitle="Book direct, and pick up your trip where you left it.">
      <div className="space-y-5">
        <label className="block">
          <DarkLabel>Email</DarkLabel>
          <input className={darkInput} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <DarkLabel>Password</DarkLabel>
          <div className="relative">
            <input className={`${darkInput} pr-16`} type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute right-2 top-0 min-h-12 px-3 text-[15px] font-semibold text-[#7F4F24]" onClick={() => setShow((s) => !s)}>
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <button type="button" className="min-h-11 text-[15px] font-semibold text-[#7F4F24]" onClick={() => go("forgot")}>
          Forgot password?
        </button>
        <DarkButton onClick={() => submit()}>Sign in</DarkButton>
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="space-y-3">
          <DarkButton variant="apple" onClick={() => submit(DEMO.email, DEMO.password)}>
            Continue with Apple
          </DarkButton>
          <DarkButton variant="line" onClick={() => submit(DEMO.email, DEMO.password)}>
            Continue with Google
          </DarkButton>
        </div>
        <button type="button" className="min-h-12 w-full text-[17px] font-semibold text-[#7F4F24]" onClick={() => go("register")}>
          Create an account
        </button>
        <button type="button" className="min-h-11 w-full text-[15px] text-muted-foreground" onClick={() => go("recovery")}>
          Locked out or lost the email?
        </button>
      </div>
    </AuthScreen>
  );
}

function Forgot() {
  const { backGate, go } = useNav();
  const [email, setEmail] = useState("");
  return (
    <AuthScreen title="Reset password" subtitle="Enter the email on your account. We’ll send a 6-digit code." onBack={backGate}>
      <label className="block">
        <DarkLabel>Email</DarkLabel>
        <input className={darkInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <div className="mt-5">
        <DarkButton onClick={() => go("otp")}>Send code</DarkButton>
      </div>
    </AuthScreen>
  );
}

function Otp() {
  const { backGate, go } = useNav();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  function setAt(i: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 1) {
      const next = clean.slice(0, 6).split("");
      const filled = [0, 1, 2, 3, 4, 5].map((n) => next[n] ?? "");
      setDigits(filled);
      refs.current[Math.min(clean.length, 5)]?.focus();
      return;
    }
    const copy = [...digits];
    copy[i] = clean;
    setDigits(copy);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  }

  return (
    <AuthScreen title="Enter the code" subtitle="Check your email for the 6-digit code." onBack={backGate}>
      <div className="flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            aria-label={`Digit ${i + 1}`}
            className="h-14 w-11 rounded-[12px] border border-line bg-card text-center text-[22px] text-foreground"
            value={d}
            onChange={(e) => setAt(i, e.target.value)}
          />
        ))}
      </div>
      <div className="mt-6">
        <DarkButton onClick={() => go("newpass")}>Continue</DarkButton>
      </div>
      <button
        type="button"
        disabled={seconds > 0}
        className="mt-4 min-h-11 text-[15px] font-semibold text-[#7F4F24] disabled:opacity-60"
        onClick={() => setSeconds(30)}
      >
        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
      </button>
    </AuthScreen>
  );
}

function NewPass() {
  const { go, backGate } = useNav();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <AuthScreen title="New password" subtitle="Choose a password for your next sign-in." onBack={backGate}>
      <div className="space-y-4">
        <label className="block">
          <DarkLabel>New password</DarkLabel>
          <input className={darkInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="block">
          <DarkLabel>Confirm password</DarkLabel>
          <input className={darkInput} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <DarkButton onClick={() => go("resetdone")}>Update password</DarkButton>
      </div>
    </AuthScreen>
  );
}

function ResetDone() {
  const { replaceGate } = useNav();
  return (
    <AuthScreen title="Password updated" subtitle="You can sign in with it whenever you’re ready.">
      <DarkButton onClick={() => replaceGate("login")}>Back to sign in</DarkButton>
    </AuthScreen>
  );
}

function Recovery() {
  const { backGate, go } = useNav();
  const { pushToast } = useStore();
  return (
    <AuthScreen
      title="Account help"
      subtitle="If you’re locked out, or the email on the account is one you can’t open, Barb’s team can send a fresh link."
      onBack={backGate}
    >
      <div className="space-y-3">
        <DarkButton onClick={() => pushToast("Email drafted", "Write to 3arb@IvyLaneprop.com from an address you can open.")}>
          Email 3arb@IvyLaneprop.com
        </DarkButton>
        <DarkButton variant="line" onClick={() => pushToast("Call", "(555) 018-1960 · usually within the hour")}>
          Call the host line
        </DarkButton>
        <button type="button" className="min-h-11 w-full text-[17px] font-semibold text-[#7F4F24]" onClick={() => go("forgot")}>
          I still have the email
        </button>
      </div>
    </AuthScreen>
  );
}

export function SignInSheet() {
  const { signInOpen, setSignInOpen, go } = useNav();
  const { login, markOnboarded } = useStore();
  const { enterApp } = useNav();
  return (
    <Sheet open={signInOpen} title="Sign in to continue" onClose={() => setSignInOpen(false)}>
      <p className="mb-4 text-[15px] text-muted-foreground">
        Booking, saving a home, and messages live with your account. You can keep browsing as a guest.
      </p>
      <div className="space-y-3 pb-4">
        <Button
          full
          onClick={() => {
            login(DEMO.email, DEMO.password);
            markOnboarded();
            setSignInOpen(false);
            enterApp();
          }}
        >
          Continue as Elena
        </Button>
        <Button
          full
          variant="secondary"
          onClick={() => {
            setSignInOpen(false);
            go("login");
          }}
        >
          Sign in with email
        </Button>
        <Button
          full
          variant="tertiary"
          onClick={() => {
            setSignInOpen(false);
            go("register");
          }}
        >
          Create an account
        </Button>
      </div>
    </Sheet>
  );
}
