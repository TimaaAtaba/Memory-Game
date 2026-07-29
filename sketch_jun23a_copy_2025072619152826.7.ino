//ת.ז - 212814156 
//שם - תיימאא עתאבא 
// ב NANO 
// PORT = COM 6 
// Processor = old bootloader
#include <TM1637Display.h>  

const int ledPins[4] = {3, 4, 5, 6};       
const int buttonPins[4] = {7, 8, 11, 12};  


#define CLK 9  
#define DIO 10
TM1637Display display(CLK, DIO);


#define IDLE 0
#define SHOW 1
#define PLAY 2
#define RESET 3
int gameState = IDLE;

// משתנים 
int sequence[20]; 
      
int level = 0;
int Index = 0;
unsigned long lastTime = 0;
int Speed = 600;
bool waitingForStart = true;

void setup() {
  for (int i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
    pinMode(buttonPins[i], INPUT_PULLUP);
  }

  display.setBrightness(0x0f);  
  randomSeed(analogRead(A0));   
}

void loop() {
  switch (gameState) {
    case IDLE:
      handleIdle();
      break;
    case SHOW:
      handleShow();
      break;
    case PLAY:
      handlePlay();
      break;
    case RESET:
      handleReset();
      break;
  }
}

//מצב המתנה
void handleIdle() {
  static int currentLED = 0;
  static unsigned long lastBlink = 0;

  if (millis() - lastBlink > 200) {
    digitalWrite(ledPins[currentLED], LOW);
    currentLED = random(0, 4);
    digitalWrite(ledPins[currentLED], HIGH);
    lastBlink = millis();
  }

  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == LOW) {
      delay(200);
      level = 0;
      Speed = 600;
      gameState = SHOW;
      digitalWrite(ledPins[currentLED], LOW);
      return;
    }
  }
}

void handleShow() {
  delay(500);
  sequence[level] = random(0, 4);
  display.showNumberDec(level + 1);

  for (int i = 0; i <= level; i++) {
    int led = sequence[i];
    digitalWrite(ledPins[led], HIGH);
    delay(Speed);
    digitalWrite(ledPins[led], LOW);
    delay(200);
  }

  gameState = PLAY;
  Index = 0;

//// כל 5 שלבים  אנו מגבירים את המהירות
  if ((level + 1) % 5 == 0 && Speed > 200) {
    Speed -= 100;
  }
}

// מצב משחק
void handlePlay() {
  for (int i = 0; i < 4; i++) {
    if (digitalRead(buttonPins[i]) == LOW) {
      digitalWrite(ledPins[i], HIGH);
      delay(200);
      digitalWrite(ledPins[i], LOW);

      if (i == sequence[Index]) {
        Index++;
        if (Index > level) {
          level++;
          if (level >= 20) {
            

            display.showNumberDec(8888); // ניצחון
            delay(2000);
            gameState = RESET;
          } else {
            gameState = SHOW;
          }
        }
      } else {
        // טעות
        display.showNumberDec(0, true);
        delay(1500);
        gameState = RESET;
      }
      delay(300);
      break;
    }
  }
}

// איפוס
void handleReset() {
  level = 0;
  Index = 0;
  Speed = 600;
  delay(1000);
  gameState = IDLE;
}

