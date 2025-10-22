
const themeBtn = document.getElementById('themeBtn');
const wishBtn = document.getElementById('wishBtn');
const snowBtn = document.getElementById('snowBtn');
const confettiBtn = document.getElementById('confettiBtn');
const heartsBtn = document.getElementById('heartsBtn');
const songBtn = document.getElementById('songBtn');
const loveModalBtn = document.getElementById('loveModalBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const chainBtn = document.getElementById('chainBtn');
const stopBtn = document.getElementById('stopBtn');

const mainContent = document.getElementById('mainContent');
const body = document.body;
const effectCanvas = document.getElementById('effectCanvas');
const ctx = effectCanvas.getContext('2d');

let animationFrameId;
let effects = [];
let synth, part;

// --- Theme Changer ---
const themes = ['theme-purple-black', 'theme-dark-blue', 'theme-light-pink', 'theme-forest-green', 'theme-classic-black'];
let currentThemeIndex = 0;

themeBtn.addEventListener('click', () => {
    body.classList.remove(...themes);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    if (themes[currentThemeIndex] !== 'theme-purple-black') {
        body.classList.add(themes[currentThemeIndex]);
    }
});

// --- Modal Logic ---
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById(modalId).classList.add('flex');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('flex');
}

wishBtn.addEventListener('click', () => openModal('wishModal'));
loveModalBtn.addEventListener('click', () => openModal('loveModal'));

// --- Canvas Effects ---
function resizeCanvas() {
    effectCanvas.width = window.innerWidth;
    effectCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function clearCanvas() {
    ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
}

function animateEffects() {
    clearCanvas();
    effects = effects.filter(effect => {
        effect.update();
        effect.draw();
        return effect.isAlive();
    });
    animationFrameId = requestAnimationFrame(animateEffects);
}

function stopAllEffects() {
    effects = [];
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    clearCanvas();
}
stopBtn.addEventListener('click', () => {
    stopAllEffects();
    if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }
    if (synth) synth.releaseAll();
});


// Snowfall
class Snowflake {
    constructor() {
        this.x = Math.random() * effectCanvas.width;
        this.y = Math.random() * -effectCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.y += this.speed;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    isAlive() {
        return this.y < effectCanvas.height;
    }
}

snowBtn.addEventListener('click', () => {
    if (!animationFrameId) animateEffects();
    for (let i = 0; i < 100; i++) {
        effects.push(new Snowflake());
    }
});

// Confetti
const confettiColors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
class Confetti {
    constructor() {
        this.x = Math.random() * effectCanvas.width;
        this.y = Math.random() * -effectCanvas.height / 2;
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 3 + 2;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.rotation = Math.random() * 360;
        this.spin = Math.random() * 10 - 5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.spin;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
    isAlive() {
        return this.y < effectCanvas.height + this.size;
    }
}

confettiBtn.addEventListener('click', () => {
    if (!animationFrameId) animateEffects();
    for (let i = 0; i < 200; i++) {
        effects.push(new Confetti());
    }
});

// Hearts
class Heart {
    constructor() {
        this.x = Math.random() * effectCanvas.width;
        this.y = Math.random() * effectCanvas.height - effectCanvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.7 + 0.3;
    }
    update() {
        this.y += this.speed;
    }
    draw() {
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = `rgba(255, 20, 147, ${this.opacity})`;
        ctx.fillText('❤️', this.x, this.y);
    }
    isAlive() {
        return this.y < effectCanvas.height + this.size;
    }
}

heartsBtn.addEventListener('click', () => {
    if (!animationFrameId) animateEffects();
    for (let i = 0; i < 30; i++) {
        effects.push(new Heart());
    }
});


// --- Birthday Song ---
songBtn.addEventListener('click', async () => {
    await Tone.start();

    // If song is already playing, stop it and reset.
    if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        if (synth) synth.releaseAll();
        return;
    }

    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const notes = [
        { time: '0:0', note: 'C4', duration: '8n' }, { time: '0:0:2', note: 'C4', duration: '8n' },
        { time: '0:1', note: 'D4', duration: '4n' }, { time: '0:2', note: 'C4', duration: '4n' },
        { time: '0:3', note: 'F4', duration: '4n' }, { time: '1:0', note: 'E4', duration: '2n' },
        { time: '1:2', note: 'C4', duration: '8n' }, { time: '1:2:2', note: 'C4', duration: '8n' },
        { time: '1:3', note: 'D4', duration: '4n' }, { time: '2:0', note: 'C4', duration: '4n' },
        { time: '2:1', note: 'G4', duration: '4n' }, { time: '2:2', note: 'F4', duration: '2n' },
        { time: '3:0', note: 'C4', duration: '8n' }, { time: '3:0:2', note: 'C4', duration: '8n' },
        { time: '3:1', note: 'C5', duration: '4n' }, { time: '3:2', note: 'A4', duration: '4n' },
        { time: '3:3', note: 'F4', duration: '4n' }, { time: '4:0', note: 'E4', duration: '4n' },
        { time: '4:1', note: 'D4', duration: '2n' },
        { time: '4:3', note: 'A#4', duration: '8n' }, { time: '4:3:2', note: 'A#4', duration: '8n' },
        { time: '5:0', note: 'A4', duration: '4n' }, { time: '5:1', note: 'F4', duration: '4n' },
        { time: '5:2', note: 'G4', duration: '4n' }, { time: '5:3', note: 'F4', duration: '2n' }
    ];

    part = new Tone.Part((time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time);
    }, notes).start(0);

    Tone.Transport.start();
});


// --- Surprise Message ---
// surpriseBtn.addEventListener('click', () => {
//     const surpriseContainer = document.getElementById('surpriseContainer');
//     mainContent.classList.add('hidden');
//     surpriseContainer.classList.remove('hidden');
//     surpriseContainer.innerHTML = `
//         <div class="typing-container">
//             <p class="typed-text text-xl md:text-3xl font-orbitron" style="color: var(--text-color); width: 70vw;"> Wishing you the happiest birthday. It is a small gift from me, You know I don't know how to impressively, I always preffer to stay silent, I talk less and don't know how to say something and to express feelings, so please understand my feelings.</p>
//         </div>
//     `;
//     setTimeout(() => {
//         mainContent.classList.remove('hidden');
//         surpriseContainer.classList.add('hidden');
//     }, 45000);
// });

surpriseBtn.addEventListener('click', () => {
    const surpriseContainer = document.getElementById('surpriseContainer');
    mainContent.classList.add('hidden');
    surpriseContainer.classList.remove('hidden');

    surpriseContainer.innerHTML = `
        <div class="typing-container" style="overflow-y: auto; max-height: 80vh; padding: 1rem; position: relative;">
            <p id="typedText" class="typed-text text-xl md:text-3xl font-orbitron" 
               style="color: var(--text-color); width: 70vw; white-space: pre-wrap; line-height: 1.5;"></p>
            <p id="countdown" style="
                position: absolute; 
                bottom: 10px; 
                right: 10px; 
                color: var(--secondary-color); 
                font-size: 0.8rem;
                font-weight: bold;
            "></p>
        </div>
    `;

    const typedText = document.getElementById("typedText");
    const countdownEl = document.getElementById("countdown");
    const container = typedText.parentElement;

    // const text = "Wishing you the happiest birthday. It is a small gift from me, You know I don't know how to impressively, I always prefer to stay silent, I talk less and don't know how to say something and to express feelings, so please understand my feelings. I hope you will never leave me, I love you so so much ❤️";
    const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.";

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typedText.textContent += text.charAt(i);
            i++;

            // Auto-scroll
            container.scrollTop = container.scrollHeight;

            setTimeout(typeWriter, 70);
        }
    }
    typeWriter();

    // Countdown logic
    let remainingSeconds = 59;
    countdownEl.textContent = `${remainingSeconds}s`;

    const countdownInterval = setInterval(() => {
        remainingSeconds--;
        if (remainingSeconds >= 0) {
            countdownEl.textContent = `${remainingSeconds}s`;
        }
    }, 1000);

    // Hide after 45s
    setTimeout(() => {
        clearInterval(countdownInterval); // stop countdown
        mainContent.classList.remove('hidden');
        surpriseContainer.classList.add('hidden');
    }, 59000);
});



// --- Message Chain ---
const messages = [
    {
        text: "Hey, I was just thinking...",
        buttons: [{ text: "About what?", next: 1 }]
    },
    {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.",
        buttons: [{ text: "Haha, of course!", next: 2 }]
    },
    {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.",
        buttons: [{ text: "Yeah I agreee with you, That was so amazing and exciting !", next: 3 }]
    },
    {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.",
        buttons: [{ text: "Are you mad? ", next: 4 }]
    },
    {
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, ducimus? Vitae tempora adipisci sapiente. Reiciendis, perspiciatis accusantium. Soluta, ipsa! Dolor totam architecto distinctio voluptas reiciendis eos porro ducimus eius delectus.",
        buttons: [{ text: "Okay, now I'm blushing...", next: 5 }]
    },
    {
        text: "Good. 😉 My point is, today is all about celebrating you and how wonderful you are.",
        buttons: [{ text: "This is so sweet...", next: 6 }]
    },
    {
        text: "Happy Birthday , my love. I can't wait to make so many more memories with you. ❤️",
        buttons: [{ text: "I love you more! ❤️", next: -1 }] // -1 to close
    }
];

function showChainMessage(index) {
    if (index === -1) {
        closeModal('chainModal');
        return;
    }
    const message = messages[index];
    const contentDiv = document.getElementById('chainModalContent');
    let buttonsHtml = message.buttons.map(btn =>
        `<button class="robotic-btn !text-sm !py-2 w-full mt-2" onclick="showChainMessage(${btn.next})">${btn.text}</button>`
    ).join('');

    contentDiv.innerHTML = `
                <p class="mb-4">${message.text}</p>
                ${buttonsHtml}
                ${index !== (messages.length - 1) ? '<button class="mt-4 text-xs" onclick="closeModal(\'chainModal\')">Close</button>' : ''}
            `;
}

chainBtn.addEventListener('click', () => {
    showChainMessage(0);
    openModal('chainModal');
});