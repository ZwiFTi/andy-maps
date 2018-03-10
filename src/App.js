import React, {Component} from 'react';
import './App.css';
import Map from './Components/Map';
import Sidebar from "./Components/Sidebar";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
            markers: [
                {
                    lat: 58.971355,
                    long: 5.731016,
                    name: 'Sjøhuset Skagen',
                    source: 'https://foursquare.com/v/sj%C3%B8huset-skagen/4c433ea6d7fad13a64410ada'
                },
                {
                    lat: 58.970965,
                    long: 5.731965,
                    name: 'Døgnvill Burger Stavanger',
                    source: 'https://foursquare.com/v/d%C3%B8gnvill-burger-stavanger/52d679b111d25266c4e5516a'
                },
                {
                    lat: 58.971192,
                    long: 5.731273,
                    name: 'Chevy\'s Rockbar',
                    source: 'https://foursquare.com/v/chevys-rockbar/4f431cd6e3ffb9465ded8493'
                },
                {
                    lat: 58.971813,
                    long: 5.737259,
                    name: 'Deja Vu Delikatesse AS',
                    source: 'https://foursquare.com/v/d%C3%A9j%C3%A0-vu-delikatesser/4c2f2767452620a1ccfd1c0f'
                },
                {
                    lat: 58.971797,
                    long: 5.733449,
                    name: 'Re-naa',
                    source: 'https://foursquare.com/v/renaa/5839d87d04aa4f696b344e6d'
                },
                {
                    lat: 58.973657,
                    long: 5.730911,
                    name: 'India Tandoori Restaurant',
                    source: 'https://foursquare.com/v/india-tandoori-restaurant-as/53f9a3a9498eacc7b118af93'
                },
                {
                    lat: 58.970190,
                    long: 5.736564,
                    name: 'Thai Nong Khai AS',
                    source: 'https://foursquare.com/v/thai-nong-khai/54f9a122498e902e45d310da'
                }
            ],
            virtualMarkers: []
        };


        this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }


    componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyCrwKQ8dOR8mp6MiPC8KaC5gRYa5BqfyYw&callback=initMap');
    }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: 58.969137, lng: 5.732136 }
        });

        var infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        this.generateMarkers(map);
    }

    generateMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            const loc = {lat: marker.lat, lng: marker.long};

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name,
                source: marker.source
            });


            mark.addListener('click', function () {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
        });
    }

    openMarker(marker = '') {
        const clientId = "VVPEFJC40SJDVH1YFRJS4IBNQ0GGZJY5X1XLHEA23H1LTVOQ\n";
        const clientSecret = "MEAM2N42L434P1MB1AJZFUHM5XAGMCDNGETUH5XNZIYEHOKI\n";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function (resp) {
                if (resp.status !== 200) {
                    const err = "Can't load data.";
                 this.state.info.setContent(err);
                }
                resp.json().then(function (data) {
                    var place = data.response.venues[0];
                    let phone = '';

                    if (place.contact.formattedPhone) {
                        phone = "<p><b>Phone:</b> "+ place.contact.formattedPhone +"</p>";
                    }

                    let twitter = '';

                    if (place.contact.twitter) {
                        twitter = "<p><b>Phone:</b> "+ place.contact.twitter +"</p>";
                    }

                    var info =
                        "<div id='marker'>" +
                            "<h2>" + self.marker.title + "</h2>" +
                            phone +
                            twitter +
                            "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                            "<p><b>Source:</b> " + self.marker.source + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function (err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }


    render() {
        return (
            <div>
                <header>
                    <h1 id="title">Eating Stavanger</h1>
                </header>
                <Map markers={this.state.markers}></Map>
            </div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    tag.parentNode.insertBefore(script, tag);
}

export default App;
