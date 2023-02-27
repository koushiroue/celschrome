# Celschrome - Cel's userchrome.css  `110.0`

![Main](assets/showcase/title-light.png#gh-light-mode-only)
![Main2](assets/showcase/title-dark2.png#gh-dark-mode-only)  

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/darkwindow.gif" width="300">
    <img src="assets/lightwindow.gif" width="500">
  </picture>
</p>

What is [userchrome.css?](https://www.userchrome.org/)

### Features

This css is inspired from most userchrome.css tweaks repos, including the one-liner mod ,auto-hide close button and auto-hide navigation buttons.

- [SimplerentFox](https://github.com/migueravila/SimplerentFox)  
- [CustomCSSforFx](https://github.com/Aris-t2/CustomCSSforFx)  
- [FirefoxCssHacks](https://github.com/MrOtherGuy/firefox-csshacks)

### Overall Tweaks

- ~~Colorless Theme. (uses the color from Windows Personalization Setting)~~ `borked in Windows 11`
- ~~*RGB*~~ ~~`deprecated since Firefox v69`~~ `in working in v100+ with FirefoxCssHacks`

### Navigation Tweaks  

- Allows One-Liner Compact Mode (Address Bar + Tab) when Browser window is over certain size.
- Tab auto-size focus with auto-hide close button.
- Address Bar auto-expand and auto-hide when hovered. (buggy)  
- Reduce most* spaces in tabs, navigations and bookmark bar for more compact footprint `*not including window buttons.`  

### Personal Bar Tweaks  

- ~~Transparent Background color in bookmark folder.~~ `idk what happened lmao`  
- ~~Auto-Hide Personal Bar.~~ `dropped support, may readded in the future`

---

## Requirements

Go to `about:config` in Firefox and do the following :  

- Set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.  
- ~~(Optional) Set `layout.css.backdrop-filter.enabled` to `true`.~~ `default to true on v106`  
- Set `layout.css.color-mix.enabled` to `true`. `For RGB Mod`  

## Installing  

Download `chrome.zip` from [latest release](https://github.com/koushiroue/celschrome/releases/latest) and extract it to your Firefox profile folder.
Go to `about:profiles` to check the location of the folder.
