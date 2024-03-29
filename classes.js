

class Player {
    constructor(game) {
        this.game = game
        this.collisionX = this.game.width * 0.5
        this.collisionY = this.game.height * 0.5
        this.collisionRadius = 30
        this.speedX = 0
        this.speedY = 0
        this.dx = 0
        this.dy = 0
        this.speedModifier = 10
        this.spriteWidth = 255
        this.spriteHeight = 256
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX
        this.spriteY
        // 5/16/2023 below is for the animation, but no animation functions have been added yet, it's just the values used for animation
        this.xFrames = 4
        this.yFrames = 4
        this.frameX = 0
        this.frameY = 0
        this.frameInterval = 4
        this.exactFrame = 0
        this.image = document.getElementById('bull')
    }
    restart() {
        this.collisionX = this.game.width * 0.5
        this.collisionY = this.game.height * 0.5
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height * 0.5 - 100

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
        // the X frames
        // if(this.frameX < 20) {
        //     this.frameX++
        // } else {
        //     this.frameX = 0
        // }
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
        //horizontal boundaries
        if(this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius // the left side of the canvas is zero, but the left side should be added to the collision radius
        else if(this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius
        //vertical boundaries
        if(this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius // again the top is zero so it can just be taken out
        else if(this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius
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
    update() {

    }
}

class Egg {
    constructor(game) {
        this.game = game
        this.collisionRadius = 50
        this.margin = this.collisionRadius * 2
        this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2))
        this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin))
        this.image = document.getElementById('egg')
        this.spriteWidth = 110
        this.spriteHeight = 135
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX
        this.spriteY
        this.hatchTimer = 0
        this.hatchInterval = 7000
        this.markedForDeletion = false
    }
    draw(context) {
        context.drawImage(this.image, this.spriteX, this.spriteY)
        if(this.game.debug) {
            context.beginPath()
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
            // .save() and .restore() are if i want to change a state's settings for what's between them and have it not affect the rest of the code
            context.save() // context.save() creates a snapshot of the current canvas state
            context.globalAlpha = 0.5
            context.fill()
            context.restore() // restores what was saved
            context.stroke()
            const displayTimer = (this.hatchTimer / 1000).toFixed(0)
            context.fillText(displayTimer, this.collisionX, this.collisionY - this.collisionRadius * 2.5)
        }
    }
    update(deltaTime) {
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height * 0.5 - 30
        //collisions
        let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies, ...this.game.hatchlings]
        collisionObjects.forEach(object => {
            let {didCollide, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object)
            if(didCollide) {
                const unit_x = dx / distance
                const unit_y = dy / distance
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y
            }
        })
        //hatching
        if(this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
            this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY))
            this.markedForDeletion = true
            this.game.removeGameObject()
        } else {
            this.hatchTimer+= deltaTime
        }
    }
}

class Enemy {
    constructor(game) {
        this.game = game
        this.collisionRadius = 30
        this.speedX = Math.random() * 3 + 5
        this.image = document.getElementById('toads')
        this.spriteWidth = 140
        this.spriteHeight = 260
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
        this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
        this.spriteX
        this.spriteY
        this.frameX = 0
        this.frameY = Math.floor(Math.random() * 4)
        this.hits = 0
        this.maxHits = 3
        this.markedForDeletion = false
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
    update() {
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height + 40
        this.collisionX-= this.speedX
        if(this.spriteX + this.width < 0 && !this.game.gameOver) {
            this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5
            this.collisionY = this.game.topMargin + Math.random() * (this.game.height - this.game.topMargin)
            this.frameY = Math.floor(Math.random() * 4)
        }
        // collisions
        let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies] // this.game.enemies only works with the ternary in the didCollide result; if I change that code I MUST CHANGE THIS CODE 
        collisionObjects.forEach(object => {
            let {didCollide, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object)
            if(didCollide) {
                const unit_x = dx / distance
                const unit_y = dy / distance
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y
            }
        })
        if(this.hits >= this.maxHits) {
            this.markedForDeletion = true
            this.game.killedEnemies++
            this.game.explosions.push(new Explosion(this.game, this.collisionX, this.collisionY))
            this.game.removeGameObject()
        }
    }
}

class Explosion {
    constructor(game, x, y) {
        this.game = game
        this.collisionX = x
        this.collisionY = y
        this.image = document.getElementById('new_explosion')
        this.xFrames = 4
        this.yFrames = 4
        this.frameX = 0
        this.frameY = 0
        this.frameInterval = 4
        this.exactFrame = 0
        this.spriteWidth = this.image.width / this.xFrames
        this.spriteHeight = this.image.height / this.yFrames
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height * 0.5 - 80
        this.audioPlayed = false
        this.markedForDeletion = false
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
    }
    update(deltaTime) { // the draw function only fucks up when i try to animate the sprite
        // this.spriteX = this.collisionX - this.width * 0.5
        // this.spriteY = this.collisionY - this.height * 0.5
        if(!this.audioPlayed) {
            let audio = new Audio("./all_project_sounds/mixkit-arcade-game-explosion-2759.wav")
            audio.play()
            this.audioPlayed = true
        }
        this.exactFrame++
        if(this.exactFrame >= this.frameInterval) {
            this.exactFrame = 0
            if(this.frameX < this.xFrames) {
                this.frameX++
            } else {
                this.frameX = 0
                if(this.frameY >= this.yFrames) {
                    this.markedForDeletion = true
                    this.game.removeGameObject()
                } else {
                    this.frameY++ 
                }
            }
        }
    }
}

class Larva {
    constructor(game, x, y) {
        this.game = game
        this.collisionX = x
        this.collisionY = y
        this.collisionRadius = 30
        this.image = document.getElementById('larva')
        this.spriteWidth = 150
        this.spriteHeight = 150
        this.width = this.spriteWidth
        this.height = this.spriteHeight
        this.spriteX
        this.spriteY
        this.speedX = 1 + Math.random() * 2
        this.frameX = 0
        this.frameY = Math.floor(Math.random() * 2)
    }
    draw(context) {
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
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
    update() {
        this.collisionY-= this.speedX
        this.spriteX = this.collisionX - this.width * 0.5
        this.spriteY = this.collisionY - this.height * 0.5 - 40
        // move to safety
        if(this.collisionY < this.game.topMargin) {
            this.markedForDeletion = true
            this.game.removeGameObject()
            if(!this.game.gameOver) {
                this.game.score++
                let audio = new Audio("./all_project_sounds/mixkit-retro-game-score-212.wav")
                audio.play()
            } 
            // pick a random color from selections below
            const pickColor = ['red']
            const randomColor = pickColor[Math.floor(Math.random() * pickColor.length)] // putting this outside of the loop makes sure all random fireflies are the same color when they were spawned from the same larva -- each firefly being a random color looked weird to me
            // put a random number of fireflies bewtween 1 and 4
            for(let i = 0; i < Math.ceil(Math.random() * 4) + 2; i++) {
                this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, randomColor))
            } 
        }
        // collisions with objects
        let collisionObjects = [this.game.player, ...this.game.obstacles]
        collisionObjects.forEach(object => {
            let {didCollide, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object)
            if(didCollide) {
                const unit_x = dx / distance
                const unit_y = dy / distance
                this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x
                this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y
            }
        })
        // collisions with enemies
        this.game.enemies.forEach(enemy => {
            if(this.game.checkCollision(this, enemy).didCollide && !this.game.gameOver) { // refering only to didCollide
                this.markedForDeletion = true
                enemy.hits++ // larva can hit enemys to destroy them
                let audio = new Audio("./all_project_sounds/mixkit-air-whistle-punch-2048.wav")
                audio.play()
                console.log(enemy)
                this.game.removeGameObject()
                this.game.lostHatchlings++
                for(let i = 0; i < Math.ceil(Math.random() * 4); i++) {
                    this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'yellow'))
                } 
            }
        })
    }
}

class Particle {
    constructor(game, x, y, color) {
        this.game = game
        this.collisionX = x
        this.collisionY = y
        this.color = color
        this.radius = Math.floor(Math.random() * 10 + 5)
        this.speedX = Math.random() * 6 - 3
        this.speedY = Math.random() * 2 + 0.5
        this.angle = 0
        this.va = Math.random() * 0.1 + 0.01
        this.markedForDeletion = false
    }
    draw(context) {
        context.save()
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.collisionX, this.collisionY, this.radius, 0, Math.PI * 2)
        context.fill()
        context.stroke()
        context.restore()
    }
}

class Firefly extends Particle {
    update() {
        this.angle+= this.va
        this.collisionX+= Math.cos(this.angle) * this.speedX
        this.collisionY-= this.speedY
        if(this.collisionY < 0 - this.radius) {
            this.markedForDeletion = true
            this.game.removeGameObject()
        }
    }
}

class Spark extends Particle {
    update() {
        this.angle+= this.va * 0.5
        this.collisionX-= Math.cos(this.angle) * this.speedX
        this.collisionY-= Math.sin(this.angle) * this.speedY
        if(this.radius > 0.1) this.radius-= 0.05
        if(this.radius < 0.2) {
            this.markedForDeletion = true
            this.game.removeGameObject()
        }
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.topMargin = 260
        this.debug = false
        this.player = new Player(this) // instantiating the player, later might be useful to put somewhere else instead/in addition to
        this.fps = 70
        this.timer = 0
        this.interval = 1000/this.fps
        this.eggTimer = 0
        this.eggInterval = 500
        this.numberOfObstacles = 10 // Math.ceil(Math.random() * 6)
        this.maxEggs = 5
        this.numberOfEnemies = 4
        this.killedEnemies = 0
        this.obstacles = []
        this.eggs = []
        this.enemies = []
        this.hatchlings = []
        this.particles= []
        this.explosions = []
        this.gameObjects = []
        this.score = 0
        this.winningScore = 25
        this.gameOver = false
        this.gameEnded = false
        this.lostHatchlings = 0
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
            else if(e.key === 'r') this.restart()
        })
    }
    render(context, deltaTime) {
        if(this.timer > this.interval) {
            //animate frames
            context.clearRect(0, 0, this.width, this.height)
            this.gameObjects = [...this.eggs, ...this.obstacles, this.player, ...this.enemies, ...this.hatchlings, ...this.particles, ...this.explosions]
            // sort by vertical position
            this.gameObjects.sort((a, b) => {
                return a.collisionY - b.collisionY
            })
            this.gameObjects.forEach(object => {
                object.draw(context)
                object.update(deltaTime)
            })
            this.timer = 0
        }
        this.timer+= deltaTime
        // add the eggs periodically
        if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver) {
            this.addEgg()
            this.eggTimer = 0
        } else {
            this.eggTimer+= deltaTime
        }
        // draw score
        context.save()
        context.textAlign = 'left'
        context.fillText(`Score: ${this.score * 1000 - this.lostHatchlings * 100 * 6 + this.killedEnemies * 100 * 5}`, 25, 50) 
        if(this.debug) {
            context.fillText(`Lost Hatclings: ${this.lostHatchlings}`, 25, 100)
            context.fillText(`Enemies Killed: ${this.killedEnemies}`, 25, 150)

        }
        // the instructions
        context.fillText(`Click on board to move to that location`, 300, 50)
        context.fillText('Push eggs and larva to the forest or push enemies away', 300, 100)
        context.fillText('Enemies will eat larva and get hurt in the process', 300, 150)
        context.restore()

        // win/lose message
        if(this.score >= this.winningScore && !this.debug) { // the game won't end in debug mode
            this.gameOver = true
            context.save()
            context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, this.width, this.height)
            context.fillStyle = 'rgba(255, 255, 255, 0.6)'
            context.textAlign = 'center'
            context.shadowOffsetX = 4
            context.shadowOffsetY = 4
            context.shadowColor = 'black'
            let message1
            let message2
            if(this.lostHatchlings <= this.winningScore / 2) {
                // win
                message1 = 'You Win!!!!!!!!'
                message2 = 'Can\'t touch this!!!'
                if(!this.gameEnded) {
                    let audio = new Audio("./all_project_sounds/mixkit-ethereal-fairy-win-sound-2019.wav")
                    audio.play()
                    this.gameEnded = true
                }
            } else {
                // lose
                message1 = 'OH NOOOOO!!!!!!!!'
                message2 = `You lost ${this.lostHatchlings} hatchlings!!!`
                if(!this.gameEnded) {
                    let audio = new Audio("./all_project_sounds/mixkit-sci-fi-game-over-1951.wav")
                    audio.play()
                    this.gameEnded = true
                }
            }
            context.font = '130px Bangers'
            context.fillText(message1, this.width * 0.5, this.height * 0.5 -20)
            context.font = '40px Bangers'
            context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30)
            context.fillText(`Final Score ${this.score * 1000 - this.lostHatchlings * 100 * 6}. Press "R" to restart the game.`, this.width * 0.5, this.height * 0.5 + 80)
            context.restore()
        }
    }
    checkCollision(a, b) {
        const dx = a.collisionX - b.collisionX
        const dy = a.collisionY - b.collisionY
        const distance = Math.hypot(dy, dx)
        const sumOfRadii = a.collisionRadius + b.collisionRadius
        return {
            didCollide: a === b ? false : (distance < sumOfRadii), // if a and b are the same object, it will always return false
            dx: dx,
            dy: dy,
            distance: distance,
            sumOfRadii: sumOfRadii,
        }
    }
    addEgg() {
        this.eggs.push(new Egg(this))
    }
    addEnemy() {
        this.enemies.push(new Enemy(this))
    }
    removeGameObject() { // when this is called it removes all game objects so you don't need it to fire multiple times from the same event
        this.eggs = this.eggs.filter(object => !object.markedForDeletion)
        this.hatchlings = this.hatchlings.filter(object => !object.markedForDeletion)
        this.particles = this.particles.filter(object => !object.markedForDeletion)
        this.enemies = this.enemies.filter(object => !object.markedForDeletion)
        if(this.enemies.length === 0) {
            for(let i = 0; i < this.numberOfEnemies; i++) {
                this.addEnemy()
            }
        }
    }
    restart() {
        this.player.restart()
        this.obstacles = []
        this.eggs = []
        this.enemies = []
        this.hatchlings = []
        this.particles= []
        this.mouse = {
            x: this.canvas.width * 0.5,
            y: this.canvas.height * 0.5,
            isPressed: false,
        }
        this.score = 0
        this.lostHatchlings = 0
        this.gameOver = false
        this.init()
    }
    init() {
        // for(let i = 0; i < this.numberOfObstacles; i++) {
        //     this.obstacles.push(new Obstacle(this))
        // }
        for(let i = 0; i < this.numberOfEnemies; i++) {
            this.addEnemy()
        }
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
            const margin = testObstacle.collisionRadius * 3
            if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) { // makes sure the obstacles don't overlap or move past the edges of the page
                this.obstacles.push(testObstacle)
            }
            attempts++
        }
    }
}