import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'maps-zoom-range-page',
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{
 
  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-74.5, 40);
  
  ngAfterViewInit(): void {
    if(!this.divMap) throw ('HTML element was not found')

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
      });

      this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(){
    if(!this.map) throw Error('Map not initialized.');

    this.map.on('zoom', ev =>{
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', ev =>{
      this.map!.getZoom() > 18 ? this.map!.zoomTo(18) : null;
      return; 
    });

    this.map.on('move', ev =>{
      this.currentLngLat = this.map!.getCenter();
    })
  }

  zoomIn(){
    this.map?.zoomIn();
  }

  zoomOut(){
    this.map?.zoomOut();
  }

  zoomChanged(zoom: string){
    this.zoom = Number(zoom);
    this.map?.zoomTo(this.zoom);
  }
}
