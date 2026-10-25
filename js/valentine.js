// Kiểm tra thiết bị có đang ở chế độ màn hình dọc trên mobile/tablet không
function isMobilePortrait() {
  return window.innerWidth <= 900 && window.innerHeight > window.innerWidth;
}
// === HÀM GIẢI MÃ BASE64 UNICODE ===
function decodeBase64(encoded) {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Decode thất bại:", e);
    return null;
  }
}

// === CẤU HÌNH DỮ LIỆU MẶC ĐỊNH TỪ LINK CỦA BẠN ===
let PASSCODE = "2610";
let TITLE_TEXT = "Chúc mừng sinh nhật chị 🎉";
let LOVE_MESSAGE =
  "Hôm nay là một ngày đặc biệt...\nChúc chị  luôn luôn xinh đẹp, hạnh phúc và ngập tràn niềm vui mỗi ngày!\n Nhớ kiếm đủ tiền mua nhà phố cổ nha  ❤️";
let PHOTO_LIST = [
  "assets/valentine/avt.jpg",
  "assets/valentine/image.png",
  "assets/valentine/2.jpg",
  "assets/valentine/3.jpg",
  "assets/valentine/4.jpg",
];
let MUSIC = "a.mp3";
// Trang tiếp theo khi click vào hộp quà (có thể đổi thành galaxy.html, index1.html, myheart.html, v.v.)
let NEXT_PAGE_URL = "flower.html";

// Đọc dữ liệu từ tham số URL nếu có
const params = new URLSearchParams(window.location.search);
const encodedData = params.get("id");

if (encodedData) {
  const decodedStr = decodeBase64(encodedData);
  if (decodedStr) {
    try {
      const decoded = JSON.parse(decodedStr);
      if (decoded.p) PASSCODE = decoded.p;
      if (decoded.t) TITLE_TEXT = decoded.t;
      if (decoded.l && decoded.l.trim() !== "") LOVE_MESSAGE = decoded.l;
      if (Array.isArray(decoded.q) && decoded.q.length) PHOTO_LIST = decoded.q;
      if (decoded.m) MUSIC = decoded.m === "n/a.mp3" ? "a.mp3" : decoded.m;
    } catch (e) {
      console.error("Data không hợp lệ:", e);
    }
  }
}

// === CẤU HÌNH NHẠC ĐÚNG & SAI ===
let MUSIC_CORRECT = "a.mp3";
let MUSIC_WRONG = "assets/valentine/wrong.mp3"; // Có thể đổi thành link bài hát/âm thanh khác

// Danh sách câu nói trêu đùa dễ thương khi nhập sai mật khẩu sinh nhật
const WRONG_SPEECHES = [
  "Ủa ủa? Sinh nhật của Chị mà cũng nhớ nhầm hả trời? 😜 Mau thử lại xem nào!",
  "Hong đúng rùi nha! Nghĩ kỹ lại xem ngày đặc biệt nhất năm là ngày mấy nè... 🤔",
  "Chắc là bấm vội quá đúng hông? Bình tĩnh hít một hơi rồi gõ lại nha! 💕",
  "Sai bét rùi nha! Gợi ý nè: Ngày mà một thiên thần siêu đáng yêu ra đời đó! ✨",
  "Gõ nhầm số rùi kìa! Bấm lại đàng hoàng coi chừng bị phạt đó nha! 🙈",
  "Ủa alo? Có phải chủ nhân của ngày sinh nhật này không dạ? Nhập lại mau! 🤭",
];

// === ÂM THANH HIỆU ỨNG WEB AUDIO API (TỰ ĐỘNG CHẠY MƯỢT MÀ KHÔNG CẦN TẢI FILE) ===
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Âm thanh hài hước "womp womp" khi nhập sai
function playWrongSound() {
  try {
    const ctx = getAudioContext();
    const notes = [
      { freq: 380, start: 0, dur: 0.2, type: "sawtooth" },
      { freq: 310, start: 0.22, dur: 0.24, type: "sawtooth" },
      { freq: 240, start: 0.48, dur: 0.28, type: "triangle" },
      { freq: 180, start: 0.78, dur: 0.55, type: "sawtooth" },
    ];
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.start);
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(50, n.freq * 0.75),
        ctx.currentTime + n.start + n.dur,
      );
      gain.gain.setValueAtTime(0.25, ctx.currentTime + n.start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + n.start + n.dur,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.start);
      osc.stop(ctx.currentTime + n.start + n.dur);
    });
  } catch (e) {
    console.log("AudioContext lỗi:", e);
  }
}

// Âm thanh chuông chiến thắng leng keng khi nhập đúng
function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.08 + 0.45,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.5);
    });
  } catch (e) {
    console.log("AudioContext lỗi:", e);
  }
}

// === GIỌNG ĐỌC LỜI NÓI (WEB SPEECH API) ===
function speakMessage(text) {
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "vi-VN";
      utter.rate = 1.05;
      utter.pitch = 1.15;
      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find((v) => v.lang && v.lang.includes("vi"));
      if (viVoice) utter.voice = viVoice;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.log("SpeechSynthesis error:", e);
    }
  }
}

// === TRÌNH PHÁT NHẠC (MUSIC CONTROL) ===
const MUSIC_TEXT = "Play Music 🎵";
function renderMusic() {
  const container = document.getElementById("music-container");
  if (!container) return;

  container.innerHTML = `
        <div class="music-control" id="music-btn">
            <div class="disk" id="music-disk"></div>
            <span style="font-size: 14px; font-weight: bold;">${MUSIC_TEXT}</span>
        </div>
        <!-- Nhạc nền khi nhập đúng / phát bình thường -->
        <audio id="bg-music" loop>
            <source src="${MUSIC || MUSIC_CORRECT}" type="audio/mpeg">
        </audio>
        <!-- Nhạc phát khi nhập sai mật khẩu -->
        <audio id="wrong-music">
            <source src="${MUSIC_WRONG}" type="audio/mpeg">
        </audio>`;

  const musicBtn = document.getElementById("music-btn");
  if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
  }
}

function toggleMusic() {
  const music = document.getElementById("bg-music");
  const disk = document.getElementById("music-disk");
  if (!music) return;

  if (music.paused) {
    music
      .play()
      .then(() => {
        if (disk) disk.classList.add("playing");
      })
      .catch((e) => console.log("Cần tương tác để phát nhạc:", e));
  } else {
    music.pause();
    if (disk) disk.classList.remove("playing");
  }
}

// === HIỂN THỊ VÀ ĐÓNG MODAL POPUP LỜI NÓI ===
function showWrongModal() {
  const modal = document.getElementById("wrong-modal");
  const speechEl = document.getElementById("speech-text");
  const errEl = document.getElementById("pass-error-msg");

  // Chọn ngẫu nhiên 1 câu nói
  const randomSpeech =
    WRONG_SPEECHES[Math.floor(Math.random() * WRONG_SPEECHES.length)];
  if (speechEl) {
    speechEl.textContent = randomSpeech;
  }

  if (errEl) {
    errEl.textContent = "❌ Mật khẩu chưa chính xác rồi nè!";
    errEl.classList.add("active");
  }

  // Phát nhạc / âm thanh sai
  const wrongMusic = document.getElementById("wrong-music");
  let playedFile = false;
  if (wrongMusic) {
    wrongMusic.currentTime = 0;
    wrongMusic
      .play()
      .then(() => {
        playedFile = true;
      })
      .catch(() => {
        // Nếu không có file nhạc sai hoặc trình duyệt chặn, dùng âm thanh Web Audio
        playWrongSound();
      });
  } else {
    playWrongSound();
  }
  // Chạy âm thanh Web Audio hỗ trợ thêm hiệu ứng sinh động
  setTimeout(playWrongSound, 50);

  // Phát giọng đọc lời nói tiếng Việt
  speakMessage(randomSpeech);

  // Mở popup modal
  if (modal) {
    modal.classList.add("active");
  }
}

function closeWrongModal() {
  const modal = document.getElementById("wrong-modal");
  if (modal) {
    modal.classList.remove("active");
  }

  // Tắt giọng đọc nếu đang nói
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // Dừng nhạc sai nếu đang phát
  const wrongMusic = document.getElementById("wrong-music");
  if (wrongMusic && !wrongMusic.paused) {
    wrongMusic.pause();
    wrongMusic.currentTime = 0;
  }

  // Reset lại ô nhập mã pin
  clearInput();
}

// Đóng modal khi bấm ra ngoài vùng đen hoặc phím ESC
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("wrong-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeWrongModal();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeWrongModal();
    }
  });

  // Khởi tạo bàn phím số xáo trộn ngẫu nhiên ngay khi mở
  shuffleNumpad(false);

  const decorBtn = document.querySelector(".numpad .num-decor");
  if (decorBtn) {
    decorBtn.addEventListener("click", () => shuffleNumpad(true));
  }
});

// === XỬ LÝ NHẬP MÃ PIN (LOCK SCREEN) ===
let currentInput = "";

// Hàm xáo trộn ngẫu nhiên các số trên bàn phím số
function shuffleNumpad(animate = true) {
  const numButtons = document.querySelectorAll(".numpad .digit-btn");
  if (!numButtons || numButtons.length === 0) return;

  const currentOrder = Array.from(numButtons).map(
    (b) => b.getAttribute("data-digit") || b.textContent.trim(),
  );
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  // Fisher-Yates shuffle đảm bảo thứ tự mới khác thứ tự cũ
  let attempts = 0;
  do {
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    attempts++;
  } while (attempts < 5 && digits.every((d, i) => d === currentOrder[i]));

  // Cập nhật ngẫu nhiên emoji vui vẻ ở nút góc
  const emojis = ["😎", "🥳", "✨", "🎂", "🌸", "💖", "🎉", "👑", "⭐"];
  const decorBtn = document.querySelector(".numpad .num-decor");
  if (decorBtn) {
    decorBtn.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  }

  numButtons.forEach((btn, index) => {
    const newDigit = digits[index];
    btn.setAttribute("data-digit", newDigit);
    btn.setAttribute("onclick", `press('${newDigit}')`);

    if (animate) {
      btn.classList.add("shuffling");
      setTimeout(() => {
        btn.textContent = newDigit;
        btn.classList.remove("shuffling");
      }, 75);
    } else {
      btn.textContent = newDigit;
    }
  });
}
window.shuffleNumpad = shuffleNumpad;

function press(num) {
  if (isMobilePortrait()) return; // Không cho nhập khi chưa xoay ngang
  const modal = document.getElementById("wrong-modal");
  if (modal && modal.classList.contains("active")) {
    return; // Đang mở popup thì không nhận phím
  }

  if (currentInput.length < 4) {
    currentInput += num;
    updateDots();

    // Mỗi lần chọn số: xáo trộn ngẫu nhiên các số trên bàn phím
    if (currentInput.length < 4) {
      shuffleNumpad(true);
    } else {
      setTimeout(checkPass, 180);
    }
  }
}

function clearInput() {
  currentInput = "";
  updateDots();
  const dots = document.querySelectorAll(".dot");
  dots.forEach((d) => d.classList.remove("error"));
  const errEl = document.getElementById("pass-error-msg");
  if (errEl) {
    errEl.textContent = "";
    errEl.classList.remove("active");
  }
  // Xáo trộn lại bàn phím khi xóa
  shuffleNumpad(true);
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    if (idx < currentInput.length) dot.classList.add("filled");
    else dot.classList.remove("filled");
  });
}

function checkPass() {
  const dots = document.querySelectorAll(".dot");
  if (currentInput === PASSCODE) {
    // Đúng mật khẩu -> Tắt nhạc sai và modal nếu có
    closeWrongModal();

    // Phát âm thanh chuông chiến thắng
    playCorrectSound();

    // Bắn pháo hoa confetti ăn mừng
    if (typeof confetti === "function") {
      confetti({
        particleCount: 180,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#ffd166", "#ff4d6d", "#06d6a0", "#118ab2", "#ffffff"],
      });
    }

    // Chuyển sang màn hình thiệp mừng & hộp quà (hoạt động độc lập tại chỗ)
    const cardScreen = document.getElementById("card-screen");
    if (cardScreen) {
      setTimeout(() => {
        const lockScreen = document.getElementById("lock-screen");
        if (lockScreen) lockScreen.classList.remove("active");
        cardScreen.classList.add("active");
        const mainTitle = document.getElementById("main-title");
        if (mainTitle) mainTitle.textContent = TITLE_TEXT;
        if (typeof startTypewriter === "function") startTypewriter();

        const music = document.getElementById("bg-music");
        if (music && music.paused && typeof toggleMusic === "function") {
          toggleMusic();
        }

        if (typeof initScratch === "function") initScratch();
        if (typeof initPhotoStack === "function") initPhotoStack();
      }, 600);
    }
  } else {
    // Sai mật khẩu -> Rung đỏ các chấm & hiện popup lời nói + phát nhạc sai
    dots.forEach((d) => d.classList.add("error"));
    showWrongModal();
  }
}

// === HIỂN THỊ ẢNH TRONG HỘP BÍ MẬT ===
function renderPhotos() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  gallery.innerHTML = "";

  PHOTO_LIST.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.className = "photo-stack";
    img.alt = "Kỷ niệm";
    gallery.appendChild(img);
  });
}

// === HIỆU ỨNG GÕ CHỮ (TYPEWRITER) ===
function startTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  let i = 0;
  el.innerHTML = '<span class="cursor"></span>';
  const cursor = el.querySelector(".cursor");

  function type() {
    if (i < LOVE_MESSAGE.length) {
      const char = LOVE_MESSAGE.charAt(i);
      const node = document.createTextNode(char);
      el.insertBefore(node, cursor);
      i++;
      setTimeout(type, 45);
    }
  }
  type();
}

// === THẺ CÀO BÍ MẬT (SCRATCH CARD) ===
let canvas, ctx, scratchBox;
let isDrawing = false;
let isScratchRevealed = false;

function initScratch() {
  canvas = document.getElementById("scratch");
  scratchBox = document.querySelector(".scratch-box");
  if (!canvas || !scratchBox) return;

  isScratchRevealed = false;
  canvas.style.display = "block";
  canvas.style.opacity = "1";
  canvas.style.pointerEvents = "auto";

  ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.globalCompositeOperation = "source-over";

  const w = scratchBox.offsetWidth || 320;
  const h = scratchBox.offsetHeight || 400;
  canvas.width = w;
  canvas.height = h;

  // Lớp phủ Gradient vàng hồng ánh kim sang trọng
  const grd = ctx.createLinearGradient(0, 0, w, h);
  grd.addColorStop(0, "#ff6b8b");
  grd.addColorStop(0.35, "#ff8e9e");
  grd.addColorStop(0.65, "#ffd166");
  grd.addColorStop(1, "#ff758c");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  // Hoa văn trang trí chấm sáng lấp lánh
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  for (let i = 0; i < 45; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * w,
      Math.random() * h,
      Math.random() * 10 + 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // Biểu tượng món quà ở giữa
  ctx.font = "38px 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🎁", w / 2, h / 2 - 35);

  // Dòng chữ chính
  ctx.font = "bold 20px 'Mali', cursive";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 6;
  ctx.fillText("✨ Cào nhẹ ở đây ✨", w / 2, h / 2 + 15);

  // Dòng chữ phụ
  ctx.font = "13px 'Mali', cursive";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText("Di chuột hoặc vuốt để mở ảnh", w / 2, h / 2 + 42);

  ctx.shadowBlur = 0;
}

const getPos = (e) => {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  let clientX = e.clientX;
  let clientY = e.clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  const scaleX = rect.width ? canvas.width / rect.width : 1;
  const scaleY = rect.height ? canvas.height / rect.height : 1;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
};

const scratch = (e) => {
  if (isMobilePortrait()) return; // Không cho cào khi chưa xoay ngang
  if (!isDrawing || !ctx || isScratchRevealed) return;
  if (e.cancelable) e.preventDefault();
  const pos = getPos(e);
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
  ctx.fill();
};

function revealScratch() {
  if (isScratchRevealed) return;
  isScratchRevealed = true;

  updatePhotoBadge();

  // Bắn pháo hoa nhẹ khi cào xong
  if (typeof confetti === "function") {
    confetti({
      particleCount: 90,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#ff4d6d", "#ffd166", "#ffffff"],
    });
  }

  if (canvas) {
    canvas.style.pointerEvents = "none";
    canvas.style.transition = "opacity 0.6s ease";
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.style.display = "none";
      startAutoSlide();
    }, 600);
  } else {
    startAutoSlide();
  }
}

function checkScratchPercent() {
  if (!canvas || !ctx || isScratchRevealed) return;
  try {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 16) {
      if (imageData.data[i] === 0) clearPixels++;
    }

    const totalChecked = imageData.data.length / 16;
    // Cào được > 12% là tự động mở mượt mà
    if (clearPixels / totalChecked > 0.65) {
      revealScratch();
    }
  } catch (err) {
    console.error(err);
  }
}

// === PHOTO STACK, TỰ ĐỘNG CHUYỂN ẢNH VÀ HỘP QUÀ KẾT THÚC ===
let autoSlideInterval = null;
let slidesCount = 0;
let isPhotoFinished = false;
let isTransitioning = false;

function updatePhotoBadge() {
  const badge = document.getElementById("photo-progress-badge");
  const photos = document.querySelectorAll(".photo-stack");
  if (!badge || !photos.length) return;

  if (!isScratchRevealed) {
    badge.innerHTML =
      '<i class="fas fa-magic"></i> ✨ Hãy cào tấm thẻ bên phải để khám phá ảnh nha!';
    badge.classList.remove("finished");
  } else if (isPhotoFinished) {
    badge.innerHTML =
      '<i class="fas fa-gift"></i> Đã xem hết ảnh! Chạm vào hộp quà bên phải 👉';
    badge.classList.add("finished");
  } else {
    const currentNum = Math.min(slidesCount + 1, photos.length);
    badge.innerHTML = `<i class="fas fa-camera-retro"></i> Ảnh ${currentNum}/${photos.length} • Tự chuyển hoặc chạm để lướt`;
    badge.classList.remove("finished");
  }
}

function initPhotoStack() {
  const photos = document.querySelectorAll(".photo-stack");
  slidesCount = 0;
  isPhotoFinished = false;
  isTransitioning = false;

  // Ẩn hộp quà nếu đang mở
  const giftWrapper = document.getElementById("gift-box-wrapper");
  if (giftWrapper) {
    giftWrapper.classList.remove("active", "opening");
    giftWrapper.style.display = "none";
    giftWrapper.style.opacity = "0";
  }

  photos.forEach((photo, index) => {
    photo.style.transform = `rotate(${Math.random() * 8 - 4}deg)`;
    photo.style.zIndex = photos.length - index;
    photo.style.pointerEvents = "auto";
    photo.style.cursor = "pointer";
    photo.classList.remove("dimmed", "fly-away");

    photo.onclick = (e) => {
      e.stopPropagation();
      if (isPhotoFinished || isTransitioning) return;
      nextPhoto(photo);
      resetAutoSlide();
    };
  });

  // Cho phép click vào bất kỳ đâu trên khung thẻ ảnh để chuyển ảnh
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.onclick = (e) => {
      if (isPhotoFinished || isTransitioning) return;
      const currentPhotos = document.querySelectorAll(".photo-stack");
      if (!currentPhotos.length) return;
      const currentTopPhoto = Array.from(currentPhotos).reduce(
        (prev, current) => {
          return parseInt(prev.style.zIndex || 0) >
            parseInt(current.style.zIndex || 0)
            ? prev
            : current;
        },
      );
      nextPhoto(currentTopPhoto);
      resetAutoSlide();
    };
  }

  // Kết nối sự kiện click vào hộp quà
  const giftBtn = document.getElementById("gift-box-btn");
  if (giftBtn)
    giftBtn.onclick = (e) => {
      e.stopPropagation();
      handleGiftBoxClick();
    };
  if (giftWrapper) {
    giftWrapper.onclick = (e) => {
      e.stopPropagation();
      handleGiftBoxClick();
    };
  }

  updatePhotoBadge();

  // Chỉ tự động chuyển ảnh nếu thẻ cào đã được mở
  if (isScratchRevealed) {
    startAutoSlide();
  }
}

function nextPhoto(photoElement) {
  if (!photoElement || isPhotoFinished || isTransitioning) return;
  const photos = document.querySelectorAll(".photo-stack");
  if (!photos.length) return;

  isTransitioning = true;
  slidesCount++;
  updatePhotoBadge();

  photoElement.classList.add("fly-away");

  setTimeout(() => {
    photoElement.classList.remove("fly-away");
    let minZ = Math.min(
      ...Array.from(photos).map((p) => parseInt(p.style.zIndex || 0)),
    );
    photoElement.style.zIndex = minZ - 1;
    photoElement.style.transform = `rotate(${Math.random() * 8 - 4}deg)`;
    isTransitioning = false;

    // Khi đã xem hết số lượng ảnh (click hết hoặc load hết ảnh)
    if (slidesCount >= photos.length) {
      finishPhotosAndShowGift();
    }
  }, 600);
}

function startAutoSlide() {
  const photos = document.querySelectorAll(".photo-stack");
  if (photos.length === 0 || isPhotoFinished) return;

  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    clearTimeout(autoSlideInterval);
    autoSlideInterval = null;
  }

  if (photos.length === 1) {
    // Nếu chỉ có 1 ảnh, sau 3.5 giây tự động xuất hiện hộp quà
    autoSlideInterval = setTimeout(() => {
      if (!isPhotoFinished) {
        finishPhotosAndShowGift();
      }
    }, 3500);
    return;
  }

  autoSlideInterval = setInterval(() => {
    if (isPhotoFinished) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
      return;
    }
    if (isTransitioning) return;

    const currentPhotos = document.querySelectorAll(".photo-stack");
    if (!currentPhotos.length) return;
    const currentTopPhoto = Array.from(currentPhotos).reduce(
      (prev, current) => {
        return parseInt(prev.style.zIndex || 0) >
          parseInt(current.style.zIndex || 0)
          ? prev
          : current;
      },
    );
    nextPhoto(currentTopPhoto);
  }, 3200);
}

function resetAutoSlide() {
  if (isPhotoFinished) return;
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    clearTimeout(autoSlideInterval);
    autoSlideInterval = null;
  }
  startAutoSlide();
}

// Khi đã click hết ảnh hoặc load hết ảnh -> Dừng load, dừng click và hiện hộp quà
function finishPhotosAndShowGift() {
  if (isPhotoFinished) return;
  isPhotoFinished = true;

  // 1. Dừng hoàn toàn auto-slide
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    clearTimeout(autoSlideInterval);
    autoSlideInterval = null;
  }

  // 2. Dừng click và làm mờ nhẹ ảnh
  const photos = document.querySelectorAll(".photo-stack");
  photos.forEach((p) => {
    p.style.pointerEvents = "none";
    p.style.cursor = "default";
    p.classList.add("dimmed");
  });

  // Cập nhật badge
  updatePhotoBadge();

  // 3. Pháo hoa confetti ăn mừng
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff4d6d", "#ffd166", "#ffffff", "#ff8fa3"],
    });
  }

  // 4. Hộp quà sinh nhật từ từ hiện ra
  const giftWrapper = document.getElementById("gift-box-wrapper");
  if (giftWrapper) {
    giftWrapper.style.display = "flex";
    giftWrapper.style.opacity = "0";
    void giftWrapper.offsetWidth; // trigger reflow
    giftWrapper.classList.add("active");
    giftWrapper.style.opacity = "1";
  }
}
window.finishPhotosAndShowGift = finishPhotosAndShowGift;

// Xử lý khi người dùng click vào hộp quà -> Bắn pháo hoa và chuyển sang trang flower.html
function handleGiftBoxClick() {
  const giftWrapper = document.getElementById("gift-box-wrapper");
  if (!giftWrapper || giftWrapper.classList.contains("opening")) return;

  giftWrapper.classList.add("opening");

  // Pháo hoa confetti rực rỡ
  if (typeof confetti === "function") {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#ff4d6d", "#ffd166", "#00f5d4", "#ffffff", "#ff8fa3"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#ff4d6d", "#ffd166", "#ff8fa3"],
      });
    }, 350);
  }

  // Âm thanh chúc mừng leng keng
  playCorrectSound();

  // Chuyển hướng sang trang flower.html
  setTimeout(() => {
    window.location.href = NEXT_PAGE_URL || "flower.html";
  }, 1000);
}

function closeCardGiftModal() {
  const modal = document.getElementById("card-gift-modal");
  if (modal) modal.classList.remove("active");
}
window.closeCardGiftModal = closeCardGiftModal;

// === HIỆU ỨNG HẠT NỀN BACKGROUND CANVAS ===
function initBackgroundAnimation() {
  const bgCanvas = document.getElementById("bg-canvas");
  if (!bgCanvas) return;
  const bgCtx = bgCanvas.getContext("2d");

  let width, height;
  let particles = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width;
    bgCanvas.height = height;
  }
  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? "#ff4d6d" : "#ffffff";
    }
    update() {
      this.y -= this.speedY;
      if (this.y < 0) this.y = height;
      this.opacity = Math.sin(Date.now() * 0.001 * this.speedY) * 0.2 + 0.3;
    }
    draw() {
      bgCtx.fillStyle = this.color;
      bgCtx.globalAlpha = this.opacity;
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateBg() {
    bgCtx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateBg);
  }
  animateBg();
}

// === KHỞI TẠO TOÀN BỘ TRANG ===
document.addEventListener("DOMContentLoaded", () => {
  renderMusic();
  renderPhotos();
  initBackgroundAnimation();

  const canvasEl = document.getElementById("scratch");
  if (canvasEl) {
    canvasEl.addEventListener("mousedown", (e) => {
      isDrawing = true;
      scratch(e);
    });
    canvasEl.addEventListener(
      "touchstart",
      (e) => {
        isDrawing = true;
        scratch(e);
      },
      { passive: false },
    );

    window.addEventListener("mouseup", () => {
      if (isDrawing) {
        isDrawing = false;
        checkScratchPercent();
      }
    });
    window.addEventListener("touchend", () => {
      if (isDrawing) {
        isDrawing = false;
        checkScratchPercent();
      }
    });

    canvasEl.addEventListener("mousemove", (e) => {
      if (isDrawing) {
        scratch(e);
        checkScratchPercent();
      }
    });
    canvasEl.addEventListener(
      "touchmove",
      (e) => {
        if (isDrawing) {
          scratch(e);
          checkScratchPercent();
        }
      },
      { passive: false },
    );
  }
});
