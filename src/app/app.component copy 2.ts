import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';


declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  overlay: any;
  map: any;
  latitude: number = -16.509418;
  longitude: number = -68.124151;
  ngOnInit() {
    
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 12
      })
    });
    this.addPoint(this.latitude, this.longitude);

    var self = this.map
    this.map.on('click', function(evt) {
      var selected = null;
      console.log(selected)
      self.forEachFeatureAtPixel(evt.pixel, function(f) {
        selected = f;
        window.open(selected.get('name'), "_blank")
        console.log(selected.get('name'))
        return true;
      });



    //  self.getLayers().item(0).getFeatures(evt.pixel).then(function(f){console.log(f)})
    });
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.addMarker(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(12);
  }

  addPoint(lat: number, lng: number) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
          name:"https://nihutak.livejournal.com/16870.html"
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.1, 0.1],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          src: "assets/img/1.png"
        })
      })
    });
    this.map.addLayer(vectorLayer);
    }
}