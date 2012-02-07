/// <reference path="../../lib/amplify-1.1.0/amplify.js" />

define(["./base64/base64.model", "../../lib/amplify-1.1.0/amplify"], function (Base64) {
    // Return the module definition

    return {
        Environment: function (name, address, userName, password, domain) {
            this.specifyUser = false;
            this.domain = domain;
            this.name = name;
            this.address = address;
            this.userName = userName;
            this.password = password;
        },
        getEnvironments: function () {
            return amplify.store("environment.model.environments");
        },
        storeEnvironments: function (environments) {
            amplify.store("environment.model.environments", environments);
        },
        callService: function (env, url, method, data, success, fail) {
            amplify.publish("log", "Connecting to: " + url);
            $.ajax({
                type: "POST", //GET or POST or PUT or DELETE verb
                url: url,
                data: data, //Data sent to server
                contentType: "application/json; charset=utf-8", // content type sent to server
                dataType: "json", //Expected data format from server
                xhrFields: {
                    withCredentials: !env.specifyUser
                },
                beforeSend: function (req) {
                    if (env.specifyUser) {
                        var tok = env.domain + "\\" + env.userName + ':' + env.password;
                        var hash = Base64.encode(tok);
                        req.setRequestHeader('Authorization', "Basic " + hash);
                    }
                },
                async: true,
                timeout: 10000,
                processdata: false, //True or False
                success: success,
                error: function (xhr, status, error, blah, blah2, blah3) {
                    amplify.publish("log", error + " (" +status + "):" + (xhr.responseXML ? xhr.responseXML.text : "No content"));
                    if (fail) fail(xhr);
                }
            });
        },
        callMainService: function (env, method, data, success, fail) {
            var url = env.address + "TriboldPPMWebServices/TriboldPPMSecureService.svc"
                + (env.specifyUser ? "/restba/" : "/rest/") + method;
            this.callService(env, url, method, data, success, fail);
        },

        callCreateService: function (env, method, data, success, fail) {
            var url = env.address + "TriboldPPMSecureCreateWebService/TriboldPPMSecureCreateService.svc"
                + (env.specifyUser ? "/restba/" : "/rest/") + method;
            this.callService(env, url, method, data, success, fail);
        },
        connect: function (env, success, fail) {
            this.callMainService(env, "HelloWorld", null, success, fail);
        },
        getAllChangeSetGroups: function (env, success, fail) {
            this.callMainService(env, "GetAllChangeSetGroups", null, success, fail);
        },
        createEntity: function (env, instance, ignoreWorkflowWarnings, success, fail) {
            this.callCreateService(env, "CreateEntity",
                '{ "instance": "' + escape(instance) + '", "ignoreWorkflowWarnings": ' + ignoreWorkflowWarnings + '}', success, fail);
        },
        createSingleInstance: function (env, schemaGuid, referenceInstance, success, fail) {
            this.callCreateService(env, "CreateSingleInstance",
            { schemaGuid: schemaGuid, referenceInstance: referenceInstance },
            success, fail);
        },
        getBlankProformaForEntity: function (env, entityGuid, success, fail) {
            this.callCreateService(env, "GetBlankProformaForEntity",
            '{ "entityGuid":"' + entityGuid +'"}',
        success, fail);
        },
        getReferenceTypeClassList: function (env, success, fail) {
            this.callCreateService("GetReferenceTypeClassList", null,
            success, fail);
        },
        getBlankProformaForReferenceClass: function (env, success, fail) {
            this.callCreateService(env, "GetBlankProformaForReferenceClass", null,
            success, fail);
        },
        getEntity: function (env, guid, success, fail) {
            this.callMainService(env, "GetEntityDetail",
            '{ "entityGuid": "' + guid + '"}',
            success, fail);
        },
        getEntityXml: function (env, guid, success, fail) {
            this.callMainService(env, "GetEntityXml",
            '{ "entityGuid": "' + guid + '"}',
            success, fail);
        },
        getEntities: function (env, success, fail) {
            //real mock data
            var data = [
            { Guid: '3CBFC97F-2F9D-4B27-BA8A-052AEB8C6EC7', Name: 'Mobile Package - M_Package_02210' },
            { Guid: 'D66D4922-BDCA-4C44-820F-021C036B0086', Name: 'Mobile Bundle - M_Bundle_02301' }
        ];
            if (success) success(data);

            return;
            // real call
            this.callService("GetEntities", null,
            function (data) {
                if (success) success(data);
            },
            function (error) {
                if (fail) fail(error);
            }
        );
        }
    };
});
