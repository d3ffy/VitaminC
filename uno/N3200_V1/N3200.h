#ifndef _N3200_H
#define _N3200_H
#endif
#include <Arduino.h>

#define RED     0x00  ///< Red color channel for filtering
#define GREEN   0x01  ///< Green color channel for filtering
#define BLUE    0x02  ///< Blue color channel for filtering
#define CLEAR   0x03  ///< Clear color channel for filtering

#define OFF      0x00  ///< Power down mode
#define LO      0x01  ///< 2% frequency scaling
#define MID     0x02  ///< 20% frequency scaling
#define HI    0x03  ///< 100% frequency scaling



typedef struct _RGBColor {
    uint8_t red;    ///< Red color intensity (0-255)
    uint8_t green;  ///< Green color intensity (0-255)
    uint8_t blue;   ///< Blue color intensity (0-255)
    uint8_t clear;  ///< Clear intensity (0-255) *** 
} RGBColor;




class N3200{
    public:
        N3200(uint8_t s0_pin, uint8_t s1_pin, uint8_t s2_pin, uint8_t s3_pin, uint8_t out_pin);
        ~N3200(void);
        void begin();
        RGBColor white_balance();
        uint8_t read(uint8_t color);
        void frequency_scaling(int scaling);
        void calibrate();
        void calibrate_dark();
        void calibrate_light();
        void white_balance(RGBColor white_balance_rgb);
    private:
        uint8_t _s0_pin, _s1_pin, _s2_pin, _s3_pin, _out_pin;
        uint8_t max_r, max_g, max_b,max_c;
        uint8_t min_r, min_g, min_b,min_c;

        unsigned int _integration_time;
        int _frequency_scaling;
        bool is_calibrated;

        //void (*upper_bound_interrupt_callback)();
        //void (*lower_bound_interrupt_callback)();

//  RGBColor white_balance_rgb, ub_threshold, lb_threshold;
        RGBColor white_balance_rgb ;
        void filter(uint8_t filter);

};
