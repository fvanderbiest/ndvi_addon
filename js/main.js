Ext.namespace("GEOR.Addons");
/**
 * The ndvi client
 */
GEOR.Addons.Calculndvi = Ext.extend(GEOR.Addons.Base, {

    win: null,

    map: this.map,

    // the list of available layers
    layerStore: null,
    // the selected layer name
    layername_infrared: null,

    layername_red: null,

    lbbox_infrared: null,

    lbbox_red: null,

    layer_infrared: null,

    layer_red: null,

    layerName_ndvi: null,


    init: function(record) {

        // Setting of proj4js global vars.
        GEOR.WPS_Utils.initProj4jsGlobalVar();

        var lang = OpenLayers.Lang.getCode();
        map = this.map;
        mapProjection = map.getProjection();
        if (this.target) {
            this.components = this.target.insertButton(
                    this.position, {
                        xtype: 'button',
                        enableToggle: true,
                        tooltip: this.getTooltip(record),
                        iconCls: 'addon-calculndvi',
                        listeners: {
                            "toggle": this.showWindow,
                            scope: this
                        }
                    });
            this.target.doLayout();
        } else {
            this.item = new Ext.menu.Item({
                id: 'checkBox_NDVI',
                text: this.getText(record),
                qtip: this.getQtip(record),
                checked: false,
                listeners: {
                    "click": this.showWindow,
                    scope: this
                }

            });
        }

    },

    
    /**
     * show the configuration window
     */
    showWindow: function() {
        if (!this.win) {
            serverStore = GEOR.WPS_Utils.initServerStore();
            serverStore.load();

            this.combo_Server_1 = GEOR.WPS_Utils.initCombobox(
                    'combo_server_1_NDVI', serverStore,
                    OpenLayers.i18n("calculndvi.workspace"),
                    'url', 'name', false);
            this.combo_Server_1.on('select', function(combo,
                    record) {
                GEOR.WPS_Utils.loadNextDataStore(Ext
                        .getCmp('combo_Server_1_NDVI'), record
                        .get('url'), Ext
                        .getCmp('combo_layer_1_NDVI'));
                Ext.getCmp('combo_layer_1_NDVI').setDisabled(
                        false);
            });
            this.combo_Server_2 = GEOR.WPS_Utils.initCombobox(
                    'combo_server_2_NDVI', serverStore,
                    OpenLayers.i18n("calculndvi.workspace"),
                    'url', 'name', false);
            this.combo_Server_2.on('select', function(combo,
                    record) {
                GEOR.WPS_Utils.loadNextDataStore(Ext
                        .getCmp('combo_Server_2_NDVI'), record
                        .get('url'), Ext
                        .getCmp('combo_layer_2_NDVI'));
                Ext.getCmp('combo_layer_2_NDVI').setDisabled(
                        false);
            });
            this.combo_Layers_1 = GEOR.WPS_Utils.initCombobox(
                    'combo_layer_1_NDVI', this.layerStore,
                    OpenLayers.i18n("calculndvi.layername"),
                    'layer', 'name', true);
            this.combo_Layers_2 = GEOR.WPS_Utils.initCombobox(
                    'combo_layer_2_NDVI', this.layerStore,
                    OpenLayers.i18n("calculndvi.layername"),
                    'layer', 'name', true);
            this.combo_Layers_1
                    .on(
                            'select',
                            function(combo, record) {
                                layer_infrared = record
                                        .get('layer');
                                workspace_infrared = GEOR.WPS_Utils
                                        .getWorkspace(
                                                combo,
                                                Ext
                                                        .getCmp('combo_server_1_NDVI'));
                                layername_infrared = workspace_infrared
                                        + ":"
                                        + GEOR.WPS_Utils
                                                .getLayerName(combo);

                            });

            this.combo_Layers_2
                    .on(
                            'select',
                            function(combo, record) {
                                layer_red = record.get('layer');
                                workspace_red = GEOR.WPS_Utils
                                        .getWorkspace(
                                                combo,
                                                Ext
                                                        .getCmp('combo_server_2_NDVI'));
                                layername_red = workspace_red
                                        + ":"
                                        + GEOR.WPS_Utils
                                                .getLayerName(combo);

                            });

            this.win = new Ext.Window(
                    {
                        title: "Configuration",
                        height: 450,
                        width: 350,
                        bodyStyle: 'padding: 5px',
                        layout: 'form',
                        labelWidth: 110,
                        defaultType: 'field',
                        items: [
                                {
                                    xtype: 'box',
                                    height: 30,
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: '800'
                                    },
                                    autoEl: {
                                        tag: 'div',
                                        html: OpenLayers
                                                .i18n("calculndvi.firstlayer")
                                    }
                                },
                                this.combo_Server_1,
                                this.combo_Layers_1,
                                {
                                    fieldLabel: OpenLayers
                                            .i18n("calculndvi.layersprojection.label"),
                                    width: 200,
                                    id: 'projection_1',
                                    allowBlank: false,
                                },
                                {
                                    xtype: 'box',
                                    height: 30,
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: '800'
                                    },

                                    autoEl: {
                                        tag: 'div',
                                        html: OpenLayers
                                                .i18n("calculndvi.secondlayer")
                                    }
                                },
                                this.combo_Server_2,
                                this.combo_Layers_2,
                                {
                                    fieldLabel: OpenLayers
                                            .i18n("calculndvi.layersprojection.label"),
                                    width: 200,
                                    id: 'projection_2',
                                    allowBlank: false,
                                },

                                {
                                    xtype: 'box',
                                    height: 30,
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: '800'
                                    },

                                    autoEl: {
                                        tag: 'div',
                                        html: OpenLayers
                                                .i18n("calculndvi.generatedLayer")
                                    }
                                },
                                {
                                    fieldLabel: OpenLayers
                                            .i18n("calculndvi.generatedLayerName"),
                                    width: 200,
                                    id: 'generatedLayer',
                                    allowBlank: false,
                                },
                                {
                                    xtype: 'box',
                                    height: 30,
                                    style: {
                                        fontSize: '15px',
                                        fontWeight: '800'
                                    },

                                    autoEl: {
                                        tag: 'div',
                                        html: OpenLayers
                                                .i18n("calculndvi.geoserveridentifier")
                                    }
                                },

                                {
                                    fieldLabel: OpenLayers
                                            .i18n("calculndvi.geoserverusername"),
                                    width: 200,
                                    id: 'userName',
                                    allowBlank: false,
                                },

                                {
                                    fieldLabel: OpenLayers
                                            .i18n("calculndvi.geoserverpassword"),
                                    width: 200,
                                    inputType: 'password',
                                    id: 'password',
                                    allowBlank: false,
                                }

                        ],
                        fbar: [
                                '->',
                                {
                                    text: OpenLayers
                                            .i18n("calculndvi.submit"),
                                    id: 'submit_NDVI',
                                    formBind: true,
                                    handler: function() {
                                        projection_1 = Ext
                                                .getCmp(
                                                        'projection_1')
                                                .getValue();
                                        projection_2 = Ext
                                                .getCmp(
                                                        'projection_2')
                                                .getValue();
                                        generatedLayerName = Ext
                                                .getCmp(
                                                        'generatedLayer')
                                                .getValue();

                                        this.win.hide();
                                        this.executeWPS();
                                    },

                                    scope: this
                                } ],
                        listeners: {
                            "hide": function() {
                            },
                            scope: this
                        }
                    });

        }

        this.win.show();

    },

    
    /**
     * Reconstitute the wps document and post it
     */
    executeWPS: function() {

        GEOR.waiter.show();

        lbbox_infrared = layer_infrared.bbox["epsg:"
                + projection_1].bbox;
        lbbox_red = layer_red.bbox["epsg:" + projection_2].bbox;

        var wpsFormat = new OpenLayers.Format.WPSExecute();

        var result = wpsFormat
                .write({
                    identifier: "gs:CalculateNdvi",
                    dataInputs: [
                            {
                                identifier: 'Near infrared image',
                                reference: {
                                    mimeType: "image/tiff",
                                    href: "http://geoserver/wcs",
                                    method: "POST",
                                    body: {
                                        wcs: {
                                            identifier: layername_infrared,
                                            version: '1.1.1',
                                            domainSubset: {
                                                boundingBox: {
                                                    projection: 'http://www.opengis.net/gml/srs/epsg.xml#'
                                                            + projection_1,
                                                    bounds: new OpenLayers.Bounds(
                                                            lbbox_infrared)
                                                }
                                            },
                                            output: {
                                                format: 'image/tiff'
                                            }
                                        }
                                    }
                                }
                            },

                            {
                                identifier: 'Red image',
                                reference: {
                                    mimeType: "image/tiff",
                                    href: "http://geoserver/wcs",
                                    method: "POST",
                                    body: {
                                        wcs: {
                                            identifier: layername_red,
                                            version: '1.1.1',
                                            domainSubset: {
                                                boundingBox: {
                                                    projection: 'http://www.opengis.net/gml/srs/epsg.xml#'
                                                            + projection_2,
                                                    bounds: new OpenLayers.Bounds(
                                                            lbbox_red)

                                                }
                                            },
                                            output: {
                                                format: 'image/tiff'
                                            }

                                        }
                                    }
                                }
                            },
                            {
                                identifier: "Ndvi layer",
                                data: {
                                    literalData: {
                                        value: generatedLayerName
                                    }
                                }
                            },
                            {
                                identifier: "User",
                                data: {
                                    literalData: {
                                        value: Ext.getCmp(
                                                'userName')
                                                .getValue()
                                    }
                                }
                            },
                            {
                                identifier: "Password",
                                data: {
                                    literalData: {
                                        value: Ext.getCmp(
                                                'password')
                                                .getValue()
                                    }
                                }
                            }

                    ],
                    responseForm: {
                        rawDataOutput: {
                            mimeType: "image/tiff",
                            identifier: "result"
                        }
                    }
                });

        OpenLayers.Request.POST({
            url: GEOR.custom.GEOSERVER_WPS_URL,
            data: result,
            success: function(response) {

                newWmsLayer = new OpenLayers.Layer.WMS(
                        generatedLayerName,
                        GEOR.custom.GEOSERVER_WMS_URL, {
                            layers: "wps_tmp:"
                                    + response.responseText,
                            transparent: 'true',
                            format: 'image/png'
                        }, { // isBaseLayer: true,
                            singleTile: true
                        });

                this.map.addLayers([ newWmsLayer ]);

                GEOR.waiter.hide();

            },
            failure: function(response) {
                alert("failure!");
                alert(response.responseText);
                GEOR.waiter.hide();
            }
        });

    },

    
    destroy: function() {
        GEOR.Addons.Base.prototype.destroy.call(this);

    }
});
