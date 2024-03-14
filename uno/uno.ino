// Arduino
void setup() {
  Serial.begin(9600);
}

void loop() {
  while (Serial.availableForWrite()) {
    delay(2000);
    Serial.println("Hello!");
    delay(2000);
    Serial.println("RED");
    delay(2000);
    Serial.println("GREEN");
    delay(2000);
    Serial.println("BLUE");
  }
}