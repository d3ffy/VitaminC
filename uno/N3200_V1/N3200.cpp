
#include "N3200.h"

N3200::N3200(uint8_t s0_pin, uint8_t s1_pin, uint8_t s2_pin, uint8_t s3_pin, uint8_t out_pin):
    _s0_pin(s0_pin),
    _s1_pin(s1_pin),
    _s2_pin(s2_pin),
    _s3_pin(s3_pin),
    _out_pin(out_pin) {}


N3200::~N3200(void)
{
}


void N3200::begin() {
    pinMode(this->_s0_pin, OUTPUT);
    pinMode(this->_s1_pin, OUTPUT);
    pinMode(this->_s2_pin, OUTPUT);
    pinMode(this->_s3_pin, OUTPUT);
    pinMode(this->_out_pin, INPUT);

    this->_integration_time = 2000;
    this->_frequency_scaling = 1.0;
    this->is_calibrated = false;
}


void N3200::filter(uint8_t filter) {
    switch(filter) {
        case RED :
            digitalWrite(this->_s2_pin, LOW);
            digitalWrite(this->_s3_pin, LOW);
            break;
        case GREEN :
            digitalWrite(this->_s2_pin, HIGH);
            digitalWrite(this->_s3_pin, HIGH);
            break;
        case BLUE :
            digitalWrite(this->_s2_pin, LOW);
            digitalWrite(this->_s3_pin, HIGH);
            break;
        case CLEAR :
            digitalWrite(this->_s2_pin, HIGH);
            digitalWrite(this->_s3_pin, LOW);
            break;
    }
}


void N3200::frequency_scaling(int scaling) {
    this->_frequency_scaling = scaling;

    switch(this->_frequency_scaling) {
        case OFF :
            digitalWrite(this->_s0_pin, LOW);
            digitalWrite(this->_s1_pin, LOW);
            break;
        case LO :
            digitalWrite(this->_s0_pin, LOW);
            digitalWrite(this->_s1_pin, HIGH);
            break;
        case MID :
            digitalWrite(this->_s0_pin, HIGH);
            digitalWrite(this->_s1_pin, LOW);
            break;
        case HI :
            digitalWrite(this->_s0_pin, HIGH);
            digitalWrite(this->_s1_pin, HIGH);
            break;
    }
}


void N3200::calibrate() {
    this->is_calibrated = true;
}

/*
uint16_t read(uint8_t color , uint8_t min_range , uint8_t max_range){
    //this-> is_calibrated ?
    switch (color):
        case RED :
            this->filter(RED);
            uint16_t val = pulseIn(this->_out_pin, LOW);
        case BLUE :
            this->filter(BLUE);
            uint16_t val = pulseIn(this->_out_pin, LOW);
        case GREEN :
            this->filter(GREEN);
            uint16_t val = pulseIn(this->_out_pin, LOW);
        case CLEAR :
            this->filter(CLEAR);
            uint16_t val = pulseIn(this->_out_pin, LOW);
        val = this->is_calibrated ?
        map(val, this->min_b, this->max_b, 255, 0) : 
        map(val, min_range, max_range, max_range, min_range);
    return val;

}
*/

uint8_t N3200::read(uint8_t color) {
    this->filter(color);
    uint8_t max = 255;
    uint8_t min = 0;
    uint8_t value = 0;
    value = pulseIn(this->_out_pin, LOW);
    //Serial.print("Val = " + String(pulseIn(this->_out_pin,LOW,1000000)) + "  ");
    switch (color) {
        case RED:
            //filter(RED);
            value = this->is_calibrated ?
                map(value, this->min_r, this->max_r, min, max) :
                map(value, 0, 255, 255, 0);

            //frequency_scaling(OFF);
            break;
        case GREEN:
            //filter(GREEN);
            value = this->is_calibrated ?
                map(value, this->min_g, this->max_g, min, max) :
                map(value, 0, 255, 255, 0);
            //frequency_scaling(OFF);
            break;
        case BLUE:
            //filter(BLUE);
            value = this->is_calibrated ?
                map(value, this->min_b, this->max_b, min, max) :
                map(value, 0, 255, 255, 0);
            //frequency_scaling(OFF);
            break;
        case CLEAR:
            //filter(CLEAR);
            value = this->is_calibrated ?
                map(value, this->min_c, this->max_c, min, max) :
                map(value, 0, 255, 255, 0);
            //frequency_scaling(OFF);
            break;
        default:
            // Handle unexpected color value
            break;
    }
    //Serial.println("Val = " + String(value));
    //frequency_scaling(OFF);
    return value;
}


void N3200::calibrate_dark() {
    uint8_t r = 0, g = 0, b = 0, c = 0;

    delay(this->_integration_time / 2);
    for(int i = 0; i < 10; i++) {
        r += this->read(RED);
        g += this->read(GREEN);
        b += this->read(BLUE);
        c += this->read(CLEAR);
        Serial.println("CAL DARK loop : " + String(i));
        delay(this->_integration_time / 10);
    }

    this->max_r = r / 10;
    this->max_g = g / 10;
    this->max_b = b / 10;
    this->max_c = c / 10;
}

void N3200::calibrate_light() {
    uint8_t r = 0, g = 0, b = 0, c = 0; //** SET all value to zero

    delay(this->_integration_time / 2); //** More integration time more accuracy
    for(int i = 0; i < 10; i++) {
        r += this->read(RED);
        g += this->read(GREEN);
        b += this->read(BLUE);
        c += this->read(CLEAR);
        Serial.println("CAL Light loop : " + String(i));
        delay(this->_integration_time / 10);
    }

    this->white_balance_rgb.red = this->min_r = r / 10;
    this->white_balance_rgb.green = this->min_g = g / 10;
    this->white_balance_rgb.blue = this->min_b = b / 10;
    this->white_balance_rgb.clear = this->min_c = c / 10;
}


void N3200::white_balance(RGBColor white_balance_rgb) {
    this->white_balance_rgb = white_balance_rgb;
}

RGBColor N3200::white_balance() {
    return this->white_balance_rgb;
}

