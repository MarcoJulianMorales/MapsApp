import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit{
  @ViewChild('map') divMap?: ElementRef;
  @Input() lnglat?: [number, number]

  public map?: Map;

  ngAfterViewInit(): void {
    if(!this.lnglat) throw ('LngLat missing');
    if(!this.divMap?.nativeElement) throw ('HTML element was not found');

    //map
    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lnglat!, // starting position [lng, lat]
      zoom: 12, // starting zoom
      });

    //marker
    this.createMarker();
  }

  createMarker(): void{
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    this.addMarker(this.map.getCenter(), color);
  }

  addMarker(lnglat: LngLat, color: string): void{
    if(!this.map) return;

    const marker = new Marker({
      color,
      draggable: true
    }).setLngLat(lnglat).addTo(this.map);
  }
}