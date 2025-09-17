/**************************************************************************************
 * enum TimeFormat
 * The available time formats that can be specified by using attribute "format"
 **************************************************************************************/
export var TimeFormat;
(function (TimeFormat) {
    TimeFormat["HH:mm"] = "HH:mm";
    TimeFormat["H:mm"] = "H:mm";
    TimeFormat["hh:mm"] = "hh:mm";
    TimeFormat["h:mm"] = "h:mm";
    TimeFormat["HH:mm:ss"] = "HH:mm:ss";
    TimeFormat["hh:mm:ss"] = "hh:mm:ss";
    TimeFormat["H:mm:ss"] = "H:mm:ss";
    TimeFormat["h:mm:ss"] = "h:mm:ss";
    TimeFormat["mm:ss"] = "mm:ss";
    TimeFormat["m:ss"] = "m:ss";
    TimeFormat["HH"] = "HH";
    TimeFormat["H"] = "H";
    TimeFormat["hh"] = "hh";
    TimeFormat["h"] = "h";
    TimeFormat["mm"] = "mm";
    TimeFormat["m"] = "m";
    TimeFormat["ss"] = "ss";
    TimeFormat["s"] = "s";
})(TimeFormat || (TimeFormat = {}));
/**************************************************************************************
 * enum TimePart
 * A time can consist of three different parts: Hour, Minute or Second
 **************************************************************************************/
export var TimePart;
(function (TimePart) {
    TimePart["Hour"] = "Hour";
    TimePart["Minute"] = "Minute";
    TimePart["Second"] = "Second";
})(TimePart || (TimePart = {}));
/**************************************************************************************
 * class Time
 * Represents a time consisting of hour, minute and second
 **************************************************************************************/
export class Time {
    get hour() {
        return Math.floor(Math.abs(this.totalSeconds) / 3600);
    }
    get minute() {
        return Math.floor((Math.abs(this.totalSeconds) - this.hour * 3600) / 60);
    }
    get second() {
        return Math.abs(this.totalSeconds) - this.hour * 3600 - this.minute * 60;
    }
    static get Zero() {
        return new Time();
    }
    static parse(timeAsString, timeFormat) {
        if (!timeAsString)
            return undefined;
        const match = timeAsString.toLowerCase().match(/^([+|-])?([0-9]+)([^0-9]+([0-9]+)([^0-9]+([0-9]+))?)?( *(am|pm))?$/i);
        if (!match) {
            console.error('[clock-timepicker] Cannot parse time: ' + timeAsString + '. Invalid time format!');
            return undefined;
        }
        switch (timeFormat) {
            case 'HH:mm':
            case 'hh:mm':
            case 'H:mm':
            case 'h:mm':
            case 'HH:mm:ss':
            case 'hh:mm:ss':
            case 'H:mm:ss':
            case 'h:mm:ss':
                return new Time(Time.getHour(match[2], match[8]), Time.getMinute(match[4]), Time.getSecond(match[6]), match[1] == '-');
            case 'mm:ss':
            case 'm:ss':
                if (match[6])
                    new Time(Time.getHour(match[2], match[8]), Time.getMinute(match[4]), Time.getSecond(match[6]), match[1] == '-');
                return new Time(0, this.getMinute(match[2]), this.getSecond(match[4]), match[1] == '-');
            case 'HH':
            case 'hh':
            case 'H':
            case 'h':
                return new Time(Time.getHour(match[2], match[8]), Time.getMinute(match[4]), Time.getSecond(match[6]), match[1] == '-');
            case 'mm':
            case 'm':
                if (match[4])
                    return new Time(Time.getHour(match[2], match[8]), this.getMinute(match[4]), Time.getSecond(match[6]), match[1] == '-');
                return new Time(0, this.getMinute(match[2]), 0, match[1] == '-');
            case 'ss':
            case 's':
                if (match[6])
                    return new Time(Time.getHour(match[2], match[8]), Time.getMinute(match[4]), Time.getSecond(match[6]), match[1] == '-');
                if (match[4])
                    return new Time(0, this.getMinute(match[2]), Time.getSecond(match[4]), match[1] == '-');
                return new Time(0, 0, this.getSecond(match[2]));
        }
        return undefined;
    }
    static getHour(hourAsString, meridiem = undefined) {
        if (!hourAsString)
            return 0;
        let hour = parseInt(hourAsString);
        if (meridiem) {
            if (meridiem == 'am' && hour == 12)
                hour = 0;
            if (meridiem == 'pm' && hour >= 0 && hour < 12)
                hour += 12;
        }
        return hour;
    }
    static getMinute(minuteAsString) {
        if (!minuteAsString)
            return 0;
        const minute = parseInt(minuteAsString);
        if (minute >= 60) {
            console.warn('[clock-timepicker] Minute cannot be greather than 59, but found: ' + minuteAsString + '!');
            return 0;
        }
        return minute;
    }
    static getSecond(secondAsString) {
        if (!secondAsString)
            return 0;
        const second = parseInt(secondAsString);
        if (second >= 60) {
            console.warn('[clock-timepicker] Second cannot be greather than 59, but found: ' + secondAsString + '!');
            return 0;
        }
        return second;
    }
    constructor(hour = 0, minute = 0, second = 0, isNegative = false) {
        hour = Math.abs(hour);
        minute = Math.abs(minute);
        second = Math.abs(second);
        this.isNegative = isNegative;
        this.totalSeconds = (isNegative ? -1 : 1) * (hour * 3600 + minute * 60 + second);
    }
    getTimePart(timePart) {
        if (timePart == TimePart.Hour)
            return this.hour;
        else if (timePart == TimePart.Minute)
            return this.minute;
        else if (timePart == TimePart.Second)
            return this.second;
        else
            return 0;
    }
    isZero() {
        return this.totalSeconds == 0;
    }
    equals(time) {
        return this.totalSeconds == time.totalSeconds && this.isNegative == time.isNegative;
    }
    isLessThan(time) {
        return this.totalSeconds < time.totalSeconds;
    }
    isGreaterThan(time) {
        return this.totalSeconds > time.totalSeconds;
    }
    add(time) {
        const totalSeconds = this.totalSeconds + time.totalSeconds;
        return new Time(0, 0, totalSeconds, totalSeconds < 0);
    }
    subtract(time) {
        const totalSeconds = this.totalSeconds - time.totalSeconds;
        return new Time(0, 0, totalSeconds, totalSeconds < 0);
    }
    clone() {
        return new Time(0, 0, this.totalSeconds, this.isNegative);
    }
}
/**************************************************************************************
 * class ClockTimepicker extends HTMLElement (Web Component)
 **************************************************************************************/
export class ClockTimepicker extends HTMLElement {
    constructor() {
        super(...arguments);
        //Options (uses getter and setters) with defaults set
        this._animationDuration = 300;
        this._autosize = false;
        this._cancelText = 'Cancel';
        this._disabled = false;
        this._format = TimeFormat['HH:mm'];
        this._maximum = new Time(23, 59, 59);
        this._minimum = Time.Zero;
        this._okText = 'OK';
        this._precision = new Time(0, 0, 1);
        this._required = false;
        this._separator = ':';
        this._usePlusSign = false;
        this._value = undefined;
        this._vibrate = 'vibrate' in navigator;
        //Further variables
        this._input = undefined;
        this._inputObserver = undefined;
        this._scrollContainer = undefined;
        this._caretColorBefore = undefined;
        this._shadowRoot = undefined;
        this._backgroundLayer = undefined;
        this._popup = undefined;
        this._header = undefined;
        this._canvasHolder = undefined;
        this._footer = undefined;
        this._canvases = [];
        this._activeTimePart = undefined;
        this._isSet = false;
        this._enteredDigits = undefined;
        //value
        //-------------------------------------------------------------------------------------
        this.failedValueBecauseOfMinimum = undefined;
        this.failedValueBecauseOfMaximum = undefined;
        /**************************************************************************************
         * Event listeners
         **************************************************************************************/
        //WINDOW.orientationchange() listener
        //Reposition popup if orientation has changed
        this.orientationChangeListener = () => this.positionPopup();
        //WINDOW.resize() listener
        //Reposition popup if viewport has been resized
        this.resizeListener = () => this.positionPopup();
        //SCROLLCONTAINER.scroll() listener
        //Reposition popup if scroll container has been scrolled
        this.scrollListener = () => this.positionPopup();
        //INPUT.contextmenu() listener
        //Pretend from showing context menu on right click
        this.contextMenuListener = ($event) => $event.preventDefault();
        //INPUT.focus() listener
        //When gaining focus, show popup and select time part
        this.focusListener = () => {
            var _a;
            if (!this._input)
                return;
            if (this.disabled)
                return;
            this.selectTimePart((_a = this._activeTimePart) !== null && _a !== void 0 ? _a : this.getAvailableTimeParts()[0]);
            this.showPopup();
            this.fireEvent('focus');
        };
        //INPUT.blur() listener
        //When loosing the focus, hide popup and remove selection
        this.inputBlurListener = () => {
            setTimeout(() => {
                this.hidePopup();
                const selection = window.getSelection();
                if ((selection === null || selection === void 0 ? void 0 : selection.anchorNode) == this)
                    selection.empty();
                this.fireEvent('blur');
            });
        };
        //INPUT.mousedown() listener
        //Select clicked time part
        this.inputMouseDownListener = ($event) => {
            $event.preventDefault();
            $event.stopImmediatePropagation();
            $event.stopPropagation();
            if (this._disabled)
                return;
            const clickedTimePart = this.getClickedTimePart($event);
            const availableTimeParts = this.getAvailableTimeParts();
            if (clickedTimePart == 'start')
                this.selectTimePart(availableTimeParts[0]);
            else if (clickedTimePart == 'end')
                this.selectTimePart(availableTimeParts[availableTimeParts.length - 1]);
            else
                this.selectTimePart(clickedTimePart);
        };
        //INPUT.keydown() listener
        this.inputKeyDownListener = ($event) => {
            if (!this._input || !this._value || !this._activeTimePart)
                return;
            //We process the entered digit in inputKeyUpListener
            if ($event.key.match(/^[0-9]$/))
                return;
            //Only react on Tabulator, if it's not the last time part
            if ($event.key == 'Tab') {
                const timeParts = this.getAvailableTimeParts();
                const currentIndex = timeParts.findIndex(t => t == this._activeTimePart);
                if (currentIndex == timeParts.length - 1)
                    return;
            }
            //Prevent default key action
            $event.preventDefault();
            switch ($event.key) {
                //Tabulator (for not last time part)
                case 'Tab':
                    this.selectNextTimePart();
                    break;
                //Enter: We accept the current entered value ("OK")
                case 'Enter':
                    this.ok();
                    break;
                //Escape: We cancel the input and restore the original value ("CANCEL")
                case 'Escape':
                    this.cancel();
                    break;
                //Plus sign: Switch to positive time
                case '+':
                    if (this._value.isNegative)
                        this.negateTime();
                    break;
                //Minus sign: Switch to negative time
                case '-':
                    if (!this._value.isNegative)
                        this.negateTime();
                    break;
                //Separator sign: We select the next time part
                case ':':
                case '.':
                case this.separator:
                    this.selectNextTimePart(false);
                    break;
                //Arrow up: Add one step to the current active time part
                case 'ArrowUp':
                    if (this._activeTimePart == TimePart.Hour) {
                        const precision = Math.ceil(this._precision.totalSeconds / 3600);
                        const totalSeconds = this._value.totalSeconds + precision * 3600;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    else if (this._activeTimePart == TimePart.Minute) {
                        const precision = Math.ceil(this._precision.totalSeconds / 60);
                        const totalSeconds = this._value.totalSeconds + precision * 60;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    else {
                        const totalSeconds = this._value.totalSeconds + this._precision.totalSeconds;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    break;
                //Arrow down: Subtract one step from the current active time part
                case 'ArrowDown':
                    if (this._activeTimePart == TimePart.Hour) {
                        const precision = Math.ceil(this._precision.totalSeconds / 3600);
                        const totalSeconds = this._value.totalSeconds - precision * 3600;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    else if (this._activeTimePart == TimePart.Minute) {
                        const precision = Math.ceil(this._precision.totalSeconds / 60);
                        const totalSeconds = this._value.totalSeconds - precision * 60;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    else {
                        const totalSeconds = this._value.totalSeconds - this._precision.totalSeconds;
                        this.setTime(new Time(0, 0, totalSeconds, totalSeconds < 0 || (totalSeconds == 0 && this._value.isNegative)));
                    }
                    break;
                //Arrow left: We select the previous time part
                case 'ArrowLeft':
                    this.selectPreviousTimePart();
                    break;
                //Arrow right: We select the next time part (if one is available)
                case 'ArrowRight':
                    this.selectNextTimePart(false);
                    break;
                //Backspace or Delete: We clear the current active time part
                case 'Backspace':
                case 'Delete':
                    this._enteredDigits = undefined;
                    const value = this._value.getTimePart(this._activeTimePart);
                    if (value == 0) {
                        if (!this.required && this._value.totalSeconds == 0 && this._activeTimePart == this.getAvailableTimeParts()[0]) {
                            this._input.value = '';
                            this.autosizeInput();
                            this._isSet = false;
                            this._input.blur();
                        }
                        else
                            this.selectPreviousTimePart();
                    }
                    else
                        this.setTimePart(this._activeTimePart, 0);
                    break;
            }
        };
        //INPUT.keyup() listener
        //Process the input of digits by keyboard
        this.inputKeyUpListener = ($event) => {
            $event.preventDefault();
            //Only allow to enter digits [0-9]
            if (!this._activeTimePart || !this._value || !$event.key.match(/^[0-9]$/))
                return;
            //Add the entered digit to the previously entered digits
            const nextDigit = (this._enteredDigits != undefined ? this._enteredDigits : '') + $event.key;
            //If minimum and maximum is not respected, don't accept input
            const nextTime = new Time(this._activeTimePart == TimePart.Hour ? parseInt(nextDigit) : this._value.hour, this._activeTimePart == TimePart.Minute ? parseInt(nextDigit) : this._value.minute, this._activeTimePart == TimePart.Second ? parseInt(nextDigit) : this._value.second);
            if (nextTime.isGreaterThan(this._maximum) || nextTime.isLessThan(this._minimum)) {
                this._enteredDigits = undefined;
                return;
            }
            //Remember entered number
            this._enteredDigits = nextDigit;
            //Set new time part
            this.setTimePart(this._activeTimePart, parseInt(this._enteredDigits));
            //For minutes and seconds select next time part if entered number is greater than 5
            if (this._activeTimePart != TimePart.Hour && (parseInt(this._enteredDigits) > 5 || this._enteredDigits.length >= 2))
                this.selectNextTimePart();
            else {
                //Is it possible to enter another digit? If not, select next time part
                const nextSmallestDigit = this._enteredDigits + '0';
                const nextSmallestTime = new Time(this._activeTimePart == TimePart.Hour ? parseInt(nextSmallestDigit) : this._value.hour, this._activeTimePart == TimePart.Minute ? parseInt(nextSmallestDigit) : this._value.minute, this._activeTimePart == TimePart.Second ? parseInt(nextSmallestDigit) : this._value.second, this._value.isNegative);
                if (nextSmallestTime.isGreaterThan(this._maximum) || nextSmallestTime.isLessThan(this._minimum))
                    this.selectNextTimePart();
            }
        };
    }
    /**************************************************************************************
     * Getter and setters
     **************************************************************************************/
    //animationDuration
    //-------------------------------------------------------------------------------------
    get animationDuration() {
        return this._animationDuration;
    }
    set animationDuration(value) {
        if (!value)
            value = 300;
        else if (typeof value == 'string') {
            if (!value.match(/^[0-9]+$/)) {
                console.error('[clock-timepicker] Invalid animationDuration specified: ' + value + '! Must be a number between 0 and 1000ms. Default is: 300ms');
                return;
            }
            value = parseInt(value);
        }
        if (value < 0 || value > 1000) {
            console.error('[clock-timepicker] Invalid animationDuration specified: ' + value + '! Must be a number between 0 and 1000ms. Default is: 300ms');
            return;
        }
        this._animationDuration = value;
        //console.log('SET', 'animationDuration', this._animationDuration);
    }
    //autosize
    //-------------------------------------------------------------------------------------
    get autosize() {
        return this._autosize;
    }
    set autosize(value) {
        if (value == undefined)
            value = false;
        else if (typeof value == 'string')
            value = !value.match(/^false$/i);
        this._autosize = value;
        //console.log('SET', 'autosize', this._autosize);
    }
    //disabled
    //-------------------------------------------------------------------------------------
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        if (value == undefined)
            value = false;
        else if (typeof value == 'string')
            value = !value.match(/^false$/i);
        this._disabled = value;
        //console.log('SET', 'disabled', this._disabled);
        if (!this._input)
            return;
        if (this._disabled) {
            if (document.activeElement == this._input)
                this.cancel();
            this._input.style.cursor = 'default';
        }
        else
            this._input.style.cursor = 'text';
    }
    //format
    //-------------------------------------------------------------------------------------
    get format() {
        return this._format;
    }
    set format(value) {
        if (!value)
            this.format = TimeFormat['HH:mm'];
        else if (typeof value == 'string') {
            if (!TimeFormat[value]) {
                console.error('[clock-timepicker] Invalid format specified: ' + value + '!');
                return;
            }
            this._format = TimeFormat[value];
        }
        else
            this._format = value;
        //console.log('SET', 'format', this._format);
    }
    //maximum
    //-------------------------------------------------------------------------------------
    get maximum() {
        return this._maximum;
    }
    set maximum(value) {
        if (!value)
            return;
        if (typeof value == 'string') {
            value = Time.parse(value, this.format);
            if (!value) {
                console.error('[clock-timepicker] Invalid maximum specified: ' + value + '!');
                return;
            }
        }
        if (value.isLessThan(this._minimum)) {
            console.error('[clock-timepicker] Maximum cannot be less than minimum!');
            return;
        }
        this._maximum = value;
        //console.log('SET', 'maximum', this._maximum);
        if (this.failedValueBecauseOfMaximum) {
            this.value = this.failedValueBecauseOfMaximum;
            this.failedValueBecauseOfMaximum = undefined;
        }
    }
    //minimum
    //-------------------------------------------------------------------------------------
    get minimum() {
        return this._minimum;
    }
    set minimum(value) {
        if (!value)
            return;
        if (typeof value == 'string') {
            value = Time.parse(value, this.format);
            if (!value) {
                console.error('[clock-timepicker] Invalid minimum specified: ' + value + '!');
                return;
            }
        }
        if (value.isGreaterThan(this._maximum)) {
            console.error('[clock-timepicker] Minimum cannot be greater than maximum!');
            return;
        }
        this._minimum = value;
        //console.log('SET', 'minimum', this._minimum);
        if (this.failedValueBecauseOfMinimum) {
            this.value = this.failedValueBecauseOfMinimum;
            this.failedValueBecauseOfMinimum = undefined;
        }
    }
    //precision
    //-------------------------------------------------------------------------------------
    get precision() {
        return this._precision;
    }
    set precision(value) {
        if (value == undefined)
            this._precision = new Time(0, 0, 1);
        else if (typeof value == 'number') {
            if (value < 1)
                console.error('[clock-timepicker] Precision must be positive and greater than zero: ' + value + '!');
            else {
                this._precision = new Time(0, value, 0);
                //console.log('SET', 'precision', this._precision);
            }
        }
        else if (typeof value == 'string') {
            const time = Time.parse(value, this._format);
            if (time == undefined)
                console.error('[clock-timepicker] Invalid precision specified: ' + value + '!');
            else if (time === null || time === void 0 ? void 0 : time.isLessThan(new Time(0, 0, 1)))
                console.error('[clock-timepicker] Precision must be positive and greater than zero: ' + value + '!');
            else {
                this._precision = time;
                //console.log('SET', 'precision', this._precision);
            }
        }
        else if (value.isLessThan(new Time(0, 0, 1)))
            console.error('[clock-timepicker] Precision must be positive and greater than zero: ' + value + '!');
        else {
            this._precision = value;
            //console.log('SET', 'precision', this._precision);
        }
    }
    //required
    //-------------------------------------------------------------------------------------
    get required() {
        return this._required;
    }
    set required(value) {
        if (value == undefined)
            value = false;
        else if (typeof value == 'string')
            value = !value.match(/^false$/i);
        this._required = value;
        //console.log('SET', 'required', this._required);
    }
    //separator
    //-------------------------------------------------------------------------------------
    get separator() {
        return this._separator;
    }
    set separator(value) {
        if (!value)
            value = ':';
        else if (value.match(/[0-9]/)) {
            console.error('[clock-timepicker] Invalid separator specified: ' + value + '! Separator cannot consist of a number.');
            return;
        }
        this._separator = value;
        //console.log('SET', 'separator', this._separator);
    }
    //usePlusSign
    //-------------------------------------------------------------------------------------
    get usePlusSign() {
        return this._usePlusSign;
    }
    set usePlusSign(value) {
        if (value == undefined)
            value = false;
        else if (typeof value == 'string')
            value = !value.match(/^false$/i);
        this._usePlusSign = value;
        //console.log('SET', 'usePlusSign', this._usePlusSign);
    }
    get value() {
        if (!this._value)
            return undefined;
        return this.formatTime();
    }
    get time() {
        return this._value;
    }
    set value(value) {
        if (!value)
            value = undefined;
        else if (typeof value == 'string')
            value = Time.parse(value, this.format);
        if (value == undefined)
            this._value = this.required ? this.minimum : undefined;
        else {
            if (value.isLessThan(this.minimum)) {
                this.failedValueBecauseOfMinimum = value;
                this._value = this.minimum.clone();
                //console.log('SET', 'value', this._value, '[minimum]');
            }
            else if (value.isGreaterThan(this.maximum)) {
                this.failedValueBecauseOfMaximum = value;
                this._value = this.maximum.clone();
                //console.log('SET', 'value', this._value, '[maximum]');
            }
            else {
                this._value = value;
                //console.log('SET', 'value', this._value);
            }
            this._isSet = true;
        }
        if (this._input) {
            this._input.value = this.formatTime();
            this.autosizeInput();
            if (document.activeElement == this._input)
                this.selectTimePart();
        }
    }
    //vibrate
    //-------------------------------------------------------------------------------------
    get vibrate() {
        return this._vibrate;
    }
    set vibrate(value) {
        if (value == undefined || !('vibrate' in navigator))
            value = false;
        else if (typeof value == 'string')
            value = !value.match(/^false$/i);
        this._vibrate = value;
        //console.log('SET', 'vibrate', this._vibrate);
    }
    //Public access to input variable
    get input() {
        return this._input;
    }
    //Public access to scroll container
    get scrollContainer() {
        return this._scrollContainer || document.documentElement;
    }
    //Lifecycle method called when an observed attribute has been added, removed or updated
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'animationduration':
                this.animationDuration = newValue;
                break;
            case 'autosize':
                this.autosize = newValue;
                break;
            case 'canceltext':
                break;
            case 'disabled':
                this.disabled = newValue;
                break;
            case 'format':
                this.format = newValue;
                break;
            case 'maximum':
                this.maximum = newValue;
                break;
            case 'minimum':
                this.minimum = newValue;
                break;
            case 'precision':
                this.precision = newValue;
                break;
            case 'required':
                this.required = newValue;
                break;
            case 'separator':
                this.separator = newValue;
                break;
            case 'useplussign':
                this.usePlusSign = newValue;
                break;
            case 'value':
                this.value = newValue;
                break;
            case 'vibrate':
                this.vibrate = newValue;
                break;
        }
    }
    //Lifecycle method called when the component is added to the DOM
    connectedCallback() {
        //Get or create INPUT element
        this._input = this.querySelector('input');
        if (!this._input) {
            this._input = document.createElement('input');
            this.appendChild(this._input);
        }
        else {
            if (this._input.value)
                this.value = this._input.value;
            if (this._input.disabled) {
                this._input.disabled = false;
                this.disabled = true;
            }
            this._caretColorBefore = this._input.style.caretColor;
            //Observe attribute changes of provided input element
            this._inputObserver = new MutationObserver(() => {
                if (this._scrollContainer)
                    (this._scrollContainer == document.documentElement ? window : this._scrollContainer).removeEventListener('scroll', this.scrollListener);
                this._scrollContainer = this.getScrollContainer(this);
                (this._scrollContainer == document.documentElement ? window : this._scrollContainer).addEventListener('scroll', this.scrollListener);
            });
            this._inputObserver.observe(this._input, { attributes: true });
            //Observe value property of provided input element
            let inputValueDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this._input), 'value');
            const _this = this;
            Object.defineProperty(this._input, 'value', {
                get: function () {
                    var _a;
                    return (_a = inputValueDescriptor === null || inputValueDescriptor === void 0 ? void 0 : inputValueDescriptor.get) === null || _a === void 0 ? void 0 : _a.apply(this);
                },
                set: function (value) {
                    if (!(inputValueDescriptor === null || inputValueDescriptor === void 0 ? void 0 : inputValueDescriptor.set))
                        return undefined;
                    inputValueDescriptor.set.apply(this, [value]);
                    if (_this.value != value)
                        _this.value = value;
                    return value;
                }
            });
            //Observe disabled property of provided input element
            Object.defineProperty(this._input, 'disabled', {
                set: function (disabled) {
                    _this.disabled = disabled;
                    return _this.disabled;
                }
            });
        }
        //Setting properties of input element
        if (!this._value && this.required)
            this._value = this.minimum.clone();
        this._input.value = this.formatTime();
        this._input.type = 'text';
        this._input.spellcheck = false;
        this._input.autocomplete = 'off';
        this._input.readOnly = true;
        this._input.style.caretColor = 'transparent';
        //Register listeners on input element
        this._input.addEventListener('mousedown', this.inputMouseDownListener);
        this._input.addEventListener('focus', this.focusListener);
        this._input.addEventListener('blur', this.inputBlurListener);
        this._input.addEventListener('keydown', this.inputKeyDownListener);
        this._input.addEventListener('keyup', this.inputKeyUpListener);
        this._input.addEventListener('contextmenu', this.contextMenuListener);
        //Autosize input
        this.autosizeInput();
        //Create shadow root element and add it
        this._shadowRoot = document.createElement('div');
        this._shadowRoot.className = 'clock-timepicker-shadow-root';
        this.appendChild(this._shadowRoot);
        const shadowRoot = this._shadowRoot.attachShadow({ mode: 'open' });
        //Create CSS style for the shadow root
        const style = document.createElement('style');
        style.innerHTML = `
      div.background-layer {
        position: fixed;
        z-index: 2147483646;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        display: none;
      }

			div.popup {
				position: fixed;
        z-index: 2147483647;
        font-family: var(--clock-timepicker-font-family, Arial);
				cursor: var(--clock-timepicker-cursor, default);
				border: var(--clock-timepicker-popup-border, none);
				border-radius: var(--clock-timepicker-popup-border-radius, 5px);
				box-shadow: var(--clock-timepicker-popup-shadow, rgba(0, 0, 0, 0.14) 0px 4px 20px 0px);
				background: var(--clock-timepicker-popup-background, #ffffff);
				overflow: hidden;
				user-select: none;
				opacity: 0;
				pointer-events: none;
			}

      div.header {
        background: var(--clock-timepicker-header-background, var(--clock-timepicker-accent-color, #0797ff));
        padding: 10px 0px;
        text-align: center;
      }

      div.header > span {
        font-size: var(--clock-timepicker-header-font-size, 40px);
        line-height: var(--clock-timepicker-header-font-size, 40px);
        color: var(--clock-timepicker-header-font-color, #ffffff);
      }

      div.header > span.active {
        background: var(--clock-timepicker-header-selection-background, rgba(255, 255, 255, 0.6));
      }

      div.canvas-holder {
        position: relative;
        width: var(--clock-timepicker-popup-size, 200px);
				height: var(--clock-timepicker-popup-size, 200px);
      }

      div.footer {
        display: flex;
        gap: var(--clock-timepicker-button-gap, 30px);
        justify-content: right;
        padding: 10px 30px 15px 30px;
      }

      div.footer > button {
        background: var(--clock-timepicker-button-background, none);
        border: var(--clock-timepicker-button-border, none);
        shadow: var(--clock-timepicker-button-shadow, none);
        outline: var(--clock-timepicker-button-outline, none);
        font-size: var(--clock-timepicker-button-font-size, 20px);
        padding: var(--clock-timepicker-button-padding, none);
        color: var(--clock-timepicker-button-color, var(--clock-timepicker-accent-color, #0797ff));
        cursor: inherit;
      }

      div.footer > button.ok {
        color: var(--clock-timepicker-button-ok-color, var(--clock-timepicker-button-color, var(--clock-timepicker-accent-color, #0797ff)));
      }

      div.footer > button.cancel {
        color: var(--clock-timepicker-button-cancel-color, var(--clock-timepicker-button-color, var(--clock-timepicker-accent-color, #0797ff)));
      }
			
			canvas {
        position: absolute;
        left: 0px;
        top: 0px;
				margin: 20px;
				width: 250px;
				height: 250px;
        opacity: 0;
			}

      @media (min-width: 600px) {
        div.header { display: none; }
        div.footer { display: none; }
        canvas {
          margin: 10px;
          width: calc(var(--clock-timepicker-popup-size, 200px) - 2 * 10px);
				  height: calc(var(--clock-timepicker-popup-size, 200px) - 2 * 10px);
        }
      }
		`;
        shadowRoot.appendChild(style);
        //Background layer element for mobile version
        this._backgroundLayer = document.createElement('div');
        this._backgroundLayer.className = 'background-layer';
        this._backgroundLayer.addEventListener('mousedown', $event => $event.preventDefault());
        shadowRoot.appendChild(this._backgroundLayer);
        //Create popup element and add it to the shadow root
        this._popup = document.createElement('div');
        this._popup.className = 'popup';
        this._popup.addEventListener('mousedown', $event => $event.preventDefault());
        this._popup.addEventListener('contextmenu', $event => $event.preventDefault());
        shadowRoot.appendChild(this._popup);
        //Create header element for mobile version
        this._header = document.createElement('div');
        this._header.className = 'header';
        this._popup.appendChild(this._header);
        //Create canvas holder element
        this._canvasHolder = document.createElement('div');
        this._canvasHolder.className = 'canvas-holder';
        this._popup.appendChild(this._canvasHolder);
        //Create clock canvas elements for each time part and add it to the popup
        this._canvases = [
            new ClockCanvas(this, this._canvasHolder, TimePart.Hour),
            new ClockCanvas(this, this._canvasHolder, TimePart.Minute),
            new ClockCanvas(this, this._canvasHolder, TimePart.Second)
        ];
        //Create footer element for mobile version
        this._footer = document.createElement('div');
        this._footer.className = 'footer';
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel';
        cancelButton.innerHTML = this._cancelText;
        cancelButton.addEventListener('click', () => this.cancel());
        this._footer.appendChild(cancelButton);
        const okButton = document.createElement('button');
        okButton.className = 'ok';
        okButton.innerHTML = this._okText;
        okButton.addEventListener('click', () => this.ok());
        this._footer.appendChild(okButton);
        this._popup.appendChild(this._footer);
        //Window event listeners
        window.addEventListener('orientationchange', this.orientationChangeListener);
        window.addEventListener('resize', this.resizeListener);
        //Scoll container listener
        this._scrollContainer = this.getScrollContainer(this);
        (this._scrollContainer == document.documentElement ? window : this._scrollContainer).addEventListener('scroll', this.scrollListener);
    }
    //Lifecycle method called when the component is removed from the DOM
    //Remove all listeners and disconnect from input observer
    disconnectedCallback() {
        var _a;
        (_a = (this._scrollContainer == document.documentElement ? window : this._scrollContainer)) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('orientationchange', this.orientationChangeListener);
        window.removeEventListener('resize', this.resizeListener);
        if (this._input) {
            this._input.removeEventListener('mousedown', this.inputMouseDownListener);
            this._input.removeEventListener('focus', this.focusListener);
            this._input.removeEventListener('blur', this.inputBlurListener);
            this._input.removeEventListener('keydown', this.inputKeyDownListener);
            this._input.removeEventListener('keyup', this.inputKeyUpListener);
            this._input.removeEventListener('contextmenu', this.contextMenuListener);
            if (this._caretColorBefore != undefined)
                this._input.style.caretColor = this._caretColorBefore;
        }
        if (this._inputObserver)
            this._inputObserver.disconnect();
    }
    /**************************************************************************************
     * Public methods
     **************************************************************************************/
    //Set time of the timepicker
    setTime(time) {
        if (!this._input || (this._value != undefined && time.equals(this._value)))
            return;
        if (time.isLessThan(this._minimum))
            this._value = this._minimum.clone();
        else if (time.isGreaterThan(this._maximum))
            this._value = this._maximum.clone();
        else
            this._value = time;
        this._isSet = true;
        this._input.value = this.formatTime();
        this.autosizeInput();
        if (this.vibrate)
            navigator.vibrate(10);
        this.selectTimePart();
        this.fireEvent('input');
    }
    //Negate time of the timepicker
    negateTime() {
        if (!this._input || !this._value)
            return;
        this.setTime(new Time(0, 0, this._value.totalSeconds, !this._value.isNegative));
    }
    //Set a certain time part of the timepicker
    setTimePart(timePart, value) {
        if (!this._input)
            return;
        if (value < 0) {
            console.error('[clock-timepicker] setTimePart only accepts positive numbers! Use negateTime() to switch between positive and negative time...');
            return;
        }
        switch (timePart) {
            case TimePart.Hour:
                if (this._value == undefined)
                    this.setTime(new Time(value, 0, 0, this._maximum.isLessThan(Time.Zero)));
                else
                    this.setTime(new Time(value, this._value.minute, this._value.second, this._value.isNegative));
                break;
            case TimePart.Minute:
                if (value < 0 || value >= 60) {
                    console.error('[clock-timepicker] setTimePart only accepts minutes between 0 and 59, but encountered: ' + value);
                    return;
                }
                if (this._value == undefined)
                    this.setTime(new Time(0, value, 0, this._maximum.isLessThan(Time.Zero)));
                else
                    this.setTime(new Time(this._value.hour, value, this._value.second, this._value.isNegative));
                break;
            case TimePart.Second:
                if (value < 0 || value >= 60) {
                    console.error('[clock-timepicker] setTimePart only accepts seconds between 0 and 59, but encountered: ' + value);
                    return;
                }
                if (this._value == undefined)
                    this.setTime(new Time(0, 0, value, this._maximum.isLessThan(Time.Zero)));
                else
                    this.setTime(new Time(this._value.hour, this._value.minute, value, this._value.isNegative));
                break;
        }
    }
    //Select a specific time part of the timepicker or select current one if argument is not specified
    selectTimePart(timePart = undefined) {
        var _a;
        if (!this._input || !this._header)
            return;
        if (timePart == undefined)
            timePart = this._activeTimePart;
        const canvas = this._canvases.find(t => t.timePart == timePart);
        //If browser is not in focus, canvas is not available, so we blur the input element
        if (!canvas) {
            this._input.blur();
            return;
        }
        //On first focus we directly show the canvas without animation
        if (!this._activeTimePart) {
            this._activeTimePart = timePart;
            for (let otherCanvas of this._canvases.filter(t => t.timePart != canvas.timePart)) {
                otherCanvas.element.style.opacity = '0';
                otherCanvas.element.style.transform = 'scale(0.7)';
                otherCanvas.element.style.zIndex = '0';
            }
            canvas.element.style.opacity = '1';
            canvas.element.style.transform = 'scale(1)';
            canvas.element.style.zIndex = '1';
        }
        //Otherwise we show the animation to switch between different time parts
        else if (this._activeTimePart != timePart) {
            this._enteredDigits = undefined;
            (_a = this._canvases.find(t => t.timePart == this._activeTimePart)) === null || _a === void 0 ? void 0 : _a.element.animate([{ offset: 0, opacity: 1, transform: 'scale(1)', zIndex: 1 }, { offset: 1, opacity: 0, transform: 'scale(0.7)', zIndex: 0 }], { duration: this.animationDuration, fill: 'forwards' });
            this._activeTimePart = timePart;
            canvas.element.animate([{ offset: 0, opacity: 0, transform: 'scale(0.7)', zIndex: 0 }, { offset: 1, opacity: 1, transform: 'scale(1)', zIndex: 1 }], { duration: this.animationDuration, fill: 'forwards' });
        }
        //Refresh the canvas
        canvas.refresh();
        //Focus the input element
        this._input.focus();
        //Select time part of input element
        const hourLength = this.formatTime(TimePart.Hour).length;
        const minuteLength = this.formatTime(TimePart.Minute).length;
        const secondLength = this.formatTime(TimePart.Second).length;
        switch (timePart) {
            case TimePart.Hour:
                this._input.setSelectionRange(0, hourLength);
                break;
            case TimePart.Minute:
                this._input.setSelectionRange(hourLength + (hourLength ? 1 : 0), hourLength + (hourLength ? 1 : 0) + minuteLength);
                break;
            case TimePart.Second:
                this._input.setSelectionRange(hourLength + (hourLength ? 1 : 0) + minuteLength + (minuteLength ? 1 : 0), hourLength + (hourLength ? 1 : 0) + minuteLength + (minuteLength ? 1 : 0) + secondLength);
                break;
        }
        //Update the header (used in mobile version)
        this._header.innerHTML = '';
        const availableTimeParts = this.getAvailableTimeParts();
        for (let i = 0; i < availableTimeParts.length; i++) {
            if (i) {
                const separatorSpan = document.createElement('span');
                separatorSpan.innerHTML = this.separator;
                this._header.appendChild(separatorSpan);
            }
            const span = document.createElement('span');
            span.addEventListener('click', () => this.selectTimePart(availableTimeParts[i]));
            if (availableTimeParts[i] == timePart)
                span.className = 'active';
            span.innerHTML = this.formatTime(availableTimeParts[i]);
            this._header.appendChild(span);
        }
    }
    //Select previous time part of the timepicker
    selectPreviousTimePart() {
        const timeParts = this.getAvailableTimeParts();
        const currentIndex = timeParts.findIndex(t => t == this._activeTimePart);
        if (currentIndex > 0)
            this.selectTimePart(timeParts[currentIndex - 1]);
    }
    //Select next time part of the timepicker or close the timepicker if the last time part is active (except if argument false is passed)
    selectNextTimePart(closeAfterLastTimePart = true) {
        var _a;
        const timeParts = this.getAvailableTimeParts();
        const currentIndex = timeParts.findIndex(t => t == this._activeTimePart);
        if (currentIndex < timeParts.length - 1)
            this.selectTimePart(timeParts[currentIndex + 1]);
        else if (closeAfterLastTimePart)
            (_a = this._input) === null || _a === void 0 ? void 0 : _a.blur();
    }
    /**************************************************************************************
     * Private methods
     **************************************************************************************/
    //Get scroll container in which this clock timepicker element lays
    getScrollContainer(element) {
        if (!element || element == document.documentElement || element == document.body)
            return document.documentElement;
        if (element.scrollHeight > element.clientHeight && window.getComputedStyle(element).overflowY.match(/^auto|scroll$/))
            return element;
        return this.getScrollContainer(element.parentElement);
    }
    //OK button is hit (in mobile version)
    ok() {
        if (!this._input)
            return;
        this._input.blur();
        if (this.vibrate)
            navigator.vibrate(10);
    }
    //CANCEL button is hit (in mobile version)
    //Restore value before
    cancel() {
        if (!this._input)
            return;
        if (this.dataset.timeBefore != undefined)
            this._value = Time.parse(this.dataset.timeBefore, this._format);
        this._input.blur();
        if (this.vibrate)
            navigator.vibrate(10);
    }
    //Retrieves the available time parts depending on the specified time format
    getAvailableTimeParts(respectPrecision = true) {
        const timeParts = [];
        const precision = this._precision.totalSeconds;
        for (let part of this.format.toString().split(':')) {
            if (part.match(/h/i))
                timeParts.push(TimePart.Hour);
            if (part.match(/m/) && (!respectPrecision || precision < 3600))
                timeParts.push(TimePart.Minute);
            if (part.match(/s/) && (!respectPrecision || precision < 60))
                timeParts.push(TimePart.Second);
        }
        return timeParts;
    }
    //Fire a change or input event
    fireEvent(eventName) {
        if (!this._input)
            return;
        //console.log('ClockTimepicker.fireEvent(\'' + eventName + '\')');
        const event = new Event(eventName);
        this.dispatchEvent(event);
        if (eventName == 'change' || eventName == 'input')
            this._input.dispatchEvent(event);
    }
    //Show the popup
    showPopup() {
        if (!this._popup || !this._input || this._popup.style.opacity == '1')
            return;
        this.value = this._input.value;
        if (!this._value) {
            this._value = this.minimum.clone();
            this._input.value = this.formatTime();
            this.autosizeInput();
        }
        const okButton = this._popup.querySelector('button.ok');
        if (okButton)
            okButton.innerHTML = this._okText;
        const cancelButton = this._popup.querySelector('button.cancel');
        if (cancelButton)
            cancelButton.innerHTML = this._cancelText;
        this._popup.style.pointerEvents = 'all';
        this.positionPopup();
        this._popup.style.opacity = '1';
        this.dataset.timeBefore = this.formatTime();
    }
    //Hides the popup
    hidePopup() {
        if (!this._backgroundLayer || !this._popup || !this._input || this._popup.style.opacity == '0')
            return;
        //Round to precision
        if (this._value != undefined && this._precision != undefined) {
            this._value = new Time(0, 0, Math.round(this._value.totalSeconds / this._precision.totalSeconds) * this._precision.totalSeconds, this._value.isNegative);
            this._input.value = this.formatTime();
        }
        this._popup.style.opacity = '0';
        this._popup.style.pointerEvents = 'none';
        if (!this.required && !this._isSet) {
            this._value = undefined;
            this._input.value = this.formatTime();
            this.autosizeInput();
        }
        this._backgroundLayer.style.display = 'none';
        this._activeTimePart = undefined;
        this._enteredDigits = undefined;
        this._canvases.forEach(canvas => canvas.element.getAnimations().forEach(a => a.cancel()));
        if (this._input.value != this.dataset.timeBefore)
            this.fireEvent('change');
        delete this.dataset.timeBefore;
    }
    //Positions the popup on the screen
    positionPopup() {
        var _a;
        if (!this._backgroundLayer || !this._input || !this._popup || !this._canvasHolder)
            return;
        let size;
        let faceMargin;
        if (window.innerWidth < 600) {
            size = window.innerWidth - 80 > 300 ? '300px' : window.innerWidth - 80 + 'px';
            faceMargin = 20;
        }
        else {
            size = window.getComputedStyle(this).getPropertyValue('--clock-timepicker-popup-size');
            if (!size)
                size = '200px';
            faceMargin = 10;
        }
        this._canvasHolder.style.width = size;
        this._canvasHolder.style.height = size;
        this._popup.querySelectorAll('canvas').forEach((canvas) => {
            canvas.style.width = 'calc(' + size + ' - 2 * ' + faceMargin + 'px)';
            canvas.style.height = 'calc(' + size + ' - 2 * ' + faceMargin + 'px)';
            const dpr = window.devicePixelRatio || 1;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            const ctx = canvas.getContext('2d');
            ctx === null || ctx === void 0 ? void 0 : ctx.scale(dpr, dpr);
        });
        (_a = this._canvases.find(t => t.timePart == this._activeTimePart)) === null || _a === void 0 ? void 0 : _a.refresh();
        if (window.innerWidth < 600) {
            if (this._popup.style.pointerEvents == 'all')
                this._backgroundLayer.style.display = 'block';
            this._popup.style.left = (window.innerWidth - this._popup.offsetWidth) / 2 + 'px';
            this._popup.style.top = (window.innerHeight - this._popup.offsetHeight) / 2 + 'px';
        }
        else {
            this._backgroundLayer.style.display = 'none';
            const inputPosition = this._input.getBoundingClientRect();
            const inputFocusStyle = window.getComputedStyle(this._input, 'focus');
            //Display popup above the input element (if there is not enough space beneath the input element)
            if (inputPosition.top + this._input.offsetHeight + this._popup.offsetHeight + 10 > window.innerHeight) {
                this._popup.style.top = inputPosition.top - this._popup.offsetHeight - parseInt(inputFocusStyle.borderTop) + 'px';
            }
            //Display popup beneath the input element (DEFAULT)
            else {
                this._popup.style.top = inputPosition.top + this._input.offsetHeight + parseInt(inputFocusStyle.borderBottomWidth) + 'px';
            }
            //Align popup horizontally
            if (this._input.offsetWidth < this._popup.offsetWidth) {
                let left = inputPosition.left + this._input.offsetWidth / 2 - this._popup.offsetWidth / 2;
                if (left + this._popup.offsetWidth + 20 > window.innerWidth)
                    left = window.innerWidth - this._popup.offsetWidth - 20;
                if (left < 10)
                    left = 10;
                this._popup.style.left = left + 'px';
            }
            else
                this._popup.style.left = inputPosition.left + 'px';
        }
    }
    //Autosize input
    autosizeInput() {
        if (!this._input || !this.autosize)
            return;
        const computedStyle = window.getComputedStyle(this._input, 'focus');
        this._input.style.width = this.getInputTextWidth() + parseInt(computedStyle.borderLeftWidth) + parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.borderRightWidth) + parseInt(computedStyle.paddingRight) + 'px';
    }
    //Format the time according to the specified time format
    formatTime(timePart = undefined, time = undefined) {
        if (!time)
            time = this._value;
        if (!time)
            return '';
        let format = this.format;
        if (timePart) {
            const timeFormatSplits = format.toString().split(':');
            let usedFormat = undefined;
            if (timePart == TimePart.Hour)
                usedFormat = timeFormatSplits.find(t => t.match(/h/i));
            else if (timePart == TimePart.Minute)
                usedFormat = timeFormatSplits.find(t => t.match(/m/));
            else if (timePart == TimePart.Second)
                usedFormat = timeFormatSplits.find(t => t.match(/s/));
            if (!usedFormat)
                return '';
            format = TimeFormat[usedFormat];
        }
        let hour = time.hour;
        let isPM = false;
        if (format.toString().match(/h/)) {
            if (hour == 0)
                hour = 12;
            else if (hour == 12)
                isPM = true;
            else if (hour > 12) {
                hour -= 12;
                isPM = true;
            }
        }
        let formattedTime;
        switch (format) {
            case 'HH:mm':
                formattedTime = hour.toString().padStart(2, '0') + this.separator + time.minute.toString().padStart(2, '0');
                break;
            case 'H:mm':
                formattedTime = hour.toString() + this.separator + time.minute.toString().padStart(2, '0');
                break;
            case 'hh:mm':
                formattedTime = hour.toString().padStart(2, '0') + this.separator + time.minute.toString().padStart(2, '0') + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'h:mm':
                formattedTime = hour.toString() + this.separator + time.minute.toString().padStart(2, '0') + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'HH:mm:ss':
                formattedTime = hour.toString().padStart(2, '0') + this.separator + time.minute.toString().padStart(2, '0') + this.separator + time.second.toString().padStart(2, '0');
                break;
            case 'hh:mm:ss':
                formattedTime = hour.toString().padStart(2, '0') + this.separator + time.minute.toString().padStart(2, '0') + this.separator + time.second.toString().padStart(2, '0') + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'H:mm:ss':
                formattedTime = hour.toString() + this.separator + time.minute.toString().padStart(2, '0') + this.separator + time.second.toString().padStart(2, '0');
                break;
            case 'h:mm:ss':
                formattedTime = hour.toString() + this.separator + time.minute.toString().padStart(2, '0') + this.separator + time.second.toString().padStart(2, '0') + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'mm:ss':
                formattedTime = time.minute.toString().padStart(2, '0') + this.separator + time.second.toString().padStart(2, '0');
                break;
            case 'm:ss':
                formattedTime = time.minute.toString() + this.separator + time.second.toString().padStart(2, '0');
                break;
            case 'HH':
                formattedTime = hour.toString().padStart(2, '0');
                break;
            case 'H':
                formattedTime = hour.toString();
                break;
            case 'hh':
                formattedTime = hour.toString().padStart(2, '0') + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'h':
                formattedTime = hour.toString() + (!timePart ? ' ' + (isPM ? 'pm' : 'am') : '');
                break;
            case 'mm':
                formattedTime = time.minute.toString().padStart(2, '0');
                break;
            case 'm':
                formattedTime = time.minute.toString();
                break;
            case 'ss':
                formattedTime = time.second.toString().padStart(2, '0');
                break;
            case 's':
                formattedTime = time.second.toString();
                break;
            default:
                return '';
        }
        return (this.usePlusSign && !time.isNegative ? '+' : '') + (time.isNegative ? '-' : '') + formattedTime;
    }
    //Gets the clicked time part on the input element
    //Returns TimePart.Hour, TimePart.Minute, TimePart.Second, 'start' (if the click was before the first part) or 'end' (if the click was after the last part)
    getClickedTimePart($event) {
        if (!this._input || !this._value)
            return 'start';
        const computedStyle = window.getComputedStyle(this._input, 'focus');
        const inputPosition = this._input.getBoundingClientRect();
        let textWidth = this.getInputTextWidth();
        const x = $event.pageX - inputPosition.left;
        let _x = parseInt(computedStyle.borderLeft) + parseInt(computedStyle.paddingLeft);
        if (computedStyle.textAlign == 'center')
            _x = (this._input.offsetWidth - textWidth) / 2;
        if (computedStyle.textAlign.match(/^right|end$/))
            _x = this._input.offsetWidth - textWidth;
        if (x < _x)
            return 'start';
        const separatorWidth = this.getInputTextWidth(':');
        let isFirstPart = true;
        textWidth = this.getInputTextWidth(TimePart.Hour);
        if (textWidth) {
            if (x >= _x && x < _x + textWidth + separatorWidth / 2)
                return TimePart.Hour;
            _x += textWidth + separatorWidth / 2;
            isFirstPart = false;
        }
        textWidth = this.getInputTextWidth(TimePart.Minute);
        if (textWidth) {
            if (this._precision.totalSeconds < 3600 && x >= _x && x < _x + textWidth + separatorWidth / (isFirstPart ? 2 : 1))
                return TimePart.Minute;
            _x += textWidth + separatorWidth;
            isFirstPart = false;
        }
        textWidth = this.getInputTextWidth(TimePart.Second);
        if (textWidth && this._precision.totalSeconds < 60 && x >= _x && x < _x + textWidth)
            return TimePart.Second;
        return this.format.toString().match(/h/) ? 'start' : 'end';
    }
    //Calculate the input's text width
    //If argument is undefined, delivers back the calculated width of the whole input
    getInputTextWidth(timePart = undefined) {
        if (!this._input)
            return 0;
        let width = 0;
        if (timePart == undefined) {
            const availableTimeParts = this.getAvailableTimeParts(false);
            for (let i = 0; i < availableTimeParts.length; i++) {
                if (i)
                    width += this.getInputTextWidth(':');
                width += this.getInputTextWidth(availableTimeParts[i]);
            }
            if (this.format.match(/h/))
                width += this.getInputTextWidth('pm');
            return width;
        }
        let text;
        if (timePart == ':')
            text = this.separator;
        else if (timePart == 'am' || timePart == 'pm')
            text = ' ' + timePart;
        else {
            text = this.formatTime(timePart);
            if (!text)
                text = this.formatTime(timePart, Time.Zero);
        }
        const computedStyle = window.getComputedStyle(this._input, 'focus');
        const ghost = document.createElement('span');
        ghost.style.position = 'fixed';
        ghost.style.top = '-1000px';
        ghost.style.fontFamily = computedStyle.fontFamily;
        ghost.style.fontSize = computedStyle.fontSize;
        ghost.style.fontStyle = computedStyle.fontStyle;
        ghost.style.fontWeight = computedStyle.fontWeight;
        ghost.style.border = computedStyle.border;
        ghost.innerText = text;
        document.body.appendChild(ghost);
        width = ghost.offsetWidth;
        document.body.removeChild(ghost);
        return width;
    }
}
/**************************************************************************************
 * Web Component Life Cycle Hooks
 **************************************************************************************/
//Observed attributes (in small letters)
ClockTimepicker.observedAttributes = ['animationduration', 'autosize', 'disabled', 'format', 'maximum', 'minimum', 'precision', 'required', 'separator', 'useplussign', 'value', 'vibrate'];
/**************************************************************************************
 * class ClockCanvas
 **************************************************************************************/
class ClockCanvas {
    //Get the time part which is represented by the canvas
    get timePart() {
        return this._timePart;
    }
    //Get the canvas element
    get element() {
        return this._canvas;
    }
    constructor(clockTimepicker, canvasHolder, timePart) {
        this._isMouseButtonPressed = false;
        this._hoveredValue = undefined;
        //Mouse down listener
        this.downListener = () => {
            if (!this._clockTimepicker.input)
                return;
            this._isMouseButtonPressed = true;
            if (this._hoveredValue != undefined) {
                this._clockTimepicker.setTimePart(this.timePart, this._hoveredValue);
            }
            this.refresh();
        };
        //Mouse up listener
        //Select next time part or switch between positive and negative time when releasing the mouse button
        this.upListener = ($event) => {
            this._isMouseButtonPressed = false;
            if (this._hoveredValue != undefined)
                this._clockTimepicker.selectNextTimePart();
            else if (this._clockTimepicker.time) {
                const useSign = this._clockTimepicker.minimum.totalSeconds < 0 && this._clockTimepicker.maximum.totalSeconds > 0;
                if (useSign) {
                    const pageX = $event instanceof TouchEvent ? $event.touches[0].pageX : $event.pageX;
                    const pageY = $event instanceof TouchEvent ? $event.touches[0].pageY : $event.pageY;
                    const canvasPosition = this._canvas.getBoundingClientRect();
                    const x = pageX - canvasPosition.left /*- this._clockTimepicker.scrollContainer.scrollLeft*/;
                    const y = pageY - canvasPosition.top /*- this._clockTimepicker.scrollContainer.scrollTop*/;
                    if (x >= this._canvas.offsetWidth / 2 - this._canvas.offsetWidth / 12 && x <= this._canvas.offsetWidth / 2 + this._canvas.offsetWidth / 12 && y >= this._canvas.offsetWidth / 2 - this._canvas.offsetWidth / 12 && y <= this._canvas.offsetWidth / 2 + this._canvas.offsetWidth / 12) {
                        this._clockTimepicker.negateTime();
                        this.refresh();
                    }
                }
            }
        };
        //Mouse move listener
        //React on mouse movement over the canvas element
        // -> set _hoveredValue depending on the mouse position
        // -> set time part if mouse button is pressed
        this.moveListener = ($event) => {
            $event.preventDefault();
            const pageX = $event instanceof TouchEvent ? $event.touches[0].pageX : $event.pageX;
            const pageY = $event instanceof TouchEvent ? $event.touches[0].pageY : $event.pageY;
            const canvasPosition = this._canvas.getBoundingClientRect();
            let x = pageX - canvasPosition.left - document.documentElement.scrollLeft;
            let y = pageY - canvasPosition.top - document.documentElement.scrollTop;
            const selectorAngle = (360 * Math.atan((y - this._canvas.offsetWidth / 2) / (x - this._canvas.offsetWidth / 2)) / (2 * Math.PI)) + 90;
            const selectorLength = Math.sqrt(Math.pow(Math.abs(x - this._canvas.offsetWidth / 2), 2) + Math.pow(Math.abs(y - this._canvas.offsetWidth / 2), 2));
            if (selectorLength > this._canvas.offsetWidth / 2)
                this._hoveredValue = undefined;
            //Outer circle
            else if (selectorLength >= this._canvas.offsetWidth / 2 - 2 * this._canvas.offsetWidth / 13) {
                let value = Math.round(selectorAngle / (this.timePart == TimePart.Hour ? 30 : 6));
                if (x < this._canvas.offsetWidth / 2)
                    value += this.timePart == TimePart.Hour ? 6 : 30;
                let precision = Math.ceil(this._clockTimepicker.precision.totalSeconds / (this.timePart == TimePart.Hour ? 3600 : (this.timePart == TimePart.Minute ? 60 : 1)));
                value = precision * Math.round(value / precision);
                if (this.timePart == TimePart.Hour && value == 12)
                    value = 0;
                if (this.timePart != TimePart.Hour && value == 60)
                    value = 0;
                this._hoveredValue = this.isDisabledValue(value) ? undefined : value;
            }
            //Inner circle
            else if (this.timePart == TimePart.Hour && selectorLength >= this._canvas.offsetWidth / 2 - 4 * this._canvas.offsetWidth / 13) {
                let hour = Math.round(selectorAngle / 30) + 12;
                let precision = Math.ceil(this._clockTimepicker.precision.totalSeconds / 3600);
                hour = precision * Math.round(hour / precision);
                if (x < this._canvas.offsetWidth / 2) {
                    hour += 6;
                    if (hour == 24)
                        hour = 12;
                }
                this._hoveredValue = this.isDisabledValue(hour) ? undefined : hour;
            }
            else
                this._hoveredValue = undefined;
            if (this._isMouseButtonPressed && this._hoveredValue != undefined) {
                this._clockTimepicker.setTimePart(this.timePart, this._hoveredValue);
            }
            this.refresh();
        };
        this._clockTimepicker = clockTimepicker;
        this._timePart = timePart;
        //Create canvas
        this._canvas = document.createElement('canvas');
        //Add canvas to the popup
        canvasHolder.appendChild(this._canvas);
        //Set width and height attributes of canvas element
        this._canvas.setAttribute('width', this._canvas.offsetWidth.toString());
        this._canvas.setAttribute('height', this._canvas.offsetHeight.toString());
        this.refresh();
        //Canvas events
        this._canvas.addEventListener('mousedown', this.downListener);
        this._canvas.addEventListener('touchstart', this.downListener, { passive: false });
        this._canvas.addEventListener('mouseup', this.upListener);
        this._canvas.addEventListener('touchend', this.upListener);
        this._canvas.addEventListener('mousemove', this.moveListener, { passive: false });
        this._canvas.addEventListener('touchmove', this.moveListener, { passive: false });
        //Canvas mouse leave event
        this._canvas.addEventListener('mouseleave', () => {
            this._hoveredValue = undefined;
            this.refresh();
        });
    }
    //Check if a value on the time clock is available due to limits of minimum and maximum values
    isDisabledValue(value) {
        var _a, _b, _c;
        let totalSeconds;
        switch (this.timePart) {
            case TimePart.Hour:
                totalSeconds = (((_a = this._clockTimepicker.time) === null || _a === void 0 ? void 0 : _a.isNegative) ? -1 : 1) * value * 3600;
                break;
            case TimePart.Minute:
                totalSeconds = (((_b = this._clockTimepicker.time) === null || _b === void 0 ? void 0 : _b.isNegative) ? -1 : 1) * ((this._clockTimepicker.time ? this._clockTimepicker.time.hour : 0) * 3600 + value * 60);
                break;
            case TimePart.Second:
                totalSeconds = (((_c = this._clockTimepicker.time) === null || _c === void 0 ? void 0 : _c.isNegative) ? -1 : 1) * ((this._clockTimepicker.time ? this._clockTimepicker.time.hour : 0) * 3600 + (this._clockTimepicker.time ? this._clockTimepicker.time.minute : 0) * 60 + value);
        }
        return !(totalSeconds >= this._clockTimepicker.minimum.totalSeconds && totalSeconds <= this._clockTimepicker.maximum.totalSeconds);
    }
    //Paint clock canvas
    refresh() {
        var _a;
        const ctx = this._canvas.getContext('2d');
        if (!ctx)
            return;
        //Get styles from CSS variables
        const computedStyle = window.getComputedStyle(this._clockTimepicker);
        let accentColor = computedStyle.getPropertyValue('--clock-timepicker-accent-color');
        if (!accentColor)
            accentColor = '#0797ff';
        let font = computedStyle.getPropertyValue('--clock-timepicker-font-family');
        if (!font)
            font = 'Arial';
        let faceColor = computedStyle.getPropertyValue('--clock-timepicker-face-color');
        if (!faceColor)
            faceColor = '#eeeeee';
        let faceHoverColor = computedStyle.getPropertyValue('--clock-timepicker-face-hover-color');
        if (!faceHoverColor)
            faceHoverColor = '#dddddd';
        let faceSelectionColor = computedStyle.getPropertyValue('--clock-timepicker-face-selection-color');
        if (!faceSelectionColor)
            faceSelectionColor = accentColor;
        let outerNumbersColor = computedStyle.getPropertyValue('--clock-timepicker-outer-numbers-color');
        if (!outerNumbersColor)
            outerNumbersColor = '#000000';
        let innerNumbersColor = computedStyle.getPropertyValue('--clock-timepicker-inner-numbers-color');
        if (!innerNumbersColor)
            innerNumbersColor = '#888888';
        let disabledNumbersColor = computedStyle.getPropertyValue('--clock-timepicker-disabled-numbers-color');
        if (!disabledNumbersColor)
            disabledNumbersColor = '#dddddd';
        let precision = Math.ceil(this._clockTimepicker.precision.totalSeconds / (this.timePart == TimePart.Hour ? 3600 : (this.timePart == TimePart.Minute ? 60 : 1)));
        //Clear canvas
        ctx.clearRect(0, 0, this._canvas.offsetWidth, this._canvas.offsetWidth);
        //Draw clock face
        ctx.beginPath();
        ctx.arc(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = faceColor;
        ctx.fill();
        ctx.closePath();
        const clockOuterCircleFontSize = this._canvas.offsetWidth / 13;
        const clockInnerCircleFontSize = this._canvas.offsetWidth / 15;
        const clockOuterRadius = this._canvas.offsetWidth / 2 - (clockOuterCircleFontSize + 2);
        const clockInnerRadius = clockOuterRadius - clockInnerCircleFontSize * 2.2;
        //Draw hovered circle
        if (this._hoveredValue != undefined && !this.isDisabledValue(this._hoveredValue)) {
            const angle = Math.PI / 30 * (this._hoveredValue * (this.timePart == TimePart.Hour ? 5 : 1) - 15);
            const radius = this.timePart == TimePart.Hour && this._hoveredValue >= 12 ? clockInnerRadius : clockOuterRadius;
            ctx.beginPath();
            ctx.fillStyle = faceHoverColor;
            const x = this._canvas.offsetWidth / 2 + Math.cos(angle) * radius;
            const y = this._canvas.offsetWidth / 2 + Math.sin(angle) * radius;
            ctx.arc(x, y, this.timePart == TimePart.Hour && this._hoveredValue >= 12 ? clockInnerCircleFontSize : clockOuterCircleFontSize, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
        //Draw selected circle
        if (this._clockTimepicker.time) {
            const value = this._clockTimepicker.time.getTimePart(this.timePart);
            if (value != undefined) {
                const angle = Math.PI / 30 * (value * (this.timePart == TimePart.Hour ? 5 : 1) - 15);
                const radius = this.timePart == TimePart.Hour && value >= 12 ? clockInnerRadius : clockOuterRadius;
                ctx.beginPath();
                ctx.fillStyle = faceSelectionColor;
                const x = this._canvas.offsetWidth / 2 + Math.cos(angle) * radius;
                const y = this._canvas.offsetWidth / 2 + Math.sin(angle) * radius;
                ctx.arc(x, y, this.timePart == TimePart.Hour && value >= 12 ? clockInnerCircleFontSize : clockOuterCircleFontSize, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        }
        //Draw circle numbers
        for (let i = 0; i < (this.timePart == TimePart.Hour ? 120 : 60); i++) {
            const value = this.timePart == TimePart.Hour ? i / 5 : i;
            if (this._clockTimepicker.time && this._clockTimepicker.time.getTimePart(this.timePart) == value)
                continue;
            if (i % 5 == 0 && i % precision == 0) {
                let s;
                if (this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/) && value >= 12) {
                    s = (value - 12).toString().padStart(this.timePart == TimePart.Hour ? 1 : 2, '0');
                    if (s == '0' && this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/))
                        s = '12\npm';
                }
                else {
                    s = value.toString().padStart(this.timePart == TimePart.Hour ? 1 : 2, '0');
                    if (s == '0' && this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/))
                        s = '12\nam';
                }
                const angle = Math.PI / 30 * (i - 15);
                const radius = i < 60 ? clockOuterRadius : clockInnerRadius;
                const fontSize = i < 60 ? clockOuterCircleFontSize : clockInnerCircleFontSize;
                ctx.fillStyle = this.isDisabledValue(value) ? disabledNumbersColor : (i < 60 ? outerNumbersColor : innerNumbersColor);
                const x = this._canvas.offsetWidth / 2 + Math.cos(angle) * radius;
                const y = this._canvas.offsetWidth / 2 + Math.sin(angle) * radius;
                this.writeText(ctx, s, x, y, font, fontSize);
            }
        }
        //Draw line from center to selected value
        if (this._clockTimepicker.time) {
            const value = this._clockTimepicker.time.getTimePart(this.timePart);
            if (value != undefined) {
                const angle = Math.PI / 30 * (value * (this.timePart == TimePart.Hour ? 5 : 1) - 15);
                const radius = this.timePart == TimePart.Hour && value >= 12 ? clockInnerRadius : clockOuterRadius;
                const x = this._canvas.offsetWidth / 2 + Math.cos(angle) * radius;
                const y = this._canvas.offsetWidth / 2 + Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.moveTo(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2);
                ctx.lineTo(x, y);
                ctx.lineWidth = 1;
                ctx.strokeStyle = faceSelectionColor;
                ctx.stroke();
                ctx.closePath();
            }
        }
        //Draw selected number
        if (this._clockTimepicker.time) {
            const value = this._clockTimepicker.time.getTimePart(this.timePart);
            if (value != undefined) {
                const angle = Math.PI / 30 * (value * (this.timePart == TimePart.Hour ? 5 : 1) - 15);
                const radius = this.timePart == TimePart.Hour && value >= 12 ? clockInnerRadius : clockOuterRadius;
                const x = this._canvas.offsetWidth / 2 + Math.cos(angle) * radius;
                const y = this._canvas.offsetWidth / 2 + Math.sin(angle) * radius;
                const fontSize = value < 12 || this.timePart != TimePart.Hour ? clockOuterCircleFontSize : clockInnerCircleFontSize;
                ctx.font = fontSize + 'px ' + font;
                ctx.fillStyle = '#fff'; //TODO: Calculate if white or black color should be used
                if (value % precision == 0) {
                    let s;
                    if (this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/) && value >= 12) {
                        s = (value - 12).toString().padStart(this.timePart == TimePart.Hour ? 1 : 2, '0');
                        if (s == '0' && this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/))
                            s = '12\npm';
                    }
                    else {
                        s = value.toString().padStart(this.timePart == TimePart.Hour ? 1 : 2, '0');
                        if (s == '0' && this.timePart == TimePart.Hour && this._clockTimepicker.format.toString().match(/h/))
                            s = '12\nam';
                    }
                    this.writeText(ctx, s, x, y, font, fontSize);
                }
                else {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
        //Draw sign button (+ or -) in the center
        const useSign = this._clockTimepicker.minimum.totalSeconds < 0 && this._clockTimepicker.maximum.totalSeconds > 0;
        if (!useSign) {
            ctx.beginPath();
            ctx.arc(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 60, 0, 2 * Math.PI, false);
            ctx.fillStyle = faceSelectionColor;
            ctx.fill();
            ctx.closePath();
        }
        else {
            ctx.beginPath();
            ctx.arc(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 12, 0, 2 * Math.PI, false);
            ctx.fillStyle = faceSelectionColor;
            ctx.fill();
            ctx.closePath();
            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(this._canvas.offsetWidth / 2 - this._canvas.offsetWidth / 30, this._canvas.offsetWidth / 2);
            ctx.lineTo(this._canvas.offsetWidth / 2 + this._canvas.offsetWidth / 30, this._canvas.offsetWidth / 2);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
            if (!((_a = this._clockTimepicker.time) === null || _a === void 0 ? void 0 : _a.isNegative)) {
                ctx.beginPath();
                ctx.moveTo(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2 - this._canvas.offsetWidth / 30);
                ctx.lineTo(this._canvas.offsetWidth / 2, this._canvas.offsetWidth / 2 + this._canvas.offsetWidth / 30);
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    //Write text to canvas (used by refresh method)
    writeText(ctx, text, x, y, font, fontSize) {
        const splits = text.split('\n');
        ctx.font = fontSize + 'px ' + font;
        if (splits.length == 1) {
            ctx.fillText(text, x - ctx.measureText(text).width / 2, y + fontSize / 3);
            return;
        }
        let _y = y;
        for (let split of splits) {
            ctx.fillText(split, x - ctx.measureText(split).width / 2, _y);
            _y += 9;
            ctx.font = '9px ' + font;
        }
    }
}
//Register web component "clock-timepicker"
customElements.get('clock-timepicker') || customElements.define('clock-timepicker', ClockTimepicker);
