const width = 600;
const height = 600;
const radius = 15;
const friction = 0.98;

const svg = d3.select("#carrom-board").append("svg")
    .attr("width", width)
    .attr("height", height);

let balls = d3.range(20).map((d, i) => ({
    id: i,
    x: Math.random() * (width - 2 * radius) + radius,
    y: Math.random() * (height - 2 * radius) + radius,
    vx: 0,
    vy: 0,
    radius: radius,
    color: i === 0 ? "black" : "white"
}));

const ballSelection = svg.selectAll("circle")
    .data(balls, d => d.id)
    .enter()
    .append("circle")
    .attr("id", d => `ball${d.id}`)
    .attr("r", d => d.radius)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", d => d.color)
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

function tick() {
    balls.forEach(d => {
        d.vx *= friction;
        d.vy *= friction;

        d.x += d.vx;
        d.y += d.vy;

        if (d.x - d.radius < 0 || d.x + d.radius > width || d.y - d.radius < 0 || d.y + d.radius > height) {
            d3.select(`#ball${d.id}`).remove();
            balls = balls.filter(ball => ball.id !== d.id);
        }

        balls.forEach(e => {
            if (d.id !== e.id) {
                const dx = e.x - d.x;
                const dy = e.y - d.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < d.radius + e.radius) {
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    const vx1 = d.vx * cos + d.vy * sin;
                    const vy1 = d.vy * cos - d.vx * sin;
                    const vx2 = e.vx * cos + e.vy * sin;
                    const vy2 = e.vy * cos - e.vx * sin;

                    const final_vx1 = ((d.radius - e.radius) * vx1 + (e.radius + e.radius) * vx2) / (d.radius + e.radius);
                    const final_vx2 = ((d.radius + d.radius) * vx1 + (e.radius - d.radius) * vx2) / (d.radius + e.radius);

                    d.vx = cos * final_vx1 + cos * vy1;
                    d.vy = sin * final_vx1 + sin * vy1;
                    e.vx = cos * final_vx2 + cos * vy2;
                    e.vy = sin * final_vx2 + sin * vy2;

                    d.x += d.vx;
                    d.y += d.vy;
                    e.x += e.vx;
                    e.y += e.vy;
                }
            }
        });
    });

    ballSelection
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    requestAnimationFrame(tick);
}

function dragStarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
    d.vx = 0;
    d.vy = 0;
}

function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
}

function dragEnded(event, d) {
    d3.select(this).attr("stroke", null);
    d.vx = (event.x - d.x) * 0.1;
    d.vy = (event.y - d.y) * 0.1;
}

document.getElementById("reset").addEventListener("click", () => {
    balls = d3.range(20).map((d, i) => ({
        id: i,
        x: Math.random() * (width - 2 * radius) + radius,
        y: Math.random() * (height - 2 * radius) + radius,
        vx: 0,
        vy: 0,
        radius: radius,
        color: i === 0 ? "black" : "white"
    }));

    ballSelection.data(balls, d => d.id)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("fill", d => d.color);

    tick();
});

tick();
