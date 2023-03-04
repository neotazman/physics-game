// this was made using a tutorial: https://www.youtube.com/watch?v=U34l-Xz5ynU&t=342s

// using exact pixels doesn't work well with zooming in, so i'm using a variable that I can change if i need to
// might change to percentage in css
let canvasHeight = 720
let canvasWidth = canvasHeight * (1280 / 720)


window.addEventListener('load', () => { // I don't see the point of this yet
    const canvas = document.getElementById("canvas1")
    const ctx = canvas.getContext("2d")
    const overlay = document.getElementById("overlay")
    overlay.height = canvasHeight
    overlay.width = canvasWidth
    canvas.height = canvasHeight
    canvas.width = canvasWidth

    ctx.fillStyle = 'white'

    class Player {
        constructor(game) {
            this.game = game
            this.collisionX = this.game.width * 0.5
            this.collisionY = this.game.height * 0.5
            this.collionRadius = 50
        }
        draw(context) {
            context.beginPath()
            context.arc(this.collisionX, this.collisionY, this.collionRadius, 0, Math.PI * 2)
            context.fill()
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas
            this.width = this.canvas.width
            this.height = this.canvas.height
            this.player = new Player(this)
        }
        render(context) {
            this.player.draw(context)
        }
    }

    const game = new Game(canvas)
    game.render(ctx)
    console.log(game)

    function animate() {

    }
})

