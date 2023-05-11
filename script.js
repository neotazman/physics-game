// this was made using a tutorial: https://www.youtube.com/watch?v=U34l-Xz5ynU&t=342s

// i'm using a variable that both the canvas and the overlay will be set to
// might change to percentage in css
let canvasHeight = 720
let canvasWidth = canvasHeight * (1280 / 720)


window.addEventListener('load', () => { 
    const canvas = document.getElementById("canvas1")
    const ctx = canvas.getContext("2d")
    const overlay = document.getElementById("overlay")
    overlay.height = canvasHeight
    overlay.width = canvasWidth
    canvas.height = canvasHeight
    canvas.width = canvasWidth

    ctx.fillStyle = 'white'
    ctx.lineWidth = 3
    ctx.strokeStyle = 'black'
    ctx.font = '40px Bangers'
    ctx.textAlign = 'center'

    const game = new Game(canvas)
    game.init()
    console.log(game)

    let lastTime = 0
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        game.render(ctx, deltaTime)
        requestAnimationFrame(animate)
    }
    animate(0)
})

