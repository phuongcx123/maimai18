/* ═══════════════════════════════════════════════════════
   LOADER — Car race with milestone markers 🚗
   Orchestrated via GSAP Timeline
═══════════════════════════════════════════════════════ */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const car      = document.getElementById('ldCar');
  const roadLine = document.getElementById('ldRoadLine');
  const subtitle = document.getElementById('ldSubtitle');
  const percent  = document.getElementById('ldPercent');
  const msWrap   = document.getElementById('ldMilestones');

  if (!loader || !car || !msWrap) return;

  /* ── Twinkling Stars in Loader ── */
  const ldStarsEl = document.getElementById('ldStars');
  if (ldStarsEl) {
    for (let i = 0; i < 50; i++) {
      const s = document.createElement('div');
      s.className = 'ld-star';
      const sz = (Math.random() * 2.5 + 0.8).toFixed(1);
      s.style.cssText =
        'width:' + sz + 'px;height:' + sz + 'px;' +
        'top:' + (Math.random() * 100) + '%;left:' + (Math.random() * 100) + '%;' +
        'animation-duration:' + (Math.random() * 2 + 1).toFixed(1) + 's;' +
        'animation-delay:' + (Math.random() * 3).toFixed(1) + 's';
      ldStarsEl.appendChild(s);
    }
  }

  /* ── Milestone data ── */
  const MS = [
    { pct: 0,   icon: '🚦', label: 'Xuất phát' },
    { pct: 20,  icon: '🎈', label: 'Chúc Mừng '  },
    { pct: 40,  icon: '🎂', label: 'Sinh nhật'  },
    { pct: 60,  icon: '🕯️', label: 'Người Chị' },
    { pct: 80,  icon: '🎁', label: 'Của Tôi'  },
    { pct: 100, icon: '🎉', label: 'Đích đến'  },
  ];

  const pctToLeft = pct => (3 + pct * 0.94) + '%';

  /* ── Build milestone DOM ── */
  MS.forEach((ms, i) => {
    const el = document.createElement('div');
    el.className = 'ld-ms';
    el.id = 'ms_' + i;
    el.style.left = pctToLeft(ms.pct);
    el.innerHTML =
      '<div class="ld-ms-icon">' + ms.icon + '</div>' +
      '<div class="ld-ms-label">' + ms.label + '</div>' +
      '<div class="ld-ms-pole"></div>';
    msWrap.appendChild(el);
  });

  if (typeof gsap === 'undefined') {
    setTimeout(() => {
      loader.style.display = 'none';
      window.dispatchEvent(new CustomEvent('loaderComplete'));
    }, 1500);
    return;
  }

  gsap.set(car, { xPercent: -50, scaleX: -1, left: '3%', y: 0 });

  const ms0 = document.getElementById('ms_0');
  if (ms0) {
    gsap.set(ms0, { opacity: 1, scale: 1.18 });
    gsap.set(ms0.querySelector('.ld-ms-icon'),  { filter: 'drop-shadow(0 0 14px #ffbe00)' });
    gsap.set(ms0.querySelector('.ld-ms-label'), { color: '#ffbe00' });
  }

  function reachMilestone(i) {
    const msEl = document.getElementById('ms_' + i);
    if (!msEl) return;
    gsap.fromTo(msEl,
      { opacity: 0.28, scale: 0.75 },
      { opacity: 1, scale: 1.18, duration: 0.45, ease: 'back.out(2.5)' }
    );
    gsap.fromTo(msEl.querySelector('.ld-ms-icon'),
      { filter: 'drop-shadow(0 0 0px rgba(255,190,0,0))' },
      { filter: 'drop-shadow(0 0 16px #ffbe00)', duration: 0.45 }
    );
    gsap.fromTo(msEl.querySelector('.ld-ms-label'),
      { color: 'rgba(255,255,255,0.45)' },
      { color: '#ffbe00', duration: 0.35 }
    );

    /* Burst particles */
    const burst = document.createElement('div');
    burst.className = 'ld-burst';
    msEl.appendChild(burst);
    ['🌟', '✨', '💫', '⭐'].forEach((em, j) => {
      const span = document.createElement('span');
      span.textContent = em;
      burst.appendChild(span);
      gsap.fromTo(span,
        { x: 0, y: 0, opacity: 1, scale: 0.5 },
        {
          x: (j % 2 === 0 ? 1 : -1) * (18 + j * 7),
          y: -(22 + j * 8),
          opacity: 0, scale: 1.2,
          duration: 0.6, ease: 'power2.out',
          delay: j * 0.05,
          onComplete: () => burst.remove(),
        }
      );
    });
  }

  function updateText(ms) {
    const msgs = [
      'Sẵn sàng xuất phát... 🚀',
      'Đang tăng tốc... 💨',
      'Nửa chặng đường rồi! 🎶',
      'Sắp đến nơi rồi! 🌟',
      'Chuẩn bị bất ngờ... 🎁',
      'ĐÃ ĐẾN NƠI! CHÚC MỪNG SINH NHẬT! 🎉🎂',
    ];
    if (msgs[ms] && subtitle) {
      gsap.to(subtitle, {
        opacity: 0, duration: 0.2,
        onComplete() {
          subtitle.textContent = msgs[ms];
          gsap.to(subtitle, { opacity: 1, duration: 0.3 });
        },
      });
    }
  }

  function spawnSmoke() {
    const scene = document.querySelector('.ld-scene');
    if (!scene) return;
    const s = document.createElement('div');
    s.className = 'ld-smoke';
    s.textContent = '💨';
    scene.appendChild(s);
    s.style.left = 'calc(' + car.style.left + ' + 10px)';
    gsap.fromTo(s,
      { opacity: 0.7, x: 0, y: 0 },
      { opacity: 0, x: 18, y: -16, duration: 0.7, ease: 'power1.out',
        onComplete: () => s.remove() }
    );
  }

  function pauseRoad() { if (roadLine) roadLine.classList.add('paused'); }
  function resumeRoad() { if (roadLine) roadLine.classList.remove('paused'); }

  function launchConfetti(count = 180) {
    const canvas = document.createElement('canvas');
    canvas.className = 'ld-confetti-canvas';
    loader.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#ff4d6d', '#ffbe00', '#00f5d4', '#7b2cbf', '#ffffff', '#ff758c', '#ffe066'];
    const particles = Array.from({ length: count }, () => ({
      x: window.innerWidth * (0.2 + Math.random() * 0.6),
      y: window.innerHeight * 0.5,
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 14 + 6),
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      alpha: 1,
    }));

    let frameId;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rSpeed;
        p.alpha -= 0.007;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        frameId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(frameId);
        canvas.remove();
      }
    }
    render();
  }
  window.launchConfetti = launchConfetti;

  /* ── Master timeline ── */
  const masterTl = gsap.timeline({
    delay: 0.3,
    onComplete() {
      if (typeof launchConfetti === 'function') {
        launchConfetti(220);
      }
      gsap.to(loader, {
        opacity: 0, duration: 0.8, ease: 'power2.inOut',
        onComplete() {
          loader.style.display = 'none';
          window.dispatchEvent(new CustomEvent('loaderComplete'));
        },
      });
    },
  });

  let smokeInt = null;

  MS.forEach((ms, i) => {
    if (i === 0) return;

    const prevPct = MS[i - 1].pct;
    const dur = (ms.pct - prevPct) / 100 * 3.5;

    masterTl.to(car, {
      left: pctToLeft(ms.pct),
      duration: dur,
      ease: 'none',
      onStart() {
        resumeRoad();
        if (!smokeInt) smokeInt = setInterval(spawnSmoke, 450);
        if (percent) percent.textContent = prevPct + '%';
      },
      onUpdate() {
        const approx = Math.round(prevPct + (ms.pct - prevPct) * (masterTl.time() / masterTl.duration()));
        if (percent) percent.textContent = Math.min(ms.pct, Math.max(prevPct, approx)) + '%';
      },
    });

    masterTl.add(() => {
      pauseRoad();
      clearInterval(smokeInt); smokeInt = null;
      if (percent) percent.textContent = ms.pct + '%';
      reachMilestone(i);
      updateText(i);
    });

    masterTl.to({}, { duration: 0.45 });

    masterTl
      .to(car, { y: -10, duration: 0.12, ease: 'power2.out' })
      .to(car, { y: 0,   duration: 0.22, ease: 'bounce.out' });
  });
})();
