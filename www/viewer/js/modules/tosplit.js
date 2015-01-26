/**
 * 
 */

define(['modules/model','jquery', 'leaflet'],function(recordsModel){
    var map = null;
    var map_layers_control = null;
    var csw_url = "http://localhost/pycsw-wsgi";
    var csw_ip_url = "http://localhost/pycsw-wsgi";
    var pagesize = 10;

    var protocols = {
        "None": ["Unknown", "WWW"],
        "ESRI:AIMS--http--configuration": ["ArcIMS Map Service Configuration File (*.AXL)", "ArcIMS"],
        "ESRI:AIMS--http-get-feature": ["ArcIMS Internet Feature Map Service", "ArcIMS"],
        "ESRI:AIMS--http-get-image": ["ArcIMS Internet Image Map Service", "ArcIMS"],
        "GLG:KML-2.0-http-get-map": ["Google Earth KML service (ver 2.0)", "KML"],
        "OGC:CSW": ["OGC-CSW Catalogue Service for the Web", "CSW"],
        "OGC:KML": ["OGC-KML Keyhole Markup Language", "KML"],
        "OGC:GML": ["OGC-GML Geography Markup Language", "GML"],
        "OGC:ODS": ["OGC-ODS OpenLS Directory Service", "OpenLS"],
        "OGC:OGS": ["OGC-ODS OpenLS Gateway Service", "OpenLS"],
        "OGC:OUS": ["OGC-ODS OpenLS Utility Service", "OpenLS"],
        "OGC:OPS": ["OGC-ODS OpenLS Presentation Service", "OpenLS"],
        "OGC:ORS": ["OGC-ODS OpenLS Route Service", "OpenLS"],
        "OGC:SOS": ["OGC-SOS Sensor Observation Service", "SOS"],
        "OGC:SPS": ["OGC-SPS Sensor Planning Service", "SPS"],
        "OGC:SAS": ["OGC-SAS Sensor Alert Service", "SAS"],
        "OGC:WCS": ["OGC-WCS Web Coverage Service", "WCS"],
        "OGC:WCS-1.1.0-http-get-capabilities": ["OGC-WCS Web Coverage Service (ver 1.1.0)", "WCS"],
        "OGC:WCTS": ["OGC-WCTS Web Coordinate Transformation Service", "WCTS"],
        "OGC:WFS": ["OGC-WFS Web Feature Service", "WFS"],
        "OGC:WFS-1.0.0-http-get-capabilities": ["OGC-WFS Web Feature Service (ver 1.0.0)", "WFS"],
        "OGC:WFS-G": ["OGC-WFS-G Gazzetteer Service", "WFS-G"],
        "OGC:WMC-1.1.0-http-get-capabilities": ["OGC-WMC Web Map Context (ver 1.1)", "WMC"],
        "OGC:WMS": ["OGC-WMS Web Map Service", "WMS"],
        "OGC:WMS-1.1.1-http-get-capabilities": ["OGC-WMS Capabilities service (ver 1.1.1)", "WMS"],
        "OGC:WMS-1.3.0-http-get-capabilities": ["OGC-WMS Capabilities service (ver 1.3.0)", "WMS"],
        "OGC:WMS-1.1.1-http-get-map": ["OGC Web Map Service (ver 1.1.1)", "WMS"],
        "OGC:WMS-1.3.0-http-get-map": ["OGC Web Map Service (ver 1.3.0)", "WMS"],
        "OGC:SOS-1.0.0-http-get-observation": ["OGC-SOS Get Observation (ver 1.0.0)", "SOS"],
        "OGC:SOS-1.0.0-http-post-observation": ["OGC-SOS Get Observation (POST) (ver 1.0.0)", "SOS"],
        "OGC:WNS": ["OGC-WNS Web Notification Service", "WNS"],
        "OGC:WPS": ["OGC-WPS Web Processing Service", "WPS"],
        "WWW:DOWNLOAD-1.0-ftp--download": ["File for download through FTP", "FTP"],
        "WWW:DOWNLOAD-1.0-http--download": ["File for download", "HTTP"],
        "FILE:GEO": ["GIS file", "GIS"],
        "FILE:RASTER": ["GIS RASTER file", "Raster"],
        "WWW:LINK-1.0-http--ical": ["iCalendar (URL)", "iCal"],
        "WWW:LINK-1.0-http--link": ["Web address (URL)", "WWW"],
        "WWW:LINK-1.0-http--partners": ["Partner web address (URL)", "WWW"],
        "WWW:LINK-1.0-http--related": ["Related link (URL)", "WWW"],
        "WWW:LINK-1.0-http--rss": ["RSS News feed (URL)", "RSS"],
        "WWW:LINK-1.0-http--samples": ["Showcase product (URL)", "WWW"],
        "DB:POSTGIS": ["PostGIS database table", "PostGIS"],
        "DB:ORACLE": ["ORACLE database table", "Oracle"],
        "WWW:LINK-1.0-http--opendap": ["OPeNDAP URL", "OPeNDAP"],
        "RBNB:DATATURBINE": ["Data Turbine", "turbine"],
        "UKST": ["Unknown Service Type", "unknown"],
        "WWW:LINK-1.0-http--image-thumbnail": ["Web image thumbnail (URL)", "thumb"],
    };

    function BoundingBox(xml) {
        var ll = $(xml).find(escapeElementName('ows:LowerCorner')).text().split(' ');
        var ur = $(xml).find(escapeElementName('ows:UpperCorner')).text().split(' ');
        this.minx = ll[1];
        this.miny = ll[0];
        this.maxx = ur[1];
        this.maxy = ur[0];
        this.csv = [ll[0], ll[1], ur[0], ur[1]].join();
    }

    function Link(xml) {
        this.value = $(xml).text();
        this.scheme = 'None';
        var scheme = $(xml).attr('scheme');
        if (scheme != 'None' && scheme != "") {
            this.scheme = scheme;
        }
    }

    function CswRecord(xml) {
        this.identifier = $(xml).find(escapeElementName('dc:identifier')).text();
        this.type = $(xml).find(escapeElementName('dc:type')).text();
        this.title = $(xml).find(escapeElementName('dc:title')).text();
        this.abstract = $(xml).find(escapeElementName('dct:abstract')).text();
        this.publisher = $(xml).find(escapeElementName('dc:publisher')).text();
        this.abstract2 = $(xml).find(escapeElementName('dct:abstract')).text();
        this.source = $(xml).find(escapeElementName('dc:source')).text();
        this.date = $(xml).find(escapeElementName('dc:date')).text();
        this.modified = $(xml).find(escapeElementName('dct:modified')).text();
        this.references = [];
        this.bbox = new BoundingBox($(xml).find(escapeElementName('ows:BoundingBox')));

        var self = this;

        // get all links
        $(xml).find(escapeElementName('dct:references')).each(function() {
            self.references.push(new Link($(this)));
        });
    }

    function truncate(value, length) {
        if (value.length > length) {
            return value.substring(0, length) + '...';
        }
        return value;
    }

    function escapeElementName(str) {
        return str.replace(':', '\\:').replace('.', '\\.');
    }
    function bbox2polygon(bbox) {
        if (bbox == null) {
            return new L.Polygon();
        }
        var coords = bbox.split(',');
        var p1 = new L.LatLng(coords[0], coords[1]),
            p2 = new L.LatLng(coords[2], coords[1]),
            p3 = new L.LatLng(coords[2], coords[3]),
            p4 = new L.LatLng(coords[0], coords[3]),
            polygonPoints = [p1, p2, p3, p4];
        return new L.Polygon(polygonPoints);
    }

    function style_record(rec) {
        var snippet = "<tr><td>";
        var links = "";
        // get all links
        for (var i = 0; i < rec.references.length; i++) {
            if (rec.references[i].value != "None" && rec.references[i].value.lastIndexOf("http", 0) === 0) {
                if (rec.references[i].scheme == 'OGC:WMS-1.1.1-http-get-map') {
                    urlbase = rec.references[i].value.split('?')[0];
                    links += '<span id="' + rec.references[i].value + '##' + rec.title + '" class="btn btn-primary btn-sm">Add to map</span>';
                }
                else {
                    links += ' <a class="btn btn-primary btn-sm" title="' + rec.references[i].scheme + '" href="' + rec.references[i].value + '">' + protocols[rec.references[i].scheme][1] + '</a> ';
                }
            }
        }

        url = csw_ip_url + "?service=CSW&version=2.0.2&request=GetRecordById&elementsetname=full&id=" + rec.identifier;
        title2 = '<a id="' + rec.bbox.csv + '" class="a-record" target="_blank" title="' + rec.title + '" href="' + url  + '">' + rec.title + '</a>';
        snippet += '<h5>' + title2 + '</h5>';
        snippet += '<h5>' + truncate(rec.abstract, 255) + '</h5>';
        snippet += '<em>' + rec.publisher + '</em><br/>';
        snippet += '<small><strong>Date</strong>: ' + rec.date + '</small><br/>';
        snippet += links;
        snippet += '</td></tr>';
        return snippet;
    }
    function search(startposition) {
        $('#div-csw-results-glass').toggle();

        if (!startposition) {
            startposition = 1;
        }
        var freetext = $('#input-anytext').val().trim();
        var bbox_enabled = $('#input-bbox').is(':checked');
        var sortby = $('#select-sortby option:selected').val();
       
        if (bbox_enabled && map != null) {
            bounds = map.getBounds();
            qbbox = '<ogc:BBOX><ogc:PropertyName>ows:BoundingBox</ogc:PropertyName><gml:Envelope xmlns:gml="http://www.opengis.net/gml"><gml:lowerCorner>' + bounds.getSouth() + ' ' + bounds.getWest() + '</gml:lowerCorner><gml:upperCorner>' + bounds.getNorth() + ' ' + bounds.getEast() + '</gml:upperCorner></gml:Envelope></ogc:BBOX>';
        }

        data = '<csw:GetRecords maxRecords="' + pagesize + '" startPosition="' + startposition + '" outputFormat="application/xml" outputSchema="http://www.opengis.net/cat/csw/2.0.2" resultType="results" service="CSW" version="2.0.2" xsi:schemaLocation="http://www.opengis.net/cat/csw/2.0.2 http://schemas.opengis.net/csw/2.0.2/CSW-discovery.xsd" xmlns:ogc="http://www.opengis.net/ogc" xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><csw:Query typeNames="csw:Record"><csw:ElementSetName>full</csw:ElementSetName>';
        if (freetext != '') {
            if (bbox_enabled && map != null) {
                data += '<csw:Constraint version="1.1.0"><ogc:Filter><ogc:And><ogc:PropertyIsLike escapeChar="\\" singleChar="_" wildCard="%"><ogc:PropertyName>csw:AnyText</ogc:PropertyName><ogc:Literal>%' + $("#input-anytext").val().trim() + '%</ogc:Literal></ogc:PropertyIsLike>' + qbbox + '</ogc:And></ogc:Filter></csw:Constraint>';
            }
            else {
                data += '<csw:Constraint version="1.1.0"><ogc:Filter><ogc:PropertyIsLike escapeChar="\\" singleChar="_" wildCard="%"><ogc:PropertyName>csw:AnyText</ogc:PropertyName><ogc:Literal>%' + $("#input-anytext").val().trim() + '%</ogc:Literal></ogc:PropertyIsLike></ogc:Filter></csw:Constraint>';
            }
        }
        else if (bbox_enabled && map != null) {
            data += '<csw:Constraint version="1.1.0"><ogc:Filter>' + qbbox + '</ogc:Filter></csw:Constraint>';
        }

        data += '</csw:Query></csw:GetRecords>';

        $.ajax({
            type: "post",
            url: csw_ip_url,
            contentType: "text/xml",
            data: data,
            dataType: "text",
            success: function(xml) {
                $('#table-csw-results').empty();
                $('#div-csw-results-glass').toggle();
                //alert(xml);
                // derive results for paging
                var matched = parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('numberOfRecordsMatched'));
                var returned = parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('numberOfRecordsReturned'));
                var nextrecord = parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('nextRecord'));

                $('#input-startposition').val(startposition);
                $('#input-nextrecord').val(nextrecord);
                $('#input-matched').val(matched);

                if (matched == 0) {
                    $('#div-results').html('');
                    $('#table-csw-results').html('<tr><td>No results</td></tr>');
                    return;
                }
                if (nextrecord == 0 || nextrecord >= matched) { // at the end
                    $('#li-next').attr('class', 'disabled');
                    nextrecord = matched;
                }
                else {
                    $('#li-next').attr('class', 'active');
                }
                if (startposition == 1) {
                    $('#li-previous').attr('class', 'disabled');
                }
                else {
                    $('#li-previous').attr('class', 'active');
                }

                results = '<strong>Results ' + startposition + '-' + nextrecord + ' of ' + matched + ' record(s)</strong>';

                $('#div-results').html(results);
                recordsModel.createRecordsModel(xml);

                $(escapeElementName('csw:Record'),xml).each(function(record) {
                    var rec = new CswRecord($(this));
                    $("#table-csw-results").append(style_record(rec));
                })
            }
        });
    }
    $(document).ready(function(){
        // init the map
        polygon_layer = null;
        map = L.map('div-map').setView([10, 0], 1);
        basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        })
        map.addLayer(basemap);
        map_layers_control = L.control.layers({"basemap": basemap}, {}, {'collapsed': true}).addTo(map);
        // init the results table with CSW results
        search();
        // handle CSW searches
        $("#form-search").keypress(function (e) {
            if (e.keyCode == 13) { // Enter key pressed, but not submitting the form to a page refresh
                search();
                return false;
            }
        });
        $('#a-previous').click(function(event){
            event.preventDefault(); 
            startposition2 = $('#input-startposition').val()-pagesize;
            if (startposition2 < 1) {
                return;
            }
            search(startposition2);
        }); 
        $('#a-next').click(function(event){
            event.preventDefault(); 
            nextrecord2 = parseInt($('#input-nextrecord').val());
            matched2 = parseInt($('#input-matched').val());
            if (nextrecord2 == 0 || nextrecord2>=matched2) {
                return;
            }
            search(nextrecord2);
        }); 
        $("table").on("click", "span", function(event) {
            var tokens = $(this).attr('id').split('##');
            var getmap = tokens[0].split('?');
            var url = getmap[0];
            var getmap_kvp = getmap[1].split('&');;
            for (var i = 0; i < getmap_kvp.length; i++) {
                var temp = getmap_kvp[i].toLowerCase();
                if (temp.search('layers') != -1) {
                    var kvp = getmap_kvp[i].split('=');
                    var layer_name = kvp[1];
                }
            }

            for (var prop in map_layers_control._layers) {
                if (url == map_layers_control._layers[prop].layer._url && tokens[1] == map_layers_control._layers[prop].name) {
                    return;
                }
            }

            var layer = L.tileLayer.wms(url, {
                layers: layer_name,
                format: 'image/png',
                transparent: true,
            });
            map_layers_control.addOverlay(layer, tokens[1]);
            map.addLayer(layer);
        }); 
        $("table").on("mouseenter", "td", function(event) {
            bbox = $(this).find('[id]').attr('id');
            if (polygon_layer != null && map.hasLayer(polygon_layer)) {
                map.removeLayer(polygon_layer);
            }
            if ($('#input-footprints').is(':checked')) {
                if (bbox != undefined) {
                    polygon_layer = bbox2polygon(bbox);
                    map.addLayer(polygon_layer);
                }
            }
        });
    });
});