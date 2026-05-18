(function () {
    const canvas = document.getElementById('pulsar-canvas');
    const ctx = canvas.getContext('2d');

    const BG     = '#03080f';
    const ACCENT = '#38bdf8';

    // Waveform parameters
    const PERIOD      = 300;   // pixels between pulse peaks
    const PULSE_SIGMA = 5.5;   // Gaussian half-width (narrower = sharper spike)
    const AMPLITUDE   = 70;    // peak height in pixels
    const SCROLL_SPEED = 0.55; // pixels per frame (rightward → leftward scroll)
    const WAVE_Y_FRAC  = 0.82; // fraction of screen height for the baseline

    // Starfield
    const NUM_STARS = 200;
    let stars = [];

    let W, H, baseY;
    let frame = 0;

    // ── Resize ──────────────────────────────────────────────────────────────

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        baseY = H * WAVE_Y_FRAC;
        buildStars();
    }

    function buildStars() {
        stars = Array.from({ length: NUM_STARS }, () => ({
            x:       Math.random() * W,
            y:       Math.random() * H * 0.62,  // only in upper portion
            r:       Math.random() * 1.1 + 0.2,
            opacity: Math.random() * 0.45 + 0.08,
            speed:   Math.random() * 0.018 + 0.004,
            phase:   Math.random() * Math.PI * 2,
        }));
    }

    // ── Signal maths ────────────────────────────────────────────────────────

    function gaussian(x, sigma) {
        return Math.exp(-0.5 * (x / sigma) ** 2);
    }

    // Returns signal amplitude at a given time-space position.
    // phase wraps at PERIOD; two Gaussians handle the seam smoothly.
    function pulseAt(pos) {
        const phase = ((pos % PERIOD) + PERIOD) % PERIOD;
        return gaussian(phase, PULSE_SIGMA) + gaussian(phase - PERIOD, PULSE_SIGMA);
    }

    // ── Draw routines ────────────────────────────────────────────────────────

    function drawBackground() {
        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, W, H);
    }

    function drawStars(t) {
        stars.forEach(s => {
            const alpha = s.opacity * (0.65 + 0.35 * Math.sin(t * s.speed + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.fill();
        });
    }

    function drawBaseline() {
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(W, baseY);
        ctx.strokeStyle = 'rgba(56,189,248,0.06)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
    }

    function drawWaveform() {
        const offset = frame * SCROLL_SPEED;

        // Outer glow pass
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
            const y = baseY - pulseAt(x + offset) * AMPLITUDE;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1.8;
        ctx.shadowBlur = 16;
        ctx.shadowColor = ACCENT;
        ctx.stroke();

        // Reset shadow before inner pass
        ctx.shadowBlur = 0;

        // Bright core pass — only where signal is above noise floor
        ctx.beginPath();
        let inSegment = false;
        for (let x = 0; x <= W; x++) {
            const sig = pulseAt(x + offset);
            if (sig > 0.04) {
                const y = baseY - sig * AMPLITUDE;
                if (!inSegment) { ctx.moveTo(x, y); inSegment = true; }
                else ctx.lineTo(x, y);
            } else {
                inSegment = false;
            }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.82)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
    }

    // ── Animation loop ────────────────────────────────────────────────────

    function tick() {
        frame++;
        drawBackground();
        drawStars(frame);
        drawBaseline();
        drawWaveform();
        requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(tick);
})();
