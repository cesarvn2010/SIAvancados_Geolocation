import { Component } from '@angular/core';
import { NavController, Platform,AlertController } from 'ionic-angular';
import { Geolocation} from '@ionic-native/geolocation';
import { GeoAulaProvider } from '../../providers/geo-aula/geo-aula';

declare var google : any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mapa : any;
  latitude : any;
  longitude : any;
  enderecoPosicao : "";

  latitudeDestino : 0;
  longitudeDestino : 0;
  enderecoDestino : any = "";

  constructor(public navCtrl: NavController,
    public geolocation : Geolocation,
    public alertCtrl: AlertController,
    public platform : Platform,
    public geoAulaProvider : GeoAulaProvider) {
      platform.ready().then(()=> {
        this.obterPosicao();
      });
  }

  obterPosicao():any{
    
    this.geolocation.getCurrentPosition()
      .then(res=> {
        this.latitude = res.coords.latitude;
        this.longitude = res.coords.longitude;
        this.buscarEnderecoPorCoordenadas();
        this.loadMap();
      })
      .catch(
        (error) => {
          console.log(error.message);
          this.latitude = -18.3768;
          this.longitude = -46.0325;
          this.loadMap();
        }
      )

  }

  novoLugar() 
  {

    this.enderecoDestino = "Rua Padre Caldeira, 231, Patos de Minas, MG";
    this.geoAulaProvider.buscarCoordenadas(this.enderecoDestino)
      .then (retorno => {       
        this.latitudeDestino = retorno[0].geometry.location.lat();
        this.longitudeDestino = retorno[0].geometry.location.lng();
        this.loadMap();
      });   
    
  }

  loadMap(){

    let mapContainer = document.getElementById('map');

    this.mapa = new google.maps.Map(
            mapContainer,
           {center: new google.maps.LatLng(
                        this.latitude, 
                        this.longitude), 
                        zoom : 14});

    let marcador = new google.maps.Marker({
      icon: 'assets/imgs/iconeAqui.png',
      map: this.mapa,
      position: new google.maps.LatLng(
            this.latitude, 
            this.longitude)
    });
    if (this.latitudeDestino != 0)
     {
        let marcador2 = new google.maps.Marker({
          icon: 'assets/imgs/iconeAqui.png',
          map : this.mapa, 
          position : new google.maps.LatLng(this.latitudeDestino, 
              this.longitudeDestino)
        });
     }

 }
  
 buscarEnderecoPorCoordenadas() {

  this.geoAulaProvider.buscarEndereco(this.latitude,
      this.longitude).then (retorno => 
        {
          console.log(retorno);
           this.enderecoPosicao = retorno;
        });   
}
 
 showAlert(mensagem, titulo) {
   let alert = this.alertCtrl.create({
     title: titulo,
     subTitle: mensagem,
     buttons: ['OK']
   });
   alert.present();
  }  

  rota() {

    if (this.latitudeDestino != 0)
    {
 
      let directionsService = new google.maps.DirectionsService();
      let directionsDisplay = new google.maps.DirectionsRenderer();
   
      let startPosition = new google.maps.LatLng(
             this.latitude, 
             this.longitude);
    
      const mapOptions = {
        zoom: 18,
        center: startPosition,
        disableDefaultUI: true
      };

      this.mapa = new google.maps.Map(document.getElementById('map'), 
            mapOptions);
      directionsDisplay.setMap(this.mapa);
 
      const marker = new google.maps.Marker({
        position: startPosition,
        map: this.mapa,
      });

      const request = { 
        origin: new google.maps.LatLng(this.latitude, this.longitude),
        destination: new google.maps.LatLng(this.latitudeDestino, this.longitudeDestino),
        travelMode: 'DRIVING'
      };

      directionsService.route(request, function (result, status) {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
    }
  }

}