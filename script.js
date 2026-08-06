const pages = [
  {
    title: "Piuuu meri bestie queen...",
    sticker: "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
    message: "Mujhse galti ho gayi, aur haan main excuses nahi banaunga. Bas dil se bol raha hoon: sorry Piuuu, please thoda sa maaf kar do na. 🥺"
  },
  {
    title: "Official cute apology notice 💌",
    sticker: "https://media.giphy.com/media/9d3LQ6TdV2Flo8ODTU/giphy.gif",
    message: "Dear Piuuu, tumhari narazgi bilkul valid hai. Main apni stupidity ko pink glitter mein pack karke dustbin mein daal raha hoon. Sorry yaar! 🎀"
  },
  {
    title: "Drama level: filmy sorry 🌧️",
    sticker: "https://media.giphy.com/media/l4FGpP4lxGGgK5CBW/giphy.gif",
    message: "Agar ye Bollywood hota na, toh main baarish mein khada hoke bolta: ‘Piuuu, tumhari smile ke bina background music bhi sad lagta hai.’ Maaf kar do please. 🎬"
  },
  {
    title: "Tiny teddy court mein appeal 🧸",
    sticker: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY21jYW1janV0YjZyc3k0aGR4ZTZ6Ynl6a3Q0NXVuMTZ6em44bGpibCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEduOnl5IHM5NRodO/giphy.gif",
    message: "Judge Piuuu ji, accused ne accept kar liya hai ki usne hurt kiya. Punishment: 100 sorry, 50 compliments, aur lifelong better behavior. Verdict please: maafi? 🥹"
  },
  {
    title: "Sorry but make it magical ✨",
    sticker: "https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif",
    message: "Main wish karta hoon ki ek magic wand se tumhara mood instantly happy ho jaye. Tab tak meri taraf se sparkly sorry, extra care, aur no-repeat promise. 🌸"
  },
  {
    title: "Piuuu smile rescue mission 🚀",
    sticker: "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
    message: "Mission ka target simple hai: Piuuu ki smile wapas lana. Fuel: meri guilt. Rocket: ye cute website. Landing message: I am really, really sorry. 💗"
  },
  {
    title: "Final boss apology unlocked 👑",
    sticker: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",
    message: "Piuuu, mazaak alag, tum mere liye important ho. Agar maine tumhe hurt kiya, I am genuinely sorry. Please ‘Yes’ dabao aur mujhe ek chance de do. 🫶"
  }
];

const card = document.getElementById("card");
const stepText = document.getElementById("stepText");
const sticker = document.getElementById("sticker");
const title = document.getElementById("title");
const message = document.getElementById("message");
const meterFill = document.getElementById("meterFill");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const happyPage = document.getElementById("happyPage");
const sorrySong = document.getElementById("sorrySong");
const hearts = document.getElementById("hearts");

let pageIndex = 0;
let typingTimer;

function typeMessage(text) {
  clearInterval(typingTimer);
  message.textContent = "";
  let charIndex = 0;
  typingTimer = setInterval(() => {
    message.textContent += text.charAt(charIndex);
    charIndex += 1;
    if (charIndex >= text.length) clearInterval(typingTimer);
  }, 18);
}

function renderPage() {
  const page = pages[pageIndex];
  stepText.textContent = `Page ${pageIndex + 1} / ${pages.length}`;
  sticker.src = page.sticker;
  title.textContent = page.title;
  yesBtn.textContent = pageIndex === pages.length - 1 ? "Yes, maaf kiya 💖" : "Next sorry ✨";
  meterFill.style.width = `${((pageIndex + 1) / pages.length) * 100}%`;
  card.style.animation = "none";
  card.offsetHeight;
  card.style.animation = "pop 0.55s cubic-bezier(.2, 1.4, .4, 1) both";
  typeMessage(page.message);
}

function moveNoButton(event) {
  event.preventDefault();
  const padding = 16;
  const maxX = Math.max(padding, window.innerWidth - noBtn.offsetWidth - padding);
  const maxY = Math.max(padding, window.innerHeight - noBtn.offsetHeight - padding);
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
  noBtn.classList.remove("runaway");
  noBtn.offsetHeight;
  noBtn.classList.add("runaway");
  noBtn.textContent = ["Nope, catch me 😝", "Not allowed 🙈", "Maafi pending 💅", "Try Yes na 🥺"][Math.floor(Math.random() * 4)];
}

function launchFinalPage() {
  document.querySelector(".app-shell").classList.add("hidden");
  happyPage.classList.remove("hidden");
  noBtn.classList.add("hidden");
  confetti({ particleCount: 220, spread: 110, origin: { y: 0.65 } });
  sorrySong.play().catch(() => {
    document.body.addEventListener("click", () => sorrySong.play(), { once: true });
  });
}

function floatHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = ["💗", "💖", "🌸", "✨", "🎀", "🫶"][Math.floor(Math.random() * 6)];
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${Math.random() * 1.2 + 1.1}rem`;
  heart.style.animationDuration = `${Math.random() * 2 + 4}s`;
  hearts.appendChild(heart);
  setTimeout(() => heart.remove(), 6500);
}

yesBtn.addEventListener("click", () => {
  confetti({ particleCount: 80, spread: 75, origin: { y: 0.72 } });
  if (pageIndex < pages.length - 1) {
    pageIndex += 1;
    renderPage();
    return;
  }
  launchFinalPage();
});

noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("mouseover", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton, { passive: false });

renderPage();
setInterval(floatHeart, 550);
