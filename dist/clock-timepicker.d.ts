/**************************************************************************************
 * enum TimeFormat
 * The available time formats that can be specified by using attribute "format"
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
 * A time can consist of three different parts: Hour, Minute or Second
 **************************************************************************************/
export declare enum TimePart {
    Hour = "Hour",
    Minute = "Minute",
    Second = "Second"
}
/**************************************************************************************
 * class Time
 * Represents a time consisting of hour, minute and second
 **************************************************************************************/
export declare class Time {
    readonly totalSeconds: number;
    readonly isNegative: boolean;
    get hour(): number;
    get minute(): number;
    get second(): number;
    static get Zero(): Time;
    static parse(timeAsString: string, timeFormat: TimeFormat): Time | undefined;
    private static getHour;
    private static getMinute;
    private static getSecond;
    constructor(hour?: number, minute?: number, second?: number, isNegative?: boolean);
    getTimePart(timePart: TimePart): number;
    isZero(): boolean;
    equals(time: Time): boolean;
    isLessThan(time: Time): boolean;
    isGreaterThan(time: Time): boolean;
    add(time: Time): Time;
    subtract(time: Time): Time;
    clone(): Time;
}
/**************************************************************************************
 * class ClockTimepicker extends HTMLElement (Web Component)
 **************************************************************************************/
export declare class ClockTimepicker extends HTMLElement {
    private _animationDuration;
    private _autosize;
    private _cancelText;
    private _disabled;
    private _format;
    private _maximum;
    private _minimum;
    private _okText;
    private _precision;
    private _required;
    private _separator;
    private _usePlusSign;
    private _value;
    private _previousValue;
    private _vibrate;
    private _input;
    private _inputObserver;
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
    private _isSet;
    private _enteredDigits;
    /**************************************************************************************
     * Getter and setters
     **************************************************************************************/
    get animationDuration(): number;
    set animationDuration(value: number | string | undefined);
    get autosize(): boolean;
    set autosize(value: boolean | string | undefined);
    get disabled(): boolean;
    set disabled(value: boolean | string | undefined);
    get format(): TimeFormat;
    set format(value: TimeFormat | string | undefined);
    get maximum(): Time;
    set maximum(value: Time | string | undefined);
    get minimum(): Time;
    set minimum(value: Time | string | undefined);
    get precision(): Time;
    set precision(value: Time | string | number | undefined);
    get required(): boolean;
    set required(value: boolean | string | undefined);
    get separator(): string;
    set separator(value: string | undefined);
    get usePlusSign(): boolean;
    set usePlusSign(value: boolean | string | undefined);
    private failedValueBecauseOfMinimum;
    private failedValueBecauseOfMaximum;
    get value(): string | undefined;
    get time(): Time | undefined;
    set value(value: Time | string | undefined);
    get previousValue(): string | undefined;
    get vibrate(): boolean;
    set vibrate(value: boolean | string | undefined);
    get input(): HTMLInputElement | undefined;
    get scrollContainer(): HTMLElement;
    /**************************************************************************************
     * Web Component Life Cycle Hooks
     **************************************************************************************/
    static observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**************************************************************************************
     * Public methods
     **************************************************************************************/
    setTime(time: Time): void;
    negateTime(): void;
    setTimePart(timePart: TimePart, value: number): void;
    selectTimePart(timePart?: TimePart | undefined): void;
    selectPreviousTimePart(): void;
    selectNextTimePart(closeAfterLastTimePart?: boolean): void;
    /**************************************************************************************
     * Event listeners
     **************************************************************************************/
    private orientationChangeListener;
    private resizeListener;
    private scrollListener;
    private contextMenuListener;
    private focusListener;
    private inputBlurListener;
    private inputMouseDownListener;
    private inputKeyDownListener;
    private inputKeyUpListener;
    /**************************************************************************************
     * Private methods
     **************************************************************************************/
    private getScrollContainer;
    private ok;
    private cancel;
    private getAvailableTimeParts;
    private fireEvent;
    private showPopup;
    private hidePopup;
    private positionPopup;
    private autosizeInput;
    private formatTime;
    private getClickedTimePart;
    private getInputTextWidth;
}
