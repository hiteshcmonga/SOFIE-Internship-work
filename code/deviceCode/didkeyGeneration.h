#include "Base58.h" 
#include <Crypto.h>
#include <Ed25519.h>
#include <string>


uint8_t privateKey[32];
uint8_t publicKey[32];
uint8_t message[2] = {1, 2};
uint8_t signature[64];
char encodedPublicKey[47]; // the required length after "did:key:" (9 chars) parameter
String didKey;


void didkey() {
  Ed25519::generatePrivateKey(privateKey);
  Ed25519::derivePublicKey(publicKey, privateKey);
  // the static start_byte used as an identifier for ed25519-pub
  uint8_t start_byte[2] = {0xed, 0x01}; 
  uint8_t concatpublicKey[sizeof(start_byte) + sizeof(publicKey)];
  memcpy(concatpublicKey, start_byte, sizeof(start_byte));
  memcpy(concatpublicKey + sizeof(start_byte), publicKey, sizeof(publicKey));
  // printNumber(concatpublicKey,sizeof(start_byte)+sizeof(publicKey));
  base58Encode(concatpublicKey, sizeof(start_byte) + sizeof(publicKey), encodedPublicKey, 47);
  didKey = "did:key:z" + String(encodedPublicKey);
  didKey = didKey.substring(0, 56);
  Serial.println(didKey);
}
