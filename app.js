// ===== 15 Anos da Kaellen — App JS =====
// Uses GSAP + ScrollTrigger for fluid scroll-based animations

// ===== SPLASH SCREEN =====
function initSplash() {
    const splash = document.querySelector('.splash');
    const cta = document.querySelector('.splash-cta');

    function closeSplash() {
        splash.classList.add('closing');
        document.body.style.overflow = '';
        playMusic();
        setTimeout(() => {
            splash.style.display = 'none';
            startAnimations();
            launchConfetti();
        }, 1200);
    }

    cta.addEventListener('click', closeSplash);
    splash.addEventListener('click', (e) => { if (e.target === splash) closeSplash(); });
    document.body.style.overflow = 'hidden';
}

// ===== BUBBLES =====
function createBubbles() {
    const container = document.getElementById('bubbles');
    const count = window.innerWidth < 600 ? 15 : 25;
    for (let i = 0; i < count; i++) {
        const b = document.createElement('div');
        b.classList.add('bubble');
        const s = Math.random() * 22 + 8;
        b.style.width = s + 'px';
        b.style.height = s + 'px';
        b.style.left = Math.random() * 100 + '%';
        b.style.animationDuration = (Math.random() * 10 + 7) + 's';
        b.style.animationDelay = (Math.random() * 14) + 's';
        container.appendChild(b);
    }
}

// ===== CURSOR GLOW =====
function initCursorGlow() {
    const glow = document.querySelector('.cursor-glow');
    if (window.innerWidth < 768) return; // skip on mobile

    document.addEventListener('mousemove', (e) => {
        glow.classList.add('active');
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
}

// ===== WATER RIPPLE CANVAS =====
function initWaterCanvas() {
    const canvas = document.getElementById('water-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    const ripples = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Add ripple on click/touch
    function addRipple(x, y) {
        ripples.push({ x, y, radius: 0, maxRadius: 120 + Math.random() * 80, alpha: 0.6, speed: 2 + Math.random() });
    }

    document.addEventListener('click', (e) => addRipple(e.clientX, e.clientY));
    document.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        addRipple(t.clientX, t.clientY);
    }, { passive: true });

    // Auto ripples every 3s
    setInterval(() => {
        addRipple(Math.random() * W, Math.random() * H);
    }, 3000);

    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            r.radius += r.speed;
            r.alpha = 0.6 * (1 - r.radius / r.maxRadius);
            if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(103, 232, 249, ${r.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Second ring
            if (r.radius > 20) {
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(103, 232, 249, ${r.alpha * 0.5})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== CONFETTI =====
function launchConfetti() {
    const cvs = document.getElementById('confetti');
    const ctx = cvs.getContext('2d');
    cvs.width = innerWidth; cvs.height = innerHeight;
    const colors = ['#f472b6', '#fbbf24', '#22d3ee', '#a78bfa', '#fb923c', '#34d399', '#f43f5e', '#fff'];
    const pieces = [];
    for (let i = 0; i < 130; i++) {
        pieces.push({
            x: Math.random() * cvs.width,
            y: Math.random() * cvs.height - cvs.height,
            w: Math.random() * 10 + 4,
            h: Math.random() * 6 + 3,
            c: colors[Math.floor(Math.random() * colors.length)],
            v: Math.random() * 3 + 1.2,
            a: Math.random() * Math.PI * 2,
            s: (Math.random() - 0.5) * 0.12,
            d: (Math.random() - 0.5) * 1.2
        });
    }
    const start = Date.now();
    (function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        const elapsed = Date.now() - start - 4000;
        const alpha = elapsed > 0 ? Math.max(0, 1 - elapsed / 2500) : 1;
        if (alpha <= 0) { cvs.style.display = 'none'; return; }
        pieces.forEach(p => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.a);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
            p.y += p.v; p.x += p.d; p.a += p.s;
            if (p.y > cvs.height + 20) { p.y = -20; p.x = Math.random() * cvs.width; }
        });
        requestAnimationFrame(draw);
    })();
    window.addEventListener('resize', () => { cvs.width = innerWidth; cvs.height = innerHeight; });
}

// ===== GSAP ANIMATIONS =====
function startAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // --- HERO entrance sequence ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.starburst', { opacity: 1, scale: 1, duration: 0.8, delay: 0.2 })
        .to('.num-15', { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.4')
        .to('.anos-da', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to('.name-wrap', { opacity: 1, duration: 0.1 }, '-=0.3')
        .to('.name-outline .letter', {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.6, stagger: 0.06, ease: 'back.out(1.5)'
        }, '-=0.2')
        .to('.name-fill .letter', {
            opacity: 0.85, y: 0, rotateX: 0,
            duration: 0.5, stagger: 0.06, ease: 'back.out(1.5)'
        }, '-=0.7')
        .to('.annotation', { opacity: 1, x: 0, duration: 0.6 }, '-=0.2')
        .to('.scroll-hint', { opacity: 1, duration: 0.8 }, '-=0.3');

    // --- HERO parallax on scroll ---
    gsap.to('.hero-content', {
        yPercent: 30, opacity: 0.3,
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });

    // --- Floating decorations continuous animation ---
    gsap.utils.toArray('.deco').forEach((el, i) => {
        gsap.to(el, {
            y: 'random(-25, -8)', x: 'random(-8, 8)',
            rotation: 'random(-6, 6)',
            duration: 'random(3, 6)',
            repeat: -1, yoyo: true, ease: 'sine.inOut',
            delay: i * 0.3
        });
    });

    // --- Background text parallax ---
    gsap.utils.toArray('.bg-text').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, scale: 0.85, y: 60 },
            {
                opacity: 1, scale: 1, y: 0, duration: 1.2,
                scrollTrigger: { trigger: el.closest('section'), start: 'top 80%', end: 'top 30%', scrub: 1 }
            }
        );
    });

    // --- Glass cards stagger ---
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.to(card, {
            y: 0, opacity: 1, duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
            delay: i * 0.1
        });
    });

    // --- Chuva de frutas contínua ---
    initFruitRain();

    // --- Gift pills stagger ---
    gsap.utils.toArray('.gift-pill').forEach((pill, i) => {
        gsap.to(pill, {
            y: 0, opacity: 1, duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: { trigger: '.gifts-section', start: 'top 70%', toggleActions: 'play none none reverse' },
            delay: 0.1 + i * 0.08
        });
    });

    // --- Hero background color morph on scroll ---
    gsap.to('.hero', {
        background: '#0e7490',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });

    // --- Marquee bars scale in ---
    gsap.utils.toArray('.marquee-bar').forEach(bar => {
        gsap.from(bar, {
            scaleY: 0, transformOrigin: 'center',
            scrollTrigger: { trigger: bar, start: 'top 95%', toggleActions: 'play none none reverse' },
            duration: 0.5, ease: 'power2.out'
        });
    });
}

// ===== SPLIT TEXT INTO LETTERS =====
function splitLetters() {
    document.querySelectorAll('.hero-name').forEach(el => {
        const text = el.textContent.trim();
        el.innerHTML = '';
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.classList.add('letter');
            span.textContent = char;
            el.appendChild(span);
        });
    });
}

// ===== PLAYER MUSIC =====
let ytPlayer = null;

function updateMusicButton(state) {
    const btn = document.getElementById('music-toggle');
    if (!btn) return;
    btn.classList.remove('playing', 'paused');
    btn.classList.add(state);
    btn.setAttribute('aria-label', state === 'playing' ? 'Pausar música' : 'Tocar música');
}

function toggleMusic() {
    if (!ytPlayer) {
        playMusic();
        return;
    }
    const state = ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : -1;
    if (state === 1) {
        ytPlayer.pauseVideo();
        updateMusicButton('paused');
    } else {
        ytPlayer.playVideo();
        updateMusicButton('playing');
    }
}

function playMusic() {
    if (ytPlayer) return;

    function createPlayer() {
        ytPlayer = new YT.Player('player', {
            height: '0',
            width: '0',
            playerVars: {
                listType: 'playlist',
                list: 'PLMM5MkRQlvhe9-JhNZ5IfRRMyodkwJ9m7',
                autoplay: 1,
                loop: 1
            },
            events: {
                onReady: (e) => {
                    e.target.playVideo();
                    updateMusicButton('playing');
                },
                onError: () => { ytPlayer = null; }
            }
        });
    }

    if (window.YT && window.YT.Player) {
        createPlayer();
    } else {
        window.onYouTubeIframeAPIReady = createPlayer;
        if (!document.getElementById('yt-api-script')) {
            const tag = document.createElement('script');
            tag.id = 'yt-api-script';
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }
    }
}

function initMusicToggle() {
    const btn = document.getElementById('music-toggle');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); toggleMusic(); });
}

// ===== CARROSSEL NO CENTRO DO CÍRCULO =====
function initCircleCarousel() {
    const imgs = document.querySelectorAll('.circle-carousel-img');
    if (imgs.length === 0) return;
    let index = 0;
    setInterval(() => {
        imgs[index].classList.remove('active');
        index = (index + 1) % imgs.length;
        imgs[index].classList.add('active');
    }, 2000);
}

// ===== CHUVA DE FRUTAS =====
function initFruitRain() {
    const container = document.querySelector('.fruit-rain');
    if (!container) return;

    const fruitSrcs = [
        'images/drop/amora.webp',
        'images/drop/banana.webp',
        'images/drop/cocos.webp',
        'images/drop/estrela-brilho.webp',
        'images/drop/flor-brilhante.webp',
        'images/drop/kiwi.webp',
        'images/drop/morango-top.webp',
        'images/drop/morangos.webp',
        'images/drop/pessego.webp',
        'images/drop/rosa-top.webp',
        'images/drop/tangerina.webp',
        'images/drop/uellow-orange.webp',
        'images/drop/yellow-orange2.webp',
        'images/drop/flor.webp',
        'images/drop/booble-brilho.webp',
        'images/drop/limao.webp'
    ];

    const maxOpacity = 0.35;
    let pool = [...fruitSrcs];

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function pickNextSrc() {
        if (pool.length === 0) pool = shuffle([...fruitSrcs]);
        return pool.pop();
    }

    function getH() {
        return container.offsetHeight || container.parentElement.offsetHeight || 200;
    }

    function dropFruit() {
        const img = document.createElement('img');
        img.className = 'rain-fruit';
        img.src = pickNextSrc();
        img.draggable = false;

        const size = 35 + Math.random() * 25;
        const left = Math.random() * 85;
        const rot = (Math.random() - 0.5) * 60;
        const duration = 1.8 + Math.random() * 1.2;
        const rotEnd = rot + (Math.random() - 0.5) * 40;
        const h = getH();

        img.style.width = size + 'px';
        img.style.left = left + '%';
        img.style.transform = `rotate(${rot}deg)`;

        container.appendChild(img);

        gsap.fromTo(img,
            { y: -60, opacity: 0, rotation: rot },
            {
                y: h + 20,
                opacity: maxOpacity,
                rotation: rotEnd,
                duration: duration,
                ease: 'power1.in',
                onUpdate: function () {
                    const progress = this.progress();
                    if (progress < 0.15) {
                        img.style.opacity = (progress / 0.15) * maxOpacity;
                    } else if (progress > 0.8) {
                        img.style.opacity = ((1 - progress) / 0.2) * maxOpacity;
                    } else {
                        img.style.opacity = maxOpacity;
                    }
                },
                onComplete: () => img.remove()
            }
        );
    }

    function dropBatch() {
        const count = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
            setTimeout(() => dropFruit(), Math.random() * 400);
        }
    }

    let running = false;
    function scheduleLoop() {
        if (running) return;
        running = true;
        (function loop() {
            dropBatch();
            const nextDelay = 800 + Math.random() * 1200;
            setTimeout(loop, nextDelay);
        })();
    }

    ScrollTrigger.create({
        trigger: container.closest('.glass-card') || container,
        start: 'top 95%',
        onEnter: () => scheduleLoop(),
        once: true
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    splitLetters();
    createBubbles();
    initCursorGlow();
    initWaterCanvas();
    initSplash();
    initMusicToggle();
    initCircleCarousel();
});
