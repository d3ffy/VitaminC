// Arduino
const int blueLED = 11;
const int greenLED = 12;
const int redLED = 13;

const int whiteLED = 2;
const int S0 = 3;
const int S1 = 4;
const int out = 5;
const int S2 = 6;
const int S3 = 7;

// Define int variables
int redValue = 0;
int greenValue = 0;
int blueValue = 0;
int frequency = 0;

void setup() {
  pinMode(redLED, OUTPUT);
  pinMode(greenLED, OUTPUT);
  pinMode(blueLED, OUTPUT);

  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(out, INPUT);
  pinMode(whiteLED, OUTPUT);
  
  digitalWrite(whiteLED, LOW);
  digitalWrite(S0, HIGH);
  Serial.begin(9600);
}

void loop() {
  while (Serial.availableForWrite()) {

    getColorValue();
    Serial.print("Red Freq = ");
    Serial.print(redValue); 
    Serial.print("   ");
    Serial.print("Green Freq = ");
    Serial.print(greenValue); 
    Serial.print("   ");
    Serial.print("Blue Freq = ");
    Serial.println(blueValue); 
  }
}

int getRed() {
  digitalWrite(redLED, HIGH);
  digitalWrite(S2,LOW);
  digitalWrite(S3,LOW);
  delay(1000);
  frequency = pulseIn(out, LOW); // Get the Red Color Frequency
  digitalWrite(redLED, LOW);
  return frequency;
}

int getGreen() {
  digitalWrite(greenLED, HIGH);
  digitalWrite(S2,HIGH);
  digitalWrite(S3,HIGH);
  delay(1000);
  frequency = pulseIn(out, LOW); // Get the Green Color Frequency
  digitalWrite(greenLED, LOW);
  return frequency;
}

int getBlue() {
  digitalWrite(blueLED, HIGH);
  digitalWrite(S2,LOW);
  digitalWrite(S3,HIGH);
  delay(1000);
  frequency = pulseIn(out, LOW); // Get the Blue Color Frequency
  digitalWrite(blueLED, LOW);
  return frequency;
}

void getColorValue() {
  redValue = getRed();
  delay(500); 
  greenValue = getGreen();
  delay(500); 
  blueValue = getBlue();
  delay(500); 
}