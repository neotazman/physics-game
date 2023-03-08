

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
        this.speedModifier = 15
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
        const distance = Math.hypot(this.dy, this.dx)
        if(distance > this.speedModifier) { // so the player doesn't keep shaking when it hits the clicked spot
            this.speedX = this.dx / distance || 0
            this.speedY = this.dy / distance || 0            
        } else {
            this.speedX = 0
            this.speedY = 0
        }

        this.collisionX += this.speedX * this.speedModifier
        this.collisionY += this.speedY * this.speedModifier
    }
}

class Obstacle {
    constructor(game) {
        this.game = game
        this.collisionX = Math.random() * this.game.width
        this.collisionY = Math.random() * this.game.height
        this.collisionRadius = 60
        this.image = document.getElementById('obstacles')
        this.spriteWidth = 250
        this.spriteHeight = 250
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX = this.collisionX - this.width / 2
        this.spriteY = this.collisionY - this.height / 2 - 70
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
        context.beginPath()
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
        // .save() and .restore() are if i want to change a state's settings for what's between them and have it not affect the rest of the code
        context.save() // context.save() creates a snapshot of the current canvas state
        context.globalAlpha = 0.5
        context.fill()
        context.restore() // restores what was saved
        context.stroke()
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.player = new Player(this) // instantiating the player, later might be useful to put somewhere else instead/in addition to
        this.numberOfObstacles = 10 // Math.ceil(Math.random() * 6)
        this.obstacles = []
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
        this.obstacles.forEach(obstacle => obstacle.draw(context))
    }
    init() {
        // for(let i = 0; i < this.numberOfObstacles; i++) {
        //     this.obstacles.push(new Obstacle(this))
        // }
        let attempts = 0
        while(this.obstacles.length < this.numberOfObstacles && attempts < 200) {
            let testObstacle = new Obstacle(this)
            let overlap = false
            this.obstacles.forEach(obstacle => {
                const dx = testObstacle.collisionX - obstacle.collisionX
                const dy = testObstacle.collisionY - obstacle.collisionY
                const distance = Math.hypot(dy, dx)
                const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius
                if(distance < sumOfRadii) {
                    overlap = true
                }
            })
            if(!overlap) {
                this.obstacles.push(testObstacle)
            }
            attempts++
        }
    }
}