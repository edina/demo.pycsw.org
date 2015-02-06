/**
 * based from this gist
 * https://gist.githubusercontent.com/rclark/5154432/raw/b18dd51f9e0668efccb013b709154065d5650cfd/owslib-metadata-mapping.json
 */

/*jslint browser: true*/
/*global $, define, console */

define(function () {
    "use strict";
    var mappings = {
        "identifier": "gmd:fileIdentifier/gco:CharacterString",
        "parentidentifier": "gmd:parentIdentifier/gco:CharacterString",
        "language": "gmd:language/gco:CharacterString",
        "dataseturi": "gmd:dataSetURI/gco:CharacterString",
        "languagecode": "gmd:language/gmd:LanguageCode",
        "datestamp": "gmd:dateStamp/gco:Date or gmd:dateStamp/gco:DateTime",
        "charset": "gmd:characterSet/gmd:MD_CharacterSetCode/@codeListValue",
        "hierarchy": "gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue",
        "contact": {
            "context": "gmd:contact/gmd:CI_ResponsibleParty",
            "value": {
                "name": "gmd:individualName/gco:CharacterString",
                "organization": "gmd:organisationName/gco:CharacterString",
                "position": "gmd:positionName/gco:CharacterString",
                "phone": "gmd:contactInfo/gmd:CI_Contact/gmd:phone/gmd:CI_Telephone/gmd:voice/gco:CharacterString",
                "fax": "gmd:contactInfo/gmd:CI_Contact/gmd:phone/gmd:CI_Telephone/gmd:facsimile/gco:CharacterString",
                "address": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:deliveryPoint/gco:CharacterString",
                "city": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:city/gco:CharacterString",
                "region": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:administrativeArea/gco:CharacterString",
                "postcode": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:postalCode/gco:CharacterString",
                "country": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:country/gco:CharacterString",
                "email": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:electronicMailAddress/gco:CharacterString",
                "onlineresource": {
                    "url": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:linkage/gmd:URL",
                    "protocol": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:protocol/gco:CharacterString",
                    "name": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:name/gco:CharacterString",
                    "description": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:description/gco:CharacterString",
                    "application_profile": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:applicationProfile/gco:CharacterString"
                },
                "role": "gmd:role/gmd:CI_RoleCode/@codeListValue"
            }
        },
        // },
        // mapping2 = {

        "datetimestamp": "gmd:dateStamp/gco:DateTime",
        "stdname": "gmd:metadataStandardName/gco:CharacterString",
        "stdver": "gmd:metadataStandardVersion/gco:CharacterString",
        "referencesystem": {
            "code": "gmd:referenceSystemInfo/gmd:MD_ReferenceSystem/gmd:referenceSystemIdentifier/gmd:RS_Identifier/gmd:code/gco:CharacterString"
        },
        "identification": {
            "context": "gmd:identificationInfo/srv:SV_ServiceIdentification or gmd:identificationInfo/gmd:MD_DataIdentification",
            "value": {
                "identtype": "dataset or service",
                "title": "gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString",
                "alternatetitle": "gmd:citation/gmd:CI_Citation/gmd:alternateTitle/gco:CharacterString",
                "aggregationinfo": "gmd:aggregationInfo",
                "date": {
                    "context": "gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date",
                    "value": {
                        "date": "gmd:date/gco:Date or gmd:date/gco:DateTime",
                        "type": "gmd:dateType/gmd:CI_DateTypeCode/@codeListValue"
                    }

                },
                "uselimitation": "gmd:resourceConstraints/gmd:MD_Constraints/gmd:useLimitation/gco:CharacterString",
                "accessconstraints": "gmd:resourceConstraints/gmd:MD_LegalConstraints/gmd:accessConstraints/gmd:MD_RestrictionCode",
                "classification": "gmd:resourceConstraints/gmd:MD_LegalConstraints/gmd:accessConstraints/gmd:MD_ClassificationCode/@codeListValue",
                "otherconstraints": "gmd:resourceConstraints/gmd:MD_LegalConstraints/gmd:otherConstraints/gco:CharacterString",
                "securityconstraints": "gmd:resourceConstraints/gmd:MD_SecurityConstraints/gmd:useLimitation",
                "useconstraints": "gmd:resourceConstraints/gmd:MD_LegalConstraints/gmd:useConstraints/gmd:MD_RestrictionCode/@codeListValue",
                "denominators": "gmd:spatialResolution/gmd:MD_Resolution/gmd:equivalentScale/gmd:MD_RepresentativeFraction/gmd:denominator/gco:Integer",
                "distance": "gmd:spatialResolution/gmd:MD_Resolution/gmd:distance/gco:Distance",
                "uom": "gmd:spatialResolution/gmd:MD_Resolution/gmd:distance/gco:Distance/@uom",
                "resourcelanguage": "gmd:language/gmd:LanguageCode",
                //TODO deal with xpath where
                //"creator": "gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName where gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:role/gmd:CI_Role/@codeListValue == creator",
                //"publisher": "gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName where gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:role/gmd:CI_Role/@codeListValue == publisher",
                //"originator": "gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName where gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:role/gmd:CI_Role/@codeListValue == originator",
                "edition": "gmd:edition/gco:CharacterString",
                "abstract": "gmd:abstract/gco:CharacterString",
                "purpose": "gmd:purpose/gco:CharacterString",
                "status": "gmd:status/gmd:MD_ProgressCode/@codeListValue",
                "contact": {
                    "context": "gmd:pointOfContact/gmd:CI_ResponsibleParty",
                    "value": {
                        "name": "gmd:individualName/gco:CharacterString",
                        "organization": "gmd:organisationName/gco:CharacterString",
                        "position": "gmd:positionName/gco:CharacterString",
                        "phone": "gmd:contactInfo/gmd:CI_Contact/gmd:phone/gmd:CI_Telephone/gmd:voice/gco:CharacterString",
                        "fax": "gmd:contactInfo/gmd:CI_Contact/gmd:phone/gmd:CI_Telephone/gmd:facsimile/gco:CharacterString",
                        "address": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:deliveryPoint/gco:CharacterString",
                        "city": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:city/gco:CharacterString",
                        "region": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:administrativeArea/gco:CharacterString",
                        "postcode": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:postalCode/gco:CharacterString",
                        "country": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:country/gco:CharacterString",
                        "email": "gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:electronicMailAddress/gco:CharacterString",
                        "onlineresource": {
                            "url": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:linkage/gmd:URL",
                            "protocol": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:protocol/gco:CharacterString",
                            "name": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:name/gco:CharacterString",
                            "description": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:description/gco:CharacterString",
                            "application_profile": "gmd:contactInfo/gmd:CI_Contact/gmd:onlineResource/gmd:CI_OnlineResource/gmd:applicationProfile/gco:CharacterString"
                        },
                        "role": "gmd:role/gmd:CI_RoleCode/@codeListValue"
                    }

                },
                "keywords": {
                    "context": "gmd:descriptiveKeywords",
                    "value": {
                        "type": "gmd:MD_Keywords/gmd:type/gmd:MD_KeywordTypeCode/@codeListValue",
                        "thesaurus": {
                            "context": "gmd:thesaurusName/gmd:CI_Citation",
                            "value": {
                                "title": "gmd:title/gco:CharacterString",
                                "date": "gmd:date/gmd:CI_Date/gmd:date/gco:Date",
                                "datetype": "gmd:date/gmd:CI_Date/gmd:dateType/gmd:CI_DateTypeCode"
                            }
                        },
                        "keywords": "gmd:MD_Keywords/gmd:keyword/gco:CharacterString"

                    }

                },
                "topiccategory": "gmd:topicCategory/gmd:MD_TopicCategoryCode",
                "suplementalinformation": "gmd:supplementalInformation/gco:CharacterString",
                "extent": {
                    "context": "gmd:extent/gmd:EX_Extent/gmd:geographicElement",
                    "value": {
                        "boundingBox": {
                            "context": "gmd:EX_GeographicBoundingBox",
                            "value": {
                                "minx": "gmd:westBoundLongitude/gco:Decimal",
                                "maxx": "gmd:eastBoundLongitude/gco:Decimal",
                                "miny": "gmd:southBoundLatitude/gco:Decimal",
                                "maxy": "gmd:northBoundLatitude/gco:Decimal"
                            }
                        },
                        "boundingPolygon": {
                            "context": "gmd:EX_BoundingPolygon",
                            "value": {
                                "is_extent": "gmd:extentTypeCode",
                                "polygons": {
                                    "context": "gmd:polygon",
                                    "value": {
                                        "exterior_ring": "gml:Polygon/gml:exterior/gml:LinearRing/gml:pos",
                                        "interior_rings": "gml:Polygon/gml:interior/gml:LinearRing/gml:pos"

                                    }

                                }
                            }
                        },
                        "description_code": "gmd:EX_GeographicDescription/gmd:geographicIdentifier/gmd:MD_Identifier/gmd:code/gco:CharacterString"
                    }

                },
                "bbox": {
                    "context": "gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox",
                    "value": {
                        "minx": "gmd:westBoundLongitude/gco:Decimal",
                        "maxx": "gmd:eastBoundLongitude/gco:Decimal",
                        "miny": "gmd:southBoundLatitude/gco:Decimal",
                        "maxy": "gmd:northBoundLatitude/gco:Decimal"
                    }
                },
                "temporalextent_start": "gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:beginPosition",
                "temporalextent_end": "gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimePeriod/gml:endPosition"
            }
        },
        "serviceidentification": {
            "context": "gmd:identificationInfo/srv:SV_ServiceIdentification",
            "value": {
                "type": "srv:serviceType/gco:LocalName",
                "version": "srv:serviceTypeVersion/gco:CharacterString",
                "fees": "srv:accessProperties/gmd:MD_StandardOrderProcess/gmd:fees/gco:CharacterString",
                "bbox": {
                    "context": "srv:extent/gmd:EX_Extent/gmd:geographicElement",
                    "value": {
                        "boundingBox": {
                            "context": "gmd:EX_GeographicBoundingBox",
                            "value": {
                                "minx": "gmd:westBoundLongitude/gco:Decimal",
                                "maxx": "gmd:eastBoundLongitude/gco:Decimal",
                                "miny": "gmd:southBoundLatitude/gco:Decimal",
                                "maxy": "gmd:northBoundLatitude/gco:Decimal"
                            }
                        },
                        "boundingPolygon": {
                            "context": "gmd:EX_BoundingPolygon",
                            "value": {
                                "is_extent": "gmd:extentTypeCode",
                                "polygons": {
                                    "context": "gmd:polygon",
                                    "value": {
                                        "exterior_ring": "gml:Polygon/gml:exterior/gml:LinearRing/gml:pos",
                                        "interior_rings": "gml:Polygon/gml:interior/gml:LinearRing/gml:pos"

                                    }

                                }
                            }
                        },
                        "description_code": "gmd:EX_GeographicDescription/gmd:geographicIdentifier/gmd:MD_Identifier/gmd:code/gco:CharacterString"
                    }
                },
                "couplingtype": "gmd:couplingType/gmd:SV_CouplingType/@codeListValue",
                "operations": {
                    "context": "srv:containsOperations",
                    "value": {
                        "name": "srv:SV_OperationMetadata/srv:operationName/gco:CharacterString",
                        "dcplist": "srv:SV_OperationMetadata/srv:DCP/srv:DCPList/@codeListValue",
                        "connectpoint": {
                            "context": "srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource",
                            "value": {
                                "url": "gmd:linkage/gmd:URL",
                                "protocol": "gmd:protocol/gco:CharacterString",
                                "name": "gmd:name/gco:CharacterString",
                                "description": "gmd:description/gco:CharacterString",
                                "application_profile": "gmd:applicationProfile/gco:CharacterString"
                            }

                        }
                    }

                },
                "operateson": {
                    "context": "srv:operatesOn",
                    "value": {
                        "uuidref": "/@uuidref",
                        "href": "/@xlink:href",
                        "title": "/@xlink:title"
                    }

                }
            }
        },
        "distribution": {
            "context": "gmd:distributionInfo/gmd:MD_Distribution",
            "value": {
                "format": "gmd:distributionFormat/gmd:MD_Format/gmd:name/gco:CharacterString",
                "version": "gmd:distributionFormat/gmd:MD_Format/gmd:version/gco:CharacterString",
                "online": {
                    "context": "gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource",
                    "value": {
                        "url": "gmd:linkage/gmd:URL",
                        "protocol": "gmd:protocol/gco:CharacterString",
                        "name": "gmd:name/gco:CharacterString",
                        "description": "gmd:description/gco:CharacterString",
                        "application_profile": "gmd:applicationProfile/gco:CharacterString"
                    }

                }
            }
        },
        "dataquality": {
            "context": "gmd:dataQualityInfo/gmd:DQ_DataQuality",
            "value": {
                "conformancetitle": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:title/gco:CharacterString",
                "conformancedate": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date/gco:Date",
                "conformancedatetype": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue",
                "conformancedegree": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:pass/gco:Boolean",
                "lineage": "gmd:lineage/gmd:LI_Lineage/gmd:statement/gco:CharacterString",
                "specificationtitle": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:title/gco:CharacterString",
                "specificationdate": "gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:date/gmd:CI_Date"

            }
        }
    };

    return mappings;
});