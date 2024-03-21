---
layout: post
title: '[angular] Fix for custom angular formcontrol retaining input value after form reset'
date: 2024-03-13 00:00:00 +0100
---

I came across a behavior in Angular where a custom formcontrol (using `ControlValueAccessor`) retained its value in the UI after being reset.
Credit to this [stackoverflow question](https://stackoverflow.com/questions/76389471/angular-retaining-input-value-after-form-reset), which helped me fix this issue.
My post gives a concise description, fix and explanation for this behavior.

# The behavior

```typescript
@Component({
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputRetainsComponent),
        multi: true,
    }],
    template: `
    <input
      [value]="value"
      (input)="onChange($event)"
    />`,
})
export class InputRetainsComponent implements ControlValueAccessor
```
A component that implements `ControlValueAccessor` implements a couple of methods to interact with the Angular forms API.

```typescript
onChange(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;
    this.changed(value);
}
```

A `changed` method is registered as callback in this component.
Whenever the value in the ui changes the method is called and the form is notified through the callback.

```typescript
writeValue(value: string): void {
    this.value = value;
}
```

On the other side you have a `writeValue` function that the form uses to write the value to the custom formcontrol.
Now if you write anything in your input in the ui and call `setValue`, the ui will update.
However, when you call `.reset()` on the form the input will retain its value.

# The fix

The solution is to write the value directly to the view, you don't need to keep an internal `value`;

```typescript

    template: `
        <input #inputRef />`,
...
  writeValue(value: string): void {
    const ref = this.inputRef();
    ref && (ref.nativeElement.value = value);
  }
```

# The explanation

An answer is actually in the comments of the `ControlValueAccessor` interface.

```typescript
@usageNotes
### Write a value to the element

The following example writes a value to the native DOM element.

```ts
writeValue(value: any): void {
  this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
}
```

Though it may appear strange at first, writing directly to the DOM is actually encouraged.
Maybe custom form controls are excluded from normal change detection

It's still strange behavior though, the first solution only had an issue when the reset function was called.
There is a mention in the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value) that the value attribute is used for initial value.
But when using normal input binding, the value is also mirrored...

If you want to look at full code examples you can find them [here](https://github.com/MFStapert/the_bin/tree/master/node/angular-control-retains-value).
