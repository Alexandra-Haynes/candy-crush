let candies = ["Blue", "Green", "Yellow", "Purple", "Red", "Orange"];

let board = [];

let rows = 9;
let cols = 9;
let score = 0;

let currentTile; //currtile
let targetTile; //othertile

window.onload = function () {
  startGame();

  window.setInterval(function () {
    crushCandy();
    slideCandy() //everytime we crush candy we want to slide them too
    generateCandy() //and generate more candies
  }, 100); //check if there are candies to be crushed
};

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = []; //holding the img tags for each row
    for (let c = 0; c < cols; c++) {
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";
      //< img id='0-1' src = './images/Red.png'

      //drag and drop functionality:
      tile.addEventListener("dragstart", dragStart); //step 1: click on candy
      tile.addEventListener("dragover", dragOver); //step 2: moving the mouse when clicked
      tile.addEventListener("dragenter", dragEnter); //step 3: dragging cand onto another candy
      tile.addEventListener("dragleave", dragLeave); //step 4: leave candy over another candy
      tile.addEventListener("drop", dragDrop); //step 5: dropping candy over another candy
      tile.addEventListener("dragend", dragEnd);
      //step 6: after drag process completed, swaps the candy (crushes teh candy)

      document.getElementById("board").appendChild(tile);

      row.push(tile); //add tile to the current row
    }
    board.push(row); //add rows to the board
  }
  // console.log(board)
}

function dragStart() {
  currentTile = this; //this = the candy(tile) that was just clicked on
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  targetTile = this;
}

function dragEnd() {
  //firstly we check if neither of the img is blank:

  if(currentTile.src.includes('blank') || targetTile.src.includes('blank')){
    return; //don't perform the swap
  }

  //only swap if candies are adjacents:
  // => step1: we need coords for both candies
  let currentCoords = currentTile.id.split("-"); // id='0-1' -> ['0','1']
  let r = parseInt(currentCoords[0]);
  let c = parseInt(currentCoords[1]);

  let targetCoords = targetTile.id.split("-");
  let r2 = parseInt(targetCoords[0]);
  let c2 = parseInt(targetCoords[1]);

  //step 2: check if candies are neighbors:
  let moveLeft = c2 == c - 1 && r2 == r; //same row, consecutive col left
  let moveRight = c2 == c + 1 && r2 == r; //same row, consecutive col right
  let moveUp = c2 == c && r2 == r - 1; //same col, consecutive row up
  let moveDown = (c2 == c) & (r2 == r + 1); //same col, consecutive row down

  //step 3: validate the swap
  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

  if (isAdjacent) {
    //step 4: perform the swap:
    let currentImg = currentTile.src;
    let targetImg = targetTile.src;
    currentTile.src = targetImg;
    targetTile.src = currentImg; //swith img

    //check if the swap is valid:
    let validMove = checkValid();
    if (!validMove){
      let currentImg = currentTile.src;
      let targetImg = targetTile.src;
      currentTile.src = targetImg;
      targetTile.src = currentImg; 
    }
  }
}

//crushing the candy:

function crushCandy() {
  //crushFive()
  //crushFour()
  //when you crush 4 or 5 in a row you get a special candy
  crushThree();
  document.getElementById('score').innerText = score;
  //specialCandy()
}

function crushThree() {
  //step1: check rows: check 2 candy with the 2 candies ahead => c < cols-2
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      //check if the img src is the same:
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy1.src != "./images/blank.png"
      ) {
        //blank.png is what we gonna use to replace the img with
        //we use this dummy code to prevent from having 'img not found'
        //we can also use !candy1.src.includes('blank)
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png"; //crush all 3 candies
        score +=30;  //30 because we crushed 3 candies
      }
    }
  }
  //check columns:
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];

      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy1.src != "./images/blank.png"
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        score +=30;
      }
    }
  }
}

//prevent from swapping with an empty tile

function checkValid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];

      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy1.src != "./images/blank.png"
      ) {
        return true; //we dont want to crush them, just to validate the swap
      }
    }
  }
  //check columns:
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];

      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy1.src != "./images/blank.png"
      ) {
        return true;
      }
    }
  }
  return false; //not valid
}


function slideCandy() {
    for(let c=0; c< cols; c++) {
        //for every column we check if we have empty tiles
        //we go up checking every row
        //if we find a candy we want to drag(slide) it down, falling effect
        //continuing with every candy in the next rows, till all the candies fall
        //after that we set those tiles to empty tiles 
        //and generate more candies for them
        let candyIndex = rows-1; //start at row no 8
        for (let r= rows -1; r >=0; r--){
            //minues means is gonna go up
            if(!board[r][c].src.includes('blank')){ //if it's a candy
                board[candyIndex][c].src= board[r][c].src; //?
                candyIndex -=1; //moving the index up by 1

            }
        }
        for(let r= candyIndex; r >=0; r --){
            board[r][c].src = './images/blank.png'
        }
    }
}

function generateCandy() {
    //we only gonna generate for the first row because
    // slideCandy()is gonna slide that candy down and 
    //repeat every 1/10 of a sec
    for (let c=0; c<cols; c++){
        if(board[0][c].src.includes('blank')){
            board[0][c].src = './images/' + randomCandy() +'.png'
        }
    }
}