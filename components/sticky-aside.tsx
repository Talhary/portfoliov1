"use client";

import React, { useEffect, useRef, ReactNode } from "react";

export const StickyAside = ({ children }: { children: ReactNode }) => {
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = asideRef.current;
    if (!sidebar) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = sidebar;
      const isScrollable = scrollHeight > clientHeight;

      if (!isScrollable) {
        // If sidebar is not scrollable, let it bubble to the window (scrolls the main page)
        return;
      }

      const isAtTop = e.deltaY < 0 && scrollTop <= 0;
      const isAtBottom = e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 1;

      if (!isAtTop && !isAtBottom) {
        // We are scrolling inside the sidebar. Stop the scroll event from bubbling to the window
        // so that the main page does not scroll simultaneously.
        e.stopPropagation();
      }
      // If we are at the boundaries (top/bottom), we do NOT stop propagation,
      // letting the wheel event bubble up to the window to scroll the main page.
    };

    sidebar.addEventListener("wheel", handleWheel, { capture: false, passive: true });
    return () => {
      sidebar.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <aside 
      ref={asideRef}
      data-lenis-prevent
      className="py-10 z-10 bg-zinc-50 dark:bg-big-card text-zinc-900 dark:text-white border border-zinc-200 dark:border-none shadow-sm dark:shadow-black w-full md:w-[20rem] md:min-w-[20rem] md:max-w-[20rem] max-md:max-w-full rounded-xl mr-0 p-5 h-auto max-md:p-0 max-md:m-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto custom-scrollbar sidebar-container"
    >
      {children}
    </aside>
  );
};
