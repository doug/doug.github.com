int numSpheres = 500;
PVector[] spheres = new PVector[numSpheres];
int numcameras = 16;
PGraphics[] cameras = new PGraphics[numcameras];
int camOffset = 5;
float depth;

void setup() {
  size(400,400,P3D);
  smooth();
  randomSeed(3);
  depth = width;
  for(int i=0;i<numSpheres;i++) {
    addSphere(i);
  }
  for(int i=0;i<cameras.length;i++) {
    PGraphics pg = createGraphics(width,height,P3D);
    pg.colorMode(RGB,255);
    pg.stroke(0);
    drawSpheres(pg,i);
    cameras[i] = pg;
  }
}

void addSphere(int i) {
  spheres[i] = (new PVector(random(width*2)-width,random(height*2)-height,random(depth)-depth/2f));
}


void drawSpheres(PGraphics pg, int camid) {
  pg.background(255);
  pg.noStroke();
  pg.colorMode(HSB,1.0);
  pg.pushMatrix();
  pg.translate(camid*camOffset,0,0);
  //translate the world = to translate of camera
  pg.pushMatrix();
  for(int i=0;i<spheres.length;i++) {
    PVector s = spheres[i];
    pg.pushMatrix();
    pg.fill(((s.z+depth/2f)/(float)depth),1,1);
    pg.translate(s.x,s.y,s.z);
    pg.sphere(10);
    pg.popMatrix();
  }
}

void findAndDraw() {
  loadPixels();
  for(int i=0;i<pixels.length;i++) {
    float[] reds = new float[cameras.length];
    float[] greens = new float[cameras.length];
    float[] blues = new float[cameras.length];
    for(int j=0;j<cameras.length;j++) {
      int pos = (int)(i+j*((mouseX/(float)width)*camOffset*3));
      if(pos<pixels.length) {
        PGraphics pg = cameras[j];
        pg.loadPixels();
        reds[j] = (red(pg.pixels[pos]));
        greens[j] = (green(pg.pixels[pos]));
        blues[j] = (blue(pg.pixels[pos]));
      }
    }
    reds = sort(reds);
    greens = sort(greens);
    blues = sort(blues);
    pixels[i] = color(reds[reds.length/2],greens[greens.length/2],blues[blues.length/2]);  //just take the median
  }
  updatePixels();
}

void addAndDraw() {
  loadPixels();
  float[] pred = new float[pixels.length];
  float[] pgreen = new float[pixels.length];
  float[] pblue = new float[pixels.length];
  for(int i=0;i<cameras.length;i++) {
    PGraphics pg = cameras[i];
    pg.loadPixels();
    for(int j=0;j<pixels.length;j++) {
      int pos = (int)(j+i*((mouseX/(float)width)*camOffset*3));
      if(pos<pixels.length) {
        pred[j] += red(pg.pixels[pos]);
        pgreen[j] += green(pg.pixels[pos]);
        pblue[j] += blue(pg.pixels[pos]);
      }
    }
  }
  for(int i=0;i<pixels.length;i++) {
    pred[i] = pred[i]/((float)cameras.length);
    pgreen[i] = pgreen[i]/((float)cameras.length);
    pblue[i] = pblue[i]/((float)cameras.length);
    pixels[i] = color(pred[i],pgreen[i],pblue[i]);
  }
  updatePixels();
}  

void draw() {
  lights();
  findAndDraw();
//  addAndDraw();
}

