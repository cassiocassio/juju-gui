/* Copyright (C) 2017 Canonical Ltd. */
'use strict';


const Keysim = require('keysim');
const hotkeys = require('./hotkeys');
const utils = require('../../test/utils');

describe('hotkeys', function() {
  let container, context, listener;
  const keyboard = Keysim.Keyboard.US_ENGLISH;

  beforeEach(() => {
    context = {
      _clearSettingsModal: sinon.stub(),
      _clearShortcutsModal: sinon.stub(),
      _displaySettingsModal: sinon.stub(),
      _displayShortcutsModal: sinon.stub()
    };
    listener = hotkeys.activate(context);
    container = utils.makeAppContainer();
  });

  afterEach(() => {
    listener.deactivate();
    container.remove();
  });

  it('should listen for "?" events', function() {
    window.GUI_VERSION = {version: '1.2.3', commit: '123abc]'};
    const keystroke = new Keysim.Keystroke(Keysim.Keystroke.SHIFT, 191);
    keyboard.dispatchEventsForKeystroke(keystroke, container);
    assert.equal(context._displayShortcutsModal.callCount, 1,
      'The shortcuts component did not render');
  });

  it('should listen for "!" events', function() {
    const keystroke = new Keysim.Keystroke(Keysim.Keystroke.SHIFT, 49);
    keyboard.dispatchEventsForKeystroke(keystroke, container);
    assert.equal(context._displaySettingsModal.callCount, 1,
      'The settings component did not render');
  });

  it('should listen for Alt-S key events', function() {
    let searchInput = document.createElement('input');
    searchInput.setAttribute('id', 'charm-search-field');
    container.appendChild(searchInput);

    const keystroke = new Keysim.Keystroke(Keysim.Keystroke.ALT, 83);
    keyboard.dispatchEventsForKeystroke(keystroke, container);

    // Did charm-search-field get the focus?
    assert.equal(searchInput, document.activeElement);
  });
});
