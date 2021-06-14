var touchMoved = false,
  changingApp = false,
  target = null;

const currentTime = function loadCurrentTime(systemData) {
  clock({
    twentyfour: systemData.isTwentyFourHourTimeEnabled,
    padzero: true,
    refresh: 5000,
    success: function(clock) {
      $$("tod").innerHTML = `${clock.greet()}, ${config.username}`;
      $$("time").innerHTML = `${clock.hour()}${clock.minute()}`;
      $$(
        "date"
      ).innerHTML = ` / ${clock.date()} ${clock.smonthtext()} ${clock.year()}`;
    },
  });
};

const batteryInfo = function loadBatteryInfo(resourcesData) {
  $$("battery").innerHTML = resourcesData.battery.percentage;
};

const temp = function setWeatherTemperature(weatherData) {
  $$(
    "weather-temp"
  ).innerHTML = `${weatherData.now.temperature.current}&deg${weatherData.units.temperature}`;
  $$(
    "weather-hiLow"
  ).innerHTML = `${weatherData.now.temperature.minimum}&deg${weatherData.units.temperature} / ${weatherData.now.temperature.maximum}&deg${weatherData.units.temperature}`;
};

const wicon = function setWeatherIcon(weatherData) {
  $$(
    "weather-icon"
  ).src = `./assets/weatherIcons/${weatherData.now.condition.code}.png`;
};

const cond = function setWeatherCondition(weatherData) {
  $$("weather-cond-left").innerHTML = weatherData.now.condition.description;
  $$("weather-cond-right").innerHTML =
    weatherData.daily[0].condition.description;
};

const precip = function setWeatherPrecipitation(weatherData) {
  $$(
    "weather-precip"
  ).innerHTML = `${weatherData.daily[0].precipitation.probability}% (${weatherData.now.precipitation.total}${weatherData.units.amount})`;
};

const weatherInfo = function loadWeatherInfo(weatherData) {
  temp(weatherData);
  wicon(weatherData);
  cond(weatherData);
  precip(weatherData);
};

const musicCover = function setMusicArtwork(musicData) {
  if (!musicData.nowPlaying.artwork) return;
  let artworkBG = $$("info-music");
  let artwork = $$("music-artwork");
  artworkBG.style.backgroundImage = `url(${musicData.nowPlaying.artwork})`;
  artwork.style.backgroundImage = `url(${musicData.nowPlaying.artwork})`;
};

const musicDetails = function setMusicDetails(musicData) {
  if (!musicData.isStopped) {
    $$("music-track").innerHTML = musicData.nowPlaying.title;
    $$("music-artist").innerHTML = musicData.nowPlaying.artist;
    return;
  }
  $$("music-track").innerHTML = `no media playing`;
  $$("music-artist").innerHTML = `no artist`;
  return;
};

const musicButton = function setMusicButton(musicData) {
  if (!musicData.isPlaying) {
    $$("music-play").style.backgroundImage = `url(./assets/images/play.svg)`;
    return;
  }
  $$("music-play").style.backgroundImage = `url(./assets/images/pause.svg)`;
  return;
};

const musicInfo = function loadMusicInfo(musicData) {
  musicCover(musicData);
  musicDetails(musicData);
  musicButton(musicData);
};

const checkTheme = function checkTheme() {
  if (config.isFrostyThemeEnabled) return true
  return false
}

const theme = function setTheme(checker) {
  if (!checker) {
    let dtheme = document.querySelector('.flavor-default');
    dtheme.style.setProperty('--bgColor', config.dbgc);
    dtheme.style.setProperty('--accentColor', config.dac);
    return;
  };
  document
    .querySelector(":root")
    .style.setProperty("--blurRadius", `blur(${config.blur_radius}px)`);
  $$("widget").classList.replace("flavor-default", "flavor-frosty");
  for (const el of [
    "dock-holder",
    "card-info",
    "info-main-greet",
    "card-app",
  ]) {
    $$(el).classList.add("flavor-frosty-blur");
  }
};

const badgeColor = function setBadgeColor() {
  let r = document.querySelector(':root');
  r.style.setProperty('--badgeColor', config.badge_color);
}

const dockQuote = function setDockQuote() {
  $$("dock-quote").textContent = config.dock_quote;
};

const greetQuote = function setGreetQuote() {
  $$("greet-quote").textContent = config.greet_quote;
};

const typeface = function setTypeface() {
  if (!config.isSystemFontEnabled) return;
  $$("widget").style.setProperty("font-family", `var(--system-font)`);
  return;
};

const cardRadius = function setCardRadius() {
  return document
    .querySelector(":root")
    .style.setProperty("--cardRadius", `${config.card_radius}px`);
};

const fontWeight = function setSystemFontWeight() {
  if (!config.isSystemFontEnabled) return;
  document.body.style.setProperty(
    "font-weight",
    parseInt(config.fontWeight + "00")
  );
};

const once = function once(fn, context) {
  let result;
  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = context = null;
    }
    return result;
  };
};

const appReset = once(function() {
  localstore.resetStorage();
})

const reset = function checkReset() {
  if (!config.reset) return;
  appReset();
}

const settings = function applyConfiguration() {
  theme(checkTheme());
  cardRadius();
  dockQuote();
  greetQuote();
  typeface();
  fontWeight();
  badgeColor();
  reset();
};

function createDOM(params) {
  var element = document.createElement(params.type);
  if (params.id) {
    element.id = params.id;
  }
  if (params.className) {
    element.className = params.className;
  }
  if (params.innerHTML) {
    element.innerHTML = params.innerHTML;
  }
  if (params.styleImg) {
    element.style.backgroundImage = "url(" + params.styleImg + ")";
  }
  if (params.appender) {
    for (let i = 0; i < params.appender.length; i++) {
      element.appendChild(params.appender[i]);
    }
  }
  return element;
}

function loadStorage() {
  localstore.init({
    title: "cocoapuffStorage",
    extraStorage: {
      dockIcons: [
        "com.apple.Preferences",
        "com.apple.MobileSMS",
        "com.apple.mobilesafari",
        "com.apple.camera",
        "com.apple.mobileslideshow",
      ],
      infoIcons: [
        "placeholder0",
        "placeholder1",
        "placeholder2",
        "placeholder3",
        "placeholder4",
        "placeholder5",
        "placeholder6",
        "placeholder7",
        "placeholder8",
        "placeholder9",
        "placeholder10",
        "placeholder11",
        "placeholder12",
        "placeholder13",
        "placeholder14",
        "placeholder15",
      ],
    },
  });
}

function loadApps(apps) {
  let dockIcons = localstore.dockIcons;
  let infoIcons = localstore.infoIcons;
  $$("dock-icon-holder").innerHTML = "";
  $$("fav-icon-holder-1").innerHTML = "";
  $$("fav-icon-holder-2").innerHTML = "";
  $$("fav-icon-holder-3").innerHTML = "";
  $$("fav-icon-holder-4").innerHTML = "";
  for (let i = 0; i < dockIcons.length; i++) {
    var bundle = dockIcons[i],
      badge,
      icon,
      theApp = createDOM({
        type: "div",
        id: bundle,
        className: "app-dock",
      });

    if (bundle == "placeholder" + i) {
      theApp.style.backgroundColor = "white";
      theApp.setAttribute("name", "Blank");
    } else {
      icon = apps.applicationForIdentifier(bundle).icon;
      theApp.setAttribute("name", apps.applicationForIdentifier(bundle).name);
      if (apps.applicationForIdentifier(bundle).badge > 0) {
        badge = createDOM({
          type: "div",
          className: "badge",
          innerHTML: apps.applicationForIdentifier(bundle).badge,
        });
        theApp.appendChild(badge);
      }
      theApp.style.backgroundImage = "url(" + icon + ")";
    }

    $$("dock-icon-holder").appendChild(theApp);
  }
  for (let i = 0; i < infoIcons.length; i++) {
    var bundle = infoIcons[i],
      badge,
      icon,
      theApp = createDOM({
        type: "div",
        id: bundle,
        className: "app",
      });

    if (bundle == "placeholder" + i) {
      theApp.style.backgroundColor = "white";
      theApp.setAttribute("name", "Blank");
    } else {
      icon = apps.applicationForIdentifier(bundle).icon;
      theApp.setAttribute("name", apps.applicationForIdentifier(bundle).name);
      if (apps.applicationForIdentifier(bundle).badge > 0) {
        badge = createDOM({
          type: "div",
          className: "badge",
          innerHTML: apps.applicationForIdentifier(bundle).badge,
        });
        theApp.appendChild(badge);
      }
      theApp.style.backgroundImage = "url(" + icon + ")";
    }

    if (i < 4) {
      $$("fav-icon-holder-1").appendChild(theApp);
    } else if (i < 8) {
      $$("fav-icon-holder-2").appendChild(theApp);
    } else if (i < 12) {
      $$("fav-icon-holder-3").appendChild(theApp);
    } else if (i < 16) {
      $$("fav-icon-holder-4").appendChild(theApp);
    }
  }
}

const iconHold = function tapHoldOnIcon(el, id) {
  menu.init({
    id: el.id + ".Menu",
    message: "Change app for " + el.getAttribute("name"),
    menuItems: [
      {
        id: "replaceApp",
        title: "Set App",
        callback: function() {
          drawer.init({
            oldApp: {
              id: id, //Your div className where you want user to add their own App Shortcuts
              appID: el.id,
              callback: () => {
                changingApp = false;
                loadApps(api.apps);
              },
            },
          });
        },
      },
      {
        id: "cancel",
        title: "Cancel",
        callback: function() {
          changingApp = false;
        },
      },
    ],
  });
};

const widgetEvents = function addWidgetEvents(e) {
  // console.log(e.target);
  const dock = document.querySelector(".dock");
  const cardInfo = document.querySelector(".card-info");
  const cardApp = document.querySelector(".card-app");
  if (e.target.closest("#dock-button")) {
    dock.classList.toggle("hide");
    cardInfo.classList.toggle("show");
  }
  if (e.target.matches("#dock-quote")) {
    dock.classList.toggle("hide");
    cardApp.classList.toggle("show");
  }
  if (
    e.target.classList.contains("app-dock") ||
    e.target.classList.contains("app")
  ) {
    if (!changingApp && !touchMoved) api.apps.launchApplication(e.target.id);
    touchMoved = false;
  }
  if (e.target.id === "home-button") {
    cardInfo.classList.toggle("show");
    dock.classList.toggle("hide");
  }
  if (e.target.id === "app-button") {
    cardInfo.classList.toggle("show");
    cardApp.classList.toggle("show");
  }
  if (e.target.id === "music-play") api.media.togglePlayPause();
  if (cardApp.classList.contains("show")) {
    if (
      e.target.closest(".dock") === null &&
      e.target.closest(".card-info") === null &&
      e.target.closest(".card-app") === null &&
      e.target.closest(".menuWindow") === null &&
      e.target.closest("#drawer") === null
    ) {
      cardApp.classList.toggle("show");
      dock.classList.toggle("hide");
    }
  }
};

document.body.addEventListener("touchend", widgetEvents);
$$("dock-icon-holder").addEventListener("touchmove", () => (touchMoved = true));
$$("card-app").addEventListener("touchmove", () => (touchMoved = true));

const perform = function widgetActions() {
  api.system.observeData(function(systemData) {
    currentTime(systemData);
  });
  api.resources.observeData(function(resourcesData) {
    batteryInfo(resourcesData);
  });
  api.weather.observeData(function(weatherData) {
    weatherInfo(weatherData);
  });
  api.media.observeData(function(musicData) {
    musicInfo(musicData);
  });
  api.apps.observeData(function(appData) {
    loadApps(appData);
  });
  loadStorage();
  touchhold.init({
    time: 400,
    element: $$("dock-icon-holder"),
    callback: function(el) {
      // console.log(el);
      if (el.classList.contains("app-dock")) {
        changingApp = true;
        iconHold(el, "dockIcons");
      }
    },
  });
  touchhold.init({
    time: 400,
    element: $$("fav-app-holder-1"),
    callback: function(el) {
      if (el.classList.contains("app")) {
        changingApp = true;
        iconHold(el, "infoIcons");
      }
    },
  });
  touchhold.init({
    time: 400,
    element: $$("fav-app-holder-2"),
    callback: function(el) {
      if (el.classList.contains("app")) {
        changingApp = true;
        iconHold(el, "infoIcons");
      }
    },
  });
  settings();
};

document.addEventListener("DOMContentLoaded", perform);
