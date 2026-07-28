(function () {
    'use strict';

    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    function getAllParts(cell) {
        return Array.from(cell.querySelectorAll('.skel-circle, .skel-line, .skel-img, .skel-pill, .skel-action-dot, .skel-code-dot, .skel-bar, .skel-square, .skel-media-thumb, .skel-star, .skel-profile-cover'));
    }

    function resetParts(parts) {
        parts.forEach(function (p) { p.style.cssText = ''; });
    }

    var labels = {
        shimmer: 'background-position sweep',
        gradient: 'background-size: 200%',
        staggered: 'delay: i × 120ms',
        typewriter: 'clip-path: inset()',
        layered: 'translateZ + opacity',
        elastic: 'cubic-bezier(.34,1.56,.64,1)',
        pulse: 'animation: pulse 1.5s',
        cascade: 'staggered background wave',
        outline: 'border → background fill'
    };

    var animations = {
        shimmer: animateShimmer,
        gradient: animateGradient,
        staggered: animateStaggered,
        typewriter: animateTypewriter,
        layered: animateLayered,
        elastic: animateElastic,
        pulse: animatePulse,
        cascade: animateCascade,
        outline: animateOutline
    };

    document.querySelectorAll('.cell').forEach(function (cell) {
        function trigger() {
            if (cell.classList.contains('animating')) return;
            var skel = cell.dataset.skel;
            cell.querySelector('.cell-label').textContent = labels[skel] || '';
            cell.classList.add('animating');
            animations[skel](cell);
        }
        cell.addEventListener('click', trigger);
        cell.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
        });
    });

    async function animateShimmer(cell) {
        var parts = getAllParts(cell);
        parts.forEach(function (p) {
            p.style.background = 'linear-gradient(90deg, var(--skel-base) 25%, var(--skel-shine) 50%, var(--skel-base) 75%)';
            p.style.backgroundSize = '200% 100%';
            p.style.animation = 'skelShimmer 1.8s ease-in-out infinite';
        });
        await wait(4000);
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animateGradient(cell) {
        var parts = getAllParts(cell);
        parts.forEach(function (p) {
            p.style.background = 'linear-gradient(135deg, var(--skel-base), rgba(124,106,255,0.15), rgba(255,107,157,0.12), var(--skel-base))';
            p.style.backgroundSize = '300% 300%';
            p.style.animation = 'skelGradient 2.5s ease infinite';
        });
        await wait(5200);
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animateStaggered(cell) {
        var rows = Array.from(cell.querySelectorAll('.skel-feed-row'));
        rows.forEach(function (r) {
            r.style.opacity = '0';
            r.style.transform = 'translateX(-10px)';
            r.style.transition = 'none';
        });
        await wait(30);
        for (var i = 0; i < rows.length; i++) {
            rows[i].style.transition = 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            rows[i].style.opacity = '1';
            rows[i].style.transform = 'translateX(0)';
            await wait(180);
        }
        await wait(1000);
        for (var j = rows.length - 1; j >= 0; j--) {
            rows[j].style.transition = 'opacity 0.25s ease, transform 0.3s ease';
            rows[j].style.opacity = '0';
            rows[j].style.transform = 'translateX(10px)';
            await wait(100);
        }
        await wait(200);
        rows.forEach(function (r) {
            r.style.transition = 'none';
            r.style.transform = 'translateX(-10px)';
        });
        await wait(30);
        for (var k = 0; k < rows.length; k++) {
            rows[k].style.transition = 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            rows[k].style.opacity = '1';
            rows[k].style.transform = 'translateX(0)';
            await wait(140);
        }
        await wait(400);
        rows.forEach(function (r) { r.style.cssText = ''; });
        cell.classList.remove('animating');
    }

    async function animateTypewriter(cell) {
        var parts = getAllParts(cell);
        parts.forEach(function (p) {
            p.style.clipPath = 'inset(0 100% 0 0)';
            p.style.transition = 'none';
        });
        await wait(20);
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            var steps = 6;
            for (var s = 0; s <= steps; s++) {
                var pct = 100 - (s / steps) * 100;
                p.style.transition = 'none';
                p.style.clipPath = 'inset(0 ' + pct + '% 0 0)';
                await wait(20);
            }
            await wait(30);
        }
        await wait(600);
        for (var j = 0; j < parts.length; j++) {
            parts[j].style.transition = 'clip-path 0.2s ease';
            parts[j].style.clipPath = 'inset(0 0 0 100%)';
            await wait(30);
        }
        await wait(150);
        parts.forEach(function (p) {
            p.style.transition = 'none';
            p.style.clipPath = 'inset(0 100% 0 0)';
        });
        await wait(20);
        for (var k = 0; k < parts.length; k++) {
            parts[k].style.transition = 'clip-path 0.2s ease-out';
            parts[k].style.clipPath = 'inset(0 0% 0 0)';
            await wait(40);
        }
        await wait(300);
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animateLayered(cell) {
        var header = cell.querySelector('.skel-dash-header');
        var lines = Array.from(cell.querySelectorAll('.skel-dash > .skel-line'));
        var bars = Array.from(cell.querySelectorAll('.skel-bar'));
        var all = [header].concat(lines);
        all.forEach(function (p) {
            p.style.opacity = '0';
            p.style.transform = 'translateY(10px)';
            p.style.transition = 'none';
            p.style.filter = 'blur(2px)';
        });
        bars.forEach(function (b) {
            b.style.transition = 'none';
            b.style.transform = 'scaleY(0)';
            b.style.transformOrigin = 'bottom';
        });
        await wait(30);
        for (var i = 0; i < all.length; i++) {
            all[i].style.transition = 'all 0.45s cubic-bezier(0.0, 0, 0.2, 1)';
            all[i].style.opacity = '1';
            all[i].style.transform = 'translateY(0)';
            all[i].style.filter = 'blur(0px)';
            await wait(150);
        }
        for (var b = 0; b < bars.length; b++) {
            bars[b].style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            bars[b].style.transform = 'scaleY(1)';
            await wait(60);
        }
        await wait(1200);
        for (var c = bars.length - 1; c >= 0; c--) {
            bars[c].style.transition = 'transform 0.25s ease-in';
            bars[c].style.transform = 'scaleY(0)';
            await wait(40);
        }
        await wait(200);
        for (var j = all.length - 1; j >= 0; j--) {
            all[j].style.transition = 'all 0.3s ease-in';
            all[j].style.opacity = '0';
            all[j].style.transform = 'translateY(-6px)';
            all[j].style.filter = 'blur(2px)';
            await wait(80);
        }
        await wait(200);
        all.forEach(function (p) {
            p.style.transition = 'none';
            p.style.transform = 'translateY(10px)';
            p.style.filter = 'blur(2px)';
        });
        bars.forEach(function (b) {
            b.style.transition = 'none';
            b.style.transform = 'scaleY(0)';
        });
        await wait(30);
        for (var k = 0; k < all.length; k++) {
            all[k].style.transition = 'all 0.4s cubic-bezier(0.0, 0, 0.2, 1)';
            all[k].style.opacity = '1';
            all[k].style.transform = 'translateY(0)';
            all[k].style.filter = 'blur(0px)';
            await wait(100);
        }
        for (var m = 0; m < bars.length; m++) {
            bars[m].style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
            bars[m].style.transform = 'scaleY(1)';
            await wait(50);
        }
        await wait(400);
        all.forEach(function (p) { p.style.cssText = ''; });
        bars.forEach(function (b) { b.style.cssText = ''; });
        cell.classList.remove('animating');
    }

    async function animateElastic(cell) {
        var parts = getAllParts(cell);
        var SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
        parts.forEach(function (p) {
            p.style.opacity = '0';
            p.style.transform = 'scale(0.3)';
            p.style.transition = 'none';
        });
        await wait(30);
        for (var i = 0; i < parts.length; i++) {
            parts[i].style.transition = 'opacity 0.5s ease, transform 0.6s ' + SPRING;
            parts[i].style.opacity = '1';
            parts[i].style.transform = 'scale(1)';
            await wait(100);
        }
        await wait(1500);
        parts.forEach(function (p) {
            p.style.transition = 'opacity 0.3s ease, transform 0.4s ease-in';
            p.style.opacity = '0';
            p.style.transform = 'scale(1.1)';
        });
        await wait(500);
        parts.forEach(function (p) {
            p.style.transition = 'none';
            p.style.transform = 'scale(0.3)';
        });
        await wait(30);
        for (var j = 0; j < parts.length; j++) {
            parts[j].style.transition = 'opacity 0.4s ease, transform 0.5s ' + SPRING;
            parts[j].style.opacity = '1';
            parts[j].style.transform = 'scale(1)';
            await wait(80);
        }
        await wait(400);
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animatePulse(cell) {
        var parts = getAllParts(cell);
        parts.forEach(function (p) {
            p.style.animation = 'skelPulse 1.5s ease-in-out infinite';
        });
        await wait(3500);
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animateCascade(cell) {
        var parts = getAllParts(cell);
        var HOLD = 500;
        var GAP = 100;
        for (var cycle = 0; cycle < 3; cycle++) {
            for (var i = 0; i < parts.length; i++) {
                (function (el) {
                    el.style.transition = 'background 0.3s ease-in';
                    el.style.background = 'var(--skel-shine)';
                    setTimeout(function () {
                        el.style.transition = 'background 0.5s ease-out';
                        el.style.background = 'var(--skel-base)';
                    }, HOLD);
                })(parts[i]);
                await wait(GAP);
            }
            await wait(HOLD + 300);
        }
        resetParts(parts);
        cell.classList.remove('animating');
    }

    async function animateOutline(cell) {
        var parts = getAllParts(cell);
        parts.forEach(function (p) {
            var isCircle = p.classList.contains('skel-circle');
            p.style.transition = 'none';
            p.style.background = 'transparent';
            p.style.border = '1.5px solid var(--skel-shine)';
            p.style.borderRadius = isCircle ? '50%' : 'var(--skel-radius)';
            p.style.opacity = '0';
            p.style.transform = 'scale(0.92)';
        });
        await wait(30);
        for (var i = 0; i < parts.length; i++) {
            parts[i].style.transition = 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            parts[i].style.opacity = '1';
            parts[i].style.transform = 'scale(1)';
            await wait(80);
        }
        await wait(400);
        for (var j = 0; j < parts.length; j++) {
            parts[j].style.transition = 'background 0.5s ease, border-color 0.5s ease';
            parts[j].style.background = 'var(--skel-base)';
            parts[j].style.borderColor = 'transparent';
            await wait(70);
        }
        await wait(1000);
        parts.forEach(function (p) {
            p.style.transition = 'opacity 0.3s ease, background 0.3s ease';
            p.style.background = 'transparent';
            p.style.borderColor = 'var(--skel-shine)';
        });
        await wait(400);
        for (var k = 0; k < parts.length; k++) {
            parts[k].style.transition = 'background 0.4s ease, border-color 0.4s ease';
            parts[k].style.background = 'var(--skel-base)';
            parts[k].style.borderColor = 'transparent';
            await wait(60);
        }
        await wait(400);
        resetParts(parts);
        cell.classList.remove('animating');
    }

})();
