#include "N3200.h"

#define S0_PIN 7
#define S1_PIN 8
#define S2_PIN 9
#define S3_PIN 10
#define OUT_PIN 2

N3200 CS(S0_PIN, S1_PIN, S2_PIN, S3_PIN, OUT_PIN);
void setup() {
  //Pin define
  pinMode(S0_PIN,OUTPUT);
  pinMode(S1_PIN,OUTPUT);
  pinMode(S2_PIN,OUTPUT);
  pinMode(S3_PIN,OUTPUT);
  pinMode(OUT_PIN,INPUT);

  Serial.begin(115200);
  
  //"begin" method using for define Pin's duty / integration'time /Frequency
  CS.begin();
  
  /* "frequency_scaling" method using to set sensor Frequency mode
  LOW = 2 Percent 
  MID = 20 Percent
  HI = 100 Percent
  OFF = OFF the output
  */

  /*###############################
  Recommend for arduino (AVR)
  using LOW / MID are better suit. 
  #################################
  */

  CS.frequency_scaling(LOW);
  
  Serial.println("Start Calibrating....");
  Serial.println("Face Dark surface // turn off all light");
  // "calibrate_dark" method use for calibrate at lowest light / dark enviroment 
  CS.calibrate_dark();
  delay(5000);
  Serial.println("Face white surface // turn on all light");
  delay(5000);
  // "calibrate_light" method use for calibrate at lightness / light enviroment 
  CS.calibrate_light();
  delay(100);
  // "calibrate" method using for calling a value from Light/Dark calibrate and used it as calibrate value.
  CS.calibrate();
  Serial.println("Done Calibrating!!");
  delay(100);
  //CS.calibrate();
  //delay(100);
}

void loop() {
  // Using "delay" to make sensor have some time to re-store yourself
  // "read" method have 4 choices to select color read (RED ,GREEN ,BLUE ,CLEAR) 
  // "read" method return type as "uint8_t" aka "int 8 bit" (0-255)
  delay(200);
  int R = CS.read(RED);
  delay(200);
  int G = CS.read(GREEN);
  delay(200);
  int B = CS.read(BLUE);
  delay(200);
  int C = CS.read(CLEAR);
  delay(200);
  Serial.print("Red = "+ String(R)+"  ");
  Serial.print("Green = "+ String(G)+"  ");
  Serial.println("Blue = "+ String(B));
  Serial.println("Clear = "+ String(C));
}
