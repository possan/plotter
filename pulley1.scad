$fs = 0.1;

module pulley() {
  difference() {
    union() {
      cylinder(r=9, h=14);
      cylinder(r=21, h=2);
    }
    translate(v=[0,0,-1])  cylinder(r=2.4, h=22-5);
    translate(v=[-5,0,-1]) cylinder(r=1.5, h=22-5);
    translate(v=[5,0,-1]) cylinder(r=1.5, h=22-5);
    // translate(v=[0,-6,-2]) cylinder(r=2.4, h=22-5);
    // translate(v=[0,6,-2]) cylinder(r=2.4, h=22-5);

    translate(v=[0,10,8])
rotate(a=90,v=[1,0,0]) cylinder(r=1.5, h=20);

     for(i=[0:16]) {
       rotate(a=22.5 * i, v=[0,0,1])
 	  translate(v=[0,17,-2]) cylinder(r=2, h=22-5);
     }




  }
}

module top() {
  difference() {
    union() {
      cylinder(r=21, h=2);
    }
    translate(v=[0,0,-2]) cylinder(r=2.4, h=22-5);
    translate(v=[-5,0,-2]) cylinder(r=1.5, h=22-5);
    translate(v=[5,0,-2]) cylinder(r=1.5, h=22-5);
    translate(v=[0,-6,-2]) cylinder(r=2.4, h=22-5);
    translate(v=[0,6,-2]) cylinder(r=2.4, h=22-5);

     for(i=[0:16]) {
       rotate(a=22.5 * i, v=[0,0,1])
 	  translate(v=[0,17,-2]) cylinder(r=2, h=22-5);
     }
  }
}


translate(v=[-22,0,0]) pulley();

translate(v=[22,0,0]) top(); 
