const width = 600;
const height = 600;
const gravity = 0.1;
const bounce = -0.7;

const svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);

const balls = d3.range(10).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: 10
}));

const ballSelection = svg.selectAll("circle")
    .data(balls)
    .enter()
    .append("circle")
    .attr("r", d => d.radius)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded));

function tick() {
    ballSelection
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function dragStarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d.vx = 0;
    d.vy = 0;
    tick();
}

function dragEnded(event, d) {
    d3.select(this).attr("stroke", null);
    d.vx += (event.x - d.x) * 0.1;
    d.vy += (event.y - d.y) * 0.1;
}

d3.timer(() => {
    balls.forEach(d => {
        d.vy += gravity;

        d.x += d.vx;
        d.y += d.vy;

        if (d.x - d.radius < 0 || d.x + d.radius > width) {
            d.vx *= bounce;
            d.x = d.x - d.radius < 0 ? d.radius : width - d.radius;
        }

        if (d.y + d.radius > height) {
            d.y = height - d.radius;
            d.vy = 0;
        } else if (d.y - d.radius < 0) {
            d.vy *= bounce;
            d.y = d.radius;
        }
    });

    tick();
});
