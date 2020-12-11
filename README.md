# Gematria Calculator
### (based on https://www.gematrinator.com/calculator/index.php)

### Minor improvements:
- Removed 100 entries history limit
- Textbox is cleared on "Enter" after new word is added to history (press "Del" to clear manually)
- New entries are no longer added on mouse over ciphers (unfinished phrases cannot be added accidentally)
- History table is automatically updated on cipher toggle

### New features:
- Old history entries can be separately removed with "Del", use Up/Down arrows to cycle through history
- Press "Home" inside the left textbox to clear all history, no need to reload page
- Sentence can be added as a list of words and phrases (press "End" instead of "Enter")
- Dynamic highlighter, type space delimited numbers in the right textbox ("Del" to clear)
- Press "Insert" inside the left textbox to automatically highlight all available matches
- Click on values inside history table to toggle highlighter for a specific value

### Ciphers:
- Added "Empty" button to disable all active ciphers
- Added "English (special)" cipher category
- Added "Custom" cipher category (English alphabet, fully customizable)
- Added "Russian" cipher category

### Experimental:
- Option to render cipher chart or history table as an image (easier to share decodes)
- Click on letters/numbers inside cipher chart to highlight them
- Left click ("tap" on mobile) on cell in history table makes all similar cells blink
- Right click ("tap and hold" on mobile) on cell in history table toggles visibility for that particular cell
- CSS changes (visual style)
- Fixed "Russian E" ciphers (the only difference to Ordinal is that Е=Ё, all other letters have the same values now)
- New option: "Compact History Table" - no cipher names, no break every 25 words, only values are displayed
- New option: "Weighted Auto Highlighter" - auto highlighter ("Insert" button) does color grading based on frequency of matches (non-linear)
- New option: "Matrix Code Rain" - disable dynamic background if you prefer "classic" gray color background
- All available matches found with auto highlighter are displayed in console (debug)
- Removed unused original code
