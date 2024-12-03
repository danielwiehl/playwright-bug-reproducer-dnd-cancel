import {expect, Page, test} from '@playwright/test';

test(`should receive 'dragleave' event when canceling drag operation`, async ({page}) => {
  // Initialize test page.
  await setPageContent(page);
  await setPageScript(page);

  // Capture console logs.
  const logs = new Array<string>();
  page.on('console', log => logs.push(log.text()));

  // Get bounding box of drag source and drop target.
  const dragSourceBounds = await page.locator('.drag-source').boundingBox();
  const dropTargetBounds = await page.locator('.drop-target').boundingBox();

  // 1. Start drag operation.
  await page.mouse.move(dragSourceBounds.x + dragSourceBounds.width / 2, dragSourceBounds.y + dragSourceBounds.height / 2, {steps: 1});
  await page.mouse.down();

  // 2. Drag over drop target.
  await page.mouse.move(dropTargetBounds.x + dropTargetBounds.width / 2, dropTargetBounds.y + dropTargetBounds.height / 2, {steps: 100});

  // Assert log entries for drag events.
  await expect.poll(() => logs).toContain('[dragSource] dragstart'); // success
  await expect.poll(() => logs).toContain('[dropTarget] dragenter'); // success
  await expect.poll(() => logs).toContain('[dropTarget] dragover'); // success

  // 3. Cancel drag operation.
  await page.keyboard.press('Escape');

  // Assert log entries for cancelation.
  await expect.poll(() => logs).toContain('[dropTarget] dragleave'); // FAIL
  await expect.poll(() => logs).toContain('[dragSource] dragend'); // success
});

async function setPageContent(page: Page): Promise<void> {
  await page.setContent(`
    <div class="drag-source" draggable="true">
      Drag Me
    </div>
    <div class="drop-target">
      Drop Zone
    </div>

    <style>
      .drag-source {
        display: grid;
        place-content: center;
        width: 100px;
        height: 100px;
        border: 1px solid black;
      }
      
      .drop-target {
        display: grid;
        place-content: center;
        height: 300px;
        border: 1px dashed gray;
        margin-top: 50px;
      }
    </style>`,
  );
}

async function setPageScript(page: Page): Promise<void> {
  await page.evaluate(() => {
    const dragSource = document.querySelector('.drag-source');
    const dropTarget = document.querySelector('.drop-target');

    dragSource.addEventListener('dragstart', () => {
      console.log('[dragSource] dragstart');
    });
    dragSource.addEventListener('dragend', () => {
      console.log('[dragSource] dragend');
    });
    dropTarget.addEventListener('dragenter', () => {
      console.log('[dropTarget] dragenter');
    });
    dropTarget.addEventListener('dragleave', () => {
      console.log('[dropTarget] dragleave');
    });
    dropTarget.addEventListener('dragover', event => {
      console.log('[dropTarget] dragover');
      event.preventDefault();
    });
    dropTarget.addEventListener('drop', () => {
      console.log('[dropTarget] drop');
    });
  });
}
