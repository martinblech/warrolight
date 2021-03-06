Arduino protocol
================

The is an attempt to document the current protocol to communicate between the lights server and the Arduinos so that we can make informed decisions when introducing changes or debugging it.

## Serial protocol

After opening the serial port, the server waits 2s to send an "initial kick" (several empirical tests have shown us that 1 or 2 seconds are needed until data can be transmitted successfully). The initial kick message consists of the 3-byte ASCII string `XXX`.

If the Arduino is not connected:

 - If the Arduino has 3 or more bytes to read from the serial port, it reads the first 3 bytes and checks if they match the string `XXX`. If they do, then it drains the serial port, sets its state to connected and responds with the 5-byte ack message `YEAH\n`. If this first message does not match `XXX`, then it attempts to reconnect (see below).

If the Arduino is connected:

 - If the Arduino has less than 2 bytes to read from the serial port, ignore it. Otherwise interpret it as a lights packet. Light packets start with 1 byte defining the encoding followed by a variable number of bytes with the light's data that depends on the encoding and the number of leds. The encoding byte can be any of `POS_RGB` (1), `POS_VGA` (2), `VGA` (3), `RGB` (4), or `RGB565` (5). The board reads the first byte, then reads the expected number of bytes according to the encoding, updates the lights and finally sends the 4-byte ASCII message `OK\n` to acknowledge the new lights state. If the encoding byte is not one of the values specified above, it attempts to reconnect.

To reconnect, the Arduino consumes from the serial port until there is no more data (also called "drain") and waits 50 milliseconds to read from it again.

## Encodings

### POS_RGB

Includes a 1 byte header with the number of lights that this packet will set. Uses 4 bytes for each light. The first byte indicates the position of light, then the following 3 bytes define the colors in RGB order. Light positions that don't have a color in the packet are set to black.

### POS_VGA

Includes a 1 byte header with the number of lights that this packet will set. Uses 2 bytes for each light. The first byte indicates the position of the light, then the following byte encodes a color using 3 bits for red, 3 bits for green and 2 bits for blue. Light positions that don't have a color in the packet are set to black.

### VGA

Uses 1 byte for each light, with colors specified as in `POS_VGA`. Every light configured in this board must have a value.

### RGB

Uses 3 bytes for each light, in RGB order. Every light configured in this board must have a value.

### RGB565

Uses 2 bytes for each light. The colors are encoded using 5 bits for red, 6 bits for green, and 5 bits for blue, making a total of 16 bits (= 2 bytes).

## Ethernet protocol

On start, the Arduino will use the static IP configured in the program and listen for UDP packets on port 2222 or 4444. It will also start brodcasting UDP packets containing the 4-byte word `YEAH`  every 1 second. If it receives a UDP packet, it will read it.

 - If the length of the packet is 0, it will discard it and set its state to disconnected.
 - The first byte in the packet should contain the sequence number. Non-consecutive sequence numbers are reported via a serial message because they indicate some packet loss.
 - The rest of the packet contains encoded lights and are interpreted as described in the Serial protocol section. Only RGB encoded lights are accepted.

## RF protocol

The RF protocol is used to communicate light frames between two Arduinos. One of the Arduinos acts as the server, and is connected to the computer via serial port. The second one is the client, and receives light frames remotely.

The server reads light frames using the serial protocol and retransmits them split into individual packages of 32 bytes each one. The first byte contains the index of the first light that is specified in the package. The second byte describes the frame number. The rest of the package contains the RGB values for the next 10 lights. Note that 3 bytes x 10 lights is 30 bytes, which covers the remaining space in the packet.

The server transmits half of the lights in one radio channel, and half in the other, thus controlling 2 strips of 150 lights each.
