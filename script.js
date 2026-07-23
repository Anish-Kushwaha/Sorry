const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn'); 
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const loaderScreen = document.getElementById('loader-screen');
const loaderText = document.getElementById('loader-text');
const loaderFill = document.getElementById('loaderFill');
const mainEmoji = document.getElementById('mainEmoji');
const audio = document.getElementById('myAudio');
const trollMsg = document.getElementById('trollMsg');
const trollBox = document.getElementById('trollBox');
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');

// --- Sound System ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'whoosh') {
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

// --- Cursor Trail ---
let particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 280}, 100%, 70%)`;
        this.alpha = 1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
        this.alpha -= 0.02;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color; ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
    }
}

window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) particles.push(new Particle(e.x, e.y));
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        if (particles[i].alpha <= 0) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- Main UI Logic ---
const trollPhrases = ["Pakad ke dikhao! 🏃‍♀️", "Itna slow? 🐢", "Try again ji! 😜", "Nahi milega! 🚫"];

function moveButton() {
    playSound('whoosh');
    const maxX = window.innerWidth - yesBtn.offsetWidth - 20;
    const maxY = window.innerHeight - yesBtn.offsetHeight - 20;
    const newX = Math.max(10, Math.floor(Math.random() * maxX));
    const newY = Math.max(10, Math.floor(Math.random() * maxY));
    yesBtn.style.left = newX + "px";
    yesBtn.style.top = newY + "px";
    yesBtn.style.transform = "none";
    yesBtn.innerText = trollPhrases[Math.floor(Math.random() * trollPhrases.length)];
}

yesBtn.addEventListener('mouseover', moveButton);
yesBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveButton(); });

// --- Feature 4: Mood Slider Logic ---
const moodScreen = document.getElementById('mood-screen');
const moodSlider = document.getElementById('moodSlider');
const moodEmoji = document.getElementById('moodEmoji');
const moodLabel = document.getElementById('moodLabel');

noBtn.addEventListener('click', () => {
    playSound('pop');
    yesBtn.style.display = 'none';
    confetti({ particleCount: 100, spread: 60 });
    screen1.style.display = 'none';
    moodScreen.classList.remove('hidden'); // Opens the mood slider screen
});

moodSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (val <= 25) {
        moodEmoji.innerText = "😤";
        moodLabel.innerText = "Current Mood: Very Angry! 🤬";
        moodLabel.style.color = "#ff416c";
    } else if (val <= 50) {
        moodEmoji.innerText = "😕";
        moodLabel.innerText = "Current Mood: Still Annoyed... 🫤";
        moodLabel.style.color = "#fd79a8";
    } else if (val <= 75) {
        moodEmoji.innerText = "🙂";
        moodLabel.innerText = "Current Mood: Okay, slightly better. 😐";
        moodLabel.style.color = "#7950f2";
    } else if (val < 95) {
        moodEmoji.innerText = "😊";
        moodLabel.innerText = "Current Mood: Smiling? Almost there! 😊";
        moodLabel.style.color = "#2ed573";
    } else if (val >= 95) {
        moodEmoji.innerText = "🥰";
        moodLabel.innerText = "Current Mood: Genuine Smile Detected! ❤️";
        moodLabel.style.color = "#00b894";
        
        moodSlider.disabled = true; // Avoids multiple triggers

        setTimeout(() => {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            moodScreen.style.display = 'none';
            loaderScreen.classList.remove('hidden');

            setTimeout(() => {
                loaderFill.classList.add('success-green');
                loaderText.innerText = "{name}'s Genuine Smile Detected! 😊";
                loaderText.classList.add('text-success-green');
                playSound('success');
                confetti({ particleCount: 40, spread: 50 });
            }, 1800);

            setTimeout(() => {
                loaderScreen.style.display = 'none';
                screen2.classList.remove('hidden');
                screen2.classList.add('zoom-in-entrance');
                document.body.classList.add('show-magic');
                document.body.classList.add('magic-theme'); 
                setInterval(createSparkle, 500);
                audio.play().catch(e => {});
            }, 3500);
        }, 800);
    }
});

// --- Feature 2: Audio Visualizer Logic ---
let visInitialized = false;
function initVisualizer() {
    if (visInitialized) return;
    visInitialized = true;

    if (audioCtx.state === 'suspended') audioCtx.resume();

    const src = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasElement = document.getElementById('visualizerCanvas');
    const canvasCtx = canvasElement.getContext('2d');

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const barWidth = (canvasElement.width / bufferLength) * 1.6;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * canvasElement.height;

            const r = (i * 10) % 255;
            const g = 140;
            const b = 230;

            canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            canvasCtx.fillRect(x, canvasElement.height - barHeight, barWidth - 2, barHeight);

            x += barWidth;
        }
    }
    draw();
}

audio.addEventListener('play', initVisualizer);

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle'; sparkle.innerHTML = '✨';
    sparkle.style.left = Math.random() * 100 + 'vw';
    document.getElementById('sparkles-container').appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4000);
}

const ultimateSecrets = [
    { t: "Mana kiya tha na {name}! ab text padhte raho....😂", c: "#ff416c" },
    { t: "You are so stubborn😜", c: "#7950f2" },
    { t: "Smile toh aa gayi hogi ab tak.📸", c: "#f08c00" },
    { t: "You'll never find someone who cheers you up like this... 😝", c: "#7b3f00" },
    { t: "Honestly, annoying you is my favorite thing to do! 🐒", c: "#a18cd1" },
    { t: "Chalo now stop being angry", c: "#7b3f00" },
    { t: "Oye, you look so cute when you are angry! ✨", c: "#e84393" },
    { t: "Zyada nakhre mat dikhaya kro meko sharm aati hai🫣😝", c: "#0984e3" },
    { t: "Chalo ab bahut trolling ho gayi, dil se sorry! 🙂️", c: "#ff4757" },
    { t: "Are you smiling now? Yes or No? Reply fast! 🏃‍♀️", c: "#2ed573" },
    { t: "No. 1 nakhre wali Ladki! 👑", c: "#f9ca24" },
    { t: "100 times sorry to {name}! ✨", c: "#6d597a" }
];

// --- Feature 5: Typewriter Effect Helper ---
function typeWriter(text, element, speed = 40) {
    element.textContent = ""; // Use textContent to preserve all spaces on mobile
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

let trollIdx = 0;
let loopStarted = false;
function startUltimateTroll() {
    if (loopStarted) return;
    loopStarted = true;
    trollBox.classList.remove('glowing-border');
    
    // Pehla message bina delay ke start hoga
    trollMsg.style.opacity = 1;
    typeWriter(ultimateSecrets[trollIdx].t, trollMsg);
    trollBox.style.borderColor = ultimateSecrets[trollIdx].c;
    trollMsg.style.color = ultimateSecrets[trollIdx].c;
    trollIdx = (trollIdx + 1) % ultimateSecrets.length;

    setInterval(() => {
        trollMsg.style.opacity = 0;
        setTimeout(() => {
            trollMsg.style.opacity = 1;
            typeWriter(ultimateSecrets[trollIdx].t, trollMsg);
            trollBox.style.borderColor = ultimateSecrets[trollIdx].c;
            trollMsg.style.color = ultimateSecrets[trollIdx].c;
            trollIdx = (trollIdx + 1) % ultimateSecrets.length;
        }, 300);
        confetti({ particleCount: 20, spread: 50, colors: [ultimateSecrets[trollIdx].c] });
    }, 3800); // 3.8s isliye kiya taaki typing completely khatam ho jaye
}