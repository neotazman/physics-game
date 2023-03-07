

class Player {
    constructor(game) {
        this.game = game
        this.collisionX = this.game.width * 0.5
        this.collisionY = this.game.height * 0.5
        this.collisionRadius = 50
        this.speedX = 0
        this.speedY = 0
        this.dx = 0
        this.dy = 0
    }
    draw(context) {
        context.beginPath()
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
        // .save() and .restore() are if i want to change a state's settings for what's between them and have it not affect the rest of the code
        context.save() // context.save() creates a snapshot of the current canvas state
        context.globalAlpha = 0.5
        context.fill()
        context.restore() // restores what was saved
        context.stroke()
        // context.beginPath() creates a line between the .moveTo(point) and the .lineTo(point)
        context.beginPath()
        context.moveTo(this.collisionX, this.collisionY)
        context.lineTo(this.game.mouse.x, this.game.mouse.y)
        context.stroke()
    }
    update() {
        this.dx = this.game.mouse.x - this.collisionX
        this.dy = this.game.mouse.y - this.collisionY
        this.speedX = this.dx / 30
        this.speedY = this.dy / 20
        this.collisionX += this.speedX
        this.collisionY += this.speedY
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.player = new Player(this) // instantiating the player, later might be useful to put somewhere else instead/in addition to
        this.mouse = {
            x: this.canvas.width * 0.5,
            y: this.canvas.height * 0.5,
            isPressed: false,
        }
        // the overlay is changed in the css file to make these work more reliably
        canvas.addEventListener('mousedown', (e) => { 
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.mouse.isPressed = true
        })
        canvas.addEventListener('mouseup', (e) => { 
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
            this.mouse.isPressed = false
        })
        canvas.addEventListener('mousemove', (e) => { 
            if(this.mouse.isPressed) {
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY                
            }
        })
    }
    render(context) {
        this.player.draw(context)
        this.player.update()
    }
}