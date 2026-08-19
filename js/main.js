// ============================================================
// Portfolio scaffold — interactions
// ============================================================
(function () {
  "use strict";

  // ---- Language toggle ----
  var langToggle = document.getElementById("langToggle");
  var body = document.body;
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var isZh = body.classList.contains("lang-zh");
      body.classList.toggle("lang-zh", !isZh);
      body.classList.toggle("lang-en", isZh);
      langToggle.textContent = isZh ? "中" : "EN";
    });
  }

  // ---- Mobile menu ----
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("open");
    });
  }

  // ---- Nav shadow on scroll ----
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Scroll reveal ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Lightbox (project photos + gallery placeholders) ----
  var lightbox = document.getElementById("lightbox");
  var lightboxStage = document.getElementById("lightboxStage");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var lastFocus = null;

  function openLightbox(opts) {
    if (!lightbox || !opts) return;
    lastFocus = document.activeElement;
    lightbox.classList.remove("has-img", "has-stage");
    if (opts.src) {
      lightboxImg.src = opts.src;
      lightboxImg.alt = opts.label || "";
      lightbox.classList.add("has-img");
    } else if (opts.gradient) {
      lightboxStage.style.backgroundImage = opts.gradient;
      lightbox.classList.add("has-stage");
    }
    lightboxCaption.textContent = opts.label || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open", "has-img", "has-stage");
    lightboxImg.src = "";
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  // 项目页真实图片：点击放大，自动取 figure 的 figcaption 作为图注
  document.querySelectorAll(".proj-img img, .media-grid img, .client-logo img, .duo img, .chatbot-showcase__img img, .report-duo img, .hifi-gallery__item img, .research-card__media img, .journey-scenario-card__media img, .artifact-card__media img").forEach(function (img) {
    img.addEventListener("click", function () {
      var fig = img.closest("figure");
      var label = "";
      if (fig) {
        var cap = fig.querySelector("figcaption");
        if (cap) label = cap.textContent.trim();
      }
      openLightbox({ src: img.currentSrc || img.src, label: label });
    });
  });

  // 首页摄影作品：有真实图片则放大图片，否则沿用渐变占位
  document.querySelectorAll(".gallery__item").forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      if (img) {
        openLightbox({ src: img.currentSrc || img.src, label: item.getAttribute("data-label") || img.alt || "" });
        return;
      }
      var ph = item.querySelector(".ph");
      var gradient = ph ? getComputedStyle(ph).backgroundImage : "";
      openLightbox({ gradient: gradient, label: item.getAttribute("data-label") || "" });
    });
  });

  // 摄影分类筛选
  document.querySelectorAll(".gallery-filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      document.querySelectorAll(".gallery-filter").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      document.querySelectorAll(".gallery__item").forEach(function (item) {
        var cat = item.getAttribute("data-cat");
        if (filter === "all" || cat === filter) {
          item.classList.remove("is-hidden");
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("open")) closeLightbox();
  });
})();
