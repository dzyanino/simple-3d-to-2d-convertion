import { vertices, faces } from "../data/model.mjs";

const BACKGROUND = "#101010";
const FOREGROUND = "#50FF50";

console.log(canvas);

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

function clear() {
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function point({ x, y }) {
    const size = 10;
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x - size/2, y - size/2, size, size);
}

function line(p1, p2) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = FOREGROUND;

    ctx.beginPath();

    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    ctx.stroke();
}

function screenCoordinate(p) {
    // -1..1 => 0..2 => 0..1 => 0..w|h
    return {
        x: (p.x + 1)/2 * canvas.width,
        y: (1 - (p.y + 1)/2) * canvas.height
    };
}

function project3DTo2D({x, y, z}) {
    return {
        x: x/z,
        y: y/z
    };
}

const FPS = 60;
let dz = 1;
let angle = 0;

function translateZ({x, y, z}, dz) {
    return { x, y, z: z+dz };
}

function rotateXZPlane({ x, y, z }, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: x*cos - z*sin,
        y,
        z: x*sin + z*cos
    };
}

function frame() {
    const deltaTime = 1 / FPS;

    if (dz < 2.25) {
        dz += 0.25 * deltaTime;
    }
    angle += Math.PI * deltaTime / 8
    
    clear();
    
    // for (const v of vertices) {
    //     point(screenCoordinate(project3DTo2D(translateZ(rotateXZPlane(v, angle), dz))));
    // }

    for (const f of faces) {
        for (let i = 0; i < f.length; ++i) {
            const a = vertices[f[i]];
            const b = vertices[f[(i+1) % f.length]]

            line(
                screenCoordinate(project3DTo2D(translateZ(rotateXZPlane(a, angle), dz))),
                screenCoordinate(project3DTo2D(translateZ(rotateXZPlane(b, angle), dz)))
            )
        }
    }

    setTimeout(frame, 1000 / FPS);
}

setTimeout(frame, 1000 / FPS);
