# Gematria Calculator

### Based on [Gematrinator.com](https://www.gematrinator.com/calculator/index.php) (original calculator by Derek Tikkuri)
---
> NOTE: Classic design version is no longer updated, use "Experimental" version!

### List of features:
<ul>
<li>Phrase Box
  <ul>
  <li>Press "Enter" to add phrase to history table</li>
  <li>Box is cleared automatically on "Enter", press "Del" to clear manually</li>
  <li>Phrase can be removed from history with "Del" if it is present (use Up/Down arrows to cycle through history)</li>
  <li>Press "End" to add current phrase (sentence) as a list of words and phrases</li>
  <li>Press "Home" to remove all entries from history table</li>
  </ul>
</li>
<li>Highlight Box
  <ul>
  <li>Highlight values inside history table, type space delimited numbers (e.g - 8 10 12)</li>
  <li>Press "Del" to clear box and disable highlighter feature</li>
  <li>Press "Insert" to automatically highlight all available matches</li>
  <li>Press "Enter" to display only matching phrases (press any non-character key to clear filter, e.g. "Shift", arrow keys, etc.)</li>
  <li>New option: "Weighted Auto Highlighter" - auto highlighter ("Insert") is color graded based on frequency of matches (non-linear)</li>
  </ul>
</li>
<li>Cipher Chart
  <ul>
  <li>"Left Click" on letters/numbers to highlight cells</li>
  </ul>
</li>
<li>History Table
  <ul>
  <li>"Left click" on value makes all matching values blink</li>
  <li>"Ctrl + Left Click" adds cell value to highlight box (note: history table is recalculated)</li>
  <li>"Right Click" on cell to hide/show that particular cell</li>
  <li>"Ctrl + Left Click" on phrase in history table selects that phrase and loads it into search box (press "Del" to remove phrase)</li>
  <li>New option: "Compact History Table" - no cipher names, no break every 25 phrases, only values are displayed</li>
  </ul>
</li>
</ul>

### Additional Functionality:
- Copy/save cipher chart or history table as an image (no need to do screenshots)

### Ciphers:
- Added "Empty" button to disable all active ciphers
- Added "English (special)" cipher category
- Added "Custom" cipher category (English alphabet, fully customizable)
- Added "Russian" cipher category

### Miscellaneous:
- Removed history limit (100 items)
- Phrase is no longer added to history on mouse over ciphers (unfinished phrases cannot be added accidentally)
- History table is automatically updated on cipher toggle
- All available matches found with auto highlighter are displayed in console (debug)
- New option: "Matrix Code Rain" - disable dynamic background if you prefer "classic" gray color background
- CSS changes (visual style)
- Removed unused code
