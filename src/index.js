import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    createBoard = () => {
        let board = []

        for (let r = 0; r < 3; r++) {
            let children = []
            for (let c = 0; c < 3; c++) {
                children.push(this.renderSquare(r * 3 + c))
            }

            board.push(<div className="board-row">{children}</div>)
        }

        return board
    }

    render() {
        return <div>{this.createBoard()}</div>
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    move: Array(2).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            movesDescending: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    move: [i % 3, (i / 3) | 0],
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: move % 2 === 0,
        })
    }

    changeMoveOrder() {
        this.setState({
            movesDescending: !this.state.movesDescending,
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        let moves = history.map((step, moveNumber) => {
            var desc = moveNumber
                ? 'Go to move #' + moveNumber + ' ' + step.move
                : 'Go to game start'
            return (
                <li key={moveNumber}>
                    <button
                        onClick={() => {
                            this.jumpTo(moveNumber)
                        }}
                    >
                        {moveNumber === this.state.stepNumber ? (
                            <b>{desc}</b>
                        ) : (
                            desc
                        )}
                    </button>
                </li>
            )
        })

        if (this.state.movesDescending) {
            moves.reverse()
        }

        let status
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button
                        onClick={() => {
                            this.changeMoveOrder()
                        }}
                    >
                        Reverse move order
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a]
        }
    }
    return null
}
