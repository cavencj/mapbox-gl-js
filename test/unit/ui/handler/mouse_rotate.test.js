import {test} from '../../../util/test.js';
import {extend} from '../../../../src/util/util.js';
import window from '../../../../src/util/window.js';
import Map from '../../../../src/ui/map.js';
import * as DOM from '../../../../src/util/dom.js';
import simulate from '../../../util/simulate_interaction.js';
import browser from '../../../../src/util/browser.js';

function createMap(t, options) {
    t.stub(Map.prototype, '_detectMissingCSS');
    return new Map(extend({container: DOM.create('div', '', window.document.body), useWebGL2: false, testMode: true}, options));
}

test('MouseRotateHandler#isActive', (t) => {
    const map = createMap(t);
    const mouseRotate = map.handlers._handlersById.mouseRotate;

    // Prevent inertial rotation.
    t.stub(browser, 'now').returns(0);
    t.equal(mouseRotate.isActive(), false);

    simulate.mousedown(map.getCanvas(), {buttons: 2, button: 2});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), false);

    simulate.mousemove(map.getCanvas(), {buttons: 2, clientX: 10, clientY: 10});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), true);

    simulate.mouseup(map.getCanvas(),   {buttons: 0, button: 2});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), false);

    map.remove();
    t.end();
});

test('MouseRotateHandler#isActive #4622 regression test', (t) => {
    const map = createMap(t);
    const mouseRotate = map.handlers._handlersById.mouseRotate;

    // Prevent inertial rotation.
    simulate.mousedown(map.getCanvas(), {buttons: 2, button: 2});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), false);

    simulate.mousemove(map.getCanvas(), {buttons: 2, clientX: 10, clientY: 10});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), true);

    // Some browsers don't fire mouseup when it happens outside the window.
    // Make the handler in active when it encounters a mousemove without the button pressed.

    simulate.mousemove(map.getCanvas(), {buttons: 0, clientX: 10, clientY: 10});
    map._renderTaskQueue.run();
    t.equal(mouseRotate.isActive(), false);

    map.remove();
    t.end();
});
