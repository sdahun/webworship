var DEFAULT_PANEL = 'hymnal';

var VERSE_SHOW_FORWARD = 1.5; // ennyi másodperccel előre mutatja a következő versszakot (nem lehet kisebb, mint a VERSE_CHANGE_FADE)
var VERSE_CHANGE_FADE = 0.5; // versszak váltásnál halványodás és világosodás ideje másodpercben (a teljes áttünés ideje az idő kétszerese)

var BLANK_SCREEN_TIMEOUT = 1000 * 60; // képernyő elsőtétítés eggy ms tétlenség után

var FADE_IN = 0; // ennyi mp-et hangosít az elején (eredetileg 0.05 volt)
var FADE_OUT = 0; // ennyi mp-et halkít a végén (eredetileg 0.5 volt)
var FADE_RATE = 0.7; // ennyire halkítja le (1 = teljesen)
var PLAY_NEXT_SILENT = 0; // következő versszak játszása előtt ennyi ms szünet

// Feliratos vetítés beállításai:
var SUBTITLE_FADE_OUT_STEP = 0.04;   // felirat fade out opacity csökkentés egy lépésben
var SUBTITLE_FADE_OUT_INTERVAL = 10; // felirat fade out lépés ennyi ezredmásodpercenként
var SUBTITLE_FADE_IN_STEP = 0.04;    // felirat fade in opacity csökkentés egy lépésben
var SUBTITLE_FADE_IN_INTERVAL = 10;  // felirat fade in lépés ennyi ezredmásodpercenként
var SUBTITLE_FADE_SHOW_FORWARD = 1.5; // ennyi másodpeccel előre mutassuk az új szövegrészt
var SUBTITLE_FADE_PRE_TIME = 1 / SUBTITLE_FADE_OUT_STEP * SUBTITLE_FADE_OUT_INTERVAL / 1000 + 1 / SUBTITLE_FADE_IN_STEP * SUBTITLE_FADE_IN_INTERVAL / 1000; // az új szövegrész ideje előtt már megtörtönjen a fade-in és fade-out, ennyi idő kell hozzá
var SUBTITLE_FADE_OUT_END = 1;       // zene végén ennyivel előtte tüntessük el az utolsó szöveget
