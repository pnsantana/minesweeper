/******************************************
**            Functions                  **
******************************************/

//convert a 0-255 index to a 16x16 coord
function index_to_coord( index ){
  var coord = [];

  coord.push( Math.floor( index/16 ) );
  coord.push( index%16 );

  return coord;
};

//covert a 16x16 coord to a 0-255 index
function coord_to_index( x, y ) {
  return ( x*16 + y );
};

// shuffle an array, by switching each element with the elements before it or even itself
function shuffle( arr ) {
  var index, aux;
  for(var i=0; i<arr.length; i++){
    index = Math.floor(Math.random() * i );
    aux = arr[i];
    arr[i] = arr[index];
    arr[index] = aux;
  }
};

//counts adjacent bombs to each element of the board and store it's value on the element
function adjacent_bombs( board ) {
  for( var i=0; i<16; i++){
    for( var j=0; j<16; j++){
      
      if(board[i][j]!='b'){
        var count = 0;

        if (i>0){
          if(board[i-1][j]=='b') //verifies bomb on top
            count++;

          if(j>0){
            if(board[i-1][j-1]=='b') //verifies bomb on top left
              count++;
          };

          if(j<15){
            if(board[i-1][j+1]=='b') //verifies bomb on top right
              count++;
          };

        };

        if (i<15){
          if(board[i+1][j]=='b') //verifies bomb on bottom
            count++;

          if(j>0){
            if(board[i+1][j-1]=='b') //verifies bomb on bottom left
              count++;
          };

          if(j<15){
            if(board[i+1][j+1]=='b') //verifies bomb on bottom right
              count++;
          };
        };

        if (j>0){
          if(board[i][j-1]=='b') //verifies bomb on the left
            count++;
        };

        if (j<15){
          if(board[i][j+1]=='b') //verifies bomb on the right
            count++;
        };

        if(count==0)    //switches '0' for an empty string
          count = '';

        board[i][j]=count;
      }
    }
  }
};

//actions on clicking a blank square (no adjacent bombs)
function blank( id ) {
  
  var coord = [];

  // recieves the coordinates to the square and determines the adjacent ones that should be pressed as well
  function adjacent_blank( i , j ) {

      $( '#' + coord_to_index( i, j) ).addClass('left_clicked');
      $( '#' + coord_to_index( i, j) ).children().show();

      if(board[i][j]=='') {
      
        if (i>0){
          if(board[i-1][j]!='b' && !$( '#' + coord_to_index( i-1 , j ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on top
            adjacent_blank( i-1 , j );

          if(j>0){
            if(board[i-1][j-1]!='b'  && !$( '#' + coord_to_index( i-1 , j-1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on top left
              adjacent_blank( i-1 , j-1 );
          };

          if(j<15){
            if(board[i-1][j+1]!='b'  && !$( '#' + coord_to_index( i-1 , j+1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on top right
              adjacent_blank( i-1 , j+1 );
          };

        };

        if (i<15){
          if(board[i+1][j]!='b'  && !$( '#' + coord_to_index( i+1 , j ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on bottom
            adjacent_blank( i+1 , j );

          if(j>0){
            if(board[i+1][j-1]!='b'  && !$( '#' + coord_to_index( i+1 , j-1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on bottom left
              adjacent_blank( i+1 , j-1 );
          };

          if(j<15){
            if(board[i+1][j+1]!='b'  && !$( '#' + coord_to_index( i+1 , j+1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on bottom right
              adjacent_blank( i+1 , j+1 );
          };
        };

        if (j>0){
          if(board[i][j-1]!='b'  && !$( '#' + coord_to_index( i , j-1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on the left
            adjacent_blank( i , j-1 );
        };

        if (j<15){
          if(board[i][j+1]!='b'  && !$( '#' + coord_to_index( i , j+1 ) ).is('.left_clicked, .right_clicked') ) //verifies bomb on the right
            adjacent_blank( i , j+1 );
        };

      };
  };

  coord = index_to_coord( id );

  adjacent_blank( coord[0] , coord [1] )

};

function verify_win() {
  // win var for control
  var win = 1;

  // if counter !=0 returns 0 without the need to check other things 
  if( counter == 0 ) {

    //verifies if every square is pressed 
    $('.square').each( function() {

      if( $( this ).is('.right_clicked, .left_clicked') == false )
        win = 0;
    });

    //verfies if every right clicked square is indeed a bomb
    $('.right_clicked').each( function() {

      if( $( this ).is('.bomb') == false )
        win = 0;

    });

  // by passing both tests above, win remains equal to 1  
  return win;
  
  }
  else
    return 0;
};


/******************************************
**               Code                    **
******************************************/


//number of bombs on the field
var bombs = 40;

//creates and array with 256 positions, give bombs ('b') to the first 40 (bombs variable) and empty strings ('') for the rest
var bombs_position = [];

for(var i=0; i<256; i++){
  if(i<bombs){
    bombs_position[i]='b';
  }
  else
    bombs_position[i]='';
}

//shuffle the array to give the bombs random positions
shuffle(bombs_position);

//creates a 16x16 matrix with the bombs_position array
for(var i=0, aux = [], board = []; i<16; i++){

  //store a row on an auxiliar array
  for(var j=0; j<16; j++){
    aux.push( bombs_position[ 16*i + j ] );
  };

  //adds the row array to the board 
  board.push(aux);

  //clears the aux array
  aux = [];
};

//counts bombs
adjacent_bombs(board);

//transform the board matrix on an array
for(var i=0, board_array = []; i<16; i++){
  board_array = board_array.concat(board[i]);
};


//puts the board_array to the '.square' divs
$( '.square' ).each( function(index, element) {

  //adds a span with the class value inside each square 
  if ( board_array[index] != 'b' )
    $( this ).html("<span class='value'>" + board_array[index] + "</span>"); 
  else
    $( this ).html("<span class='value'> <img src='bomb.png' height='28' width='28' > </span>");

  //gives each .square an id with its index
  $( this ).attr('id' , index ); 
    
  //adds a class to the div according to its value
  switch (board_array[index]) {
  
    case 'b':
    element.classList.add('bomb');
    break;
    
    case '':
    element.classList.add('zero'); 
    break;

    case 1:
    element.classList.add('one');
    break;
    
    case 2:
    element.classList.add('two');
    break;
    
    case 3:
    element.classList.add('three');
    break;
    
    case 4:
    element.classList.add('four');
    break;
    
    case 5:
    element.classList.add('five');
    break;

    case 6:
    element.classList.add('six');
    break;

    case 7:
    element.classList.add('seven');
    break;

    case 8:
    element.classList.add('eight');
    break;

    default:
  }

});

// timer starts at 0.0
var time = 0;
$('#timer').html( time + '.' + 0 );

//var win controls the state of the game:
// 0 = game running
//-1 = game over
// 1 = you won
var win = 0;

// timer starts counting after the first click on the board
$('#board').one( 'click', function() {

    // counts each 100 miliseconds, as long as the user hasn't wont/lost
    setInterval( function() {
      if( win == 0) {
        time++;
        var clock = Math.floor(time/10) + '.' + time%10 ;
        $('#timer').html(clock);
      };
    }, 100 );

});

// control the number of right clicks (flags) / suposed bombs left
var counter = bombs;

//adds the initial counter value to the counter div
$('#counter').html(counter);


//actions according to mouse clicks
$('.square').mousedown( function(mouse) {

  
  if( win == 0 ){

    switch (mouse.which){

      case 1: //left click actions

      if( $( this ).hasClass('right_clicked') ){
       //left click does nothing over a right click 
      }
      else {
        // add left clicked class to the square and show the value stored on it's span
        $( this ).addClass('left_clicked');
        $( this ).children().show();


        // actions on clicking on bomb
        if( $( this ).hasClass('bomb') ) {
          win = -1;

          $( this ).attr('id', 'clicked_bomb');

          // displays remaining bombs that werent found
          $( '.bomb' ).each( function() {

            if( $( this ).hasClass('right_clicked') == false ){

              $( this ).addClass('left_clicked');
              $( this ).children().show();
            };
          });

          // displays wrong placed flags with a bomb as background and a red 'X' over it
          $( '.right_clicked' ).each( function() {

            if( $( this ).hasClass('bomb') == false ){

              $( this ).addClass('wrong_flag');
              $( this ).html('<span>X</span>');
            };
          });

          //timeout so other images load before the message pops up
          setTimeout( function() { alert('GAME OVER!'); }, 500);

        };

        // actions on clicking on a blank square
        if( $( this ).hasClass('zero') )
          blank( $( this ).attr('id') );
      }

      break;



      case 3: //right click actions
      
      if( $( this ).hasClass('left_clicked') ) {
      //right click does nothing over a left click
      }
      else {

        if ( counter > 0 ) {
          //right click can be toggled on/off if the user decides so (add/remove a flag)
          $( this ).toggleClass('right_clicked');

          // increases/decreases counter according to right click
          if ( $( this ).hasClass('right_clicked') )
            counter--;
          else
            counter++;

          //displays new counter value
          $('#counter').html( counter );
        }
        else{
          // if the counter is already at 0, only option is to remove the 'flag', so the counter doesnt become negative  
          if ( counter == 0) {
            if ( $( this ).hasClass('right_clicked') ) {

              $( this ).removeClass('right_clicked');
              counter++;
              $('#counter').html(counter);
            };
          };
        };
      };

      break;

      default:

    };
  }; 

  // verify victory after each click
  // condition needed because verify_win can set win back to 0, even after a loss
  if( win != -1) {
    win = verify_win();

    if(win==1) {
      // timeout so message doesnt pop up too fast
      setTimeout( function() { alert('YOU WIN!'); }, 500);
    };
  };

});




