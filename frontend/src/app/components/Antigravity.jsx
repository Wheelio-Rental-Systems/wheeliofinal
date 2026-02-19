import React, { useRef, useEffect, useMemo } from 'react';
import { createNoise3D } from 'simplex-noise';

const Antigravity = ({
    count = 300,
    magnetRadius = 6, // converted to interaction radius
    ringRadius = 7, // not directly applicable to standard particle but can affect orbit
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 1.5,
    lerpSpeed = 0.05,
    color = '#5227FF',
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = 'capsule', // 'circle', 'square', 'capsule'
    fieldStrength = 10,
    style = {}
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const noise3D = useMemo(() => createNoise3D(), []);

    // Animation state
    const particles = useRef([]);
    const animationFrameId = useRef(null);
    const mouse = useRef({ x: 0, y: 0, isActive: false });
    const time = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const container = containerRef.current;

        let width = container.offsetWidth;
        let height = container.offsetHeight;

        const resize = () => {
            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const initParticles = () => {
            particles.current = [];
            for (let i = 0; i < count; i++) {
                particles.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: (Math.random() * particleVariance + 0.5) * particleSize,
                    baseX: Math.random() * width,
                    baseY: Math.random() * height,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        };

        const drawParticle = (p) => {
            ctx.beginPath();
            // Color handling could be more complex, but using simple hex for now
            ctx.fillStyle = color;

            if (particleShape === 'circle') {
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (particleShape === 'square') {
                ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
            } else {
                // Capsule / elongated based on velocity or just default circle for now if 'capsule' logic is complex without 3d
                // Simulating capsule as a small line segment
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.closePath();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            time.current += waveSpeed * 0.01;

            particles.current.forEach(p => {
                // Unified physics

                // 1. Noise/Wave movement
                const noiseVal = noise3D(p.baseX * 0.005, p.baseY * 0.005, time.current);
                const waveX = Math.cos(p.phase + time.current * pulseSpeed) * waveAmplitude;
                const waveY = Math.sin(p.phase + time.current * pulseSpeed) * waveAmplitude;

                // 2. Mouse Interaction (Magnetism)
                let targetX = p.baseX + noiseVal * 20 + waveX;
                let targetY = p.baseY + noiseVal * 20 + waveY;

                if (mouse.current.isActive) {
                    const dx = mouse.current.x - p.x;
                    const dy = mouse.current.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const interactionRadius = magnetRadius * 20; // Scale up for usability

                    if (distance < interactionRadius) {
                        const force = (interactionRadius - distance) / interactionRadius;
                        const angle = Math.atan2(dy, dx);

                        // Push or Pull based on fieldStrength
                        const moveX = Math.cos(angle) * force * fieldStrength;
                        const moveY = Math.sin(angle) * force * fieldStrength;

                        targetX += moveX;
                        targetY += moveY;
                    }
                }

                // 3. Lerp to position
                p.x += (targetX - p.x) * lerpSpeed;
                p.y += (targetY - p.y) * lerpSpeed;

                drawParticle(p);
            });

            if (autoAnimate) {
                animationFrameId.current = requestAnimationFrame(animate);
            }
        };

        // Events
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.x = e.clientX - rect.left;
            mouse.current.y = e.clientY - rect.top;
            mouse.current.isActive = true;
        };

        const handleMouseLeave = () => {
            mouse.current.isActive = false;
        };

        window.addEventListener('resize', resize);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [count, magnetRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, autoAnimate, particleVariance, pulseSpeed, fieldStrength, particleShape, noise3D]);

    return (
        <div ref={containerRef} style={{ ...style, overflow: 'hidden' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
    );
};

export default Antigravity;
