﻿import { DataStoreType } from '../enums/data-store-type';

import { ActionResponse } from '../models/action-response';

import { ViewModelBase } from '../services/view-model-base';

export class Salesforce extends ViewModelBase {
    salesforceUsername: string = '';
    salesforcePassword: string = '';
    salesforceToken: string = '';
    salesforceUrl: string = 'login.salesforce.com';
    salesforceObjects: string = '';

    async OnLoaded(): Promise<void> {
        this.isValidated = false;
        this.showValidation = false;
    }

    async OnValidate(): Promise<boolean> {
        this.MS.DataStore.addToDataStore('SalesforceUser', this.salesforceUsername, DataStoreType.Public);
        this.MS.DataStore.addToDataStore('SalesforcePassword', this.salesforcePassword, DataStoreType.Private);
        this.MS.DataStore.addToDataStore('SalesforceToken', this.salesforceToken, DataStoreType.Private);
        this.MS.DataStore.addToDataStore('SalesforceUrl', this.salesforceUrl, DataStoreType.Public);
        this.MS.DataStore.addToDataStore('ObjectTables', this.salesforceObjects, DataStoreType.Public);

        let salesforceLoginResponse: ActionResponse = await this.MS.HttpService.executeAsync('Microsoft-ValidateSalesforceCredentials');

        this.isValidated = salesforceLoginResponse.IsSuccess;
        this.showValidation = this.isValidated;

        if (this.isValidated) {
            this.MS.DataStore.addToDataStore('SalesforceBaseUrl', salesforceLoginResponse.Body.serverUrlField, DataStoreType.Public);
        }

        return this.isValidated;
    }
}