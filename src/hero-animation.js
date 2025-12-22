import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeroAnimation() {
    const bg = document.getElementById('spline-background');
    const heroStart = document.getElementById('hero-start');

    if (!bg || !heroStart) return;

    // Ensure initial state
    gsap.set(bg, {
        filter: "blur(10px)",
        width: "100%",
        left: "0%"
    });

    gsap.to(bg, {
        scrollTrigger: {
            trigger: heroStart,
            start: "top top",
            end: "bottom top",
            scrub: true,
            markers: false
        },
        filter: "blur(0px)",
        width: "150%", // Expands width to shift center point right
        ease: "none"
    });
}
