
async function main(){
    // Pull Earthquake Data
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
    const data = await response.json();
    console.log(data);

   var map = L.map("map", {
       center: [40, -99],
        zoom: 5
    });

    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const features = data.features;
    console.log("features", features); 

    const coord = [];

    for (let i = 0; i < features.length; i++) {
        let quake = features[i];

        let quakeSet = {
            location: [quake.geometry.coordinates[1], quake.geometry.coordinates[0]],
            depth: quake.geometry.coordinates[2],
            place: quake.properties.place,
            magnitude: quake.properties.mag
        }
        coord.push(quakeSet);
    }

    console.log(coord);

    // Adding get color function 
    function getColor(dep) {
        return dep > 91  ? 'red' :
            dep > 90  ? 'darkorange' :
            dep > 70  ? 'orange' :
            dep > 50  ? 'yellow' :
            dep > 30  ? 'darkgreen' :
            dep > 10  ? 'green' :
            'lightgreen';
    };

    for (let i = 0; i < coord.length; i++){


        L.circle(coord[i].location, {
            fillOpacity: 1,
            color: "black",
            fillColor: getColor(coord[i].depth),
            radius: (coord[i].magnitude) * 12000
        }).bindPopup(`<h1>Location: ${coord[i].place}</h1> <hr> <h2>Magnitude: ${coord[i].magnitude}</h2> <h2>Depth: ${coord[i].depth}</h2>`).addTo(map);
    }
    
    // Create Legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            title = ['<strong>Depth</strong>'],
            depths = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < depths.length; i++) {
            div.innerHTML += 
          "<i style='background: " + getColor(depths[i] + 1) + "'></i> " +
          depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        return div;
    };
    
    //  add our legend to the map.
    legend.addTo(map);

};
main();