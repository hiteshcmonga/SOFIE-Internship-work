#include <uECC.h>
#include "sha256.h"
#define NELEMS(x)  (sizeof(x) / sizeof((x)[0]))



extern "C" {

int RNG(uint8_t *dest, unsigned size) {
  // Use the least-significant bits from the ADC for an unconnected pin (or connected to a source of 
  // random noise). This can take a long time to generate random data if the result of analogRead(0) 
  // doesn't change very frequently.
  while (size) {
    uint8_t val = 0;
    for (unsigned i = 0; i < 8; ++i) {
      int init = analogRead(0);
      int count = 0;
      while (analogRead(0) == init) {
        ++count;
      }
      
      if (count == 0) {
         val = (val << 1) | (init & 0x01);
      } else {
         val = (val << 1) | (count & 0x01);
      }
    }
    *dest = val;
    ++dest;
    --size;
  }
  // NOTE: it would be a good idea to hash the resulting random data using SHA-256 or similar.
  return 1;
}

}  // extern "C"

void setup() {
  Serial.begin(115200);
  Serial.print("Testing ecc\n");
  uECC_set_rng(&RNG);
}

void loop() {
  const struct uECC_Curve_t * curve = uECC_secp160r1();

  unsigned hash_size=64;//hash_size
  uint8_t encoded[64];
  uint8_t private1[21];
  uint8_t private2[21];
  
  uint8_t public1[40];
  uint8_t public2[40];
  
  uint8_t secret1[20];
  uint8_t secret2[20];

  uint8_t sign1[40];
  uint8_t sign2[40];  

  uint8_t message[32];


  unsigned long a = millis();
  uECC_make_key(public1, private1, curve);
  unsigned long b = millis();
  
  Serial.print("Made key 1 in "); Serial.println(b-a);
  a = millis();
  uECC_make_key(public2, private2, curve);
  b = millis();
  Serial.print("Made key 2 in "); Serial.println(b-a);

  a = millis();
  int r = uECC_shared_secret(public2, private1, secret1, curve);
  b = millis();
  Serial.print("Shared secret 1 in "); Serial.println(b-a);
  if (!r) {
    Serial.print("shared_secret() failed (1)\n");
    return;
  }
  
  a = millis();
  r = uECC_shared_secret(public1, private2, secret2, curve);
  b = millis();
  Serial.print("Shared secret 2 in "); Serial.println(b-a);
  if (!r) {
    Serial.print("shared_secret() failed (2)\n");
    return;
  }
    
  if (memcmp(secret1, secret2, 20) != 0) {
    Serial.print("Shared secrets are not identical!\n");
  } else {
    Serial.print("Shared secrets are identical\n");
  }

 /* a = millis();
  uECC_compress(public1, comp1, curve);
  b = millis();
  Serial.print("Public key 1 compressed in "); Serial.println(b-a); //check again

  
  a = millis();
  uECC_compress(public2, comp2, curve);
  b = millis();
  Serial.print("Public key 2 compressed in "); Serial.println(b-a); //check again
*/

/*
//to check keys and other uint8_t values
  uint8_t j;
  for (j = 0; j < (uint8_t)(sizeof(public1)); j++) {
  if (private1[j] < 0x10) // To print "0F", not "F" 
  {Serial.write('0');
  }
  Serial.print(public1[j], HEX);  
  }
*/
//SHA256 hashing  
    Sha256.init();
    Sha256.print("abc");
    uint8_t * result = Sha256.result();

    Serial.print(  "Got   : ");
    for (int i = 0; i < 32; i++) {
            Serial.print("0123456789abcdef"[result[i] >> 4]);
            Serial.print("0123456789abcdef"[result[i] & 0xf]);

            for(int i = 0; i < 64; i+=2)
                {
                  encoded[i] = "0123456789abcdef"[result[i / 2] >> 4];
                  encoded[i + 1] = "0123456789abcdef"[result[i / 2] & 0xf];
                }
    }
/*
       Serial.print("\n");
     for (byte i=0; i < NELEMS(encoded); i++){
                if (encoded[i]<0x10) { Serial.print('0'); }
                Serial.print(encoded[i], HEX);
        }
*/

//making signature               
  a = millis();
  int w = uECC_sign(private1,encoded,hash_size,sign1,curve);
  b = millis();
  Serial.print("Made sign 1 in "); Serial.println(b-a);
  if (!w) {
    Serial.print("made_secret() failed (2)\n");
    return;
  }  


  for (byte i=0; i < NELEMS(sign1); i++)
        {
                if (sign1[i]<0x10) { Serial.print('0'); }
                Serial.print(sign1[i], HEX);
        }

Serial.println("---");
        Serial.printf("Check against public1 = %d\n", uECC_verify(public1, encoded, hash_size,sign1, curve));
        Serial.printf("Check against public2 = %d\n", uECC_verify(public2, encoded, hash_size,sign1, curve));
        Serial.print("Signature (private 2)):");

        uECC_sign(private2, encoded,hash_size,sign2, curve);

        for (byte i=0; i < NELEMS(sign2); i++)
        {
                if (sign2[i]<0x10) { Serial.print('0'); }
                Serial.print(sign2[i], HEX);
        }

        Serial.println("---");
        Serial.printf("Check against public1 = %d\n", uECC_verify(public1, encoded, hash_size,sign2, curve));
        Serial.printf("Check against public2 = %d\n", uECC_verify(public2, encoded, hash_size,sign2, curve));

}
        
