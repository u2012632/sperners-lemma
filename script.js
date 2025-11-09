const canvasbox = document.getElementById("canvasbox")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const RED = "#ff0000"
const GREEN = "#00ff00"
const BLUE = "#0000ff"
const NULL = "#E7F2EF"
const ALPHA = "25"

var rows = 7
var dx
var dy

var nodes = []
var show_bg = false
var show_arr = false
ctx.lineWidth = 2

function init_buttons() {
    for (let row of nodes) {
        for (let button of row) button.remove()
    }
    nodes = []

    dx = 650/(rows-1)
    dy = Math.sqrt(3)/2 * dx
    for (let i = 0; i < rows; i++) {
        nodes.push([])
        for (let j = 0; j <= i; j++) {
            let x = 375 - dx * i/2
            let y = 50

            //Button
            btn = document.createElement("button")
            btn.setAttribute("colour", "black")
            btn.setAttribute("onclick", `update_btn(${i}, ${j}, this)`)
            btn.style.top = (y + dy*i) - 23 + "px"
            btn.style.left = (x + dx*j) - 23 + "px"
            canvasbox.appendChild(btn)

            nodes[i].push(btn)
        }
    }
}

function randomise_colours() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
            colours = []

            if (j > 0) colours.push(BLUE)
            if (j < i) colours.push(RED)
            if (i < rows-1) colours.push(GREEN)
            let randidx = Math.floor(Math.random() * colours.length)
            nodes[i][j].setAttribute("colour", colours[randidx])
        }
    }
}

function reset_colours() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
            if (i == 0 || (i == rows-1 && (j == 0 || j == rows-1))) continue
            nodes[i][j].setAttribute("colour", NULL)
        }
    }
    draw_canvas()
}

function polygon(p1, p2, p3, p4, colour) {
    if (colour == NULL) return
    ctx.beginPath()
    ctx.moveTo(...p1)
    ctx.lineTo(...p2)
    ctx.lineTo(...p3)
    ctx.lineTo(...p4)
    ctx.fillStyle = colour
    ctx.fill()
}

function colour_triangle(i, j, x, y, top) {
    points = top ? [
        [x + dx*j, y + dy*i],
        [x + dx*(j+1/4), y + dy*(i+1/2)],
        [x + dx*(j+1/2), y + dy*(i+1)],
        [x + dx*j, y + dy*(i+1)],
        [x + dx*(j-1/2), y + dy*(i+1)],
        [x + dx*(j-1/4), y + dy*(i+1/2)],
        [x + dx*j, y + dy*(i+2/3)]] : [
        [x + dx*j, y + dy*i],
        [x + dx*(j+1/2), y + dy*i],
        [x + dx*(j+1), y + dy*i],
        [x + dx*(j+3/4), y + dy*(i+1/2)],
        [x + dx*(j+1/2), y + dy*(i+1)],
        [x + dx*(j+1/4), y + dy*(i+1/2)],
        [x + dx*(j+1/2), y + dy*(i+1/3)]]
    
    let c1 = nodes[i][j].getAttribute("colour") + ALPHA
    let c2 = nodes[i+1][j+!top].getAttribute("colour") + ALPHA
    let c3 = nodes[i+top][j+1].getAttribute("colour") + ALPHA
    polygon(points[0], points[1], points[6], points[5], c1)
    polygon(points[4], points[5], points[6], points[3], c2)
    polygon(points[2], points[3], points[6], points[1], c3)
}

function connect_triangle(i, j, x, y, top) {
    ctx.beginPath()
    ctx.arc(x + dx*(j+!top/2), y + dy*(i+1/3+top/3), 2, 0, 2 * Math.PI)
    ctx.fillStyle = "goldenrod"
    ctx.strokeStyle = "goldenrod"
    ctx.lineWidth = 3
    ctx.fill()
    ctx.stroke()

    let c1 = nodes[i][j].getAttribute("colour")
    let c2 = nodes[i+top][j+!top].getAttribute("colour")
    let c3 = nodes[i+1][j+1].getAttribute("colour")
    let valid = (x, y) => [RED, BLUE].includes(x) && [RED, BLUE].includes(y) && x != y


    if (top && i < rows-1 && valid(c2, c3)) {
        ctx.beginPath()
        ctx.moveTo(x + dx*j, y + dy*(i+2/3))
        ctx.lineTo(x + dx*j, y + dy*(i+4/3 + 5*(i == rows-2)))
        ctx.stroke()
    }
    if (!top && valid(c1, c3)) {
        ctx.beginPath()
        ctx.moveTo(x + dx*j, y + dy*(i+2/3))
        ctx.lineTo(x + dx*(j+1/2), y + dy*(i+1/3))
        ctx.stroke()
    }
    if (!top && valid(c2, c3)) {
        ctx.beginPath()
        ctx.moveTo(x + dx*(j+1/2), y + dy*(i+1/3))
        ctx.lineTo(x + dx*(j+1), y + dy*(i+2/3))
        ctx.stroke()
    }

    ctx.lineWidth = 2
    ctx.strokeStyle = "black"
}

function draw_canvas() {
    ctx.clearRect(0, 0, 1000, 1000)
    for (let i = 0; i < rows; i++) {
        let x = 375 - dx * i/2
        let y = 50

        for (let j = 0; j <= i; j++) {
            // Filled triangle
            if (show_bg && i < rows-1) {
                colour_triangle(i, j, x, y, true)
                if (i > 0 && j < i) colour_triangle(i, j, x, y, false)
            }

            // Diagonal edges
            if (i < rows-1) {
                ctx.beginPath()
                ctx.moveTo(x + dx*j, y + dy*i)
                ctx.lineTo(x + dx*(j-1/2), y + dy*(i+1))
                ctx.moveTo(x + dx*j, y + dy*i)
                ctx.lineTo(x + dx*(j+1/2), y + dy*(i+1))
                ctx.stroke()
            }
            // Horizontal edges
            if (j < i) {
                ctx.beginPath()
                ctx.moveTo(x + dx*j, y + dy*i)
                ctx.lineTo(x + dx*(j+1), y + dy*i)
                ctx.stroke()
            }
            // Nodes
            ctx.beginPath()
            ctx.arc(x + dx*j, y + dy*i, 14, 0, 2 * Math.PI)
            ctx.fillStyle = nodes[i][j].getAttribute("colour")
            ctx.fill()
            ctx.stroke()
            
            // Vertices
            if (show_arr && i < rows-1) {
                connect_triangle(i, j, x, y, true)
                if (j < i) connect_triangle(i, j, x, y, false)
            }
        }
    }
}

function update_btn(i, j, button) {
    colours = []
    if (j > 0) colours.push(BLUE)
    if (j < i) colours.push(RED)
    if (i < rows-1) colours.push(GREEN)

    let colour = button.getAttribute("colour")
    let idx = colours.indexOf(colour)
    let newidx = idx < 0 ? 0 : (idx+1) % colours.length
    nodes[i][j].setAttribute("colour", colours[newidx])
    draw_canvas()
}

function update_bg(button) {
    show_bg = button.checked
    draw_canvas()
}

function update_rows(range) {
    rows = range.value
    init_buttons()
    randomise_colours()
    draw_canvas()
}

function update_arrow(button) {
    show_arr = button.checked
    draw_canvas()
}

update_rows({"value": 6})
