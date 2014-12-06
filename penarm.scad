module servo() {
 color("red") translate(v=[-28,0,0]) {
  translate(v=[0,0,0]) cube(size=[37,40.5,20]);  
  translate(v=[28,-8,0]) cube(size=[2.5,56.5,20]);
  translate(v=[36,30,10]) rotate(v=[0,1,0],a=90) cylinder(h=6,r=3);  

  translate(v=[15,44.5,5]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[15,44.5,15]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[15,-4.5,5]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[15,-4.5,15]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
 }
}

module sled() {
 color("green") {
/*
  translate(v=[-6,44.5,5]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[-6,44.5,15]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[-6,-4.5,5]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  translate(v=[-6,-4.5,15]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);

*/
  translate(v=[-45,-15.0,-3]) cube(size=[45,72,3]);
  translate(v=[-10,-11.0,-3]) cube(size=[10,10,25]);
  translate(v=[-10,41.0,-3]) cube(size=[10,10,25]);






 // translate(v=[-15,21.0,-3]) cube(size=[25,62,3]);

  translate(v=[30,-20,-3]) cube(size=[20,130,3]);
  translate(v=[-65,-20,-3]) cube(size=[20,130,3]);

  translate(v=[-65,-21.0,-3]) cube(size=[115,35,3]);
  translate(v=[-65,91.0,-3]) cube(size=[115,20,3]);

 }
}

module penarm() {
}

servo();
sled();
penarm();

/*
difference() {
sled();
servo();
}
*/