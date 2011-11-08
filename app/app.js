va = new Ext.Application({
    launch: function() {

        this.data = {};

        this.data.Business = Ext.regModel('', {
            fields: [
                {name: "id", type: "int"},
                {name: "name", type: "string"},
                {name: "latitude", type: "string"},
                {name: "longitude", type: "string"},
                {name: "address1", type: "string"},
                {name: "address2", type: "string"},
                {name: "address3", type: "string"},
                {name: "phone", type: "string"},
                {name: "state_code", type: "string"},
                {name: "mobile_url", type: "string"},
                {name: "rating_img_url_small", type: "string"},
                {name: "photo_url", type: "string"},
            ]
        });

        this.listCardToolbar = new Ext.Toolbar({
            dock: 'top',
            title: 'Valley Guide'
        });

        this.listCardDataList = new Ext.List({
            store: new Ext.data.Store({
                model: va.data.Business,
                autoLoad: true,
                proxy: {
                    type: 'scripttag',
                    url: 'http://api.yelp.com/business_review_search' +
                        '?ywsid=' + YELP_KEY +
                        '&term=' + 'Bars' +
                        '&location=Silicon%20Valley',
                    reader: {
                        type: 'json',
                        root: 'businesses'
                    }
                }
            }),
            itemTpl:
                '<img class="photo" src="http://src.sencha.io/40/{photo_url}" width="40" height="40"/>' +
                '{name}<br/>' +
                '<img src="{rating_img_url_small}"/>&nbsp;' +
                '<small>{address1}</small>',
            listeners: {
                selectionchange: function (selectionModel, records) {
                    if (records[0]) {
                        va.viewport.setActiveItem(va.detailTabs);
                        va.detailCardToolbar.setTitle(records[0].get('name'));
                        va.detailCard.update(records[0].data);

                        var map = va.detailMap.map;
                        if (!map.marker) {
                            map.marker = new google.maps.Marker();
                            map.marker.setMap(map);
                        }
                        map.setCenter(
                            new google.maps.LatLng(
                                records[0].get('latitude'),
                                records[0].get('longitude')
                            )
                        );
                        map.marker.setPosition(
                            map.getCenter()
                        );

                    }
                }
            },
            plugins: [{
                ptype: 'pullrefresh'
            }]
        });

        this.listCard = new Ext.Panel({
            items: [this.listCardDataList],
            dockedItems: [this.listCardToolbar],
            layout: 'fit'
        });

        this.detailCardToolbar = new Ext.Toolbar({
            dock: 'top',
            title: '...',
            items: [{
                text: 'List',
                handler: function () {
                    va.viewport.setActiveItem(
                        va.listCard,
                        {type: 'slide', direction: 'right'}
                    );
                }
            }]
        });

        this.detailCard = new Ext.Panel({
            styleHtmlContent: true,
            cls: 'detail',
            tpl: [
                '<img class="photo" src="{photo_url}" width="100" height="100"/>',
                '<h2>{name}</h2>',
                '<div class="info">',
                    '{address1}<br/>',
                    '<img src="{rating_img_url_small}"/>',
                '</div>',
                '<div class="phone x-button">',
                    '<a href="tel:{phone}">{phone}</a>',
                '</div>',
                '<div class="link x-button">',
                    '<a href="{mobile_url}">Read more</a>',
                '</div>'
            ],
            title: 'Info'
        });

        this.detailMap = new Ext.Map({
            title: 'Map'
        });

        this.detailTabs = new Ext.TabPanel({
            dockedItems: [this.detailCardToolbar],
            items: [this.detailCard, this.detailMap],
            tabBar: {
                ui: 'light',
                layout: { pack: 'center' }
            }
        });

        va.viewport = new Ext.Panel({
            layout: 'card',
            fullscreen: true,
            cardSwitchAnimation: 'slide',
            items: [this.listCard, this.detailTabs]
        });
    }
});