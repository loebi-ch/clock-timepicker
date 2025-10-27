clock-timepicker 1.0.5
======================

<img src="https://plugins.slyweb.ch/clock-timepicker/screenshot.png" alt="clock-timepicker screenshot" />

The *clock-timepicker* is a simple and lightweight _Web Component_ that allows you to pick a time or duration from a clock face. It is easy to use and fully customizable.  

[See a demo and examples here](https://plugins.slyweb.ch/clock-timepicker)


Browser support
---------------

All major browsers are supported.


Device support
--------------

Both desktop and mobile devices are supported.  
On mobile devices, the time picker will be displayed as a popup in a bigger size so touch input is easier.


No dependencies
---------------

The *clock-timepicker* has no dependencies at all. It is pure javascript (ES6 / ECMAScript 2015).  
You can use it on any platform, on any OS, with any framework.


TypeScript support
------------------

The *clock-timepicker* publishes its type definitions so you can use it in TypeScript with strict types and IDE auto completion.


Styling
-------

The *clock-timepicker* popup can be individually styled with CSS variables.  
With the CSS variable `--clock-timepicker-accent-color` you can give your timpicker quickly your own accent,  
but there are a lot more CSS variables that you can use to adjust the timepicker to your own style.

```css
clock-timepicker {
	--clock-timepicker-accent-color: purple;
}
```

The *clock-timepicker* uses an `<input>` element which is not put into shadow DOM to use your default styling.  
All other HTML elements and CSS styles (that are responsible for the popup) are hold in the shadow DOM for not interfering with your own styles or any other libraries.


Keyboard support
----------------

The *clock-timepicker* allows you to enter time/duration easily with the keyboard, navigate between time parts and escape to restore the previous value.


Installation
------------

The *clock-timepicker* can be easily installed from [NPM](https://www.npmjs.com/package/clock-timepicker):

```
npm install clock-timepicker
```

and then be imported in your JavaScript / TypeScript code:

```javascript
import 'clock-timepicker';
```  
  
You can also [download it](dist/clock-timepicker.js) and directly reference it in your HTML file:  

```html
<script type="module" src="clock-timepicker.js"></script>
```


Usage
-----

Just insert the following code into your HTML:

```html
<clock-timepicker><clock-timepicker>
```
  
To customize the timepicker, you can set the options with HTML attributes.

```html
<clock-timepicker required value="08:00" precision="00:05"><clock-timepicker>
```
  
If the timepicker is not showing up, read how to enable Web Components in your framework.  
Angular i.e. ignores custom elements (named with dashes). You have to use `CUSTOM_ELEMENTS_SCHEMA`.

```javascript
@Component({
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

In certain frameworks (as Angular or React) it's sometimes necessary to use your own `<input>` element, which you can i.e. bind to a form or a reactive property.  
In that case enclose your `<input>` in the `<clock-timepicker>` element:

```html
<clock-timepicker>
	<input [(ngModel)]="value" />
<clock-timepicker>
```

In Angular you also have the possibility to bind the `ngModel` directly to the `<clock-timepicker>` element, but you have to specify the `ngDefaultControl` value accessor:

```html
<clock-timepicker ngDefaultControl [(ngModel)]="value"><clock-timepicker>
```


Options
-------

You can set the options with attributes on the `<clock-timepicker>` element or set the properties on the ClockTimepicker object directly.  
  
The following options are available:  
  
- **animationDuration**  
The animation duration in milliseconds for switching between time parts.  
*default: 300*

- **autosize**  
Set to true if the input should be automatically adjusted in size to fit its content.  
*default: false*

- **cancelText**  
The text of the cancel button. (only used in mobile version)  
*default: 'Cancel'*

- **disabled**  
Set to true to disable the timepicker.  
*default: false*

- **format**  
The format used for the time also defines the time parts to be shown.  
HH, H, hh or h is used for the hours.  
mm or m is used for the minutes.  
ss or s is used for the seconds.  
Possible formats: 'HH:mm' (24-hours, always two digits), 'H:mm' (24-hours), 'hh:mm' (12-hours, always two digits), 'h:mm' (12-hours), 'HH:mm:ss', 'H:mm:ss', 'hh:mm:ss', 'h:mm:ss', 'mm:ss', 'm:ss', 'HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's'  
*default: 'HH:mm'*

- **maximum**  
The maximum time/duration that can be selected.  
*default: '23:59:59'*

- **minimum**  
The minimum time/duration that can be selected.  
*default: '00:00:00'*

- **okText**  
The text of the ok button. (only used in mobile version)  
*default: 'OK'*

- **precision**  
The precision lets you define the granularity of timepicker.  
*default: '00:00:01'*

- **required**  
If set to true the input always has a value.  
*default: false*

- **separator**  
The separator used to separate the time parts.  
*default: ':'*

- **usePlusSign**  
If you use the clock-timepicker as a duration picker with negative durations, it can make sense to show a plus sign for positive durations.  
*default: false*

- **value**  
Sets the initial time. If required is set to true, the value will be automatically set to 00:00:00 if no value is specified.  
*default: undefined*

- **vibrate**  
If turned on the timepicker issues haptic feedback when interacting with it.  
*default: true*


Events
------

- **blur**  
Fires when the timepicker looses the focus.

- **change**  
Fires when the popup is closed and the value has changed.

- **focus**  
Fires when the timepicker gains the focus.

- **input**  
Fires on each change as long the popup is opened.


CSS Variables
-------------

- **--clock-timepicker-accent-color**  
The accent color defines the main color of the timepicker.  
This color is also a fallback for the header background, face selection color and `--clock-timepicker-button-color` if those are not specified.  
*default: #0797ff*

- **--clock-timepicker-cursor**  
The mouse's cursor style (desktop version).  
*default: default*

- **--clock-timepicker-button-background**  
The background color of the buttons.  
*default: none*

- **--clock-timepicker-button-border**  
The border of the buttons.  
*default: none*

- **--clock-timepicker-button-color**  
The text color of the buttons.  
If not specified, uses the `--clock-timepicker-accent-color` as a fallback.  
*default: inherit*

- **--clock-timepicker-button-cancel-color**  
The text color of the cancel button.  
If not specified, uses the `--clock-timepicker-button-color` as a fallback.  
*default: inherit*

- **--clock-timepicker-button-font-size**  
The font color of the buttons.  
*default: 20px*

- **--clock-timepicker-button-gap**  
The gap between the buttons.  
*default: 30px*

- **--clock-timepicker-button-ok-color**  
The text color of the OK button.  
If not specified, uses the `--clock-timepicker-button-color` as a fallback.  
*default: inherit*

- **--clock-timepicker-button-outline**  
The outline of the buttons.  
*default: none*

- **--clock-timepicker-button-padding**  
The padding of the buttons.  
*default: none*

- **--clock-timepicker-button-shadow**  
The shadow of the buttons.  
*default: none*

- **--clock-timepicker-face-color**  
The color of the clock face.  
*default: #eeeeee*

- **--clock-timepicker-face-hover-color**  
The circle color when hovering over a number in the clock face.  
*default: #dddddd*

- **--clock-timepicker-face-selection-color**  
The circle color of a selected number in the clock face.  
If not specified, uses the `--clock-timepicker-accent-color` as a fallback.  
*default: inherit*

- **--clock-timepicker-font-family**  
The font family of the timepicker.  
*default: Arial*

- **--clock-timepicker-header-background**  
The background color of the header. (mobile version)  
If not specified, uses the `--clock-timepicker-accent-color` as a fallback.  
*default: inherit*

- **--clock-timepicker-header-font-color**  
The font color of the header. (mobile version)  
*default: #ffffff*

- **--clock-timepicker-header-font-size**  
The font size of the header. (mobile version)  
*default: 40px*

- **--clock-timepicker-header-selection-background**  
The background of the time part selected in the header. (mobile version)  
*default: rgba(255, 255, 255, 0.6)*

- **--clock-timepicker-inner-numbers-color**  
The color of the numbers in the clock face's inner circle.  
*default: #888888*

- **--clock-timepicker-outer-numbers-color**  
The color of the numbers in the clock face's outer circle.  
*default: #000000*

- **--clock-timepicker-popup-background**  
The background color of the popup.  
*default: #ffffff*

- **--clock-timepicker-popup-border**  
The border of the popup.  
*default: none*

- **--clock-timepicker-popup-border-radius**  
The border radius of the popup.  
*default: 5px*

- **--clock-timepicker-popup-shadow**  
The shadow of the popup.  
*default: rgba(0, 0, 0, 0.14) 0px 4px 20px 0px*

- **--clock-timepicker-popup-size**  
The size of the popup. (desktop version)  
*default: 200px*


Keyboard inputs
---------------

- **Enter**  
Closes the popup and keeps the selected value.

- **Escape**  
Closes the popup and restores the previous value.

- **ArrowLeft**  
Navigates to the previous time part.

- **ArrowRight**  
Navigates to the next time part.

- **ArrowUp**  
Increments the current selected time part.

- **ArrowDown**  
Decrements the current selected time part.

- **Backspace / Delete**  
Sets the selected time part to zero or removes time completely if time is 00:00 and option required is not set.

- **[0-9]**  
You can enter the digits directly by keyboard.  
The timepicker automatically jumps to the next time part or closes the popup when the maximum value is reached.

- **separator**  
Navigates to the next time part or closes the popup if last time part is reached.

- **+**  
Sets the time to positive (only supported if minimum or maximum is set to a negative value).

- **-**  
Sets the time to negative (only supported if minimum or maximum is set to a negative value).


Help
----

Submit a [GitHub Issues request](https://github.com/loebi-ch/clock-timepicker/issues/new).


Changelog
---------

Version 1.0

*   [jquery-clock-timepicker](https://github.com/loebi-ch/jquery-clock-timepicker) completely refactored to work without jQuery as a modern standalone ES6 Web Component.


This software is made available under the open source MIT license.  
**clock-timepicker** © 2025 [Andreas Marc Loeber](https://github.com/loebi-ch)