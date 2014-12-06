$fs=0.4;

module steppercorner() {

    translate(v=[15,0,-3]) translate(v=[0,-1.7,0]) cube(size=[10,3.6,15]);
    translate(v=[25,0,-3]) cylinder(r=1.7, h=15);
    translate(v=[15,0,-3]) cylinder(r=1.7, h=15);

}

module stepper() {
  color("red") union() translate(v=[0,0,-2]) {
    translate(v=[-21,-21,-2]) cube(size=[42,42,2]);

    rotate(v=[0,0,1],a=0+45) steppercorner();
    rotate(v=[0,0,1],a=90+45) steppercorner();
    rotate(v=[0,0,1],a=180+45) steppercorner();
    rotate(v=[0,0,1],a=270+45) steppercorner();

    // translate(v=[0,0,0]) cylinder(r=11, h=2);
    translate(v=[0,0,0]) cylinder(r=2.5, h=24);
    translate(v=[0,0,0]) cylinder(r=5, h=24);

    translate(v=[-5,0,-2]) cube(size=[10,42,12]);
  }
}



module corner() {
  color("green") union() {
    translate(v=[-24,-31,0]) cube(size=[48,55,5]);
    translate(v=[-50,-50,0]) cube(size=[100,20,5]);
    translate(v=[-50,-30,0]) cube(size=[100,5,10]);
  }
}

difference() {
corner();
stepper();
}

