(function () {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let shootingStars = [];
    let animationId = null;
    let shootTimer = null;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initStars();
    }

    function initStars() {
        stars = [];
        const area = width * height;

        // Layer 1 — vast field of faint pinpoints (most stars look like this)
        const farCount = Math.floor(area / 900);
        for (let i = 0; i < farCount; i++) {
            stars.push(makeStar('far'));
        }

        // Layer 2 — slightly brighter, still tiny
        const midCount = Math.floor(area / 4500);
        for (let i = 0; i < midCount; i++) {
            stars.push(makeStar('mid'));
        }

        // Layer 3 — rare brighter stars (very few, still small)
        const nearCount = Math.floor(area / 180000) + 5;
        for (let i = 0; i < nearCount; i++) {
            stars.push(makeStar('near'));
        }
    }

    function starPosition() {
        // Cluster most stars along a milky-way band, like a real sky
        if (Math.random() < 0.7) {
            const t = Math.random();
            const x = t * width + rand(-width * 0.06, width * 0.06);
            const bandY = height * (0.2 + t * 0.55) + rand(-height * 0.1, height * 0.1);
            return {
                x: Math.max(0, Math.min(width, x)),
                y: Math.max(0, Math.min(height, bandY)),
            };
        }
        return { x: Math.random() * width, y: Math.random() * height };
    }

    function makeStar(layer) {
        const temps = [
            [255, 255, 255],
            [220, 230, 255],
            [200, 215, 255],
            [255, 245, 230],
            [255, 230, 210],
        ];
        const color = temps[Math.floor(Math.random() * temps.length)];
        const pos = starPosition();

        if (layer === 'far') {
            return {
                x: pos.x,
                y: pos.y,
                r: rand(0.15, 0.4),
                base: rand(0.12, 0.38),
                amp: rand(0.03, 0.12),
                speed: rand(0.3, 0.9),
                phase: Math.random() * Math.PI * 2,
                color,
                glow: false,
                point: true,
            };
        }

        if (layer === 'mid') {
            return {
                x: pos.x,
                y: pos.y,
                r: rand(0.25, 0.55),
                base: rand(0.28, 0.58),
                amp: rand(0.08, 0.2),
                speed: rand(0.5, 1.5),
                phase: Math.random() * Math.PI * 2,
                color,
                glow: Math.random() > 0.85,
                point: Math.random() > 0.4,
            };
        }

        return {
            x: pos.x,
            y: pos.y,
            r: rand(0.45, 0.75),
            base: rand(0.55, 0.85),
            amp: rand(0.1, 0.25),
            speed: rand(0.8, 2),
            phase: Math.random() * Math.PI * 2,
            color,
            glow: true,
            point: false,
        };
    }

    function scheduleShootingStar() {
        const delay = rand(1800, 7000);
        shootTimer = setTimeout(() => {
            spawnShootingStar();
            if (Math.random() > 0.75) {
                setTimeout(spawnShootingStar, rand(200, 600));
            }
            scheduleShootingStar();
        }, delay);
    }

    function spawnShootingStar() {
        const fromTop = Math.random() > 0.35;
        let x, y, vx, vy, length;

        if (fromTop) {
            x = rand(width * 0.05, width * 0.95);
            y = rand(-40, height * 0.35);
            const angle = rand(Math.PI * 0.55, Math.PI * 0.78);
            const speed = rand(10, 18);
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        } else {
            const fromLeft = Math.random() > 0.5;
            x = fromLeft ? rand(-60, width * 0.2) : rand(width * 0.8, width + 60);
            y = rand(0, height * 0.5);
            const angle = fromLeft ? rand(Math.PI * 0.2, Math.PI * 0.42) : rand(Math.PI * 0.58, Math.PI * 0.8);
            const speed = rand(10, 18);
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
        }

        length = rand(80, 180);

        shootingStars.push({
            x,
            y,
            vx,
            vy,
            length,
            opacity: 1,
            decay: rand(0.008, 0.018),
            width: rand(1.2, 2.2),
        });
    }

    function drawBackground() {
        const grad = ctx.createRadialGradient(
            width * 0.5, height * 0.15, 0,
            width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        );
        grad.addColorStop(0, '#060610');
        grad.addColorStop(0.45, '#020208');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Faint milky-way haze where stars cluster
        ctx.save();
        ctx.globalAlpha = 0.025;
        const haze = ctx.createLinearGradient(0, 0, width, height);
        haze.addColorStop(0, 'rgba(80, 100, 180, 0)');
        haze.addColorStop(0.35, 'rgba(120, 140, 200, 1)');
        haze.addColorStop(0.65, 'rgba(90, 110, 170, 0.7)');
        haze.addColorStop(1, 'rgba(60, 80, 140, 0)');
        ctx.fillStyle = haze;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    function drawStars(time) {
        const t = time * 0.001;

        stars.forEach((star) => {
            const twinkle = Math.sin(t * star.speed + star.phase);
            const opacity = Math.min(1, Math.max(0.04, star.base + twinkle * star.amp));
            const [r, g, b] = star.color;

            if (star.point || star.r < 0.45) {
                // Single-pixel pinpoints — how most real stars appear
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.fillRect(star.x - 0.5, star.y - 0.5, 1, 1);
                return;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();

            if (star.glow && opacity > 0.5) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(opacity - 0.4) * 0.15})`;
                ctx.fill();
            }
        });
    }

    function drawShootingStars() {
        shootingStars = shootingStars.filter((s) => s.opacity > 0.04 && s.x > -200 && s.x < width + 200 && s.y < height + 200);

        shootingStars.forEach((s) => {
            const mag = Math.hypot(s.vx, s.vy) || 1;
            const tailX = s.x - (s.vx / mag) * s.length;
            const tailY = s.y - (s.vy / mag) * s.length;

            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.5, `rgba(210, 225, 255, ${s.opacity * 0.35})`);
            grad.addColorStop(0.85, `rgba(255, 255, 255, ${s.opacity * 0.85})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.width * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.fill();

            s.x += s.vx;
            s.y += s.vy;
            s.opacity -= s.decay;
        });
    }

    function render(time) {
        drawBackground();
        drawStars(time);
        drawShootingStars();
        animationId = requestAnimationFrame(render);
    }

    resize();
    window.addEventListener('resize', resize);

    scheduleShootingStar();
    setTimeout(spawnShootingStar, rand(400, 1200));

    animationId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
            clearTimeout(shootTimer);
        } else {
            animationId = requestAnimationFrame(render);
            scheduleShootingStar();
        }
    });
})();
