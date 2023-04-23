ymaps.ready(init);

function init() {
  const myMap = new ymaps.Map("map", {
    // Координаты центра карты
    center: [59.938631, 30.323037],
    // Масштаб
    zoom: 17,
    // Отключение всех элементов управления
    controls: [],
  });

  let myGeoObjects = [];

  // Параметры маркера
  myGeoObjects = new ymaps.Placemark(
    [59.938631, 30.323037],
    {
      balloonContentBody: "Приходите! Будем рады познакомиться лично.",
    },
    {
      iconLayout: "default#image",
      // Путь до картинки
      iconImageHref: "img/content/map-marker.svg",
      // Размер по ширине и высоте
      iconImageSize: [67, 100],
      // Смещение левого верхнего угла иконки относительно
      // её «ножки» (точки привязки).
      iconImageOffset: [-33, -100],
    }
  );

  const clusterer = new ymaps.Clusterer({
    clusterDisableClickZoom: false,
    clusterOpenBalloonOnClick: false,
  });

  clusterer.add(myGeoObjects);
  myMap.geoObjects.add(clusterer);
  // Отлючение возможности изменения масштаба
  myMap.behaviors.disable("scrollZoom");
}
