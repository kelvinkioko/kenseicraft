(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  root.classList.add("motion-ready");

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const nav = document.querySelector(".site-nav, .nav, .app-nav, .fh5co-nav");
  const revealSelector = [
    "main > section",
    ".craft-card",
    ".portfolio-row",
    ".support-card",
    ".principle-summary > div",
    ".policy-copy > section",
    ".detail-list > div",
    ".shot",
    ".step",
    ".feat",
    ".guide-card",
    "details.qa",
    ".article-head",
    ".article-body > *",
    ".app-inline",
    ".callout",
    ".app-hero",
    ".app-benefit",
    ".app-tour",
    ".app-guide-card",
    ".app-faq-list details",
    ".app-cta",
    "#fh5co-wireframe .fh5co-heading",
    "#fh5co-wireframe .row:nth-child(2) > div"
  ].join(",");

  const revealItems = [...document.querySelectorAll(revealSelector)];
  revealItems.forEach((item, index) => {
    item.classList.add("motion-reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    item.addEventListener("transitionend", function markSettled(event) {
      if (event.propertyName !== "transform") return;
      item.classList.add("is-settled");
      item.removeEventListener("transitionend", markSettled);
    });
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible", "is-settled"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const tiltItems = finePointer && !reducedMotion
    ? [...document.querySelectorAll([
        ".showcase-main",
        ".signal-card",
        ".craft-card",
        ".support-card",
        ".closing-card",
        ".curio-visual",
        ".phone-stack",
        ".step",
        ".feat",
        ".guide-card",
        ".app-inline",
        ".app-hero-visual",
        ".app-benefit",
        ".app-guide-card",
        "#fh5co-wireframe .row:nth-child(2) > div"
      ].join(","))]
    : [];

  tiltItems.forEach((item) => {
    item.classList.add("tilt-surface");
    let frame = 0;

    item.addEventListener("pointermove", (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        item.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
        item.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
        item.style.setProperty("--light-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        item.style.setProperty("--light-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    });

    item.addEventListener("pointerleave", () => {
      if (frame) cancelAnimationFrame(frame);
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
      item.style.setProperty("--light-x", "50%");
      item.style.setProperty("--light-y", "50%");
    });
  });

  const parallaxItems = reducedMotion
    ? []
    : [...document.querySelectorAll(".showcase-phone, .curio-visual img, .phone-stack img, .shot img, .app-inline img, .app-device img, .app-gallery img")];

  const visibleParallaxItems = new Set();
  if (parallaxItems.length && "IntersectionObserver" in window) {
    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleParallaxItems.add(entry.target);
        else visibleParallaxItems.delete(entry.target);
      });
      requestScrollUpdate();
    }, { rootMargin: "120px 0px" });

    parallaxItems.forEach((item) => parallaxObserver.observe(item));
  } else {
    parallaxItems.forEach((item) => visibleParallaxItems.add(item));
  }

  let ticking = false;
  const updateScrollEffects = () => {
    const scrollTop = window.scrollY || root.scrollTop;
    const scrollRange = Math.max(root.scrollHeight - window.innerHeight, 1);
    const viewportHeight = window.innerHeight;
    const parallaxUpdates = [];

    visibleParallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewportHeight + 100) return;
      const center = rect.top + rect.height / 2;
      const distance = (center - viewportHeight / 2) / viewportHeight;
      const shift = Math.max(-18, Math.min(18, distance * -24));
      parallaxUpdates.push([item, `${shift.toFixed(1)}px`]);
    });

    root.style.setProperty("--scroll-progress", Math.min(scrollTop / scrollRange, 1));
    nav?.classList.toggle("is-scrolled", scrollTop > 18);
    parallaxUpdates.forEach(([item, shift]) => item.style.setProperty("--parallax-y", shift));

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollEffects);
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  requestAnimationFrame(requestScrollUpdate);
})();
