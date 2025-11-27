// Matter.js aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Events = Matter.Events;

// Configuration
const WALL_THICKNESS = 60;
// Portfolio images are larger
const TEAM_CIRCLE_SIZE_MIN = 90;
const TEAM_CIRCLE_SIZE_MAX = 130;
// Decorative dots are smaller
const DOT_SIZE = 25;

// Portfolio Images
const TEAM_IMAGES = [
    '/imgs/port1.png',
    '/imgs/port2.png',
    '/imgs/port3.png',
    '/imgs/port4.png'
];

// Colors for decorative dots (Blue and Cyan from reference)
const DOT_COLORS = ['#3B82F6', '#67E8F9']; // Blue-500, Cyan-300

// Helper to crop image to circle
function processImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const size = 500; // Standardize size for correct physics scaling
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw circle mask
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw image centered and scaled to fit
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;

            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

            resolve(canvas.toDataURL());
        };
        img.onerror = () => {
            console.error('Failed to load image:', src);
            resolve(src); // Fallback to original
        };
        img.src = src;
    });
}

async function initPhysics() {
    const container = document.getElementById('hero-physics');
    if (!container) return;

    // Pre-process images
    const processedImages = await Promise.all(TEAM_IMAGES.map(processImage));

    // Create engine
    const engine = Engine.create();
    const world = engine.world;

    // Create renderer
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    // Create walls
    const ground = Bodies.rectangle(
        container.clientWidth / 2,
        container.clientHeight + WALL_THICKNESS / 2,
        container.clientWidth,
        WALL_THICKNESS,
        { isStatic: true, render: { visible: false } }
    );

    const leftWall = Bodies.rectangle(
        0 - WALL_THICKNESS / 2,
        container.clientHeight / 2,
        WALL_THICKNESS,
        container.clientHeight * 5,
        { isStatic: true, render: { visible: false } }
    );

    const rightWall = Bodies.rectangle(
        container.clientWidth + WALL_THICKNESS / 2,
        container.clientHeight / 2,
        WALL_THICKNESS,
        container.clientHeight * 5,
        { isStatic: true, render: { visible: false } }
    );

    // Add Top Wall (Ceiling)
    const topWall = Bodies.rectangle(
        container.clientWidth / 2,
        -WALL_THICKNESS * 2,
        container.clientWidth,
        WALL_THICKNESS,
        { isStatic: true, render: { visible: false } }
    );

    Composite.add(world, [ground, leftWall, rightWall, topWall]);

    // Create Portfolio Circles
    const bodies = [];

    // Add Portfolio Images (Left side)
    processedImages.forEach((imgSrc, index) => {
        const radius = TEAM_CIRCLE_SIZE_MIN + Math.random() * (TEAM_CIRCLE_SIZE_MAX - TEAM_CIRCLE_SIZE_MIN);
        // Constrain to left side (e.g., 5% to 35% of width)
        const x = Math.random() * (container.clientWidth * 0.3) + (container.clientWidth * 0.05);
        const y = Math.random() * (container.clientHeight / 2);

        const circle = Bodies.circle(x, y, radius, {
            restitution: 0.5,
            friction: 0.01,
            frictionAir: 0.005,
            render: {
                sprite: {
                    texture: imgSrc,
                    xScale: (radius * 2) / 500, // Scale based on standard 500px size
                    yScale: (radius * 2) / 500
                }
            }
        });
        bodies.push(circle);
    });

    // Add Decorative Dots (2 dots)
    for (let i = 0; i < 2; i++) {
        const radius = DOT_SIZE;
        // Also on left side
        const x = Math.random() * (container.clientWidth * 0.3) + (container.clientWidth * 0.05);
        const y = -Math.random() * 500 - 50;
        const color = DOT_COLORS[i % DOT_COLORS.length];

        const dot = Bodies.circle(x, y, radius, {
            restitution: 0.9,
            friction: 0.001,
            render: {
                fillStyle: color,
                strokeStyle: 'transparent'
            }
        });
        bodies.push(dot);
    }

    Composite.add(world, bodies);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);

    // Allow scrolling by removing Matter.js wheel capture
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Hover Interaction (Repulsion)
    Events.on(engine, 'beforeUpdate', function () {
        const mousePosition = mouse.position;
        const repulsionRange = 150;
        const repulsionForce = 0.005;

        Composite.allBodies(world).forEach(body => {
            if (body.isStatic) return;

            const dx = body.position.x - mousePosition.x;
            const dy = body.position.y - mousePosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < repulsionRange) {
                const forceMagnitude = (1 - distance / repulsionRange) * repulsionForce;
                Matter.Body.applyForce(body, body.position, {
                    x: (dx / distance) * forceMagnitude,
                    y: (dy / distance) * forceMagnitude
                });
            }
        });
    });

    // Run the renderer
    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Handle resize
    window.addEventListener('resize', () => {
        render.canvas.width = container.clientWidth;
        render.canvas.height = container.clientHeight;

        // Reposition walls
        Matter.Body.setPosition(ground, {
            x: container.clientWidth / 2,
            y: container.clientHeight + WALL_THICKNESS / 2
        });
        Matter.Body.setPosition(rightWall, {
            x: container.clientWidth + WALL_THICKNESS / 2,
            y: container.clientHeight / 2
        });
        Matter.Body.setPosition(topWall, {
            x: container.clientWidth / 2,
            y: -WALL_THICKNESS * 2
        });
    });
}

// Start
initPhysics();
