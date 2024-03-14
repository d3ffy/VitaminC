// ESP8266
const byte BUFFER_SIZE = 16;
char receivedMessage[BUFFER_SIZE];
byte messageIndex = 0;
const byte LED = 13;

void setup() {
  Serial.begin(9600);
  pinMode(LED, OUTPUT);
}

void loop() {
  messageHandler();
  functionHandler();
  clearMessage();
  delay(1000);
  digitalWrite(LED, LOW);
}

void messageHandler() {
  while (Serial.available() > 0) {
    char receivedChar = Serial.read();
    if (receivedChar == '\n') {
      messageIndex = 0;
      break;
    } else {
      receivedMessage[messageIndex++] = receivedChar;
    }
    delay(100);
  }
}

void functionHandler() {
  // use strncmp for handling future complicate function
  if (strncmp(receivedMessage, "RED", 3) == 0) {
    Serial.println("Blink red color");
    digitalWrite(LED, HIGH);
  } else if (strncmp(receivedMessage, "GREEN", 5) == 0) {
    Serial.println("Blink green color");
  } else if (strncmp(receivedMessage, "BLUE", 4) == 0) {
    Serial.println("Blink blue color");
  } else if(receivedMessage != NULL){
    Serial.print("Received: ");
    Serial.println(receivedMessage);
  }
}

void clearMessage() {
  for (uint8_t i = 0; i < BUFFER_SIZE; i++) {
  	receivedMessage[i] = '\0';
  }
}
