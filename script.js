/* ========================================================
   SESSION 1: UNVEIL CURTAIN & AUDIO PLAYBACK
   - Handles the reveal animation of the envelope
   - Plays Shehnai background music and rotates disc icon
   ======================================================== */

/* ========================================================
   SESSION 1: UNVEIL CURTAIN & AUDIO PLAYBACK (WITH VOLUME FADE)
   - Handles the 3D rumble and open swing of the temple doors
   - JavaScript-driven volume control (no frontend slider)
   - Smooth exponential fade-in on open and fade-out on pause
   ======================================================== */

   const openingGate = document.getElementById('openingGate');
   const openBtn = document.getElementById('openInvitationBtn');
   const audio = document.getElementById('weddingAudio') || document.getElementById('wedding-audio');
   const audioBtn = document.getElementById('audioControl') || document.getElementById('audio-toggle');
   
   let isPlaying = false;
   let fadeTimer = null;
   
   // Pure JS Master Volume Settings (0.0 to 1.0)
   const MAX_VOLUME = 0.35; 
   const FADE_IN_TIME = 2200;  // 2.2 seconds fade in
   const FADE_OUT_TIME = 1000; // 1.0 second fade out
   
   /**
    * Smoothly ramps audio volume up
    */
   function fadeIn(targetVol = MAX_VOLUME, duration = FADE_IN_TIME) {
     if (!audio) return;
     clearInterval(fadeTimer);
   
     audio.volume = 0;
     const stepInterval = 40; // 40ms updates
     const stepIncrement = targetVol / (duration / stepInterval);
   
     audio.play().then(() => {
       isPlaying = true;
       if (audioBtn) audioBtn.classList.add('playing', 'spinning');
   
       fadeTimer = setInterval(() => {
         if (audio.volume + stepIncrement < targetVol) {
           audio.volume += stepIncrement;
         } else {
           audio.volume = targetVol;
           clearInterval(fadeTimer);
         }
       }, stepInterval);
     }).catch((err) => {
       console.warn('Audio autoplay blocked by browser policy:', err);
     });
   }
   
   /**
    * Smoothly ramps audio volume down before pausing
    */
   function fadeOut(duration = FADE_OUT_TIME) {
     if (!audio || !isPlaying) return;
     clearInterval(fadeTimer);
   
     const stepInterval = 40;
     const stepDecrement = audio.volume / (duration / stepInterval);
   
     fadeTimer = setInterval(() => {
       if (audio.volume - stepDecrement > 0.02) {
         audio.volume -= stepDecrement;
       } else {
         audio.volume = 0;
         audio.pause();
         clearInterval(fadeTimer);
         isPlaying = false;
         if (audioBtn) audioBtn.classList.remove('playing', 'spinning');
       }
     }, stepInterval);
   }
   
   // Open Gate Interaction
   if (openBtn && openingGate) {
     openBtn.addEventListener('click', (e) => {
       e.preventDefault();
   
       // Trigger door rumble and opening swing
       openingGate.classList.add('rumble');
       openingGate.classList.add('opened');
   
       fadeIn(MAX_VOLUME);
   
       setTimeout(() => {
         openingGate.classList.remove('rumble');
       }, 450);
     });
   }
   
   // Floating Audio Button Toggle
   if (audioBtn && audio) {
     audioBtn.addEventListener('click', () => {
       if (isPlaying) {
         fadeOut();
       } else {
         fadeIn(MAX_VOLUME);
       }
     });
   }
/*/* ========================================================
   SESSION 2: ROBUST MOBILE & DESKTOP 3D PARALLAX
   ======================================================== */
const parallaxBg = document.getElementById('parallaxBg');
const heroStage = document.getElementById('heroStage');
// Support both button IDs used across steps
const openBtnTrigger = document.getElementById('openInvitationBtn') || document.getElementById('openInviteBtn');

if (heroStage && parallaxBg) {
  let initialBeta = null;
  let initialGamma = null;
  let isGyroActive = false;

  // 1. Desktop Mouse Movement
  heroStage.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = heroStage.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    
    parallaxBg.style.transform = `scale(1.1) translate3d(${-x * 1.6}px, ${-y * 1.6}px, 0) rotateY(${x * 0.35}deg) rotateX(${-y * 0.35}deg)`;
  });

  heroStage.addEventListener('mouseleave', () => {
    parallaxBg.style.transform = `scale(1) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)`;
  });

  // 2. Mobile Gyroscope Handler
  const handleOrientation = (e) => {
    if (e.gamma === null || e.beta === null) return;
    isGyroActive = true;

    // Calibrate initial resting angle on first read
    if (initialBeta === null) {
      initialBeta = e.beta;
      initialGamma = e.gamma;
      return;
    }

    // Relative delta based on natural hold angle
    const deltaX = Math.min(Math.max((e.gamma - initialGamma), -25), 25);
    const deltaY = Math.min(Math.max((e.beta - initialBeta), -25), 25);

    // Apply amplified 3D translation & tilt
    requestAnimationFrame(() => {
      parallaxBg.style.transform = `scale(1.14) translate3d(${-deltaX * 2.2}px, ${-deltaY * 2.2}px, 0) rotateY(${deltaX * 0.6}deg) rotateX(${-deltaY * 0.6}deg)`;
    });
  };

  // 3. Permission Request & Mobile Initialization
  const requestGyroPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires explicit authorization from a direct click
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      // Standard Android / Chrome / Mobile Firefox
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  // Bind authorization to both the open button and a fallback tap
  if (openBtnTrigger) {
    openBtnTrigger.addEventListener('click', requestGyroPermission, { once: true });
  }
  document.body.addEventListener('touchstart', requestGyroPermission, { once: true });

  // 4. Touch Pan Fallback (Only fires if gyroscope is unavailable/blocked)
  window.addEventListener('touchmove', (e) => {
    if (isGyroActive || e.touches.length === 0) return;
    const touch = e.touches[0];
    const x = (touch.clientX - window.innerWidth / 2) / 15;
    const y = (touch.clientY - window.innerHeight / 2) / 15;
    
    parallaxBg.style.transform = `scale(1.12) translate3d(${-x * 1.5}px, ${-y * 1.5}px, 0) rotateY(${x * 0.4}deg) rotateX(${-y * 0.4}deg)`;
  }, { passive: true });
}
   /* ========================================================
      SESSION 3: DYNAMIC COUNTDOWN TIMER
      - Counts down live to October 25, 2026, 09:15 AM
      - Updates Days, Hours, Minutes, and Seconds
      ======================================================== */
   const weddingDate = new Date("nov 15, 2026 11:45:00").getTime();
   
   function runCountdown() {
     const now = new Date().getTime();
     const diff = weddingDate - now;
   
     if (diff <= 0) {
       document.getElementById('dBox').innerText = '00';
       document.getElementById('hBox').innerText = '00';
       document.getElementById('mBox').innerText = '00';
       document.getElementById('sBox').innerText = '00';
       return;
     }
   
     const d = Math.floor(diff / (1000 * 60 * 60 * 24));
     const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
     const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
     const s = Math.floor((diff % (1000 * 60)) / 1000);
   
     document.getElementById('dBox').innerText = d < 10 ? '0' + d : d;
     document.getElementById('hBox').innerText = h < 10 ? '0' + h : h;
     document.getElementById('mBox').innerText = m < 10 ? '0' + m : m;
     document.getElementById('sBox').innerText = s < 10 ? '0' + s : s;
   }
   
   setInterval(runCountdown, 1000);
   runCountdown();
   
   /* ========================================================
      SESSION 4: GOLD DUST CANVAS PARTICLES
      - Generates a subtle floating particle system over the page
      ======================================================== */
   const sparkCanvas = document.getElementById('sparkleCanvas');
   const ctx = sparkCanvas.getContext('2d');
   let particles = [];
   
   function resize() {
     sparkCanvas.width = window.innerWidth;
     sparkCanvas.height = window.innerHeight;
   }
   window.addEventListener('resize', resize);
   resize();
   
   class GoldDust {
     constructor() { this.reset(); }
     reset() {
       this.x = Math.random() * sparkCanvas.width;
       this.y = Math.random() * sparkCanvas.height;
       this.r = Math.random() * 2 + 1;
       this.vy = Math.random() * 0.8 + 0.3;
       this.alpha = Math.random() * 0.6 + 0.2;
     }
     update() {
       this.y += this.vy;
       if (this.y > sparkCanvas.height) this.y = -10;
     }
     draw() {
       ctx.fillStyle = `rgba(244, 208, 111, ${this.alpha})`;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
       ctx.fill();
     }
   }
   
   for (let i = 0; i < 30; i++) particles.push(new GoldDust());
   
   function loopDust() {
     ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
     particles.forEach(p => { p.update(); p.draw(); });
     requestAnimationFrame(loopDust);
   }
   loopDust();
   
   /* ========================================================
      SESSION 5: DYNAMIC QR GENERATION
      - Dynamically builds a QR image targeting the current URL
      ======================================================== */
   
   /* ========================================================
      SESSION 6: WHATSAPP RSVP DISPATCHER
      - Captures guest response and formats it into a WhatsApp chat URL
      ======================================================== */
   const RSVP_NUMBER = "919876543210"; // Enter phone number with country code
   
   
   /* ========================================================
      SESSION 7: SOCIAL SHARING ACTIONS
      - Direct WhatsApp forward link and clipboard copy handler
      ======================================================== */
   document.getElementById('shareWa').addEventListener('click', () => {
     const msg = `You're invited to celebrate Arjun & Aiswarya's wedding! Explore the invitation:\n${window.location.href}`;
     window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
   });
   
   document.getElementById('copyLink').addEventListener('click', () => {
    console.log("click work")
     navigator.clipboard.writeText(window.location.href).then(() => alert("Invitation link copied!"));
   });