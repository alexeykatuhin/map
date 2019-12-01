import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { AppServices } from './services/appServices';


declare var ol: any;





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public appSevice: AppServices){}

  overlay: any;
  map: any;
  latitude: number = 52.545214330050563;
  longitude: number = 13.559093915055664;
  height: string;
  ngOnInit() {

    this.height = '738px'
    var self = this;
    var container = document.getElementById('popup');
    this.overlay = new ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });


    this.map = new ol.Map({
      target: 'map',
      overlays: [this.overlay],
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 3
      })
    });

    this.processingData();
    // this.addPoint(this.latitude, this.longitude);


    this.map.on('click', function (evt) {

      var selected = null;

      self.map.forEachFeatureAtPixel(evt.pixel, function (f) {

        selected = f;


        var match = selected.get('data');
        if (match != null) {
          console.log(document.getElementById('popup-content'))
          var content = document.getElementById('popup-content');
          content.innerHTML = self.generateHtml(match)
          self.overlay.setPosition(evt.coordinate);
        }
        return true;
      });


    });


    console.log(window)
  }


 
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.height = (window.innerHeight-17) +'px';
  // }

    closePopup()
    {
      var closer = document.getElementById('popup-closer');

      this.overlay.setPosition(undefined);
        closer.blur();
     
    }

    processingData(){
      this.appSevice.getJSON().subscribe((json)=>{
        console.log(json)
        json.forEach(item => {
          var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([item.lng, item.lat], 'EPSG:4326', 'EPSG:3857')),
                // linkRead: item.linkRead,
                // linkVk: item.linkVk,
                // linkFlickr:item.linkFlickr,
                data:item
              })]
            }),
            style: new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: "assets/img/" + item.img,
                // size:[1000,1000],
                scale:item.scale
      
              })
            })
          });
          this.map.addLayer(vectorLayer);
        });
    
      })
    }

  generateHtml(data: any) {
    let res = '<p>' + data.header;
    res += '<table>'


    data.links.forEach(element => {
      res += '<tr><td><a style="margin-right:5px;" href="' + element.url + '" title="Смотреть" target="_blank"><img class="link-img"  width="50" src="assets/img/'+element.icon+'"></a></td><td>'+element.title+'</td></tr>'

    });

    res+='</table>';

    return res;   
  }
}