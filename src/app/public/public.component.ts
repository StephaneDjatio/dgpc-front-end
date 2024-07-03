import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
declare var M: any;

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit, AfterViewInit{

  private map!: L.Map;
  private sidenavInstance: any;
  sidenavOpened: boolean = false;
  sideNavTitle: any;

  ngOnInit(): void {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.addEventListener('DOMContentLoaded', () => {
      const sidenavElement = document.getElementById('right-nav') as HTMLElement;
      this.sidenavInstance = M.Sidenav.init(sidenavElement, { 
        edge: 'right', 
        draggable: true, // Activer le déplacement de la Sidenav
        preventScrolling: false, // Autoriser le défilement même si la Sidenav est ouverte
        overlay: false,
        onOpenStart: () => {
          this.removeOverlay();
        },
        onCloseStart: () => {
          this.removeOverlay();
        }
      });
    });

    var collapsible = document.querySelectorAll('.collapsible');
    var instanceCollapsible = M.Collapsible.init(collapsible);

    var tabs = document.querySelectorAll('.tabs');
    var instanceTabs = M.Tabs.init(tabs);

    var selectElements = document.querySelectorAll('select');
    var instancesSelect = M.FormSelect.init(selectElements);

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, { dismissible: false, startingTop: '10%'});

    var tooltips = document.querySelectorAll('.tooltipped');
    var tooltipInstances = M.Tooltip.init(tooltips);

    
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addLogoAgeos();
    const modal = M.Modal.getInstance(document.getElementById('presentationModal') as HTMLElement);
    modal.open();
  }

  private initMap(): void {
    // this.map = L.map('map').setView([0.421926, 9.516176], 13);

    this.map = L.map('mapid', {
      center: [0.421926, 9.516176],
      zoom: 13,
      minZoom: 7,
      zoomControl: false // Disable default zoom control
    });

    // Base layers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    const satellite = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    const Stadia_StamenTonerLite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    Stadia_StamenTonerLite.addTo(this.map);

    // Layer control
    const baseLayers = {
      "Noir sur blanc": Stadia_StamenTonerLite,
      "OpenStreetMap": osm,
      "Satellite": satellite
    };

    L.control.layers(baseLayers).addTo(this.map);

    // Initialize the feature group
    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    // Customize draw control options
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          icon: new L.DivIcon({
            iconSize: new L.Point(10, 10),
            className: 'leaflet-div-icon leaflet-editing-icon'
          }),
          shapeOptions: {
            color: '#ff0000',
            weight: 1,
            fillOpacity: 0
          },
          allowIntersection: false,
          // showArea: true
        },
        // polyline: {
        //   shapeOptions: {
        //     color: '#ff0000'
        //   }
        // },
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
        rectangle: {
          shapeOptions: {
            color: '#ff0000',
            weight: 5,
            fillOpacity: 0,
          },
        }
      },
      edit: {
        featureGroup: drawnItems,
        remove: true
      }
    });

    this.map.addControl(drawControl);

    // Add custom zoom control to the right side
    L.control.zoom({
      position: 'topleft'
    }).addTo(this.map);

    // Handle created event
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);
    });
  }

  private addLogoAgeos(): void {
    if (!this.map) return;

    const logo_ageos = new L.Control({ position: 'bottomright' });

    logo_ageos.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'logo_ageos');
      var img_src = "../../assets/images/Logo-AGEOS2.png"

      div.innerHTML += "<img src="+img_src+">";

      return div;
    };

    logo_ageos.addTo(this.map);
  }

  openLegend() {
    
    this.sidenavOpened = false;
    this.sideNavTitle = 'Légende'
    this.sidenavInstance.open();
    this.toggleSidenav();
  }

  createReport() {
    this.sidenavOpened = false;
    this.sideNavTitle = 'Créer un rapport de la zone'
    this.sidenavInstance.open();
    this.toggleSidenav();
  }

  openSearch(): void {
    // Activate the tab by its id
    // $('.tabs').tabs('select', '');
  }

  printMap() {
    const modal = M.Modal.getInstance(document.getElementById('printMapModal') as HTMLElement);
    modal.open();
  }

  help() {
    const modal = M.Modal.getInstance(document.getElementById('helpModal') as HTMLElement);
    modal.open();
  }

  legalNotice() {
    const modal = M.Modal.getInstance(document.getElementById('legalNoticeModal') as HTMLElement);
    modal.open();
  }

  closeSideNav(): void {
    if (this.sidenavInstance) {
      this.sidenavInstance.close();
      this.toggleSidenav();
    }
  }

  removeOverlay(): void {
    const overlay = document.getElementsByClassName('sidenav-overlay');
    if (overlay) {
      // Select all elements with the class name 'example-class'

      // Convert HTMLCollection to an array for easier manipulation
      var elementsArray = Array.from(overlay);

      // Loop through each element and remove it
      elementsArray.forEach(function(element) {
        element.remove();
      });
      // this.overlay.remove();
    }
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
    const mainContent = document.querySelector('.main-content');
    if (this.sidenavOpened ) {
      mainContent!.classList.add('sidenav-open');
    } else {
      mainContent!.classList.remove('sidenav-open');
    }
  }


}
