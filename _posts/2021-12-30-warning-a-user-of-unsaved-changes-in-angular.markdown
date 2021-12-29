---
layout: post
title: 'Warning a user of unsaved changes, in a form, in angular'
date: 2021-12-30 00:00:00 +0100
---

Recently I had to implement a feature to warn our users when leaving or refreshing a page when they have unsaved changes.
While seemingly simple, there is some nuance I thought was worth explaining.
Also some of the solutions I encountered didn't cover all my use cases, so I hope this can serve as a reference for developers in a similar situation.

The use cases I wanted to solve were as follows:
- This behavior should be easy to implement across forms
- This behavior should work for both empty forms and pre-filled forms (like an edit page)
- This behavior should work with multiple formcontrols on a single page
- A warning should be triggered on a reload and a navigation event

My implementation consists of 3 pieces, a service that tracks the state of formcontrols, a directive that is used to register a new form and a guard that gets triggered on navigation event.
Al code examples are abbreviated to be more legible, a working example can be found [here](https://github.com/mfstapert/playground/blob/master/node/angular-form-unload/src/app/form/has-form-changed.directive.ts)

## HasFormChangedService

This service tracks; the state a formcontrol starts with and the state which the formcontrol currently has.
It does this through a simple interface:

```typescript
interface FormStates {
	initialState: unknown;
	currentState: unknown;
}

class HasFormChangedService {

	private formStates: Record<string, FormStates> = {};

}
```

The key of the record is a unique identifier, I chose to use a uuid for this, which gets created when a form is first registered.
There are also functions to update the current form state and to set it to a new initial state.
The register function gets called later on through our directive, the directive will hold the id and handles updates.

```typescript
public registerNewForm(state?: unknown): string {
	const id = uuid();
	this.formStates[id] = { initialState: state, currentState: state };
	return id;
}

public setCurrentFormState(id: string, currentState?: unknown): void {
	if (this.isFormIdNotPresent(id)) {
		throw Error(HasFormChangedService.ERROR_MSG);
	}
	this.formStates[id].currentState = currentState;
}

public setFormState(id: string, state?: unknown): void {
	if (this.isFormIdNotPresent(id)) {
		throw Error(HasFormChangedService.ERROR_MSG);
	}
	this.formStates[id] = { initialState: state, currentState: state };
}
```

With this logic you can check whether any form value has changed in the service by deep comparing the initial state with the current state.
You can use this function later on to show the user a warning.
I use the `ramda` package for deep comparing.

```typescript
public haveFormsBeenChanged(): boolean {
	return Object.values(this.formStates).some(
		(state) => !equals(state.initialState, state.currentState)
	);
}
```

The service also has functions to remove individual forms, or all forms from the service.
This is used when individual formcontrols get removed or when you don't want to track a form anymore, like when submiting.

## HasFormChangedDirective

This directive is the key to easily implement this behavior across multiple forms. By adding this directive on a page and passing it a formcontrol, it registers that control to our service, when the page gets destroyed the directive also unregisters the control:

```typescript
@Directive({
	selector: '[hasFormChanged]',
})
export class HasFormChangedDirective implements OnInit, OnDestroy {
	@Input() public hasFormChanged!: AbstractControl;
	private formId = this.hasFormChangedService.registerNewForm();
	private subscription?: Subscription;

	constructor(private hasFormChangedService: HasFormChangedService) {}

	public ngOnInit(): void {
		this.hasFormChangedService.setFormState(
			this.formId,
			this.hasFormChanged.value
		);

		this.subscription = this.hasFormChanged.valueChanges
			.pipe(debounceTime(250))
			.subscribe((value) => {
					if (this.hasFormChanged.dirty) {
						this.hasFormChangedService.setCurrentFormState(this.formId, value);
					return;
				}
				// If we get valueChanges while the form is not dirty it usually means we are programmatically setting
				// the control, so we need to reset its state in order to check for changes from the user
				this.hasFormChangedService.setFormState(this.formId, value);
			});
	}

	public ngOnDestroy() {
		this.hasFormChangedService.removeForm(this.formId);
		this.subscription?.unsubscribe();
	}
```

There is a lot going on here, so let's unpack this :)
This directive gets used on a page like this `[hasFormChanged]='formcontrol'`, this causes the directive to be created, before the onInit we get a formId from our service.
I had to name the formControl input the same as the name of the directive or the directive wouldn't be found, I don't know why this is.
We use this id to set the formState in our `OnInit` function, we can't do it earlier because formdata sometimes isn't loaded.
Next we subscribe to valueChanges from our formControl, we only update the current state when the control is dirty.
We had some logic that updates formControls programmatically, so this works in our situation, but it might not work in your situation.

```typescript
@HostListener('window:beforeunload', ['$event'])
public onBeforeUnload(event: BeforeUnloadEvent): void {
	if (this.hasFormChangedService.haveFormsBeenChanged()) {
		event.preventDefault();
		event.returnValue = false;
	}
}

@HostListener('submit')
public onSubmit(): void {
	this.hasFormChangedService.clearForms();
}
```

In our application this feature only had to work for a specific module, you should probably add these functions in a more central point.
The HostListener for `onBeforeUnload` is the event that gets fired when a user triggers a reload, by checking wheter `haveFormsBeenChanged` and executing the logic a dialog gets displayed to the user.
The HostListener for `onSubmit` is to clear the forms of our service when the user submits a form, submitting a form usually triggers a redirect so we don't want to display a message in that case.

## HasFormChangedGuard

This is the guard that gets triggered on route changes, it's the same principle as the beforeunload logic, only we use a confirmational here.
We can however display custom messages in a confirmational, so we use one from our environment.

```typescript
export class HasFormChangedGuard implements CanDeactivate<unknown> {

	constructor(private formChangesService: HasFormChangedService) {}

	public canDeactivate(): boolean {
		return this.formChangesService.haveFormsBeenChanged()
			? confirm(environment.hasFormChangedMessage)
			: true;
	}
}
```

## CancelFormDirective

We have a seperate directive for buttons that explicitly cancel a form, which shouldn't display any message.

```typescript
export class CancelFormDirective {

	constructor(private hasFormChangedService: HasFormChangedService) {}

	@HostListener('click', ['$event'])
	public onClick(): void {
		this.hasFormChangedService.clearForms();
	}
}
```

## Closing thoughts

What I like about this solution is that it's easy to implement across multiple forms and works with forms that have multiple formgroups across multiple components.
I would like to have a solution for displaying the same type of warning to the user for both reloading as navigating.
Also I'm pretty sure the HostListeners in the Directive can be moved to App.Component or a similair central point.

Again source can be found [here](https://github.com/mfstapert/playground/tree/master/node/angular-form-unload)
