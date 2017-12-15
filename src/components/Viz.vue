<template>

    <div class="container">
    <h2>Viz</h2>

    <modal name="hello-world">
        <div slot="top-right">
            <button @click="$modal.hide('foo')">
            ❌
            </button>
        </div>

        <div id="in">
            <label for="">Nom du processus</label>
            <input v-model="proc.nom" type="text">
        </div>

        <div id="in">
            <label for="">Duree</label>
            <input v-model.number="proc.duree" min="0" type="number">
        </div>

        <div id="in">
            <label for="">Temps d'arivee</label>
            <input min="0" v-model.number="proc.temps_arivee" type="number">
        </div>

        <div id="in">
            <label for="">Prioritee</label>
            <input min="0" v-model.number="proc.prioritee" type="number">
        </div>


        <button v-on:click="submitData">Go</button>
    </modal>

    <canvas ref="myCanvas" width="1200px" height="600px"></canvas>
    <h2>Data</h2>
    <button @click="show">Ajouter</button>
            <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Duree</th>
                    <th>Prioritee</th>
                    <th>temps arivee</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
	        <tr v-for="(row, index) in procs">
	            <td>{{ row.nom }}</td>
	        	<td>{{ row.duree }}</td>
	        	<td>{{ row.prioritee }}</td>
	        	<td>{{ row.temps_arivee }}</td>

		        <td><a @click="removeRow(row, index)">Remove</a></td>
	        </tr>
            </tbody>
    </table>
</div>
</template>

<script>

import "@/algorithms/test"
import Proc from "@/algorithms/data"
import FIFO from "@/algorithms/fifo"
import SJF from "@/algorithms/sjf"
import RR from "@/algorithms/rr"

export default {
    name: 'Viz',
    data () {
        return {
            procs: [],
            calc: {},
            last: 5,
            proc: {
                duree: 0,
                prioritee: 0,
                nom: "",
                temps_arivee: 0
            },
            curr: {},
            algo: FIFO
        }
    },

    watch: {
        'procs': function (val) {
            // this.curr = this.algo(this.procs)
            this.curr = RR(this.procs, 2)
            this.doStuff()
        }
    },

    mounted () {
        console.log("Mounted program")
        this.procs = [new Proc('P1', 0, 0, 9),
            new Proc('P2', 0, 1, 7),
            new Proc('P3', 0, 0, 8),
            new Proc('P4', 0, 3, 3),
            new Proc('P5', 0, 7, 1),
            new Proc('P6', 0, 13, 5),
            new Proc('P7', 0, 14, 1),
            ]

        // RR(this.procs, 3)
        // this.curr = RR(this.procs, 3)
        this.doStuff()
        this.show()
    },


    methods: {
        show () {
            this.$modal.show('hello-world');
        },
        hide () {
            this.$modal.hide('hello-world');
        },

        submitData (event) {
            this.hide()
            if (this.proc.nom === "") {
                this.proc.nom = "P" + this.last
                this.last++
            }

            this.procs.push(new Proc(this.proc.nom, this.proc.prioritee, this.proc.temps_arivee, this.proc.duree))

            this.proc = {
                duree: 0,
                prioritee: 0,
                nom: "",
                temps_arivee: 0
            }
        },

        removeRow(row, index) {
            this.$delete(this.procs, index)
        },

        doStuff () {
            var projectTitle = "Ordonnoncement des processus";
            let people = []

            let colour = ["#88A825",
                            "#911146",
                            "#ED8C2B"]
            let procs = this.curr
            var data = procs.map(value => {
                return {
                    task: value.nom,
                    duration: value.duree,
                    start: value.temps_arivee
                }
            })

            // get number of procs
            let s = new Set()
            data.forEach(element => {
                s.add(element.task)
            });
            s = Array.from(s)
            let mp = new Map()
            let mf = new Map()
            for (let i=0; i< data.length; i++) {
                mp.set(i, data[i].task)
                mf.set(data[i].task, s.findIndex((elem) => {
                    return elem === data[i].task
                }))
            }
            var c = this.$refs.myCanvas;
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, c.width, c.height)

            ctx.font="15px Arial";
            var cHeight = c.offsetHeight;
            var cWidth = c.offsetWidth;

            //Basic measurement units based on canvas size0
            var padding = cHeight/10; //10
            var largePadding = cHeight/3; //4
            var widthPadding = cWidth/7;
            var margin = 20;

            function drawGraph(){
                //Work out a single row measurement
                var graphHeight = cHeight - largePadding;
                var row = graphHeight / s.length;
                for(let k=0; k < s.length; k++){
                    ctx.fillText(s[k], margin,k*row+padding);  
                }   
                
                //Work out largest time to determine the width
                //1. add all duration and start properties together
                var sumOfTime = [];
                for(var i=0; i < data.length; i++){
                    sumOfTime[i] = data[i].duration + data[i].start;
                }
                //2. Loop through the combined figures to leave maxTime as the largest
                var maxTime = 0;
                for(var i=0; i < sumOfTime.length; i++){
                    if (sumOfTime[i] > maxTime){
                        maxTime = sumOfTime[i];
                    }       
                }
                //Draw graph bottom
                //Work out a single column measurement
                var graphWidth = cWidth - widthPadding;
                var column = graphWidth / maxTime;
                for(var i=0; i <= maxTime; i++){
                    ctx.fillText(i,i*column +widthPadding,cHeight-(largePadding/2));                 ctx.beginPath();
                    
                    ctx.beginPath()
                    ctx.moveTo(i * column + widthPadding ,0);
                    ctx.lineTo(i*column +widthPadding,cHeight-(largePadding/2));
                    ctx.stroke();
                }
                return {r:row,c:column};
            }

            //In the drawData function we collate all the information and produce a new clean array called "bars" that makes drawing the graphics a lot simpler.
            function drawData(row, column){
                let bars = [];
                for(var i=0; i<data.length; i++){
                    bars[i] = {};
                    //calculate the y pos of each bar by matching the objects "task" property to the order number of the task in the "processus" array.
                    bars[i].y = mf.get(mp.get(i))
                    //Calculate the colour of the bar graphic by fetching the objects "person" property index number, this number is then used as the index number to select the colour from the "colour" array.
                    for(var k=0; k<people.length; k++){
                        if(people[k] === data[i].person){
                            bars[i].col = k;
                        }
                    }

                    //Work out starting position of bar graphics, we're taking away one 'column' measurement to counter the numbers in the bottom of the graph starting at 1, not 0 
                    var barsOriginPoint = widthPadding;
                    bars[i].x = (data[i].start*column) + barsOriginPoint;
                    bars[i].w = data[i].duration*column;
                    var centreBar = padding - row/2;
                    ctx.beginPath();
                    ctx.rect(bars[i].x, bars[i].y*row + centreBar, bars[i].w, row);
                    ctx.fillStyle=colour[bars[i].col];
                    ctx.fill(); 
                }
            }  
            var units = drawGraph();
            var row = units.r;
            var column = units.c;
            drawData(row, column);
        }
    }
}
</script>

<style scoped>
canvas{
margin:0 auto;
display:block;
border:1px solid black;
}

</style>
