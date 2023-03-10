

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
        this.speedModifier = 5
        this.spriteWidth = 255
        this.spriteHeight = 255
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX
        this.spriteY
        this.frameX = 0
        this.frameY = 0
        this.image = document.getElementById('bull')
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteWidth, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
        if(this.game.debug) {
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

    }
    update() {
        this.dx = this.game.mouse.x - this.collisionX
        this.dy = this.game.mouse.y - this.collisionY
        // sprite animation
        const angle = Math.atan2(this.dy, this.dx)
        const sliceOfPi = Math.PI / 8
        // all the Y frames of the player sprite are facing in different directions, the equations for angles of a circle refers to pi, the tutorial used number estimates, but i thought using pi would be easier to understand
        if(angle < -(sliceOfPi * 7) || angle > (sliceOfPi * 7)) this.frameY = 6
        else if(angle < -(sliceOfPi * 5)) this.frameY = 7
        else if(angle < -(sliceOfPi * 3)) this.frameY = 0
        else if(angle < -(sliceOfPi)) this.frameY = 1
        else if(angle < (sliceOfPi)) this.frameY = 2
        else if(angle < (sliceOfPi * 3)) this.frameY = 3
        else if(angle < (sliceOfPi * 5)) this.frameY = 4
        else if(angle < (sliceOfPi * 7)) this.frameY = 5
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
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height * 0.5 - 100
        //collisions with obstacles
        this.game.obstacles.forEach(obstacle => {
            /* {
                didCollide: (distance < sumOfRadii),
                dx: dx,
                dy: dy,
                distance: distance,
                sumOfRadii: sumOfRadii,
            } */ // the object returned from checkCollision
            let {didCollide, dx, dy, distance, sumOfRadii} = this.game.checkCollision(this, obstacle)
            if(didCollide) {
                const unit_x = dx / distance // the ratio of the horizontal distance to the actual distance
                const unit_y = dy / distance // the ratio of the vertical distance to the actual distance
                // unit x
                this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x // sets the player's  new x coordinate to be the obstacle's x coordinate plus the distance 
                this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y
            }
        })
    }
}

class Obstacle {
    constructor(game) {
        this.game = game
        this.collisionX = Math.random() * this.game.width
        this.collisionY = Math.random() * this.game.height
        this.collisionRadius = 40
        this.image = document.getElementById('obstacles')
        this.spriteWidth = 250
        this.spriteHeight = 250
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX = this.collisionX - this.width / 2
        this.spriteY = this.collisionY - this.height / 2 - 70
        this.frameX = Math.floor(Math.random() * 4)
        this.frameY = Math.floor(Math.random() * 3)
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
        if(this.game.debug) {
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
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.topMargin = 260
        this.debug = true
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
        window.addEventListener('keydown', (e) => {
            if(e.key === 'd') this.debug = !this.debug
        })
    }
    render(context) {
        this.player.draw(context)
        this.player.update()
        this.obstacles.forEach(obstacle => obstacle.draw(context))
    }
    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX
        const dy = a.collisionY - b.collisionY
        const distance = Math.hypot(dy, dx)
        const sumOfRadii = a.collisionRadius + b.collisionRadius
        return {
            didCollide: (distance < sumOfRadii),
            dx: dx,
            dy: dy,
            distance: distance,
            sumOfRadii: sumOfRadii,
        }
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
                const distanceBuffer = 150 // the distance between the obstacles
                const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer
                if(distance < sumOfRadii) {
                    overlap = true
                }
            })
            const margin = testObstacle.collisionRadius * 2
            if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) { // makes sure the obstacles don't overlap or move past the edges of the page
                this.obstacles.push(testObstacle)
            }
            attempts++
        }
    }
}