'use client';

import { useEffect, useRef } from 'react';

export function CyberpunkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Enhanced floating particles with data fragments
        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            opacity: number;
            glitchOffset: number;
            type: 'dot' | 'fragment' | 'spark';
            trail: Array<{ x: number; y: number; opacity: number }>;
        }> = [];

        // Initialize enhanced particles
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: Math.random() * 0.8 + 0.2,
                opacity: Math.random() * 0.9 + 0.1,
                glitchOffset: Math.random() * 100,
                type: i % 5 === 0 ? 'fragment' : (i % 8 === 0 ? 'spark' : 'dot'),
                trail: []
            });
        }

        // Distortion wave system
        const distortionWaves: Array<{
            x: number;
            y: number;
            radius: number;
            intensity: number;
            speed: number;
            color: string;
        }> = [];

        // Initialize distortion waves
        for (let i = 0; i < 8; i++) {
            distortionWaves.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 0,
                intensity: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 2 + 1,
                color: i % 2 === 0 ? '#007bff' : '#ff007f'
            });
        }

        let animationId: number;
        let time = 0;
        let glitchTimer = 0;

        const animate = () => {
            time += 0.016;
            glitchTimer += 0.016;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw enhanced floating particles with trails
            particles.forEach((particle, index) => {
                // Update particle position
                particle.x += particle.speedX + Math.sin(time * 2 + index) * 0.1;
                particle.y -= particle.speedY;

                // Add to trail
                particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
                if (particle.trail.length > 10) {
                    particle.trail.shift();
                }

                // Reset particle when it goes off screen
                if (particle.y < -20) {
                    particle.y = canvas.height + 20;
                    particle.x = Math.random() * canvas.width;
                    particle.trail = [];
                }
                if (particle.x < -20 || particle.x > canvas.width + 20) {
                    particle.x = Math.random() * canvas.width;
                }

                // Enhanced glitch effect
                const glitchIntensity = Math.sin(time * 15 + particle.glitchOffset) > 0.97 ? 8 : 0;
                const randomGlitch = Math.random() > 0.998 ? 12 : 0;
                const totalGlitch = Math.max(glitchIntensity, randomGlitch);

                // Draw trail
                particle.trail.forEach((point, trailIndex) => {
                    ctx.save();
                    ctx.globalAlpha = point.opacity * (trailIndex / particle.trail.length) * 0.3;
                    ctx.fillStyle = particle.type === 'fragment' ? '#ff007f' : '#007bff';
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });

                ctx.save();
                ctx.globalAlpha = particle.opacity * (0.8 + Math.sin(time * 4 + index) * 0.2);

                // Different particle types
                if (particle.type === 'fragment') {
                    // Data fragment - rectangular
                    ctx.fillStyle = '#ff007f';
                    ctx.fillRect(
                        particle.x + totalGlitch * (Math.random() - 0.5) - particle.size,
                        particle.y + totalGlitch * (Math.random() - 0.5) - particle.size / 2,
                        particle.size * 2,
                        particle.size
                    );
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = '#ff007f';
                    ctx.fillRect(
                        particle.x - particle.size,
                        particle.y - particle.size / 2,
                        particle.size * 2,
                        particle.size
                    );
                } else if (particle.type === 'spark') {
                    // Spark - diamond shape
                    ctx.fillStyle = index % 3 === 0 ? '#ff007f' : '#007bff';
                    ctx.beginPath();
                    ctx.moveTo(particle.x + totalGlitch * (Math.random() - 0.5), particle.y - particle.size);
                    ctx.lineTo(particle.x + particle.size, particle.y);
                    ctx.lineTo(particle.x, particle.y + particle.size);
                    ctx.lineTo(particle.x - particle.size, particle.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = index % 3 === 0 ? '#ff007f' : '#007bff';
                    ctx.fill();
                } else {
                    // Regular dot
                    ctx.fillStyle = index % 3 === 0 ? '#ff007f' : '#007bff';
                    ctx.beginPath();
                    ctx.arc(
                        particle.x + totalGlitch * (Math.random() - 0.5),
                        particle.y + totalGlitch * (Math.random() - 0.5),
                        particle.size,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = index % 3 === 0 ? '#ff007f' : '#007bff';
                    ctx.fill();
                }

                ctx.restore();
            });

            // Draw distortion waves
            distortionWaves.forEach((wave) => {
                wave.radius += wave.speed;

                if (wave.radius > canvas.width * 1.2) {
                    wave.x = Math.random() * canvas.width;
                    wave.y = Math.random() * canvas.height;
                    wave.radius = 0;
                    wave.intensity = Math.random() * 0.3 + 0.1;
                }

                ctx.save();
                ctx.globalAlpha = wave.intensity * (1 - wave.radius / (canvas.width * 1.2));
                ctx.strokeStyle = wave.color;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 6]);
                ctx.lineDashOffset = time * 30;

                // Create distortion ripple effect
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(wave.x, wave.y, wave.radius + i * 20, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.restore();
            });

            // Enhanced sonar-like waveforms with data patterns
            for (let i = 0; i < 5; i++) {
                ctx.save();
                ctx.globalAlpha = 0.2 + Math.sin(time * 2 + i) * 0.1;
                ctx.strokeStyle = i % 2 === 0 ? '#007bff' : '#ff007f';
                ctx.lineWidth = 1 + Math.sin(time * 3 + i) * 0.5;
                ctx.setLineDash([8, 12, 2, 8]);
                ctx.lineDashOffset = time * 60 + i * 20;

                const radius = (time * 80 + i * 150) % (canvas.width * 1.3);
                const centerX = canvas.width / 2 + Math.sin(time * 0.5 + i) * 100;
                const centerY = canvas.height / 2 + Math.cos(time * 0.3 + i) * 80;

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // Data stream matrix effect
            if (glitchTimer > Math.random() * 3 + 1) {
                glitchTimer = 0;
                ctx.save();
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = Math.random() > 0.5 ? '#007bff' : '#ff007f';

                for (let i = 0; i < 20; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height;
                    const char = String.fromCharCode(Math.random() * 26 + 65);
                    ctx.font = '12px monospace';
                    ctx.fillText(char, x, y);
                }
                ctx.restore();
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -3 }} aria-hidden="true">
            {/* Base background with subtle texture */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: '#0a0f1f',
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 123, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 0, 127, 0.03) 0%, transparent 50%)'
                }}
            />

            {/* Deep layer - Fading grid in void */}
            <div
                className="absolute inset-0 opacity-5 deep-grid-animation"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 123, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 123, 255, 0.4) 1px, transparent 1px)
          `,
                    backgroundSize: '100px 100px',
                }}
            />

            {/* Mid layer - Secondary grid */}
            <div
                className="absolute inset-0 opacity-8 mid-grid-animation"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255, 0, 127, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 127, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '75px 75px',
                }}
            />

            {/* Enhanced cascading data streams - Multiple layers */}
            <div className="absolute inset-0">
                {/* Primary data streams */}
                {Array.from({ length: 60 }).map((_, i) => (
                    <div
                        key={`primary-${i}`}
                        className="absolute opacity-70 data-cascade-animation"
                        style={{
                            left: `${(i * 1.5) % 100}%`,
                            top: '-10%',
                            width: `${1 + Math.sin(i) * 0.5}px`,
                            height: '110%',
                            background: `linear-gradient(to bottom, 
                transparent 0%, 
                ${i % 4 === 0 ? '#ff007f' : '#007bff'} 20%, 
                ${i % 4 === 0 ? '#ff007f' : '#007bff'} 80%, 
                transparent 100%)`,
                            animationDuration: `${2 + (i % 4)}s`,
                            animationDelay: `${i * 0.05}s`,
                            transform: `skewX(${-10 - (i % 3) * 2}deg)`,
                            filter: 'blur(0.3px)',
                        }}
                    />
                ))}

                {/* Secondary lighter streams */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={`secondary-${i}`}
                        className="absolute opacity-40 data-cascade-slow-animation"
                        style={{
                            left: `${(i * 2.3 + 50) % 100}%`,
                            top: '-15%',
                            width: '1px',
                            height: '115%',
                            background: `linear-gradient(to bottom, 
                transparent 0%, 
                ${i % 3 === 0 ? '#007bff' : '#ff007f'} 30%, 
                transparent 100%)`,
                            animationDuration: `${4 + (i % 3)}s`,
                            animationDelay: `${i * 0.08}s`,
                            transform: `skewX(${-8 + (i % 2) * 3}deg)`,
                        }}
                    />
                ))}
            </div>

            {/* Distortion wave overlay */}
            <div className="absolute inset-0">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={`distortion-${i}`}
                        className="absolute w-full opacity-15 distortion-wave-animation"
                        style={{
                            top: `${15 + i * 12}%`,
                            height: '2px',
                            background: `linear-gradient(90deg, 
                transparent 0%, 
                ${i % 2 === 0 ? '#007bff' : '#ff007f'} 50%, 
                transparent 100%)`,
                            animationDuration: `${3 + i * 0.4}s`,
                            animationDelay: `${i * 0.6}s`,
                            filter: 'blur(1px)',
                        }}
                    />
                ))}
            </div>

            {/* Enhanced horizontal scanlines */}
            <div className="absolute inset-0">
                {Array.from({ length: 25 }).map((_, i) => (
                    <div
                        key={`scanline-${i}`}
                        className="absolute w-full opacity-25 enhanced-scanline-animation"
                        style={{
                            top: `${i * 4}%`,
                            height: '1px',
                            backgroundColor: i % 5 === 0 ? '#ff007f' : '#007bff',
                            animationDuration: `${2.5 + (i % 3) * 0.5}s`,
                            animationDelay: `${i * 0.15}s`,
                            boxShadow: `0 0 3px ${i % 5 === 0 ? '#ff007f' : '#007bff'}`,
                        }}
                    />
                ))}
            </div>

            {/* Top layer - Fine grid overlay */}
            <div
                className="absolute inset-0 opacity-12 grid-wave-animation"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(0, 123, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 123, 255, 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Enhanced central glow with pulsing layers */}
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 enhanced-pulse-animation"
                style={{
                    background: 'radial-gradient(circle, #007bff 0%, #ff007f 40%, rgba(255, 0, 127, 0.3) 70%, transparent 100%)',
                }}
            />

            {/* Random glitch overlays with improved timing */}
            <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={`glitch-${i}`}
                        className="absolute bg-gradient-to-r from-transparent via-current to-transparent opacity-0 h-px random-glitch-animation"
                        style={{
                            left: '0%',
                            right: '0%',
                            top: `${10 + i * 11}%`,
                            color: i % 3 === 0 ? '#ff007f' : '#007bff',
                            animationDuration: `${0.8 + i * 0.3}s`,
                            animationDelay: `${i * 1.2}s`,
                            filter: 'blur(0.5px)',
                        }}
                    />
                ))}
            </div>

            {/* Canvas for enhanced particles and waveforms */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />
        </div>
    );
}