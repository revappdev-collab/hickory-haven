import { ChevronLeft, Compass, Home, Luggage, MessageCircle, CircleUser, Star, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { photo } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { useNav } from "./nav";

export function buzz() {
  navigator.vibrate?.(8);
}

export function Photo({
  name,
  alt,
  className,
}: {
  name: string;
  alt: string;
  className?: string;
}) {
  const src = photo(name);
  const [on, setOn] = useState(false);
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("bg-gradient-to-br from-[#C2C5AA] via-[#A68A64] to-[#7F4F24]", className)}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setOn(true)}
      className={cn("object-cover transition-opacity duration-300", on ? "opacity-100" : "opacity-0", className)}
    />
  );
}

export function Logo({ className, blend = true }: { className?: string; blend?: boolean }) {
  const src = photo("brand-logo");
  if (!src) {
    return <p className={cn("font-serif text-[28px] text-brown", className)}>Hickory & Haven</p>;
  }
  return (
    <img
      src={src}
      alt="Hickory & Haven"
      className={cn(blend && "mix-blend-multiply", className)}
    />
  );
}

export function OliveBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 36" className={className} aria-hidden="true">
      <path
        className="hh-leaf"
        d="M8 28 C 30 26, 48 18, 70 16 C 86 14, 100 10, 112 6"
        fill="none"
        stroke="#656D4A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [28, 22, -30],
        [42, 18, -10],
        [56, 16, 8],
        [70, 14, -24],
        [84, 12, 6],
        [96, 9, -18],
      ].map(([x, y, rot], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="7"
          ry="3.2"
          transform={`rotate(${rot} ${x} ${y})`}
          fill="none"
          stroke="#656D4A"
          strokeWidth="1.2"
          className="hh-leaf"
        />
      ))}
    </svg>
  );
}

export function Screen({
  title,
  large,
  onBack,
  right,
  footer,
  children,
  onRefresh,
  bleed,
}: {
  title?: string;
  large?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  onRefresh?: () => void;
  bleed?: boolean;
}) {
  const { stack, goHome } = useNav();
  const scroller = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [pull, setPull] = useState(0);
  const trapped = stack.length > 0 && !onBack;

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <header className="hh-bar z-30 shrink-0 px-2 pb-3.5 pt-[max(12px,env(safe-area-inset-top))] text-[#F6F1E7] shadow-[inset_0_-1px_0_rgba(246,241,231,0.14)]">
        <div className="relative flex h-11 items-center">
          <div className="z-10 flex h-11 min-w-11 items-center">
            {onBack ? (
              <button
                type="button"
                aria-label="Back"
                onClick={onBack}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#F6F1E7] active:bg-white/10"
              >
                <ChevronLeft size={26} strokeWidth={2.25} />
              </button>
            ) : trapped ? (
              <button
                type="button"
                onClick={goHome}
                className="flex h-11 items-center gap-1 rounded-full px-2 text-[15px] font-semibold text-[#F6F1E7] active:bg-white/10"
              >
                <Home size={18} />
                Home
              </button>
            ) : null}
          </div>
          {title && (!large || scrolled) ? (
            <h1 className={cn("pointer-events-none absolute truncate text-center text-[17px] font-semibold tracking-[-0.01em] text-[#F6F1E7]", trapped ? "inset-x-24" : "inset-x-16")}>
              {title}
            </h1>
          ) : null}
          <div className="z-10 ml-auto flex h-11 min-w-11 items-center justify-end pr-1">{right}</div>
        </div>
      </header>
      <div
        ref={scroller}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
        onScroll={(e) => {
          const y = e.currentTarget.scrollTop;
          setScrolled((on) => (on ? y > 24 : y > 48));
        }}
        onPointerDown={(e) => {
          if (!onRefresh) return;
          if ((scroller.current?.scrollTop ?? 1) <= 0) startY.current = e.clientY;
        }}
        onPointerMove={(e) => {
          if (startY.current == null) return;
          setPull(Math.max(0, Math.min(80, e.clientY - startY.current)));
        }}
        onPointerUp={() => {
          if (pull > 58) onRefresh?.();
          startY.current = null;
          setPull(0);
        }}
      >
        {large && title ? (
          <h1 className="px-5 pb-3 pt-5 font-serif text-[34px] leading-[1.15] tracking-[-0.02em] text-foreground">
            {title}
          </h1>
        ) : null}
        {pull > 10 ? (
          <p className="pb-2 text-center text-[13px] text-foreground">
            {pull > 58 ? "Release to refresh" : "Pull to refresh"}
          </p>
        ) : null}
        <div className={cn(!bleed && "px-5", !large && !bleed && "pt-5", "pb-6")}>{children}</div>
      </div>
      {footer}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  full,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "apple" | "google";
  full?: boolean;
}) {
  const styles: Record<string, string> = {
    primary: "bg-brown text-[#F6F1E7]",
    secondary: "btn-secondary border-[1.5px] border-tan bg-transparent text-brown",
    tertiary: "btn-tertiary bg-transparent text-[#7F4F24]",
    danger: "bg-[#8C3A36] text-[#FBF8F2]",
    apple: "bg-black text-white",
    google: "border border-line bg-card text-foreground",
  };
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        buzz();
        props.onClick?.(e);
      }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 text-[17px] font-semibold transition-transform duration-200 active:scale-[0.98] disabled:opacity-45",
        styles[variant],
        full && "w-full",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[20px] bg-card shadow-[0_8px_24px_rgba(88,47,14,0.08)]", className)}>
      {children}
    </div>
  );
}

export function Chip({
  children,
  on,
  onClick,
}: {
  children: ReactNode;
  on?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full px-3.5 text-[15px] font-medium",
        on ? "bg-brown text-[#F6F1E7]" : "bg-chip text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (id: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="flex rounded-[10px] bg-muted p-[3px]" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "min-h-9 flex-1 rounded-[8px] px-2 text-[13px] font-semibold",
            value === o.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  on,
  label,
  onChange,
}: {
  on: boolean;
  label: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex h-8 w-[52px] shrink-0 items-center overflow-hidden rounded-full p-1 transition-colors",
        on ? "bg-[#656D4A]" : "bg-[#8A9178]",
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(28,36,24,0.35)] transition-transform duration-200",
          on ? "translate-x-[20px]" : "translate-x-0",
        )}
      />
    </button>
  );
}

export function Stepper({
  value,
  min = 0,
  max = 12,
  label,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  label: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-tan text-[22px] text-brown disabled:opacity-35"
      >
        −
      </button>
      <span className="w-6 text-center text-[17px] tabular-nums">{value}</span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-tan text-[22px] text-brown disabled:opacity-35"
      >
        +
      </button>
    </div>
  );
}

export const fieldClass =
  "h-12 w-full rounded-[12px] border border-line bg-card px-3 text-[17px] text-foreground outline-none placeholder:text-muted-foreground";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-foreground">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-[13px] text-[#8C3A36]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-[13px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function Sheet({
  open,
  title,
  onClose,
  children,
  tall,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  tall?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button type="button" aria-label="Dismiss" className="absolute inset-0 bg-forest/40" onClick={onClose} />
      <div
        role="dialog"
        aria-label={title}
        className={cn(
          "hh-sheet relative flex max-h-[92%] flex-col rounded-t-[20px] bg-card text-foreground shadow-2xl",
          tall ? "h-[88%]" : "max-h-[78%]",
        )}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-line" />
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="font-serif text-[22px] text-foreground">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="flex h-11 w-11 items-center justify-center text-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Alert({
  open,
  title,
  body,
  confirm,
  cancel,
  danger,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  confirm: string;
  cancel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center px-8">
      <button type="button" aria-label="Dismiss alert" className="absolute inset-0 bg-forest/45" onClick={onClose} />
      <div role="alertdialog" aria-label={title} className="hh-fade relative w-full max-w-[300px] overflow-hidden rounded-[16px] bg-card text-center">
        <div className="px-4 pb-4 pt-5">
          <h2 className="text-[17px] font-semibold">{title}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <div className="grid border-t border-line" style={{ gridTemplateColumns: cancel ? "1fr 1fr" : "1fr" }}>
          {cancel ? (
            <button type="button" className="min-h-11 border-r border-line text-[17px] text-brown" onClick={onClose}>
              {cancel}
            </button>
          ) : null}
          <button
            type="button"
            className={cn("min-h-11 text-[17px] font-semibold", danger ? "text-[#8C3A36]" : "text-brown")}
            onClick={onConfirm}
          >
            {confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Empty({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="px-2 py-10 text-center">
      <OliveBranch className="mx-auto mb-3 h-9 w-28" />
      <h2 className="font-serif text-[22px]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      {action && onAction ? (
        <div className="mt-5">
          <Button onClick={onAction}>{action}</Button>
        </div>
      ) : null}
    </div>
  );
}

export function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[16px] bg-chip", className)} />;
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-[#A68A64] text-[#A68A64]" : "text-line"}
        />
      ))}
    </span>
  );
}

export function Row({
  title,
  detail,
  trailing,
  onClick,
  icon,
}: {
  title: string;
  detail?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="flex min-h-14 w-full items-center gap-3 border-b border-line px-4 py-3.5 text-left last:border-0"
    >
      {icon ? <span className="text-foreground">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium text-foreground">{title}</span>
        {detail ? <span className="block text-[14px] text-foreground">{detail}</span> : null}
      </span>
      {trailing}
    </Comp>
  );
}

export function Group({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      {title ? <h2 className="mb-2.5 px-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-foreground">{title}</h2> : null}
      <div className="overflow-hidden rounded-[16px] bg-card">{children}</div>
      {footer ? <p className="mt-2 px-1 text-[13px] leading-relaxed text-muted-foreground">{footer}</p> : null}
    </section>
  );
}

export function TabBar({
  tab,
  badges,
  onChange,
}: {
  tab: string;
  badges: Record<string, number>;
  onChange: (id: string) => void;
}) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "trips", label: "Trips", icon: Luggage },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: CircleUser },
  ];
  return (
    <nav aria-label="Main" className="hh-tab pb-[max(8px,env(safe-area-inset-bottom))] text-[#F6F1E7]">
      <div className="grid h-16 grid-cols-5">
        {items.map((item) => {
          const on = tab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={on ? "page" : undefined}
              onClick={() => onChange(item.id)}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", on && "bg-[#F6F1E7]/16")}>
                <Icon size={22} strokeWidth={on ? 2.4 : 1.8} className={on ? "text-[#F6F1E7]" : "text-[#C2C5AA]"} />
              </span>
              <span className={cn("text-[length:calc(13px*var(--type))] leading-none", on ? "font-semibold text-[#F6F1E7]" : "font-medium text-[#C2C5AA]")}>
                {item.label}
              </span>
              {badges[item.id] ? (
                <span className="absolute right-[18%] top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#F6F1E7] px-1 text-[10px] font-semibold leading-none text-[#333D29]">
                  {badges[item.id]}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function Toasts({
  items,
  onDismiss,
}: {
  items: { id: number; title: string; body?: string }[];
  onDismiss: (id: number) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="pointer-events-none absolute inset-x-4 top-[max(12px,env(safe-area-inset-top))] z-50 flex flex-col gap-2">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onDismiss(t.id)}
          className="pointer-events-auto rounded-[14px] bg-forest px-4 py-3 text-left text-[#F6F1E7] shadow-lg"
        >
          <span className="block text-[15px] font-semibold">{t.title}</span>
          {t.body ? <span className="mt-0.5 block text-[13px] text-[#C2C5AA]">{t.body}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function OfflineBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="bg-[#414833] px-5 py-2 text-center text-[13px] text-[#F6F1E7]">
      You’re offline. Saved details are still here. Availability refreshes when you’re back.
    </div>
  );
}

export function Section({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-end justify-between gap-3">
        <h2 className="font-serif text-[22px] leading-none">{title}</h2>
        {action ? (
          <button type="button" onClick={onAction} className="text-[15px] font-semibold text-[#7F4F24]">
            {action}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
