# Celschrome - Cel's userchrome.css  

Heavily Customized Personal UserChrome CSS for Firefox 64+ Version.
![Main](assets/showcase/showcase-mix-3.png)
What is [userchrome.css?](https://www.userchrome.org/)

## Features

This css is inspired from most userchrome.css tweaks repos, including the one-liner mod ,auto-hide close button and auto-hide navigation buttons.

- [SimplerentFox](https://github.com/migueravila/SimplerentFox)  
- [CustomCSSforFx](https://github.com/Aris-t2/CustomCSSforFx)  

### Overall Tweaks

- ~~Colorless Theme. (uses the color from Windows Personalization Setting)~~ `absolutely broken for v89`
- ~~*RGB*~~ `deprecated since Firefox v69`

### Navigation Tweaks  

- Allows One-Liner Compact Mode (Address Bar + Tab) when Browser window is over certain size.
- Tab auto-size focus with auto-hide close button.
- Address Bar auto-expand and auto-hide when hovered. (buggy)  
- Reduce most* spaces in tabs, navigations and bookmark bar for more compact footprint.  `seemingly not much for v89`

### Personal Bar Tweaks  

- ~~Transparent Background color in bookmark folder.~~ `nope for v89`
- ~~Auto-Hide Personal Bar.~~ `dropped support, may readded in the future`

---

## Prerequisite  

Go to `about:config` in Firefox and do the following :  

- Set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.  
- (Optional) Set `layout.css.backdrop-filter.enabled` to `true`.  

## Installing  

Download `chrome.zip` from [latest release](https://github.com/koushiroue/celschrome/releases/latest) and extract it to your Firefox profile folder.
Go to `about:profiles` to check the location of the folder.

## To-do  

- [x] Update stuff around here.  
- [x] Create this readme.
