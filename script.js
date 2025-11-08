const canvasbox = document.getElementById("canvasbox")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const rows = 7


const RED = "#ff0000"
const GREEN = "#00ff00"
const BLUE = "#0000ff"
const ALPHA = "30"

const dx = 650/(rows-1)
const dy = Math.sqrt(3)/2 * dx

ctx.lineWidth = 2
var nodes = []
var show_bg = false

function init_buttons() {
    for (let i = 0; i < rows; i++) {
        nodes.push([])
        for (let j = 0; j <= i; j++) {
            let x = 375 - dx * i/2
            let y = 50

            //Button
            btn = document.createElement("button")
            btn.setAttribute("colour", "black")
            btn.setAttribute("onclick", `update_btn(${i}, ${j}, this)`)
            btn.style.top = (y + dy*i) - 20 + "px"
            btn.style.left = (x + dx*j) - 20 + "px"
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
            if (j < i) colours.push(GREEN)
            if (i < rows-1) colours.push(RED)
            let randidx = Math.floor(Math.random() * colours.length)
            nodes[i][j].setAttribute("colour", colours[randidx])
        }
    }
    draw_canvas()
}

function colour_triangle(i, j, x, y, top) {
    if (i < rows-1 && (top || (i > 0 && j < i))) {
        let vs = top ? [
            [j, i, Math.PI/3, 2*Math.PI/3],
            [j-1/2, i+1, -Math.PI/3, 0],
            [j+1/2, i+1, -Math.PI, -2*Math.PI/3]] :
            [[j, i, 0, Math.PI/3],
            [j+1, i, 2*Math.PI/3, Math.PI],
            [j+1/2, i+1, -2*Math.PI/3, -Math.PI/3]]

        let c1 = nodes[i][j].getAttribute("colour") + ALPHA
        let c2 = nodes[i+top][j+!top].getAttribute("colour") + ALPHA
        let c3 = nodes[i+1][j+1].getAttribute("colour") + ALPHA

        if (c1 == c2 && c2 == c3) {
            ctx.beginPath()
            ctx.moveTo(x + dx*vs[0][0], y + dy*vs[0][1])
            ctx.lineTo(x + dx*vs[1][0], y + dy*vs[1][1])
            ctx.lineTo(x + dx*vs[2][0], y + dy*vs[2][1])
            ctx.fillStyle = c1
            ctx.fill()
            return
        }
        let v
        if (c1 == c2) v = 2
        else if (c1 == c3) v = 1
        else if (c2 == c3) v = 0
        else {
            
            for (let k of [0,1,2]) {
                ctx.beginPath()
                ctx.moveTo(x + dx*vs[k][0], y + dy*vs[k][1])
                ctx.lineTo(x + dx*(vs[k][0]+vs[(k+1)%3][0])/2, y + dy*(vs[k][1]+vs[(k+1)%3][1])/2)
                ctx.lineTo(x + dx*(j+1/2-top/2), y + dy*(i+1/3+top/3))
                ctx.lineTo(x + dx*(vs[k][0]+vs[(k+2)%3][0])/2, y + dy*(vs[k][1]+vs[(k+2)%3][1])/2)
                ctx.fillStyle = [c1,c2,c3][k]
                ctx.fill()
            }
            return
        }

        ctx.beginPath()
        ctx.arc(x + dx*vs[v][0], y + dy*vs[v][1], dx/2, vs[v][2], vs[v][3])
        ctx.lineTo(x + dx*vs[v][0], y + dy*vs[v][1])
        ctx.fillStyle = [c1, c2, c3][v]
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x + dx*vs[v][0], y + dy*vs[v][1], dx/2, vs[v][2], vs[v][3])
        ctx.lineTo(x + dx*vs[(v+2-top)%3][0], y + dy*vs[(v+2-top)%3][1])
        ctx.lineTo(x + dx*vs[(v+1+top)%3][0], y + dy*vs[(v+1+top)%3][1])
        ctx.fillStyle = [c1,c2,c3][(v+1)%3]
        ctx.fill()
    }
}

function draw_canvas() {
    ctx.clearRect(0, 0, 1000, 1000)
    for (let i = 0; i < rows; i++) {
        let x = 375 - dx * i/2
        let y = 50

        for (let j = 0; j <= i; j++) {

            // Centre
            if (show_bg) {
                colour_triangle(i, j, x, y, true)
                colour_triangle(i, j, x, y, false)
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
        }
    }
}

function update_btn(i, j, button) {
    colours = []
    if (j > 0) colours.push(BLUE)
    if (j < i) colours.push(GREEN)
    if (i < rows-1) colours.push(RED)

    let colour = button.getAttribute("colour")
    let idx = (colours.indexOf(colour) + 1) % colours.length
    nodes[i][j].setAttribute("colour", colours[idx])
    console.log("changed to", nodes[i][j].getAttribute("colour"))
    draw_canvas()
}

function update_bg(button) {
    show_bg = button.checked
    draw_canvas()
}


init_buttons()
randomise_colours()
draw_canvas()

