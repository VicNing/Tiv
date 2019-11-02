const { Screen, Container } = require('../dist/new-src/index.js');

const screen = new Screen();
const container1 = new Container({
  width:30,
  height:30,
  left:0,
  top:0,
  border:{
    weight:'normal'
  }
});

screen.render();
screen.appendChild(container1);