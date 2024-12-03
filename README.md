REPRODUCER
==========

[Bug]: Canceling a drag operation does not fire `dragleave` event on drop target.

### Expected Behavior
Canceling a drag operation should behave like canceling a drag operation in the browser, i.e., trigger a `dragleave` event on the drop target.

### Actual Behavior
Canceling a drag operation in Playwright does not trigger a `dragleave` event on the drop target. Only the `dragend` event is fired on the element where the drag operation was started.

### Steps to Reproduce

1. Run `npm install`
2. Run `npm run test`
3. See failed test: `reproducer.spec.ts › should receive 'dragleave' event when canceling drag operation`
