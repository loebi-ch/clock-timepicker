/**************************************************************************************
 * enum TimeFormat
 **************************************************************************************/
export declare enum TimeFormat {
    'HH:mm' = "HH:mm",
    'H:mm' = "H:mm",
    'hh:mm' = "hh:mm",
    'h:mm' = "h:mm",
    'HH:mm:ss' = "HH:mm:ss",
    'hh:mm:ss' = "hh:mm:ss",
    'H:mm:ss' = "H:mm:ss",
    'h:mm:ss' = "h:mm:ss",
    'mm:ss' = "mm:ss",
    'm:ss' = "m:ss",
    'HH' = "HH",
    'H' = "H",
    'hh' = "hh",
    'h' = "h",
    'mm' = "mm",
    'm' = "m",
    'ss' = "ss",
    's' = "s"
}
/**************************************************************************************
 * enum TimePart
 **************************************************************************************/
export declare enum TimePart {
    Hour = "Hour",
    Minute = "Minute",
    Second = "Second"
}
/**************************************************************************************
 * class Time
 **************************************************************************************/
export declare class Time {
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    static get Zero(): Time;
    static parse(timeAsString: string, timeFormat: TimeFormat): Time | undefined;
    private static getHour;
    private static getMinute;
    private static getSecond;
    constructor(hour?: number, minute?: number, second?: number);
    getTimePart(timePart: TimePart): number;
    isZero(): boolean;
    equals(time: Time): boolean;
    isLessThan(time: Time): boolean;
    isGreaterThan(time: Time): boolean;
}
/**************************************************************************************
 * class ClockTimepickerConfiguration
 **************************************************************************************/
export declare class ClockTimepickerConfiguration {
    animationDuration: number;
    autosize: boolean;
    format: TimeFormat;
    maximum: string;
    minimum: string;
    precision: number;
    required: boolean;
    separator: string;
    usePlusSign: boolean;
    vibrate: boolean;
    onOpen: () => void;
    onClose: () => void;
    onTimePartChange: (timePart: TimePart) => void;
    onChange: (time: Time) => void;
    onAdjust: (time: Time) => void;
}
/**************************************************************************************
 * const DefaultClockTimepickerConfiguration
 **************************************************************************************/
export declare const DefaultClockTimepickerConfiguration: ClockTimepickerConfiguration;
/**************************************************************************************
 * class ClockTimepicker extends HTMLElement (Web Component)
 **************************************************************************************/
export declare class ClockTimepicker extends HTMLElement {
    constructor(configuration?: ClockTimepickerConfiguration | undefined);
    get configuration(): ClockTimepickerConfiguration;
    get input(): HTMLInputElement | undefined;
    get time(): Time | undefined;
    get scrollContainer(): HTMLElement;
    static observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    setTime(timeAsString: string): void;
    setTimePart(timePart: TimePart, value: number, timePartToSelect?: TimePart | undefined): void;
    selectTimePart(timePart: TimePart): void;
    selectPreviousTimePart(): void;
    selectNextTimePart(closeAfterLastTimePart?: boolean): void;
    private _configuration;
    private _input;
    private _scrollContainer;
    private _caretColorBefore;
    private _shadowRoot;
    private _backgroundLayer;
    private _popup;
    private _header;
    private _canvasHolder;
    private _footer;
    private _canvases;
    private _activeTimePart;
    private _time;
    private _isSet;
    private _enteredNumber;
    private orientationChangeListener;
    private resizeListener;
    private scrollListener;
    private clickListener;
    private inputMouseDownListener;
    private inputBlurListener;
    private inputKeyDownListener;
    private inputKeyUpListener;
    private getScrollContainer;
    private ok;
    private cancel;
    private getAvailableTimeParts;
    private showPopup;
    private hidePopup;
    private positionPopup;
    private autosizeInput;
    private formatTime;
    private getClickedTimePart;
    private getInputTextWidth;
}
