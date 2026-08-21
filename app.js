// ========================================
// SEKARDANGAN CUP VOLLEYBALL SCOREBOARD V6
// MATCH ENGINE + BUZZER SOUND SYSTEM
// ========================================


// ========================================
// DATA TEAM
// ========================================

let teams = {

    A:{
        name:"TIM MERAH",
        score:0,
        set:0
    },


    B:{
        name:"TIM PUTIH",
        score:0,
        set:0
    }

};



// ========================================
// POSISI LAPANGAN
// ========================================

let sideMap={

    left:"A",
    right:"B"

};



// ========================================
// MATCH CONFIG
// ========================================

let currentSet=1;

let history=[];

let servingTeam="";


let bestOf=3;

let pointTarget=25;

let deuce=true;



// ========================================
// TIMER
// ========================================

let matchTime=0;

let timer=null;

let matchStarted=false;

let matchFinished=false;





// ========================================
// 🔊 BUZZER AUDIO ENGINE
// ========================================


const audioCtx =
new (window.AudioContext || window.webkitAudioContext)();



function buzzer(type="point"){


    if(audioCtx.state==="suspended"){

        audioCtx.resume();

    }


    let osc =
    audioCtx.createOscillator();


    let gain =
    audioCtx.createGain();



    osc.connect(gain);

    gain.connect(audioCtx.destination);



    if(type==="point"){


        osc.frequency.value=900;

        gain.gain.value=0.15;


        osc.start();


        setTimeout(()=>{

            osc.stop();

        },120);


    }





    if(type==="set"){


        osc.frequency.value=600;

        gain.gain.value=0.25;


        osc.start();



        setTimeout(()=>{

            osc.frequency.value=900;

        },200);



        setTimeout(()=>{

            osc.stop();

        },600);



    }





    if(type==="win"){


        osc.frequency.value=500;

        gain.gain.value=0.3;


        osc.start();



        setTimeout(()=>{

            osc.frequency.value=800;

        },300);



        setTimeout(()=>{

            osc.frequency.value=1200;

        },600);



        setTimeout(()=>{

            osc.stop();

        },1300);



    }


}





// ========================================
// CLOCK REALTIME
// ========================================


setInterval(()=>{


    let now=new Date();


    document.getElementById("clock")
    .innerHTML=

    now.toLocaleTimeString(
        "id-ID",
        {
            hour12:false
        }
    );


},1000);





// ========================================
// TIMER MATCH
// ========================================


function startTimer(){


    if(timer)
        return;



    timer=setInterval(()=>{


        matchTime++;



        let h=

        String(
            Math.floor(matchTime/3600)
        )

        .padStart(2,"0");




        let m=

        String(
            Math.floor(
                (matchTime%3600)/60
            )
        )

        .padStart(2,"0");




        let s=

        String(
            matchTime%60
        )

        .padStart(2,"0");




        document.getElementById("timer")
        .innerHTML=

        `${h}:${m}:${s}`;



    },1000);



}





function stopTimer(){


    clearInterval(timer);

    timer=null;

}

// ========================================
// HELPER
// ========================================


function getTeam(side){


    return teams[
        sideMap[side]
    ];

}




function getSetsToWin(){


    return Math.ceil(
        bestOf/2
    );

}







// ========================================
// TAMBAH POINT
// ========================================


function addPoint(side){


    if(matchFinished)
        return;



    let key =
    sideMap[side];



    teams[key].score++;



    // 🔊 bunyi point

    buzzer("point");



    // update servis

    servingTeam=key;



    if(!matchStarted){


        matchStarted=true;


        startTimer();


    }



    checkSet();


    update();


}







// ========================================
// KURANG POINT
// ========================================


function minusPoint(side){



    let key =
    sideMap[side];



    if(
        teams[key].score>0
    ){


        teams[key].score--;


    }



    update();


}









// ========================================
// CEK SET
// ========================================


function checkSet(){



    let A =
    teams.A.score;


    let B =
    teams.B.score;




    let winner=null;





    // MODE DEUCE AKTIF

    if(deuce){



        if(

            (A>=pointTarget ||
            B>=pointTarget)

            &&

            Math.abs(A-B)>=2

        ){


            winner =
            A>B ? "A":"B";


        }


    }





    // MODE NORMAL

    else{


        if(

            A>=pointTarget ||
            B>=pointTarget

        ){


            winner =
            A>B ? "A":"B";


        }


    }







    if(winner){



        // 🔊 BUZZER SET SELESAI

        buzzer("set");




        history.push({


            set:currentSet,


            A:
            teams.A.score,


            B:
            teams.B.score


        });





        teams[winner].set++;





        teams.A.score=0;


        teams.B.score=0;




        servingTeam=winner;






        // CEK PEMENANG MATCH


        if(

            teams[winner].set >=
            getSetsToWin()

        ){



            matchFinished=true;



            stopTimer();



            // 🔊 BUZZER JUARA

            buzzer("win");



            setTimeout(()=>{


                alert(

                    "PEMENANG : "

                    +

                    teams[winner].name

                );



            },200);



        }





        else{


            currentSet++;


        }



    }



}









// ========================================
// UPDATE TAMPILAN
// ========================================


function update(){



    let left =
    getTeam("left");


    let right =
    getTeam("right");





    document.getElementById("teamLeft")
    .value =

    left.name;





    document.getElementById("teamRight")
    .value =

    right.name;







    document.getElementById("scoreLeft")
    .innerHTML =

    left.score;





    document.getElementById("scoreRight")
    .innerHTML =

    right.score;






    document.getElementById("setLeft")
    .innerHTML =

    left.set;





    document.getElementById("setRight")
    .innerHTML =

    right.set;






    document.getElementById("currentSet")
    .innerHTML =

    "SET "+currentSet;






    updateServe();


    updateStatus();


    renderHistory();



}

// ========================================
// INDIKATOR SERVIS
// ========================================


function updateServe(){


    document
    .getElementById("serveLeft")
    .classList
    .remove("active");



    document
    .getElementById("serveRight")
    .classList
    .remove("active");




    if(
        servingTeam===sideMap.left
    ){


        document
        .getElementById("serveLeft")
        .classList
        .add("active");


    }





    if(
        servingTeam===sideMap.right
    ){


        document
        .getElementById("serveRight")
        .classList
        .add("active");


    }


}








// ========================================
// STATUS MATCH
// ========================================


function updateStatus(){


    let text =
    "NORMAL PLAY";



    if(servingTeam){


        text =

        teams[servingTeam].name

        +

        " SERVIS";


    }




    if(
        teams.A.score===pointTarget-1
    ){


        text =

        teams.A.name

        +

        " SET POINT";


    }





    if(
        teams.B.score===pointTarget-1
    ){


        text =

        teams.B.name

        +

        " SET POINT";


    }





    if(matchFinished){


        text="MATCH SELESAI";


    }




    document
    .getElementById("status")
    .innerHTML=text;


}









// ========================================
// TABEL REKAP SET
// ========================================


function renderHistory(){


    let html="";



    html+=`

    <tr>

    <th>TIM</th>

    `;



    for(
        let i=1;
        i<=bestOf;
        i++
    ){


        html+=`

        <th>
        SET ${i}
        </th>

        `;


    }


    html+=`

    </tr>

    `;






    // TEAM A


    html+=`

    <tr>

    <td>
    ${teams.A.name}
    </td>

    `;



    for(
        let i=1;
        i<=bestOf;
        i++
    ){


        let data =
        history.find(
            x=>x.set===i
        );



        html+=`

        <td>

        ${
            data
            ?
            data.A
            :
            ""
        }

        </td>

        `;


    }


    html+=`

    </tr>

    `;






    // TEAM B


    html+=`

    <tr>

    <td>
    ${teams.B.name}
    </td>

    `;



    for(
        let i=1;
        i<=bestOf;
        i++
    ){


        let data =
        history.find(
            x=>x.set===i
        );



        html+=`

        <td>

        ${
            data
            ?
            data.B
            :
            ""
        }

        </td>

        `;


    }


    html+=`

    </tr>

    `;





    document
    .getElementById("historyTable")
    .innerHTML=html;


}









// ========================================
// TUKAR POSISI
// ========================================


function switchSide(){


    let temp =
    sideMap.left;



    sideMap.left =
    sideMap.right;



    sideMap.right =
    temp;



    update();


}









// ========================================
// SETTING
// ========================================


document
.getElementById("bestOf")
.addEventListener(
"change",
()=>{


bestOf =

parseInt(
document.getElementById("bestOf").value
);


update();


});







document
.getElementById("pointTarget")
.addEventListener(
"change",
()=>{


pointTarget =

parseInt(
document.getElementById("pointTarget").value
);


});








document
.getElementById("deuce")
.addEventListener(
"change",
()=>{


deuce =

document.getElementById("deuce")
.value==="yes";


});









// ========================================
// NAMA TEAM
// ========================================


document
.getElementById("teamLeft")
.addEventListener(
"input",
(e)=>{


let key =
sideMap.left;



teams[key].name =

e.target.value.toUpperCase();



update();


});







document
.getElementById("teamRight")
.addEventListener(
"input",
(e)=>{


let key =
sideMap.right;



teams[key].name =

e.target.value.toUpperCase();



update();


});









// ========================================
// KEYBOARD CONTROL
// ========================================


document
.addEventListener(
"keydown",
(e)=>{


    if(e.key==="ArrowLeft"){

        addPoint("left");

    }




    if(e.key==="ArrowRight"){

        addPoint("right");

    }






    if(
        e.key==="f" ||
        e.key==="F"
    ){

        fullscreen();

    }






    if(
        e.key==="r" ||
        e.key==="R"
    ){

        resetMatch();

    }



});









// ========================================
// FULLSCREEN
// ========================================


function fullscreen(){


    document
    .documentElement
    .requestFullscreen();


}









// ========================================
// RESET MATCH
// ========================================


function resetMatch(){



if(
!confirm(
"RESET MATCH?"
)

)

return;





teams.A.score=0;


teams.B.score=0;



teams.A.set=0;


teams.B.set=0;



currentSet=1;



history=[];



servingTeam="";



matchFinished=false;



matchStarted=false;



matchTime=0;



stopTimer();




document
.getElementById("timer")
.innerHTML="00:00:00";



update();



}









// ========================================
// INIT
// ========================================


update();
