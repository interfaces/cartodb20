
//=================================================
//
//
//
//  THOSE TEST ARE **REALLY** IMPORTANT SO IF SOME 
//  OF THEM IS BROKEN, PLEASE, TAKE CARE OF IT
//
//  when the user changes base layer (and maybe maps provider)
//  lot of stuff need to be done:
//
//   - change map provider
//   - remove the old base layer
//   - set the new base layers
//   - save all the layers to the server
//
//
//
//=================================================
 
describe("baseMapView", function() {

  var model, view, map;
  beforeEach(function() {

    model = new cdb.admin.TileLayer({
      urlTemplate: 'http://test.com'
    });

    map = new cdb.admin.Map({
      provider: 'leaflet'
    });

    // add base map
    map.layers.add(new cdb.admin.TileLayer());

    view = new cdb.admin.BaseMapView({
      el: $('<div>'),
      model: model,
      map: map
    });
  });

  it("should change base layer when click", function() {
    spyOn(map, 'setBaseLayer');
    view.render();
    view.$el.trigger('click');
    expect(map.setBaseLayer).toHaveBeenCalled();
    expect(map.setBaseLayer.mostRecentCall.args[0].get('urlTemplate')).toEqual('http://test.com');
  });

  it("if the map provider is gmaps should switch to leaflet", function() {
    var called = false;
    spyOn(map, 'setBaseLayer');
    map.set({provider: 'googlemaps'});
    var layer = new cdb.admin.TileLayer();
    map.layers.add(layer);
    spyOn(layer, 'save');
    spyOn(map, 'save');
    sinon.stub(map, 'save', function(data, o) {
      expect(data).toEqual({provider: 'leaflet'});
      o.success();
      called = true;
    });
    spyOn(map.layers, 'saveLayers');
    view.render();
    view.$el.trigger('click');

    expect(map.setBaseLayer).toHaveBeenCalled();
    expect(map.setBaseLayer.mostRecentCall.args[0].get('urlTemplate')).toEqual('http://test.com');

    expect(called).toEqual(true);

  });
});

describe("gmapsbaseview", function() {

  var model, view, map;
  beforeEach(function() {

    model = new cdb.admin.TileLayer({
      urlTemplate: 'http://test.com'
    });

    map = new cdb.admin.Map({
      provider: 'leaflet'
    });

    // add base map
    map.layers.add(new cdb.admin.GMapsBaseLayer());

    view = new cdb.admin.GMapsBaseView({
      el: $('<div>'),
      model: new cdb.admin.GMapsBaseLayer(),
      map: map
    });
  });

  it("if the map provider is leaflet should switch to gmaps and change baselayer", function() {
    var layer = new cdb.admin.TileLayer();
    map.layers.add(layer);
    spyOn(layer, 'save');
    sinon.stub(map, 'save', function(data, o) {
      expect(data).toEqual({provider: 'googlemaps'});
      o.success();
      called = true;
    });
    spyOn(map, 'setBaseLayer');
    view.render();
    view.$el.trigger('click');

    expect(map.setBaseLayer).toHaveBeenCalled();
    expect(map.setBaseLayer.mostRecentCall.args[0].get('type')).toEqual('GMapsBase');
  });
});

describe('BaseMapAdder', function() {
  it("should fix https url", function() {
    var url = cdb.admin.BaseMapAdder.prototype._fixHttps('http://test.com/1.json', { protocol: 'https:' });
    expect(url).toEqual('https://test.com/1.json');

    url = cdb.admin.BaseMapAdder.prototype._fixHttps('http://test.com/1.json', { protocol: 'http:' });
    expect(url).toEqual('http://test.com/1.json');
  });

  it("should use mapbox https url", function() {
    var url = cdb.admin.BaseMapAdder.prototype._fixHttps(
      'http://a.tiles.mapbox.com/v3/examples.map-4l7djmvo.json', 
      { protocol: 'https:' }
    );

    expect(url).toEqual('https://dnv9my2eseobd.cloudfront.net/v3/examples.map-4l7djmvo.json');

    url = cdb.admin.BaseMapAdder.prototype._fixHttps(
      'http://a.tiles.mapbox.com/v3/examples.map-4l7djmvo.json', 
      { protocol: 'http:' }
    );
    expect(url).toEqual(
      'http://a.tiles.mapbox.com/v3/examples.map-4l7djmvo.json'
    )
  });

});
