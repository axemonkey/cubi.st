/*

TODO

* RESOLVE CIRCULAR DEPENDECIES - probably break up files into smaller ones

* alerts? e.g. "Settings saved"

* GET RID OF MODALS
  * put view all times on a separate page
  * put delete all times modal INLINE
  * see https://modalzmodalzmodalz.com for more
  * this will help with making it work on small screens too

* LINKS? BUTTONS? Make UI decisions about what is a link and what is a button
  * Think about "affordance"

* link colours in copy. underlines alone are not enough
* make it work on smaller screens – currently doesn't even fit on laptop screen
  * including phone! portrait layout

* make sure fonts are sized in rems – this might get seen by lots of people!
* theme chooser
  * font chooser – include comic sans for ADHD users
  * also Atkinson Hyperlegible: https://brailleinstitute.org/freefont
  * not just dark/light theme – colour balance for ADHD

* these ones go away when modals are removed
  * fix modals for touch users
  * can't tab to links in modal??

WISHLIST / NICE TO HAVES

* maybe ask if users would like to create accounts and store times remotely?
* allow users to add their own custom puzzles?
  * maybe let them pick a scramble type e.g. mirror 3x3 uses 3x3 scramble etc
* download times as a CSV option?

TO DONE

* put settings on a separate page
* put instructions/about on a separate page
* hide everything when inspection starts, not when solving starts
* option/setting to not show timer when running – possibly less distracting
* finish instructions content
* include full details of the scramble moves and averages stuff that is otherwise only available on hover
* about - include:
  * cubetimer.com and sound
  * explain that the scrambler never makes two consecutive moves in the same axis
  * explain that the site uses cookies/localstorage, and why there is no cookie banner
  * what's the lamp all about?
* make instructions / about tabs
* add a ko-fi link to bottom of screen, add a copyright footer
* only show 10? 12? most recent times on main screen, open full list in a modal
* make sure the delete links in modal work. NO to "delete all" since it opens another modal!
* timestamps for stored times
* touch support for start/stop for touch users
* when timer running, hide everything else! enlarge button/timer to fill screen!
* add "CANCEL" button, link it to ESC key
* move puzzle selection and inspection time into a modal, move radios somewhere else, moar space!
* force numbering for times list to 4 digits not 2
* refactor this fucking mess into separate ES6 modules
* then lint the shit out of it

*/
