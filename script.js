// =======================================================
// SCROLL RESTORATION
// =======================================================

// 새로고침 시 브라우저가 이전 스크롤 위치를 복원하면 인트로가 끝난 뒤
// 그래픽 섹션 등으로 화면이 갑자기 튀어 보이는 문제가 있어 항상 맨 위에서 시작하도록 고정
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

// =======================================================
// GSAP
// =======================================================

gsap.registerPlugin(ScrollTrigger);

// =======================================================
// SVG GRID GENERATE
// =======================================================

const svg = document.querySelector(".grid");
const hGroup = document.querySelector(".grid-horizontal");
const vGroup = document.querySelector(".grid-vertical");

const width = window.innerWidth;
const height = window.innerHeight;
const gap = 140;

svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

for (let y = 0; y <= height; y += gap) {

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);

    line.setAttribute("x2", width);
    line.setAttribute("y2", y);

    line.setAttribute("stroke-dasharray", width);
    line.setAttribute("stroke-dashoffset", width);

    hGroup.appendChild(line);

}

for (let x = 0; x <= width; x += gap) {

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);

    line.setAttribute("x2", x);
    line.setAttribute("y2", height);

    line.setAttribute("stroke-dasharray", height);
    line.setAttribute("stroke-dashoffset", height);

    vGroup.appendChild(line);

}



// =======================================================
// INTRO
// =======================================================

const introEl = document.querySelector(".intro");
const nav = document.querySelector(".nav");

document.body.classList.add("intro-lock");

const tl = gsap.timeline();

tl

.to(".grid", {

    opacity: 1,

    duration: .4

})

.to(".grid line", {

    strokeDashoffset: 0,

    stagger: .02,

    duration: .8,

    ease: "power2.out"

}, "-=.2")

.to(".frame", {

    opacity: 1,

    duration: .5

}, "-=.4")

.to(".scroll", {

    opacity: 1,

    duration: .5

}, "-=.4")

.fromTo(".title h1",

{
    opacity:0,
    y:40,
    scale:.96
},

{
    opacity:1,
    y:0,
    scale:1,
    stagger:.15,
    duration:1,
    ease:"power4.out"
})

// 잠시 타이틀을 보여준 뒤 인트로 종료 시퀀스로 전환
.to({}, { duration: .4 })

.to(".title h1:nth-child(1)", {
    x: -250,
    opacity: 0,
    duration: .45,
    ease: "power2.inOut"
}, "exit")

.to(".title h1:nth-child(2)", {
    x: 250,
    opacity: 0,
    duration: .45,
    ease: "power2.inOut"
}, "exit")

.to(".title h1:nth-child(3)", {
    y: -220,
    opacity: 0,
    duration: .45,
    ease: "power2.inOut"
}, "exit")

.to(".frame", {
    opacity: 0,
    duration: .35
}, "exit")

.to(".scroll", {
    opacity: 0,
    duration: .35
}, "exit")

.to(".grid", {
    opacity: 0,
    scale: 1.15,
    duration: .45
}, "exit")

.to(".intro", {

    opacity: 0,

    duration: .5,

    ease: "power2.out",

    onComplete: () => {

        introEl.style.display = "none";

        document.body.classList.remove("intro-lock");

        nav.classList.add("is-visible");

        gsap.to(".profile", {

            opacity: 1,

            y: 0,

            duration: 1.1,

            ease: "power3.out"

        });

        ScrollTrigger.refresh();

    }

}, "exit+=.1")



// =======================================================
// MOUSE
// =======================================================

introEl.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - .5) * 30;
    const y = (e.clientY / window.innerHeight - .5) * 30;

    gsap.to(".title", {

        x,

        y,

        duration: 1,

        ease: "power3.out"

    });

    gsap.to(".grid", {

        x: x * .2,

        y: y * .2,

        duration: 1.4,

        ease: "power3.out"

    });

});



// =======================================================
// SCROLL LINE
// =======================================================

gsap.to(".scroll-line", {

    y: 18,

    repeat: -1,

    yoyo: true,

    duration: 1,

    ease: "power1.inOut"

});



// =======================================================
// NAV — intro 종료 시 tl의 onComplete에서 is-visible 처리
// =======================================================

// 메뉴 클릭 시 부드럽게 스크롤 (html scroll-behavior:smooth 사용)
document.querySelectorAll(".nav-menu a, .nav-logo").forEach(link => {

    link.addEventListener("click", (e) => {

        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) return;

        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({ behavior: "smooth" });

    });

});

// 현재 섹션에 따라 메뉴 active 표시
const navLinks = document.querySelectorAll("[data-nav-link]");

const navSections = ["graphic", "uxui", "publishing"];

navSections.forEach(id => {

    const section = document.getElementById(id);

    if (!section) return;

    ScrollTrigger.create({

        trigger: section,

        start: "top 55%",

        end: "bottom 55%",

        onEnter: () => setActiveNav(id),

        onEnterBack: () => setActiveNav(id)

    });

});

// profile 섹션(About 페이지 레이아웃)을 보고 있을 때도 ABOUT 메뉴를 활성화
const profileSection = document.getElementById("profile");

if (profileSection){

    ScrollTrigger.create({

        trigger: profileSection,

        start: "top 55%",

        end: "bottom 55%",

        onEnter: () => setActiveNav("profile"),

        onEnterBack: () => setActiveNav("profile")

    });

}

function setActiveNav(id) {

    navLinks.forEach(link => {

        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);

    });

}



// =======================================================
// SECTION REVEALS
// =======================================================

gsap.utils.toArray(".graphic, .uxui").forEach(section => {

    gsap.from(section, {

        y: 60,

        opacity: 0,

        duration: 1,

        ease: "power3.out",

        immediateRender: false,

        scrollTrigger: {

            trigger: section,

            start: "top 85%"

        }

    });

});



// =======================================================
// GRAPHIC TABS (Academy / Career)
// =======================================================

const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        if (btn.classList.contains("active")) return;

        tabBtns.forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });

        tabPanels.forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const target = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);

        if (target) target.classList.add("active");

        // 패널 높이가 바뀌므로 아래쪽 ScrollTrigger 위치를 다시 계산
        ScrollTrigger.refresh();

    });

});



// =======================================================
// HOVER — 프로젝트 이미지 확대
// =======================================================

document.querySelectorAll(".project, .pub-item").forEach(card => {

    const media = card.querySelector("img, .project-placeholder, .pub-cover");

    if (!media) return;

    card.addEventListener("mouseenter", () => {

        gsap.to(media, {

            scale: 1.04,

            duration: .5,

            ease: "power3.out"

        });

    });

    card.addEventListener("mouseleave", () => {

        gsap.to(media, {

            scale: 1,

            duration: .5,

            ease: "power3.out"

        });

    });

});



// =======================================================
// GRAPHIC DETAIL MODAL
// =======================================================

const detailData = [
    { title: "AI 광고 포스터", image: "image/vAIposter.jpg" },
    { title: "멀티 사이즈 배너", image: "image/vbanner.jpg" },
    { title: "이벤트 페이지", image: "image/vevent.jpg" },
    { title: "SHJ 이니셜 로고", image: "image/vlogo.jpg" },
    { title: "팝업창 디자인", image: "image/vpopup.jpg" },
    { title: "유튜브 썸네일", image: "image/vyoutube.jpg" }
];

const detailModal = document.getElementById("detailModal");

if (detailModal) {

    const detailScroll = detailModal.querySelector(".detail-modal-scroll");
    const detailFrame = detailModal.querySelector(".detail-modal-frame");
    const detailImage = detailModal.querySelector("[data-detail-image]");
    const detailCurrent = detailModal.querySelector("[data-detail-current]");

    detailModal.querySelector("[data-detail-total]").textContent = detailData.length;

    let currentDetailIndex = 0;

    function renderDetail(index) {

        const data = detailData[index];

        currentDetailIndex = index;

        detailFrame.classList.remove("is-missing");

        detailImage.src = data.image;
        detailImage.alt = data.title;

        detailCurrent.textContent = index + 1;

        detailScroll.scrollTop = 0;

    }

    detailImage.addEventListener("error", () => {
        detailFrame.classList.add("is-missing");
    });

    function openDetailModal(index) {

        renderDetail(index);

        detailModal.classList.add("is-open");
        detailModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("detail-modal-open");
        document.documentElement.classList.add("detail-modal-open");

    }

    function closeDetailModal() {

        detailModal.classList.remove("is-open");
        detailModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("detail-modal-open");
        document.documentElement.classList.remove("detail-modal-open");

    }

    function stepDetail(step) {

        const next = (currentDetailIndex + step + detailData.length) % detailData.length;

        renderDetail(next);

    }

    document.querySelectorAll("[data-detail-index]").forEach(btn => {

        btn.addEventListener("click", e => {

            e.preventDefault();

            openDetailModal(parseInt(btn.dataset.detailIndex, 10));

        });

    });

    detailModal.querySelectorAll("[data-detail-close]").forEach(el => {

        el.addEventListener("click", closeDetailModal);

    });

    detailModal.querySelector("[data-detail-prev]").addEventListener("click", () => stepDetail(-1));
    detailModal.querySelector("[data-detail-next]").addEventListener("click", () => stepDetail(1));

    document.addEventListener("keydown", e => {

        if (!detailModal.classList.contains("is-open")) return;

        if (e.key === "Escape") closeDetailModal();
        if (e.key === "ArrowLeft") stepDetail(-1);
        if (e.key === "ArrowRight") stepDetail(1);

    });

}



// =======================================================
// UXUI SLIDER
// =======================================================

const uxuiSlides = [
    {
        bg: "image/uxuxi_bg01.jpg",
        device: "image/ground.png",
        deviceType: "single",
        deviceOffset: { y: 15 },
        accent: "#E76F2F",
        badge: null,
        eyebrow: "01. Mobile App UI Design",
        title: ["그라운드시소", "모바일 앱 디자인"],
        work: "100% Personal Project",
        time: "10 Days",
        tool: "Figma",
        tags: ["Planning", "Figma", "Prototype"],
        tagLinks: { "Figma": "https://www.figma.com/design/Qjwg86P25ORjYAzQLY2Oym/Mobile-App-UI-Design-%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EC%8B%9C%EC%86%8C-?node-id=0-1&m=dev&t=IT0JTYndWE1B9VHU-1", "Prototype": "https://www.figma.com/proto/Qjwg86P25ORjYAzQLY2Oym/3.Mobile-App-UI-Design-%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C%EC%8B%9C%EC%86%8C-?node-id=227-1438&t=YxhX77tQRoVRCfEQ-1&scaling=min-zoom&content-scaling=fixed&page-id=9%3A6&starting-point-node-id=227%3A1419" },
        planImage: "image/gr_vp.jpg"
    },
    {
        bg: "image/uxuxi_bg02.jpg",
        device: "image/sungsim.png",
        deviceType: "single",
        accent: "#4A2A1A",
        badge: null,
        eyebrow: "02. Brand Site Design",
        title: ["성심당", "웹사이트 디자인"],
        work: "100% Personal Project",
        time: "1 Week",
        tool: "Figma",
        tags: ["Planning", "Figma"],
        tagLinks: { "Figma": "https://www.figma.com/design/pneuuD07mblwjCQTHbuBF0/Brand-Site-Design-%EC%84%B1%EC%8B%AC%EB%8B%B9-?node-id=112-141&m=dev" },
        planImage: "image/ssd_vp.jpg"
    },
    {
        bg: "image/uxuxi_bg03.jpg",
        device: "image/off.png",
        deviceType: "single",
        deviceOffset: { y: 70, scale: 1.35 },
        accent: "#171717",
        badge: null,
        eyebrow: "03. Reactive Web Design",
        title: ["오프화이트", "반응형 웹 디자인"],
        work: "100% Personal Project",
        time: "1 Week",
        tool: "Figma",
        tags: ["Planning", "Figma", "Prototype"],
        tagLinks: { "Figma": "https://www.figma.com/site/X5POFa2tKOWjbAnabmfqVR/%EB%B0%98%EC%9D%91%ED%98%95%EC%9B%B9-%EC%98%A4%ED%94%84%ED%99%94%EC%9D%B4%ED%8A%B8-?node-id=0-1&t=ZT0ZwOdLam55nRNj-1", "Prototype": "https://raft-tray-27491886.figma.site/" },
        planImage: "image/off_vp.jpg"
    }
];

let openPlanModal = () => {};

const uxuiSliderEl = document.querySelector("[data-uxui-slider]");

if (uxuiSliderEl) {

    const bgEl = uxuiSliderEl.querySelector("[data-uxui-bg]");
    const rowEl = uxuiSliderEl.querySelector("[data-uxui-row]");
    const badgeEl = uxuiSliderEl.querySelector("[data-uxui-badge]");
    const eyebrowEl = uxuiSliderEl.querySelector("[data-uxui-eyebrow]");
    const titleEl = uxuiSliderEl.querySelector("[data-uxui-title]");
    const workEl = uxuiSliderEl.querySelector("[data-uxui-work]");
    const timeEl = uxuiSliderEl.querySelector("[data-uxui-time]");
    const toolEl = uxuiSliderEl.querySelector("[data-uxui-tool]");
    const currentEl = uxuiSliderEl.querySelector("[data-uxui-current]");
    const totalEl = uxuiSliderEl.querySelector("[data-uxui-total]");
    const deviceEl = uxuiSliderEl.querySelector("[data-uxui-device]");
    const tagsEl = uxuiSliderEl.querySelector("[data-uxui-tags]");
    const prevBtn = uxuiSliderEl.querySelector("[data-uxui-prev]");
    const nextBtn = uxuiSliderEl.querySelector("[data-uxui-next]");

    totalEl.textContent = uxuiSlides.length;

    let uxuiIndex = 0;

    function buildDeviceHTML(data) {

        if (data.deviceType === "multi") {

            return `<div class="uxui-device-stack">
                <img class="uxui-device-part uxui-device-part--laptop" src="${data.device[0]}" alt="${data.title[0]} 랩탑 목업">
                <img class="uxui-device-part uxui-device-part--tablet" src="${data.device[1]}" alt="${data.title[0]} 태블릿 목업">
                <img class="uxui-device-part uxui-device-part--phone" src="${data.device[2]}" alt="${data.title[0]} 모바일 목업">
            </div>`;

        }

        return `<img class="uxui-device-single" src="${data.device}" alt="${data.title[0]} 목업">`;

    }

    function applySlide(index) {

        const data = uxuiSlides[index];

        uxuiSliderEl.style.setProperty("--slide-accent", data.accent);

        const offset = data.deviceOffset || {};
        uxuiSliderEl.style.setProperty("--device-x", `${offset.x ?? -110}px`);
        uxuiSliderEl.style.setProperty("--device-y", `${offset.y ?? 40}px`);
        uxuiSliderEl.style.setProperty("--device-scale", offset.scale ?? 1);

        bgEl.style.backgroundImage = `url(${data.bg})`;

        if (data.badge) {

            badgeEl.textContent = data.badge;
            badgeEl.classList.add("is-visible");

        } else {

            badgeEl.textContent = "";
            badgeEl.classList.remove("is-visible");

        }

        eyebrowEl.textContent = data.eyebrow;
        titleEl.innerHTML = data.title.join("<br>");

        workEl.textContent = data.work;
        timeEl.textContent = data.time;
        toolEl.textContent = data.tool;

        currentEl.textContent = index + 1;

        deviceEl.innerHTML = buildDeviceHTML(data);

        tagsEl.innerHTML = data.tags
            .map((tag, i) => `<button type="button" class="uxui-tag${i === 0 ? " is-active" : ""}" data-uxui-tag>${tag}</button>`)
            .join("");

    }

    function renderSlide(index, animate = true, direction = 1) {

        uxuiIndex = index;

        if (!animate) {

            applySlide(uxuiIndex);

            return;

        }

        const outX = direction > 0 ? -90 : 90;
        const inX = direction > 0 ? 90 : -90;

        gsap.to(bgEl, {

            opacity: 0,

            duration: .35,

            ease: "power2.out"

        });

        gsap.to(rowEl, {

            x: outX,

            opacity: 0,

            duration: .35,

            ease: "power2.in",

            onComplete: () => {

                applySlide(uxuiIndex);

                gsap.set(rowEl, { x: inX, opacity: 0 });
                gsap.set(bgEl, { opacity: 0 });

                gsap.to(rowEl, {

                    x: 0,

                    opacity: 1,

                    duration: .55,

                    ease: "power3.out"

                });

                gsap.to(bgEl, {

                    opacity: 1,

                    duration: .65,

                    ease: "power2.out"

                });

            }

        });

    }

    function stepSlide(step) {

        renderSlide((uxuiIndex + step + uxuiSlides.length) % uxuiSlides.length, true, step);

    }

    prevBtn.addEventListener("click", () => stepSlide(-1));
    nextBtn.addEventListener("click", () => stepSlide(1));

    tagsEl.addEventListener("click", e => {

        const btn = e.target.closest("[data-uxui-tag]");

        if (!btn) return;

        tagsEl.querySelectorAll("[data-uxui-tag]").forEach(b => b.classList.remove("is-active"));

        btn.classList.add("is-active");

        if (btn.textContent === "Planning") {

            openPlanModal(uxuiIndex);

            return;

        }

        const links = uxuiSlides[uxuiIndex].tagLinks;
        const url = links && links[btn.textContent];

        if (url && url !== "#") {

            window.open(url, "_blank", "noopener");

        }

    });

    renderSlide(0, false);

}



// =======================================================
// UXUI PLANNING MODAL
// =======================================================

const planModal = document.getElementById("uxuiPlanModal");

if (planModal) {

    const planScroll = planModal.querySelector(".detail-modal-scroll");
    const planFrame = planModal.querySelector(".detail-modal-frame");
    const planImage = planModal.querySelector("[data-plan-image]");
    const planCurrent = planModal.querySelector("[data-plan-current]");
    const planGithub = planModal.querySelector("[data-plan-github]");

    planModal.querySelector("[data-plan-total]").textContent = uxuiSlides.length;

    let currentPlanIndex = 0;

    function renderPlan(index) {

        const data = uxuiSlides[index];

        currentPlanIndex = index;

        planFrame.classList.remove("is-missing");

        if (data.planImage) {

            planImage.src = data.planImage;
            planImage.alt = data.title.join(" ");

        } else {

            planFrame.classList.add("is-missing");

        }

        planCurrent.textContent = index + 1;

        if (data.github) {

            planGithub.href = data.github;
            planGithub.hidden = false;

        } else {

            planGithub.hidden = true;

        }

        planScroll.scrollTop = 0;

    }

    planImage.addEventListener("error", () => {
        planFrame.classList.add("is-missing");
    });

    openPlanModal = function (index) {

        renderPlan(index);

        planModal.classList.add("is-open");
        planModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("detail-modal-open");
        document.documentElement.classList.add("detail-modal-open");

    };

    function closePlanModal() {

        planModal.classList.remove("is-open");
        planModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("detail-modal-open");
        document.documentElement.classList.remove("detail-modal-open");

    }

    function stepPlan(step) {

        const next = (currentPlanIndex + step + uxuiSlides.length) % uxuiSlides.length;

        renderPlan(next);

    }

    planModal.querySelectorAll("[data-plan-close]").forEach(el => {

        el.addEventListener("click", closePlanModal);

    });

    planModal.querySelector("[data-plan-prev]").addEventListener("click", () => stepPlan(-1));
    planModal.querySelector("[data-plan-next]").addEventListener("click", () => stepPlan(1));

    document.addEventListener("keydown", e => {

        if (!planModal.classList.contains("is-open")) return;

        if (e.key === "Escape") closePlanModal();
        if (e.key === "ArrowLeft") stepPlan(-1);
        if (e.key === "ArrowRight") stepPlan(1);

    });

}



// =======================================================
// PUBLISHING SLIDER
// =======================================================

const pubSlides = [
    {
        bg: "image/publ_bg01.jpg",
        device: "image/non.png",
        deviceOffset: { x: -110, y: 70 },
        accent: "#1B4D3C",
        badge: null,
        eyebrow: "01. Website Design + Publishing",
        title: ["논픽션", "원페이지 디자인"],
        work: "100% Personal Project",
        time: "2 Week",
        tool: "HTML, CSS",
        planning: "#",
        visit: "https://simzzi.github.io/nonfiction/",
        github: "https://github.com/simzzi/nonfiction",
        planImage: "image/non_vp.jpg"
    },
    {
        bg: "image/publ_bg02.jpg",
        device: "image/knotted.png",
        deviceOffset: { x: -100, y: 0 },
        accent: "#E8368F",
        badge: null,
        eyebrow: "02. Website Design + Publishing",
        title: ["노티드", "웹사이트 디자인"],
        work: "100% Personal Project",
        time: "17 Days",
        tool: "Figma, HTML, CSS, JavaScript",
        planning: "#",
        figma: "https://www.figma.com/design/oTY2PxTAC0DgjG0A5C3lff/website-design-%EB%85%B8%ED%8B%B0%EB%93%9C-?node-id=5-2&m=dev&t=sJbm3mnSRSLkhbGJ-1",
        visit: "https://simzzi.github.io/knotted/",
        github: "https://github.com/simzzi/knotted",
        planImage: "image/kno_vp.jpg"
    },
    {
        bg: "image/publ_bg04.jpg",
        device: "image/sr.png",
        deviceOffset: { x: -100, y: 60, scale:1.35},
        accent: "#4FAF92",
        badge: "Team Project",
        eyebrow: "03. Responsive Website Renewal",
        title: ["서리펫 반응형", "웹사이트 리뉴얼"],
        work: "Team Project",
        time: "17 Days",
        tool: "Figma, HTML, CSS, JavaScript",
        planning: "#",
        figma: "https://www.figma.com/design/X3BQcJYwgIqW3zYOAa72AN/%EC%84%9C%EB%A6%AC%ED%8E%AB?node-id=0-1&m=dev&t=UsFFVfD2YKaX4WRJ-1",
        visit: "https://simzzi.github.io/seoripet/",
        github: "https://github.com/simzzi/seoripet",
        planImage: "image/sr_vp.jpg"
    },
    {
        bg: "image/publ_bg03.jpg",
        device: "image/jm.png",
        deviceType: "single",
        deviceOffset: { x: -110, y: 70, scale: 1.35 },
        accent: "#171717",
        eyebrowColor: "#B0B0B0",
        badge: null,
        eyebrow: "04. AI Landing Page | Vibe Coding",
        title: ["젠틀몬스터", "메인 랜딩페이지"],
        work: "100% Personal Project",
        time: "3 Days",
        tool: "Chat GPT, Cursor AI",
        visit: "https://simzzi.github.io/gentlemonster/",
        github: "https://github.com/simzzi/gentlemonster"
    }
];

let openPubPlanModal = () => {};

const pubSliderEl = document.querySelector("[data-pub-slider]");

if (pubSliderEl) {

    const bgEl = pubSliderEl.querySelector("[data-pub-bg]");
    const rowEl = pubSliderEl.querySelector("[data-pub-row]");
    const badgeEl = pubSliderEl.querySelector("[data-pub-badge]");
    const eyebrowEl = pubSliderEl.querySelector("[data-pub-eyebrow]");
    const titleEl = pubSliderEl.querySelector("[data-pub-title]");
    const workEl = pubSliderEl.querySelector("[data-pub-work]");
    const timeEl = pubSliderEl.querySelector("[data-pub-time]");
    const toolEl = pubSliderEl.querySelector("[data-pub-tool]");
    const currentEl = pubSliderEl.querySelector("[data-pub-current]");
    const totalEl = pubSliderEl.querySelector("[data-pub-total]");
    const deviceEl = pubSliderEl.querySelector("[data-pub-device]");
    const actionsEl = pubSliderEl.querySelector("[data-pub-actions]");
    const prevBtn = pubSliderEl.querySelector("[data-pub-prev]");
    const nextBtn = pubSliderEl.querySelector("[data-pub-next]");

    totalEl.textContent = pubSlides.length;

    let pubIndex = 0;

    function applyPubSlide(index) {

        const data = pubSlides[index];

        pubSliderEl.style.setProperty("--slide-accent", data.accent);

        const offset = data.deviceOffset || {};
        pubSliderEl.style.setProperty("--device-x", `${offset.x ?? 0}px`);
        pubSliderEl.style.setProperty("--device-y", `${offset.y ?? 60}px`);
        pubSliderEl.style.setProperty("--device-scale", offset.scale ?? 1);

        if (data.eyebrowColor) {
            pubSliderEl.style.setProperty("--eyebrow-color", data.eyebrowColor);
        } else {
            pubSliderEl.style.removeProperty("--eyebrow-color");
        }

        bgEl.style.backgroundImage = `url(${data.bg})`;

        if (data.badge) {

            badgeEl.textContent = data.badge;
            badgeEl.classList.add("is-visible");

        } else {

            badgeEl.textContent = "";
            badgeEl.classList.remove("is-visible");

        }

        eyebrowEl.textContent = data.eyebrow;
        titleEl.innerHTML = data.title.join("<br>");

        workEl.textContent = data.work;
        timeEl.textContent = data.time;
        toolEl.textContent = data.tool;

        currentEl.textContent = index + 1;

        deviceEl.innerHTML = `<img class="pub-device-single" src="${data.device}" alt="${data.title[0]} 목업">`;

        const figmaBtn = actionsEl.querySelector('[data-pub-btn="figma"]');
        figmaBtn.classList.toggle("is-visible", !!data.figma);

        const planningBtn = actionsEl.querySelector('[data-pub-btn="planning"]');
        if (planningBtn) {
            planningBtn.classList.toggle("is-hidden", !data.planning);
        }

        const actionBtns = actionsEl.querySelectorAll("[data-pub-btn]");
        const firstVisibleBtn = Array.from(actionBtns).find(btn => !btn.classList.contains("is-hidden"));
        actionBtns.forEach(btn => btn.classList.toggle("is-active", btn === firstVisibleBtn));

    }

    function renderPubSlide(index, animate = true, direction = 1) {

        pubIndex = index;

        if (!animate) {

            applyPubSlide(pubIndex);

            return;

        }

        const outX = direction > 0 ? -90 : 90;
        const inX = direction > 0 ? 90 : -90;

        gsap.to(bgEl, {

            opacity: 0,

            duration: .35,

            ease: "power2.out"

        });

        gsap.to(rowEl, {

            x: outX,

            opacity: 0,

            duration: .35,

            ease: "power2.in",

            onComplete: () => {

                applyPubSlide(pubIndex);

                gsap.set(rowEl, { x: inX, opacity: 0 });
                gsap.set(bgEl, { opacity: 0 });

                gsap.to(rowEl, {

                    x: 0,

                    opacity: 1,

                    duration: .55,

                    ease: "power3.out"

                });

                gsap.to(bgEl, {

                    opacity: 1,

                    duration: .65,

                    ease: "power2.out"

                });

            }

        });

    }

    function stepPubSlide(step) {

        renderPubSlide((pubIndex + step + pubSlides.length) % pubSlides.length, true, step);

    }

    prevBtn.addEventListener("click", () => stepPubSlide(-1));
    nextBtn.addEventListener("click", () => stepPubSlide(1));

    actionsEl.addEventListener("click", e => {

        const btn = e.target.closest("[data-pub-btn]");

        if (!btn) return;

        actionsEl.querySelectorAll("[data-pub-btn]").forEach(b => b.classList.remove("is-active"));

        btn.classList.add("is-active");

        if (btn.dataset.pubBtn === "planning") {

            openPubPlanModal(pubIndex);

            return;

        }

        const url = pubSlides[pubIndex][btn.dataset.pubBtn];

        if (url && url !== "#") {

            window.open(url, "_blank", "noopener");

        }

    });

    renderPubSlide(0, false);

}

// =======================================================
// PUBLISHING PLANNING MODAL
// =======================================================

const pubPlanModal = document.getElementById("pubPlanModal");

if (pubPlanModal) {

    const pubPlanScroll = pubPlanModal.querySelector(".detail-modal-scroll");
    const pubPlanFrame = pubPlanModal.querySelector(".detail-modal-frame");
    const pubPlanImage = pubPlanModal.querySelector("[data-pubplan-image]");
    const pubPlanCurrent = pubPlanModal.querySelector("[data-pubplan-current]");
    const pubPlanGithub = pubPlanModal.querySelector("[data-pubplan-github]");

    // planImage가 있는 슬라이드만 기획서 모달 탐색 대상에 포함 (젠틀몬스터 제외)
    const pubPlanSlides = pubSlides.filter(data => !!data.planImage);

    pubPlanModal.querySelector("[data-pubplan-total]").textContent = pubPlanSlides.length;

    let currentPubPlanIndex = 0;

    function renderPubPlan(index) {

        const data = pubPlanSlides[index];

        currentPubPlanIndex = index;

        pubPlanFrame.classList.remove("is-missing");

        if (data.planImage) {

            pubPlanImage.src = data.planImage;
            pubPlanImage.alt = data.title.join(" ");

        } else {

            pubPlanFrame.classList.add("is-missing");

        }

        pubPlanCurrent.textContent = index + 1;

        if (data.github) {

            pubPlanGithub.href = data.github;
            pubPlanGithub.hidden = false;

        } else {

            pubPlanGithub.hidden = true;

        }

        pubPlanScroll.scrollTop = 0;

    }

    pubPlanImage.addEventListener("error", () => {
        pubPlanFrame.classList.add("is-missing");
    });

    openPubPlanModal = function (mainIndex) {

        const targetSlide = pubSlides[mainIndex];
        const planIndex = pubPlanSlides.indexOf(targetSlide);

        renderPubPlan(planIndex >= 0 ? planIndex : 0);

        pubPlanModal.classList.add("is-open");
        pubPlanModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("detail-modal-open");
        document.documentElement.classList.add("detail-modal-open");

    };

    function closePubPlanModal() {

        pubPlanModal.classList.remove("is-open");
        pubPlanModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("detail-modal-open");
        document.documentElement.classList.remove("detail-modal-open");

    }

    function stepPubPlan(step) {

        const next = (currentPubPlanIndex + step + pubPlanSlides.length) % pubPlanSlides.length;

        renderPubPlan(next);

    }

    pubPlanModal.querySelectorAll("[data-pubplan-close]").forEach(el => {

        el.addEventListener("click", closePubPlanModal);

    });

    pubPlanModal.querySelector("[data-pubplan-prev]").addEventListener("click", () => stepPubPlan(-1));
    pubPlanModal.querySelector("[data-pubplan-next]").addEventListener("click", () => stepPubPlan(1));

    document.addEventListener("keydown", e => {

        if (!pubPlanModal.classList.contains("is-open")) return;

        if (e.key === "Escape") closePubPlanModal();
        if (e.key === "ArrowLeft") stepPubPlan(-1);
        if (e.key === "ArrowRight") stepPubPlan(1);

    });

}



// =======================================================
// CAREER DETAIL MODAL
// =======================================================

const careerData = [
    {
        title: "다비치 리조트 빌리지",
        subtitle: "진주 타운하우스 분양 브로슈어",
        description: "리조트형 타운하우스의 가치와 라이프스타일을 담은 브로슈어 디자인",
        tools: ["image/ai.png", "image/id.png"],
        images: ["image/c-01.png", "image/c-02.png"]
    },
    {
        title: "이은아 공방",
        subtitle: "천연염색 공방 브로슈어",
        description: "세상에 하나뿐인 작품을 만드는 이은아공방 '구슬땀'의 가치를 담은 브로슈어 디자인",
        tools: ["image/ai.png", "image/id.png"],
        images: ["image/c-03.png", "image/c-04.png"]
    },
    {
        title: "한국수력원자력",
        subtitle: "사내 소통 사보 편집디자인",
        description: "임직원과 지역사회를 잇는 한국수력원자력 사보 '징검다리' 편집디자인",
        tools: ["image/ai.png", "image/id.png"],
        images: ["image/c-05.png", "image/c-06.png"]
    },
    {
        title: "교과 세부능력 도움 자료",
        subtitle: "교과 세부능력 및 특기사항 기재 도움 자료집",
        description: "영어·한국사·사회·수학·국어·과학 등 교과별 세부능력 기재를 돕는 도움 자료집 편집디자인",
        tools: ["image/ai.png", "image/id.png"],
        images: ["image/c-07.png", "image/c-08.png"]
    },
    {
        title: "리뉴얼라이프",
        subtitle: "유기농 쌀과자 브랜드 콘텐츠 디자인",
        description: "농업회사법인 리뉴얼라이프의 유기농 쌀과자 브랜드 '또또맘' 리플렛 디자인",
        tools: ["image/ai.png"],
        images: ["image/c-09.png", "image/c-09-1.png"]
    },
    {
        title: "Factory On",
        subtitle: "산업과 기술의 연결, 새로운 가능성 팩토리온",
        description: [
            "기업과 정보, 산업단지 지역 그리고 사람 서로가 연결되어 만들어갈 미래입니다. 심볼의 형태는 팩토리온을 통해 서로가 연결되고 융합하여 새로운 산업사회로 나아가고자 하는 열정을 형상화하였습니다. 블루(청색)는 다양한 정보 서비스 신뢰를, 레드(적색)는 새로운 산업사회로 이끌어 나아가는 열정을, 그린(연두색)은 친근하고 편안하게 다가갈 수 있는 팩토리온을 상징합니다."
        ],
        tools: ["image/ai.png"],
        images: ["image/c-10.png", "image/c-11.png"]
    },
    {
        title: "BE:THE",
        subtitle: "브랜드 아이덴티티 디자인",
        description: [
            "BE:THE는 해외 고객과 국내 의료기관을 연결하는 브랜드의 가치를 상징합니다. 직관적인 타이포그래피는 신뢰와 전문성을, 간결한 디자인은 정확하고 체계적인 의료 컨설팅 서비스를 의미합니다.",
            "BE:THE는 해외 고객과 국내 의료기관을 연결하는 브랜드로, 신뢰와 전문성을 바탕으로 정확한 메디컬 컨설팅 서비스를 제공합니다. 활기와 성장의 에너지를 상징하는 오렌지와 신뢰와 전문성을 나타내는 블루를 조합하여, 글로벌 의료 서비스를 연결하는 BE:THE의 혁신성과 안정감을 표현합니다."
        ],
        tools: ["image/ai.png"],
        images: ["image/c-12.png", "image/c-13.png"],
        colors: [
            { pantone: "PANTONE 151 C", cmyk: "M55 Y100", rgb: "R242 G120 B0" },
            { pantone: "PANTONE 2736 C", cmyk: "C100 M95 K15", rgb: "R51 G42 B156" }
        ]
    },
    {
        title: "COL(세포연구소)",
        subtitle: "생명의 순환과 지속가능성을 담은 연구 브랜드",
        description: [
            "무한대(∞)와 세포(Cell)의 형태를 결합하여 생명의 순환과 지속적인 연구, 무한한 가능성을 표현했습니다. 하나의 선으로 이어지는 구조는 연구와 기술의 연결성을 상징합니다.",
            "COL(Ceramic of Legend)는 세포의 연결 구조와 무한대(∞)를 모티브로 하여 생명과 연구의 지속성을 표현한 심볼입니다. 좌측 심볼은 세포의 순환과 성장, 협업을 의미하며 우측의 견고한 'L'은 연구소의 전문성과 신뢰를 상징합니다. 따뜻한 그라데이션은 생명의 에너지를, 블루 컬러는 과학적 정확성과 기술력을 나타내어 미래를 향한 혁신적인 연구 가치를 담았습니다."
        ],
        tools: ["image/ai.png"],
        images: ["image/c-14.png", "image/c-15.png"],
        colors: [
            { pantone: "PANTONE P 1120-8 C", cmyk: "C100 M18", rgb: "R0 G151 B219" },
            { pantone: "PANTONE P 104-8 C", cmyk: "C100 M68", rgb: "R0 G93 B172" },
            { pantone: "PANTONE P 17-8 C", cmyk: "M43 Y100", rgb: "R249 G160 B27" },
            { pantone: "PANTONE P 48-8 C", cmyk: "C99 Y91", rgb: "R237 G40 B59" }
        ]
    },
    {
        title: "DA성형외과",
        subtitle: "모바일 SNS 광고 콘텐츠 디자인",
        description: "DA성형외과 코·눈성형 시술 홍보를 위한 모바일 SNS 광고 콘텐츠 디자인",
        tools: ["image/ps.png"],
        images: ["image/c-17.png", "image/c-18.png"]
    }
];

const careerModal = document.getElementById("careerModal");

if (careerModal) {

    const badgesEl = careerModal.querySelector("[data-career-badges]");
    const titleEl = careerModal.querySelector("[data-career-title]");
    const subtitleEl = careerModal.querySelector("[data-career-subtitle]");
    const descEl = careerModal.querySelector("[data-career-desc]");
    const frameEl = careerModal.querySelector(".career-modal-frame");
    const imageEl = careerModal.querySelector("[data-career-image]");
    const currentEl = careerModal.querySelector("[data-career-current]");
    const imgPrevEl = careerModal.querySelector("[data-career-img-prev]");
    const imgNextEl = careerModal.querySelector("[data-career-img-next]");

    careerModal.querySelector("[data-career-total]").textContent = careerData.length;

    let careerProjectIndex = 0;
    let careerImageIndex = 0;

    function renderCareerImage() {

        const data = careerData[careerProjectIndex];
        const src = data.images[careerImageIndex];

        if (src) {

            frameEl.classList.remove("is-missing");
            imageEl.src = src;
            imageEl.alt = data.title;

        } else {

            frameEl.classList.add("is-missing");
            imageEl.src = "";
            imageEl.alt = "";

        }

        const hasMultipleImages = data.images.length > 1;
        imgPrevEl.classList.toggle("is-hidden", !hasMultipleImages);
        imgNextEl.classList.toggle("is-hidden", !hasMultipleImages);

    }

    function renderCareerProject(index) {

        careerProjectIndex = index;
        careerImageIndex = 0;

        const data = careerData[careerProjectIndex];

        badgesEl.innerHTML = data.tools
            .map(src => `<img class="career-modal-badge" src="${src}" alt="">`)
            .join("");

        titleEl.textContent = data.title;
        subtitleEl.textContent = data.subtitle;

        const paragraphs = Array.isArray(data.description) ? data.description : [data.description];
        descEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join("");

        currentEl.textContent = careerProjectIndex + 1;

        renderCareerImage();

    }

    function stepCareerImage(step) {

        const data = careerData[careerProjectIndex];

        if (!data.images.length) return;

        careerImageIndex = (careerImageIndex + step + data.images.length) % data.images.length;

        renderCareerImage();

    }

    function stepCareerProject(step) {

        const next = (careerProjectIndex + step + careerData.length) % careerData.length;

        renderCareerProject(next);

    }

    function openCareerModal(index) {

        renderCareerProject(index);

        careerModal.classList.add("is-open");
        careerModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("career-modal-open");
        document.documentElement.classList.add("career-modal-open");

    }

    function closeCareerModal() {

        careerModal.classList.remove("is-open");
        careerModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("career-modal-open");
        document.documentElement.classList.remove("career-modal-open");

    }

    document.querySelectorAll("[data-career-index]").forEach(btn => {

        btn.addEventListener("click", e => {

            e.preventDefault();

            openCareerModal(parseInt(btn.dataset.careerIndex, 10));

        });

    });

    careerModal.querySelector("[data-career-close]").addEventListener("click", closeCareerModal);

    careerModal.querySelector("[data-career-prev]").addEventListener("click", () => stepCareerProject(-1));
    careerModal.querySelector("[data-career-next]").addEventListener("click", () => stepCareerProject(1));

    careerModal.querySelector("[data-career-img-prev]").addEventListener("click", () => stepCareerImage(-1));
    careerModal.querySelector("[data-career-img-next]").addEventListener("click", () => stepCareerImage(1));

    document.addEventListener("keydown", e => {

        if (!careerModal.classList.contains("is-open")) return;

        if (e.key === "Escape") closeCareerModal();
        if (e.key === "ArrowLeft") stepCareerImage(-1);
        if (e.key === "ArrowRight") stepCareerImage(1);

    });

}
