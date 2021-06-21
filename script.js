let gamedatabase={
    'you':{'scorespan':".result1",'div':".myscore",'score':0},
    'dealer':{'scorespan':".result2",'div':".botscore",'score':0},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardsmap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':10},
    'wins':0,
    'losses':0,
    'draws':0,
    'isstand':false,
    'turnsover':false,
    'logicover':false,
}


const YOU=gamedatabase['you'];
const DEALER=gamedatabase['dealer'];


const hitmusic=new Audio('img&s/sound/swish.m4a');
const bustmusic=new Audio('img&s/sound/aww.mp3');
const cashmusic=new Audio('img&s/sound/cash.mp3');
const drawmusic=new Audio('img&s/sound/draw.mp3');



document.querySelector('.hit').addEventListener('click',jackhit);
document.querySelector('.stand').addEventListener('click',jackstand);
document.querySelector('.deal').addEventListener('click',jackdeal);


function randomcard(){
    let randomindex=Math.floor(Math.random()*13);
    return gamedatabase['cards'][randomindex];
}


async function jackhit(){
    if(gamedatabase['isstand']===false){
        let card=randomcard();
        showcard(card,YOU);   
        updatescore(card,YOU);
        showscore(YOU);
        if(YOU['score']>21){
            await sleep(1000);
            gamedatabase['logicover']=false;
            gamedatabase['isstand']=true;
            jackstand();
        }    
    }
}


function showcard(card,activeplayer){
    if(activeplayer['score']+gamedatabase['cardsmap'][card]<=21)
    {
        let cardimage=document.createElement('img');
        cardimage.src=`./img&s/img/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardimage);
        hitmusic.play();
        
    }
}

function jackdeal(){
    if(gamedatabase['turnsover']===true){
        gamedatabase['isstand']=false;
        dealcard(YOU);
        dealcard(DEALER);
        let resultdiv=document.getElementById("heading");
        resultdiv.innerText="Lets Play";
        resultdiv.style.color="white";
        gamedatabase['turnsover']=false;
        gamedatabase['logicover']=false;
    }
}





function dealcard(activeplayer){
    let pictures=document.querySelector(activeplayer['div']).querySelectorAll('img');
    for(i=0; i < pictures.length;i++){
        pictures[i].remove();
    }
    hitmusic.play();
        activeplayer['score']=0;
    document.querySelector(activeplayer['scorespan']).innerText=activeplayer['score'];
    document.querySelector(activeplayer['scorespan']).style.color='white';
}

function updatescore(card,activeplayer){
    activeplayer['score']+=gamedatabase['cardsmap'][card];
}



function showscore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['scorespan']).innerText="BUST!";
        document.querySelector(activeplayer['scorespan']).style.color="red";
    }
    else{
        document.querySelector(activeplayer['scorespan']).innerText=activeplayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}




async function  jackstand(){
    if(gamedatabase['logicover']===false){
        gamedatabase['isstand']=true;
        while(DEALER['score']<16){
            let card=randomcard();
            showcard(card,DEALER);
            updatescore(card,DEALER);
            showscore(DEALER);
            await sleep(2000);
        }
        gamedatabase['turnsover']=true;
        let winner=computewinner();
        showresult(winner);
        gamedatabase['logicover']=true;

    }
}


function computewinner(){
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score']||(DEALER['score']>21)){
            winner=YOU;
        }
    else if(YOU['score']<DEALER['score']){
            winner=DEALER;

        }
        else if(YOU['score']==DEALER['score']){

        }
    }else if(YOU['score']>21&&DEALER['score']<=21){
            winner=DEALER;
        }
        else if(YOU['score']>21&& DEALER['score']>21){
            console.log("you draw");
        }
        return winner;
    }


    function showresult(winner){
        let message,messagecolor;
        if(winner===YOU)
        {
            message="YOU WON!";
            messagecolor="green";
            cashmusic.play();
            gamedatabase['wins']++;
            document.getElementById('wins').innerText=gamedatabase['wins'];
        }

        else if(winner===DEALER){
            message="YOU LOST!";
            messagecolor="red";
            bustmusic.play();
            gamedatabase['losses']++;
            document.getElementById('losses').innerText=gamedatabase['losses'];
        }

        else{
            message="YOU DRAW!";
            messagecolor="black";
            drawmusic.play();
            gamedatabase['draws']++;
            document.getElementById('draws').innerText=gamedatabase['draws'];
        }

        resultdiv=document.getElementById('heading');
        resultdiv.innerText=message;
        resultdiv.style.color=messagecolor;

    }



        const triggerControl = (event) => {
            let keyCode = event.keyCode;
            if (keyCode == "72") {
            jackhit();
            } else if (keyCode == "68") {
            jackdeal();
            } else if (keyCode == "83") {
            jackstand();
            }
        }
        
        addEventListener('keydown', triggerControl);