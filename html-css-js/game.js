let c = document.getElementById("canvas");
var ctx = c.getContext('2d')

let widthBoard; 
let heightBoard; 

let sizeSquare;
let sizeCanvas;  

let color; 
let boardArray; 
let boardTopMargin; 

let playerTurn; 
let countTurn; 

let endGame; 
let inRow;

function set()
{
    widthBoard = 7;
    heightBoard = 6;
    playerTurn = 1;
    countTurn = 0;
    endGame = false;
    sizeCanvas = 450;
    inRow = 4;
    color = 
    {
        "board": "black",
        "player": 
        {
            0: "white",
            1: "green",
            2: "blue"
        },
        "tileShadow": "black",
        "textColor": "black"
    };
    setBoard();
    setCanvas();
    setText();
}

function setBoard()
{
    boardArray = [];
    for(y = 0; y < heightBoard; y++)
    {
        let row = [];
        for(x = 0; x < widthBoard; x++)
        {
            row.push(0);
        }
        boardArray.push(row);
    }
}

function setCanvas()
{
    if(heightBoard + 1 > widthBoard)
    {
        c.height = sizeCanvas;
        sizeSquare = sizeCanvas / (heightBoard + 1);
        c.width =  widthBoard * sizeSquare;
    } 
    else 
    {
        c.width = sizeCanvas;
        sizeSquare = sizeCanvas / widthBoard;
        c.height =  (heightBoard + 1) * sizeSquare;
    }
}

function drawTile(x, y,tileColor)
{
    let centerX = (x * sizeSquare) + (sizeSquare / 2);
    let centerY = (y * sizeSquare) + (sizeSquare / 2);
    let tileSize = (sizeSquare * 0.8) / 2;
    ctx.fillStyle = color.player[tileColor];
    ctx.beginPath();
    ctx.arc(centerX, centerY, tileSize, 0, 2 * Math.PI);
    ctx.fill();
}

function draw()
{
    ctx.fillStyle = color.board;
    ctx.fillRect(0, 0 + sizeSquare, widthBoard * sizeSquare, heightBoard * sizeSquare);
    for(y = 0; y < heightBoard; y++)
    {
        for(x = 0; x < widthBoard; x++)
        {
            drawTile(x, y + 1, boardArray[y][x]);
        }
    }
}

function checkWin()
{
    if(toWin()) 
    {
        endGame = true
        return true;   
    }
}

function checkRow()
{
    if(countTurn == widthBoard * heightBoard)
    {
        endGame = true;
        return true;  
    }
}

function Move(x,y)
{
    countTurn++
    boardArray[y][x] = playerTurn;
    if (checkWin()) 
    {
        setText("win")
    } 
    else if (checkRow()) 
    {
        setText("row")
    } 
    else 
    {
        switchPlayer();
        clearTopRow();
        setText("start");
        drawTile(x, 0, playerTurn);
    }
    draw();
}

function addController()
{
    c.addEventListener("mousemove", (e) =>
    {
        let posX = Math.floor((e.clientX - c.offsetLeft) / sizeSquare);
        if(!endGame)
        {
            clearTopRow();
            setText();
            drawTile(posX, 0, playerTurn);
        };
    })
    c.addEventListener("click", (e) =>
    {
        let clickX = Math.floor((e.clientX - c.offsetLeft) / sizeSquare)
        if(!endGame)
        {
            for(y = heightBoard - 1; y >= 0; y--)
            {
                if(boardArray[y][clickX] == 0)
                {
                    Move(clickX, y);
                    break;
                }
            }
        }
    })
}

function switchPlayer()
{
    playerTurn == 1 ? playerTurn = 2: playerTurn = 1;   
}

function clearTopRow()
{
    ctx.clearRect(0, 0, c.width, sizeSquare);
}

function setText(text)
{
    clearTopRow();
    let line;
    switch(text)
    {
        case "win": line = `WYGRAŁ GRACZ ${playerTurn}!`; break;
        case "row": line = `KONIEC GRY - ZAPEŁNIONO PLANSZE!`; break;
        default: line = ``; break;
    };
    ctx.fillStyle = color.textColor;
    ctx.font = "20px 'Times New Roman', Times, serif";
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle"; 
    ctx.fillText(line, c.width / 2, sizeSquare / 2);
}

function toWin()
{
    for (y = 0; y < heightBoard; y++)
    { 
        for (x = 0; x < widthBoard - 3;x++)
        {
            if(boardArray[y][x] == playerTurn && boardArray[y][x+1] == playerTurn && boardArray[y][x+2] == playerTurn && boardArray[y][x+3] == playerTurn) return true;
        }
    }
    for (y = 0; y < heightBoard - 3; y++)
    { 
        for (x = 0; x < widthBoard; x++)
        {
            if(boardArray[y][x] == playerTurn && boardArray[y+1][x] == playerTurn && boardArray[y+2][x] == playerTurn && boardArray[y+3][x] == playerTurn) return true;
        }
    }
    for (y = 0; y < heightBoard - 3; y++)
    { 
        for (x = 0; x < widthBoard - 3; x++)
        {
            if(boardArray[y][x] == playerTurn && boardArray[y+1][x+1] == playerTurn && boardArray[y+2][x+2] == playerTurn && boardArray[y+3][x+3] == playerTurn) return true;
        
        }
    }
    for (y = 3; y < heightBoard; y++)
    {
        for (x = 0; x < widthBoard - 3; x++)
        {
            if(boardArray[y][x] == playerTurn && boardArray[y-1][x+1] == playerTurn && boardArray[y-2][x+2] == playerTurn && boardArray[y-3][x+3] == playerTurn) return true;
        }
    }
    return false
}

set();
draw();
addController();