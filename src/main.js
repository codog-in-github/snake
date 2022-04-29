import './style/main.less'
const { random, floor } = Math
const stage = document.getElementById('stage');
const MAP_SIZE = 20, MAP = Array(MAP_SIZE)
for (let i = 0; i < MAP_SIZE; i++) {
    MAP[i] = Array(MAP_SIZE)
    const row = document.createElement('div')
    row.className = 'row'
    for (let j = 0; j < MAP_SIZE; j++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        MAP[i][j] = cell
        row.appendChild(cell)
    }
    stage.appendChild(row)
}

class Snake {

    get direction (){
        return this._direction
    }

    set direction (d) {
        if(this.body.length === 1){
            this._direction = d
        } else {
            let _i = this.body[0][0] + ( d === 0 || d === 2 ? 1: 0) * ( d === 0 ? -1 : 1),
            _j = this.body[0][1] + ( d === 1 || d === 3 ? 1: 0) * ( d === 3 ? -1 : 1)
            const [i, j] = this.body[1]
            if (i !== _i || j !== _j) {
                this._direction = d
            }
        }
    }

    constructor (i, j, graph) {
        this._direction =  1
        this.graph = graph
        this.body = [[i, j]]
        this.update(this.body)
    }

    update (add = [], remove = []) {
        for(const p of add){
            const [i, j] = p
            this.graph[i][j].classList.add('s')
        }
        for(const p of remove){
            const [i, j] = p
            this.graph[i][j].classList.remove('s')
        }
    }
}


class Game {
    constructor (graph) {
        this.graph = graph
        this.map = Array(graph.length ** 2)
        this.snake = new Snake(5, 5, graph)
        this.map[5 * this.graph.length + 5] = 's'
        this.timmer = null
        this.speed = 0.2
        this.addKeyHandler()
    }s

    start () {
        this.createAward()
        this.timmer = setInterval(this.loop.bind(this), this.speed * 1000)
    }

    over() {
        clearInterval(this.timmer)
        document.writeln('GAME OVER')
    }

    loop () {
        let [i, j] = this.snake.body[0],
            d = this.snake.direction,
            _i = i + ( d === 0 || d === 2 ? 1: 0) * ( d === 0 ? -1 : 1),
            _j = j + ( d === 1 || d === 3 ? 1: 0) * ( d === 3 ? -1 : 1)
        if(_i < 0 || _j < 0 || _i > this.graph.length || _j > this.graph.length) {
            this.over()
            return
        }
        const next = [_i, _j]
        switch(this.map[_i * this.graph.length + _j]) {
            case 'c':
                return this.over()
            case 'a':
                this.map[_i * this.graph.length + _j] = 'c'
                this.snake.body.unshift(next)
                this.graph[_i][_j].classList.remove('a')
                this.createAward()
                this.snake.update([next])
                break
            default:
                this.map[_i * this.graph.length + _j] = 'c'
                this.snake.body.unshift(next)
                const last = this.snake.body.pop()
                delete this.map[last[0] * this.graph.length + last[1]]
                this.snake.update([next], [last])
                break
        }
    }

    createAward () {
        let rand = null
        let c = 1
        for (let i = 1; i <= this.map.length; i++) {
            if(!this.map[i]){
                rand = floor(random() * c++) === 0 ? i : rand
            }
        }
        if (rand === null) {
            this.over()
        } else {
            this.map[rand] = 'a'
            this.graph[floor(rand / this.graph.length)][rand % this.graph.length].classList.add('a')
        }
    }
    

    addKeyHandler () {
        document.addEventListener('keydown', e => {
            switch(e.key){
                case 'w':
                case 'W':
                case 'ArrowUp':
                    this.snake.direction = 0
                    break
                case 'd':
                case 'D':
                case 'ArrowRight':
                    this.snake.direction = 1
                    break
                case 's':
                case 'S':
                case 'ArrowDown':
                    this.snake.direction = 2
                    break
                case 'a':
                case 'A':
                case 'ArrowLeft':
                    this.snake.direction = 3
                    break
            }
        })
    }
}

const game = new Game(MAP)

game.start()


