import {Touches} from "./touches";

const myCanvas = document.getElementById('myCanvas')
myCanvas.width = window.innerWidth
myCanvas.height = window.innerHeight

console.log('HELLO')
const touchHandler = new Touches(myCanvas)