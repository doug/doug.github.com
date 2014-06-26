import processing.core.*; 
import processing.xml.*; 

import java.applet.*; 
import java.awt.*; 
import java.awt.image.*; 
import java.awt.event.*; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class channel_mixing extends PApplet {

PImage img1;
PImage img2;
String manip, adjust;
char keydown;
float r1, r2, g1, g2, b1, b2;

public void setup() {
  size(372, 640);
  r1 = r2 = g1 = g2 = b1 = b2 = 1;
  img1 = loadImage("scotch1.jpg");
  img2 = loadImage("scotch2.jpg");
  img1.loadPixels();
  img2.loadPixels();
}

public void draw() {
  loadPixels();
  for(int i=0;i<pixels.length;i++) {
    int c1 = img1.pixels[i];
    int c2 = img2.pixels[i];
    if(keydown == '1') {
      pixels[i] = color(
                  (red(c1)*r1), 
                  (green(c1)), 
                  (blue(c1)));
    } else if (keydown == '2') {
      pixels[i] = color(
                  red(c2)*r2, 
                  green(c2)*g2, 
                  blue(c2)*b2);
    } else {
      pixels[i] = color(
                  (red(c1)*r1 + red(c2)*r2)/2.0f, 
                  (green(c1)*g1 + green(c2)*g2)/2.0f, 
                  (blue(c1)*b1 + blue(c2)*b2)/2.0f);
    }
    
  }
  updatePixels();
}

public void keyReleased() {
  keydown = 0;
}

public void keyPressed() {
  keydown = key;
  if(key == 'r') {
    adjust = "red";
  } else if(key=='g') {
    adjust = "green";
  } else if(key=='b') {
    adjust = "blue";
  } else if(key=='1') {
    manip = "1";
  } else if(key=='2') {
    manip = "2";
  }
}

public void mouseDragged() {
  float scalefactor = constrain(mouseX, 0, width)/(float)width;
  if(manip == "1") {
    if(adjust == "red") {
      r1 = scalefactor;
    } else if (adjust == "green") {
      g1 = scalefactor;
    } else if (adjust == "blue") {
      b1 = scalefactor;
    }
  } else if (manip == "2") {
    if(adjust == "red") {
      r2 = scalefactor;
    } else if (adjust == "green") {
      g2 = scalefactor;
    } else if (adjust == "blue") {
      b2 = scalefactor;
    }
  }
}

  static public void main(String args[]) {
    PApplet.main(new String[] { "--bgcolor=#FFFFFF", "channel_mixing" });
  }
}
