// ESP8266
const byte BUFFER_SIZE = 16;
char receivedMessage[BUFFER_SIZE];
byte messageIndex = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  messageHandler();
  functionHandler();
  delay(1000);
}

void messageHandler() {
  while (Serial.available()) {
    char receivedChar = Serial.read();
    if (receivedChar == '\n' || messageIndex >= BUFFER_SIZE - 1) {
      receivedMessage[messageIndex] = '\0';
      messageIndex = 0;
    } else {
      receivedMessage[messageIndex++] = receivedChar;
    }
  }
}

void functionHandler() {
  if (strncmp(receivedMessage, "RED", 3) == 0) {
    Serial.println("Blink red color");
  } else if (strncmp(receivedMessage, "GREEN", 5) == 0) {
    Serial.println("Blink green color");
  } else if (strncmp(receivedMessage, "BLUE", 4) == 0) {
    Serial.println("Blink blue color");
  } else {
    Serial.print("Received: ");
    Serial.println(receivedMessage);
  }
}
