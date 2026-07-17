"use client";

import { useEffect, useRef, useState } from "react";
import {
  Home,
  Timer,
  Music,
  ListTodo,
  Leaf,
  Quote as QuoteIcon,
  Gift,
  Settings,
  GraduationCap,
  ArrowLeft,
  Target,
  CalendarDays,
  BarChart3,
  Maximize2,
  Minimize2,
  type LucideIcon,
} from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";
import { SceneSwitcher } from "@/components/scenes/SceneSwitcher";
import { ClockStylePicker } from "@/components/clock/ClockStylePicker";
import { SoundsMixer } from "@/components/sounds/SoundsMixer";
import { SoundEngine } from "@/components/sounds/SoundEngine";
import { TasksPanel } from "@/components/tasks/TasksPanel";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { QuotesPanel } from "@/components/quotes/QuotesPanel";
import { RewardsPanel } from "@/components/rewards/RewardsPanel";

const MAG = 6; // magnetic pull cap (px)

function DockIcon({
  icon: Icon,
  label,
  active,
  onClick,
  btnRef,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  btnRef?: React.Ref<HTMLButtonElement>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  return (
    <motion.button
      ref={btnRef}
      type="button"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      transition={spring}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        x.set(Math.max(-MAG, Math.min(MAG, dx * 0.4)));
        y.set(Math.max(-MAG, Math.min(MAG, dy * 0.4)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        // Compact on phones so all icons fit on-screen; full size from sm: up.
        "relative grid h-9 w-9 shrink-0 place-items-center rounded-[12px] transition-colors sm:h-11 sm:w-11 sm:rounded-[14px]",
        active ? "text-white" : "text-white/70 hover:text-white"
      )}
    >
      {/* Shared sliding indicator — animates its position between icons. */}
      {active && (
        <motion.span
          layoutId="dock-active-pill"
          className="dock-active absolute inset-0 rounded-[12px] sm:rounded-[14px]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon strokeWidth={1.75} className="relative z-10 size-[17px] sm:size-5" />
    </motion.button>
  );
}

export function Dock() {
  const mode = useUIStore((s) => s.mode);
  const setMode = useUIStore((s) => s.setMode);
  const clockPickerOpen = useUIStore((s) => s.clockPickerOpen);
  const setClockPickerOpen = useUIStore((s) => s.setClockPickerOpen);
  const aspirantPanel = useUIStore((s) => s.aspirantPanel);
  const setAspirantPanel = useUIStore((s) => s.setAspirantPanel);
  const [scenesOpen, setScenesOpen] = useState(false);
  const [soundsOpen, setSoundsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quotesOpen, setQuotesOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const scenesRef = useRef<HTMLButtonElement>(null);

  // Only one popover open at a time.
  const closePopovers = () => {
    setScenesOpen(false);
    setSoundsOpen(false);
    setNotesOpen(false);
    setSettingsOpen(false);
    setQuotesOpen(false);
    setRewardsOpen(false);
  };

  useEffect(() => {
    const on = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  const toggleFs = () =>
    document.fullscreenElement
      ? void document.exitFullscreen()
      : void document.documentElement.requestFullscreen?.();

  // The sliding pill highlights the open popover, else the current mode.
  const activeKey = scenesOpen
    ? "scenes"
    : soundsOpen
      ? "sounds"
      : notesOpen
        ? "tasks"
        : settingsOpen
          ? "settings"
          : quotesOpen
            ? "quotes"
            : rewardsOpen
              ? "rewards"
              : mode;
  const goMode = (m: "home" | "focus" | "aspirant") => {
    closePopovers();
    setMode(m);
  };
  const aspirant = mode === "aspirant";

  return (
    <>
      {/* Headless: keeps soundscapes playing regardless of panel state. */}
      <SoundEngine />

      <SceneSwitcher
        open={scenesOpen}
        onClose={() => setScenesOpen(false)}
        anchorRef={scenesRef}
      />
      <ClockStylePicker
        open={clockPickerOpen}
        onClose={() => setClockPickerOpen(false)}
      />
      <SoundsMixer open={soundsOpen} onClose={() => setSoundsOpen(false)} />
      <TasksPanel open={notesOpen} onClose={() => setNotesOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <QuotesPanel open={quotesOpen} onClose={() => setQuotesOpen(false)} />
      <RewardsPanel open={rewardsOpen} onClose={() => setRewardsOpen(false)} />

      <div className="fixed bottom-4 left-1/2 z-20 w-max max-w-[calc(100vw-16px)] -translate-x-1/2 sm:bottom-6">
        <motion.nav
          aria-label="Primary"
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.2 }}
          // ponytail: glass lives on this non-scrolling shell so the blur +
          // border span the full pill; the inner div scrolls (its abs-pos
          // ::before would otherwise scroll away with the content).
          className="glass overflow-hidden"
          style={{ borderRadius: 9999, boxShadow: "var(--shadow-dock)" }}
        >
          <div className="flex items-center gap-0.5 overflow-x-auto px-1.5 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 sm:px-2 sm:py-2 [&::-webkit-scrollbar]:hidden">
          {aspirant ? (
            // Aspirant Mode gets its own dock — every feature its own icon.
            <>
              <DockIcon
                icon={ArrowLeft}
                label="Back to Home"
                onClick={() => goMode("home")}
              />
              <span className="mx-0.5 h-6 w-px shrink-0 bg-white/10 sm:mx-1" aria-hidden />
              <DockIcon
                icon={Timer}
                label="Timer"
                active={!scenesOpen && !soundsOpen && aspirantPanel === "timer"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setAspirantPanel("timer");
                }}
              />
              <DockIcon
                icon={Target}
                label="Goals"
                active={!scenesOpen && !soundsOpen && aspirantPanel === "goals"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setAspirantPanel("goals");
                }}
              />
              <DockIcon
                icon={CalendarDays}
                label="Calendar"
                active={!scenesOpen && !soundsOpen && aspirantPanel === "calendar"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setAspirantPanel("calendar");
                }}
              />
              <DockIcon
                icon={BarChart3}
                label="Statistics"
                active={!scenesOpen && !soundsOpen && aspirantPanel === "stats"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setAspirantPanel("stats");
                }}
              />
              <span className="mx-0.5 h-6 w-px shrink-0 bg-white/10 sm:mx-1" aria-hidden />
              <DockIcon
                icon={Music}
                label="Sounds"
                active={activeKey === "sounds"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen((v) => !v);
                }}
              />
              <DockIcon
                icon={Leaf}
                label="Scenes"
                active={activeKey === "scenes"}
                onClick={() => setScenesOpen((v) => !v)}
                btnRef={scenesRef}
              />
              <DockIcon
                icon={isFs ? Minimize2 : Maximize2}
                label={isFs ? "Exit fullscreen" : "Fullscreen"}
                onClick={toggleFs}
              />
            </>
          ) : (
            <>
              <DockIcon
                icon={Home}
                label="Home"
                active={activeKey === "home"}
                onClick={() => goMode("home")}
              />
              <DockIcon
                icon={Timer}
                label="Focus"
                active={activeKey === "focus"}
                onClick={() => goMode("focus")}
              />
              <DockIcon
                icon={GraduationCap}
                label="Aspirant Mode"
                active={activeKey === "aspirant"}
                onClick={() => goMode("aspirant")}
              />
              <DockIcon
                icon={Music}
                label="Sounds"
                active={activeKey === "sounds"}
                onClick={() => {
                  setScenesOpen(false);
                  setNotesOpen(false);
                  setSoundsOpen((v) => !v);
                }}
              />
              <DockIcon
                icon={ListTodo}
                label="Tasks"
                active={activeKey === "tasks"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setNotesOpen((v) => !v);
                }}
              />
              <span className="mx-0.5 h-6 w-px shrink-0 bg-white/10 sm:mx-1" aria-hidden />
              <DockIcon
                icon={Leaf}
                label="Scenes"
                active={activeKey === "scenes"}
                onClick={() => {
                  setSoundsOpen(false);
                  setNotesOpen(false);
                  setScenesOpen((v) => !v);
                }}
                btnRef={scenesRef}
              />
              <DockIcon
                icon={QuoteIcon}
                label="Quotes"
                active={activeKey === "quotes"}
                onClick={() => {
                  const willOpen = !quotesOpen;
                  closePopovers();
                  setQuotesOpen(willOpen);
                }}
              />
              <DockIcon
                icon={Gift}
                label="Rewards"
                active={activeKey === "rewards"}
                onClick={() => {
                  const willOpen = !rewardsOpen;
                  closePopovers();
                  setRewardsOpen(willOpen);
                }}
              />
              <DockIcon
                icon={Settings}
                label="Settings"
                active={activeKey === "settings"}
                onClick={() => {
                  setScenesOpen(false);
                  setSoundsOpen(false);
                  setNotesOpen(false);
                  setSettingsOpen((v) => !v);
                }}
              />
              <span className="mx-0.5 h-6 w-px shrink-0 bg-white/10 sm:mx-1" aria-hidden />
              <DockIcon
                icon={isFs ? Minimize2 : Maximize2}
                label={isFs ? "Exit fullscreen" : "Fullscreen"}
                onClick={toggleFs}
              />
            </>
          )}
          </div>
        </motion.nav>
      </div>
    </>
  );
}
