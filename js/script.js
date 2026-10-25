// Kiểm tra thiết bị có đang ở chế độ màn hình dọc trên mobile/tablet không
function isMobilePortrait() {
  return window.innerWidth <= 900 && window.innerHeight > window.innerWidth;
}
function decodeBase64Unicode(str) {
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(str),
          (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
        )
        .join(""),
    );
  } catch (e) {
    console.error("Lỗi giải mã Base64:", e);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const letterBox = document.getElementById("letter-box");
  const letterContent = document.getElementById("letter-content");
  const audio = document.getElementById("audio-ms");

  // Dữ liệu mặc định nếu không có tham số URL
  let data = {
    lf: "Happy Birthday To You!",
    tf: "Gửi Chị 💐",
    cf: "Hôm nay là một ngày đặc biệt... Chúc chị luôn vui vẻ, hạnh phúc và thành công trong mọi lĩnh vực. Chúc chị có một ngày sinh nhật thật ý nghĩa bên gia đình và bạn bè.  🎉",
    sf: "Sinh nhật vui vẻ!  ❤️",
    mf: "a.mp3",
  };

  const params = new URLSearchParams(window.location.search);
  const encodedData = params.get("id");

  if (encodedData) {
    const decoded = decodeBase64Unicode(encodedData);
    if (decoded) {
      try {
        const parsed = JSON.parse(decoded);
        data = { ...data, ...parsed };
      } catch (err) {
        console.error("Dữ liệu JSON không hợp lệ", err);
      }
    }
  }

  // Cập nhật text đặc biệt trên bó hoa
  const specialTextEl = document.getElementById("special-text");
  if (specialTextEl) {
    specialTextEl.textContent = data.lf || "Tặng em một bó hoa";
  }

  // Cài đặt nguồn nhạc
  if (audio) {
    audio.src = data.mf || "a.mp3";
  }

  // Trang chuyển tiếp khi ấn vào hộp quà bí mật
  let NEXT_PAGE_URL = "galaxy-box.html";

  // Âm thanh chuông chúc mừng Web Audio API
  function playChimeSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + idx * 0.1 + 0.6,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.65);
      });
    } catch (e) {
      console.log("Audio play error:", e);
    }
  }

  // Biến trạng thái
  let isLetterOpened = false;
  let isWishFinished = false;
  let isOpeningSecretGift = false;

  // Hàm mở hộp quà bí mật tại chỗ (hoạt động độc lập, không chuyển trang)
  function openSecretGift() {
    if (isMobilePortrait()) return; // Không cho mở quà khi chưa xoay ngang
    if (isOpeningSecretGift) return;
    isOpeningSecretGift = true;

    const giftBox = document.getElementById("secret-gift-box");
    const floatingGift = document.getElementById("floating-gift-shortcut");

    if (giftBox) giftBox.classList.add("opening");
    if (floatingGift) floatingGift.classList.add("opening");

    // Phát âm thanh chuông leng keng
    playChimeSound();

    // Bắn pháo hoa confetti rực rỡ
    if (typeof confetti === "function") {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
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

    // Hiện modal chúc mừng sinh nhật ngọt ngào tại chỗ, không nhảy trang
    setTimeout(() => {
      const modal = document.getElementById("flower-gift-modal");
      if (modal) modal.classList.add("active");
    }, 600);
  }

  function closeFlowerGiftModal() {
    const modal = document.getElementById("flower-gift-modal");
    if (modal) modal.classList.remove("active");
    isOpeningSecretGift = false;
    const giftBox = document.getElementById("secret-gift-box");
    const floatingGift = document.getElementById("floating-gift-shortcut");
    if (giftBox) giftBox.classList.remove("opening");
    if (floatingGift) floatingGift.classList.remove("opening");
  }
  window.closeFlowerGiftModal = closeFlowerGiftModal;
  window.goToGalaxyBox = function() {
    window.location.href = NEXT_PAGE_URL || "galaxy-box.html";
  };

  // Hàm tạo các tấm ảnh nhỏ bay ngang qua từ trái sang phải
  function startFloatingPhotos() {
    if (isWishFinished) return;
    isWishFinished = true;

    const container = document.getElementById("floating-photos-container");
    if (!container) return;
    container.innerHTML = "";

    const photos = [
      {
        src: "assets/valentine/avt.jpg",
        sticker: "💖",
        caption: "Xinh đẹp ✨",
        top: 10,
        size: 115,
        duration: 11,
        delay: 0,
      },
      {
        src: "assets/valentine/image.png",
        sticker: "🌸",
        caption: "Đáng yêu 💕",
        top: 32,
        size: 118,
        duration: 13,
        delay: 2.2,
      },
      {
        src: "assets/a/anhz.png",
        sticker: "🎀",
        caption: "Sinh Nhật Vui Vẻ 🎉",
        top: 50,
        size: 122,
        duration: 10.5,
        delay: 4.6,
      },
      {
        src: "assets/valentine/5.jpg",
        sticker: "✨",
        caption: "Tuổi mới rực rỡ 🌟",
        top: 16,
        size: 125,
        duration: 12,
        delay: 7.0,
      },
      {
        src: "assets/valentine/2.jpg",
        sticker: "🥰",
        caption: "Luôn hạnh phúc nha 🍀",
        top: 46,
        size: 125,
        duration: 11.5,
        delay: 9.4,
      },
      {
        src: "assets/valentine/3.jpg",
        sticker: "😁",
        caption: "Lắm Tiền Nha 🍀",
        top: 26,
        size: 118,
        duration: 11.5,
        delay: 12.4,
      },
    ];

    photos.forEach((item) => {
      const card = document.createElement("div");
      card.className = "mini-photo-card";
      card.style.top = `${item.top}%`;
      card.style.width = `${item.size}px`;
      card.style.animationDuration = `${item.duration}s`;
      card.style.animationDelay = `${item.delay}s`;

      card.innerHTML = `
                <span class="mini-photo-badge">${item.sticker}</span>
                <img src="${item.src}" alt="Kỷ niệm" />
                <span class="mini-photo-caption">${item.caption}</span>
            `;
      container.appendChild(card);
    });
  }

  // Hiệu ứng gõ chữ cho bức thư, khi gõ xong thì kích hoạt ảnh bay và hộp quà bí mật
  function renderTypewriterWish() {
    if (!letterContent) return;
    letterContent.innerHTML = "";

    // Tiêu đề
    const h2 = document.createElement("h2");
    h2.textContent = data.tf || "Gửi Chị 💐";
    h2.classList.add("fade-in");
    letterContent.appendChild(h2);

    // Nội dung lời chúc gõ từng chữ
    const p = document.createElement("p");
    p.innerHTML = '<span class="typing-cursor"></span>';
    letterContent.appendChild(p);

    const cursor = p.querySelector(".typing-cursor");
    const wishText =
      data.cf ||
      "Hôm nay là một ngày đặc biệt... Chúc chị luôn vui vẻ, hạnh phúc và thành công trong mọi lĩnh vực. Chúc chị có một ngày sinh nhật thật ý nghĩa bên gia đình và bạn bè. 🎉";
    let charIndex = 0;

    function typeChar() {
      if (charIndex < wishText.length) {
        const char = wishText.charAt(charIndex);
        const textNode = document.createTextNode(char);
        p.insertBefore(textNode, cursor);
        charIndex++;
        setTimeout(typeChar, 32);
      } else {
        // KHI HIỆN LỜI CHÚC XONG:
        if (cursor) cursor.remove();

        // Hiện chữ ký
        if (data.sf) {
          const sign = document.createElement("div");
          sign.textContent = data.sf;
          sign.classList.add("letter-sign", "fade-in");
          letterContent.appendChild(sign);
        }

        // Hiện hộp quà bí mật trong bức thư
        const giftBox = document.createElement("div");
        giftBox.id = "secret-gift-box";
        giftBox.className = "secret-gift-box show";
        giftBox.innerHTML = `
                    <div class="secret-gift-halo"></div>
                    <div class="secret-gift-icon-wrap">
                        <span class="secret-gift-icon">🎁</span>
                        <span class="secret-gift-ribbon">🎀</span>
                    </div>
                    <div class="secret-gift-info">
                        <div class="secret-gift-title">Hộp Quà Bí Mật 💖</div>
                        <div class="secret-gift-desc">Còn một bất ngờ nữa dành cho Chị nè...</div>
                    </div>
                    <div class="secret-gift-badge">Chạm để mở ✨</div>
                `;
        giftBox.onclick = (e) => {
          e.stopPropagation();
          openSecretGift();
        };
        letterContent.appendChild(giftBox);

        // Hiện nút hộp quà nổi ngoài màn hình hoa
        const floatingGift = document.getElementById("floating-gift-shortcut");
        if (floatingGift) {
          floatingGift.classList.add("show");
          floatingGift.onclick = (e) => {
            e.stopPropagation();
            openSecretGift();
          };
        }

        // Bắn nhẹ pháo hoa confetti
        if (typeof confetti === "function") {
          confetti({
            particleCount: 90,
            spread: 65,
            origin: { y: 0.6 },
            colors: ["#ff4d6d", "#ffd166", "#ffffff", "#ff8fa3"],
          });
        }

        // CÁC TẤM ẢNH NHO NHỎ BAY NGANG QUA TỪ TRÁI QUA PHẢI!
        startFloatingPhotos();
      }
    }

    // Bắt đầu gõ sau 250ms
    setTimeout(typeChar, 250);
  }

  // Mở và đóng bức thư
  const btnLetter = document.getElementById("btn-letter");
  const letterHint = document.getElementById("letter-hint");

  function openLetter() {
    if (letterBox) {
      letterBox.style.display = "flex";
    }
    if (letterHint) {
      letterHint.style.transition = "opacity 0.3s ease";
      letterHint.style.opacity = "0";
      setTimeout(() => {
        letterHint.style.display = "none";
      }, 300);
    }
    if (btnLetter) {
      btnLetter.classList.remove("highlight");
    }

    // Kích hoạt gõ lời chúc lần đầu mở thư
    if (!isLetterOpened) {
      isLetterOpened = true;
      renderTypewriterWish();
    }
  }

  // Sự kiện khi bấm vào ảnh quà ban đầu
  let started = false;
  const btnDevpan = document.getElementById("btn-devpan");
  if (btnDevpan) {
    btnDevpan.addEventListener("click", () => {
      if (started) return;
      started = true;

      if (audio && audio.src) {
        audio.currentTime = 0;
        audio
          .play()
          .catch((e) => console.log("Trình duyệt chặn phát tự động:", e));
      }

      const initialScreen = document.getElementById("pantalla-inicial");
      const mainContent = document.getElementById("contenido-principal");
      if (initialScreen) initialScreen.style.display = "none";
      if (mainContent) mainContent.style.display = "block";

      const ramo = document.querySelector(".ramo");
      if (ramo) ramo.classList.add("ramo--visible");

      if (btnLetter) btnLetter.style.display = "block";

      // Khi hoa được vẽ xong (~3.8s) -> Hiện thông báo nhỏ nhắc click vào bức thư
      setTimeout(() => {
        if (letterHint) {
          letterHint.classList.add("show");
        }
        if (btnLetter) {
          btnLetter.classList.add("highlight");
        }
      }, 3800);
    });
  }

  if (btnLetter) {
    btnLetter.onclick = openLetter;
  }

  if (letterHint) {
    letterHint.onclick = openLetter;
  }

  if (letterBox) {
    letterBox.addEventListener("click", () => {
      letterBox.style.display = "none";
    });
  }

  if (letterContent) {
    letterContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});
