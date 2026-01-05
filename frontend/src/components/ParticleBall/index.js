import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './index.scss';

const ParticleBall = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setClearColor(0x001f3f, 0);
        containerRef.current.appendChild(renderer.domElement);

        // Create particle cubes
        const particleGroup = new THREE.Group();
        const particleCount = 1200;
        const radius = 2.5;

        const material = new THREE.MeshPhongMaterial({
            color: 0xC4A747,
            shininess: 100,
            emissive: 0x8B6914,
            emissiveIntensity: 0.3,
        });

        for (let i = 0; i < particleCount; i++) {
            // Random position on sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            // Add random scatter - more spread out
            const scatter = 0.6;
            const sx = x + (Math.random() - 0.5) * scatter;
            const sy = y + (Math.random() - 0.5) * scatter;
            const sz = z + (Math.random() - 0.5) * scatter;

            // Create confetti piece with more variation
            const width = 0.03 + Math.random() * 0.03;
            const height = 0.03 + Math.random() * 0.03;
            const depth = 0.01 + Math.random() * 0.02;
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const confetti = new THREE.Mesh(geometry, material);
            
            confetti.position.set(sx, sy, sz);
            
            // Random rotation for confetti effect
            confetti.rotation.x = Math.random() * Math.PI;
            confetti.rotation.y = Math.random() * Math.PI;
            confetti.rotation.z = Math.random() * Math.PI;

            // Store original position and random properties for animation
            confetti.userData.originalPosition = { x: sx, y: sy, z: sz };
            confetti.userData.rotationSpeed = {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015,
            };
            // Add floating motion properties
            confetti.userData.floatSpeed = Math.random() * 0.02 + 0.01; // Speed of bobbing
            confetti.userData.floatAmount = Math.random() * 0.3 + 0.15; // How far it bobs
            confetti.userData.floatOffset = Math.random() * Math.PI * 2; // Starting phase
            confetti.userData.wobbleSpeed = (Math.random() - 0.5) * 0.015; // Side to side movement
            // Add velocity for smooth interaction
            confetti.userData.velocity = { x: 0, y: 0, z: 0 };
            confetti.userData.displacement = { x: 0, y: 0, z: 0 };

            particleGroup.add(confetti);
            geometry.dispose();
        }

        scene.add(particleGroup);

        // Lighting
        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(5, 5, 5);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xC4A747, 0.8);
        light2.position.set(-5, -5, 5);
        scene.add(light2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        camera.position.z = 6;

        // Mouse tracking for interaction
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();

        const onMouseMove = (event) => {
            const rect = containerRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        containerRef.current.addEventListener('mousemove', onMouseMove);

        // Animation loop
        let animationId;
        let time = 0;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            time += 0.01;
            
            // Update raycaster with mouse position and camera
            raycaster.setFromCamera(mouse, camera);
            
            // Rotate the entire group
            particleGroup.rotation.x += 0.0005;
            particleGroup.rotation.y += 0.001;

            // Animate individual confetti pieces
            particleGroup.children.forEach((confetti) => {
                confetti.rotation.x += confetti.userData.rotationSpeed.x;
                confetti.rotation.y += confetti.userData.rotationSpeed.y;
                confetti.rotation.z += confetti.userData.rotationSpeed.z;

                // Add floating motion to each confetti piece
                const floatY = Math.sin(time * confetti.userData.floatSpeed + confetti.userData.floatOffset) * confetti.userData.floatAmount;
                const wobbleX = Math.cos(time * confetti.userData.wobbleSpeed * 1.5) * 0.1;
                const wobbleZ = Math.sin(time * confetti.userData.wobbleSpeed * 1.3) * 0.1;

                // Mouse repulsion effect with smooth damping
                const distanceToMouse = raycaster.ray.distanceToPoint(confetti.position);
                const repulsionRadius = 2.5;
                const damping = 0.92; // Friction coefficient
                const springForce = 0.08; // How quickly particles return to original position
                
                // Apply repulsion force
                if (distanceToMouse < repulsionRadius) {
                    const repulsionStrength = Math.pow(1 - distanceToMouse / repulsionRadius, 2) * 0.25;
                    const direction = confetti.position.clone().sub(raycaster.ray.origin).normalize();
                    
                    confetti.userData.velocity.x += direction.x * repulsionStrength;
                    confetti.userData.velocity.y += direction.y * repulsionStrength;
                    confetti.userData.velocity.z += direction.z * repulsionStrength;
                }
                
                // Apply damping to velocity
                confetti.userData.velocity.x *= damping;
                confetti.userData.velocity.y *= damping;
                confetti.userData.velocity.z *= damping;
                
                // Apply spring force to return to original position
                const springX = (confetti.userData.originalPosition.x - confetti.userData.displacement.x - confetti.position.x) * springForce;
                const springY = (confetti.userData.originalPosition.y - confetti.userData.displacement.y - confetti.position.y) * springForce;
                const springZ = (confetti.userData.originalPosition.z - confetti.userData.displacement.z - confetti.position.z) * springForce;
                
                confetti.userData.velocity.x += springX;
                confetti.userData.velocity.y += springY;
                confetti.userData.velocity.z += springZ;
                
                // Store displacement from floating animation
                confetti.userData.displacement.x = wobbleX;
                confetti.userData.displacement.y = floatY;
                confetti.userData.displacement.z = wobbleZ;
                
                // Update position with velocity
                confetti.position.x = confetti.userData.originalPosition.x + confetti.userData.displacement.x + confetti.userData.velocity.x;
                confetti.position.y = confetti.userData.originalPosition.y + confetti.userData.displacement.y + confetti.userData.velocity.y;
                confetti.position.z = confetti.userData.originalPosition.z + confetti.userData.displacement.z + confetti.userData.velocity.z;
            });

            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return <div className="particle-ball-container" ref={containerRef}></div>;
};

export default ParticleBall;
