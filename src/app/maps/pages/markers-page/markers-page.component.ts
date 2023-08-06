import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface IMarkerColor {
  color: string;
  marker: Marker
}

interface IPlainMarker {
  color: string;
  lnglat: number[];
}

@Component({
  selector: 'maps-markers-page',
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit{
 
  @ViewChild('map') divMap?: ElementRef;
  public markers: IMarkerColor[] = [];

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-74.5, 40);
  
  ngAfterViewInit(): void {
    if(!this.divMap) throw ('HTML element was not found')

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 2, // starting zoom
      });

      this.readFromLocalStorage();
      this.mapListener();
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

    this.markers.push({
      color,
      marker
    });

    this.saveToLocalStorage();

    marker.on('dragend', ev =>{
      this.saveToLocalStorage();
    })
  }

  deleteMarker(index: number): void{
    this.markers[index].marker.remove();
    this.markers.splice(index,1);
  }

  flyTo(marker: Marker): void{
    this.map?.flyTo({
      zoom:8,
      center: marker.getLngLat()
    })
  }

  mapListener(): void{
    if(!this.map) throw Error('Map not initialized.');

    this.map.on('dragend', ev =>{
      console.log('dragend')
    })
  }

  saveToLocalStorage(): void{
    const plainMarkers: IPlainMarker[] = this.markers.map( ({color, marker}) => {
      return {
        color,
        lnglat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage(): void{
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: IPlainMarker[] = JSON.parse(plainMarkersString);
    
    plainMarkers.forEach(({color, lnglat}) => {
      const [lng, lat] = lnglat;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords, color);
    });
  }
}