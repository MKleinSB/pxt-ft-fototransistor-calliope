const enum zustand {
    //% block="interrupted"
    unterbrochen = 20,
    //% block="not interrupted"
    nicht_unterbrochen = 40
}

//% weight=100 color=#0641f9  icon="\uf085"
namespace fischertechnik {

    const LightEventID = 3100;
    let lastLightLevel = 0;
    let Empfindlichkeit = 20;

    /**
     * Do something when the phototransistor at the specified pin is interrupted or not.
     * @param pin with phototransistor connected
     * @param LSzustand interrupted or not
     */
    //% subcategory="Phototransistor"
    //% pin.fieldEditor="gridpicker" 
    //% pin.fieldOptions.columns=4
    //% blockId=LightLevel_create_event block="phototransistor at pin %pin | is | %LSzustand"
    export function onLightLevel(pin: AnalogPin, LSzustand: zustand, handler: () => void) {
        control.onEvent(LightEventID + pin + LSzustand, EventBusValue.MICROBIT_EVT_ANY, handler);
        control.inBackground(() => {
            while (true) {
                const LLevel = pins.analogReadPin(pin);
                if ((LLevel > Empfindlichkeit) && (lastLightLevel <= Empfindlichkeit) && (LSzustand == zustand.unterbrochen)) {
                    control.raiseEvent(LightEventID + pin + LSzustand, pin);
                } else if ((LLevel <= Empfindlichkeit) && (lastLightLevel > Empfindlichkeit) && (LSzustand == zustand.nicht_unterbrochen)) {
                    control.raiseEvent(LightEventID + pin + LSzustand, pin);
                }
                basic.pause(200);
                lastLightLevel = LLevel
            }
        })
    }

    /**
    * The read phototransistor block reads the pin that a Phototransistor is 
    * connected to and returns true or false when the lightlevel ist lower or 
    * higher than the lightsensitivity
    * @param pin - is the pin which a phototransistor is connected to
    * @param LSzustand - if interrupted or not
    */
    //% subcategory="Phototransistor"
    //% blockId=readPhototransistor
    //% block="Phototransistor at %pin| is | %LSzustand"

    export function readPhototransistor(pin: AnalogPin, LSzustand: zustand) {
        const LiLevel = pins.analogReadPin(pin);
        let Ergebnis = false;
        if ((LiLevel > Empfindlichkeit) && !(LSzustand == zustand.nicht_unterbrochen)) {
            Ergebnis = true;
        } else if ((LiLevel <= Empfindlichkeit) && !(LSzustand == zustand.unterbrochen)) {
            Ergebnis = true;
        }
        return Ergebnis
    }

    /**
     * Set the sensitivity (analogvalue) of the photocell when 
     * it´s interrupted. Normaly not necessary with original 
     * fischertechnik parts. The predefined value is 20.
     * @param value - (analogvalue)
     */
    //% subcategory="Phototransistor"
    //% value.defl=20
    //% value.min=5 value.max=1023
    //% blockId="SetLightSensitivity" block="set lightsensitivity to %value"
    export function SetLightSensitivity(value: number): void {
        Empfindlichkeit = value;
    }

}