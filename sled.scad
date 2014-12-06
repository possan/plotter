$fs = 0.1;
$fa = 5;

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
  translate(v=[-45,-15.0,-5]) cube(size=[45,72,5]);
  translate(v=[-10,-11.0,-5]) cube(size=[10,10,25]);
  translate(v=[-10,41.0,-5]) cube(size=[10,10,25]);

 // translate(v=[-15,21.0,-3]) cube(size=[25,62,3]);

  translate(v=[30,-20,-5]) cube(size=[20,130,5]);
  translate(v=[-65,-20,-5]) cube(size=[20,130,5]);

  translate(v=[-65,-21.0,-5]) cube(size=[115,35,5]);
  translate(v=[-65,91.0,-5]) cube(size=[115,20,5]);
}
  difference() {
   union() {
    translate(v=[-55,90.0,-3]) cube(size=[10,20,25]);
    translate(v=[30,90.0,-3]) cube(size=[10,20,25]);
   }
   union() {
    translate(v=[-60,100,7]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
    translate(v=[-60,100,17]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
    translate(v=[25,100,7]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
    translate(v=[25,100,17]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
   }
  }
 
}



module arm() {
 color("blue") {
  difference() {
   union() {
    translate(v=[10,30,10]) rotate(v=[0,1,0],a=90) cylinder(r=5,h=6);
    translate(v=[13,30,10]) rotate(v=[0,1,0],a=90) cylinder(r=10,h=3);
    translate(v=[10,30,5]) cube(size=[6,45,10]);
    translate(v=[10,25,5]) cube(size=[6,10,30]);
    translate(v=[-19,62,5]) cube(size=[30,13,10]);
   }
   union() {
    translate(v=[5,30,10]) rotate(v=[0,1,0],a=90) cylinder(r=2.5,h=9);
    translate(v=[10,30,10]) rotate(v=[0,1,0],a=90) cylinder(r=1.0,h=16);
    translate(v=[-5,75,-5]) rotate(v=[0,1,0],a=0) cylinder(r=7,h=29);
   }
  }
 }
}

module pulleylock() {
 difference() {
  union() {
    translate(v=[0,0,5]) cube(size=[10,10,10]);
    translate(v=[0,5,15]) rotate(v=[0,1,0],a=90) cylinder(r=5,h=10);
    translate(v=[0,5,5]) rotate(v=[0,1,0],a=90) cylinder(r=5,h=10);
  }
  union() {
    translate(v=[-5,5,5]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
    translate(v=[-5,5,15]) rotate(v=[0,1,0],a=90) cylinder(r=2,h=20);
  }
 }
}





/*
servo();
sled();
penarm();
*/
difference() {
 sled();
 servo();
} 
/*
*/

translate (v=[-20,70,-5])  rotate(v=[0,1,0],a=-90) pulleylock();
translate (v=[20,70,-5])  rotate(v=[0,1,0],a=-90) pulleylock();
translate (v=[60,0,11])  rotate(v=[0,1,0],a=90) arm();








