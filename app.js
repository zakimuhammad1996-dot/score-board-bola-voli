let scoreA = 0;
let scoreB = 0;

let setA = 0;
let setB = 0;

let currentSet = 1;

let history = [];

let servingTeam = "";



/*
====================================
 TAMBAH POINT
====================================
*/

function point(team){

    if(team === "A"){

        scoreA++;

        servingTeam =
        document.getElementById("teamA").value;

    }

    else{

        scoreB++;

        servingTeam =
        document.getElementById("teamB").value;

    }


    checkSet();

    update();

}





/*
====================================
 KURANG POINT
====================================
*/

function minus(team){


    if(team === "A" && scoreA > 0){

        scoreA--;

    }



    if(team === "B" && scoreB > 0){

        scoreB--;

    }


    update();

}





/*
====================================
 STATUS MATCH
====================================
*/

function checkStatus(){


    let status="NORMAL PLAY";


    if(servingTeam !== ""){

        status =
        servingTeam + " SERVIS";

    }



    if(scoreA==24 && scoreB<=23){

        status =
        document.getElementById("teamA").value
        +" SET POINT";

    }



    if(scoreB==24 && scoreA<=23){

        status =
        document.getElementById("teamB").value
        +" SET POINT";

    }



    if(
        (setA==2 && scoreA>=23)
        ||
        (setB==2 && scoreB>=23)
    ){

        status="MATCH POINT";

    }



    document.getElementById("statusMatch")
    .innerHTML=status;


}





/*
====================================
 CEK SET
 BEST OF 3
 25 POINT
 DEUCE SYSTEM
====================================
*/

function checkSet(){


    let target = 25;



    if(

        (scoreA >= target ||
        scoreB >= target)

        &&

        Math.abs(scoreA-scoreB)>=2

    ){


        let winner="";



        if(scoreA > scoreB){


            setA++;

            winner =
            document.getElementById("teamA").value;


        }

        else{


            setB++;

            winner =
            document.getElementById("teamB").value;


        }



        history.push({

            set:currentSet,

            teamA:
            document.getElementById("teamA").value,


            teamB:
            document.getElementById("teamB").value,


            a:scoreA,

            b:scoreB,


            winner:winner


        });





        scoreA=0;

        scoreB=0;



        currentSet++;



        if(setA==2 || setB==2){


            setTimeout(()=>{


                let champion =
                setA==2

                ?

                document.getElementById("teamA").value

                :

                document.getElementById("teamB").value;



                alert(
                "PEMENANG : "+champion
                );


            },300);



        }



    }



}








/*
====================================
 UPDATE TAMPILAN
====================================
*/


function update(){



    document.getElementById("scoreA")
    .innerHTML=scoreA;



    document.getElementById("scoreB")
    .innerHTML=scoreB;





    document.getElementById("setA")
    .innerHTML=setA;



    document.getElementById("setB")
    .innerHTML=setB;





    document.getElementById("currentSet")
    .innerHTML=

    "SET "+currentSet;





    document.getElementById("headA")
    .innerHTML=

    document.getElementById("teamA")
    .value;




    document.getElementById("headB")
    .innerHTML=

    document.getElementById("teamB")
    .value;



    renderHistory();



    checkStatus();



}









/*
====================================
 REKAP HASIL SET
====================================
*/

function renderHistory(){



    let html="";



    history.forEach((x)=>{



        html+=`


        <tr>


        <td>
        SET ${x.set}
        </td>



        <td>
        ${x.a}
        </td>



        <td>
        ${x.b}
        </td>



        <td>
        ${x.winner}
        </td>



        </tr>


        `;



    });





    if(html===""){



        html=`

        <tr>

        <td colspan="4">

        Belum ada set

        </td>

        </tr>

        `;


    }





    document.getElementById("history")
    .innerHTML=html;



}










/*
====================================
 TUKAR POSISI LAPANGAN
====================================
*/


function switchCourt(){



    let area =
    document.querySelector(".score-area");



    let left =
    area.children[0];



    let right =
    area.children[2];



    area.insertBefore(
        right,
        left
    );



    area.appendChild(left);



}









/*
====================================
 FULL SCREEN
====================================
*/


function fullscreen(){



    let element=document.documentElement;



    if(element.requestFullscreen){


        element.requestFullscreen();


    }



}










/*
====================================
 RESET MATCH
====================================
*/


function resetMatch(){



    if(confirm(
    "Reset pertandingan?"
    )){



        scoreA=0;

        scoreB=0;


        setA=0;

        setB=0;


        currentSet=1;


        history=[];


        servingTeam="";


        update();



    }


}








/*
====================================
 LOAD AWAL
====================================
*/


update();