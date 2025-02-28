/**
 * Play&Go Project
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 2.0
 * Contact: info@smartcommunitylab.it
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { PagePlayerInfoConsole } from "../model/pagePlayerInfoConsole";
import { PageTrackedInstanceConsole } from "../model/pageTrackedInstanceConsole";
import { PlayerRole } from "../model/playerRole";
import { TrackedInstancePoly } from "../model/trackedInstancePoly";

@Injectable({
  providedIn: "root",
})
export class ConsoleControllerService {
  constructor(private http: HttpClient) {}
  /**
   * addCampaignManager
   *
   * @param userName userName
   * @param campaignId campaignId
   */
  public addCampaignManagerUsingPOST(args: {
    userName: string;
    campaignId: string;
  }): Observable<any> {
    const { userName, campaignId } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/console/role/campaign`,
      {
        params: removeNullOrUndefined({
          userName,
          campaignId,
        }),
      }
    );
  }

  /**
   * addTerritoryManager
   *
   * @param userName userName
   * @param territoryId territoryId
   */
  public addTerritoryManagerUsingPOST(args: {
    userName: string;
    territoryId: string;
  }): Observable<any> {
    const { userName, territoryId } = args;
    return this.http.request<any>(
      "post",
      environment.serverUrl.api + `/playandgo/api/console/role/territory`,
      {
        params: removeNullOrUndefined({
          userName,
          territoryId,
        }),
      }
    );
  }

  /**
   * getCampaignManager
   *
   * @param campaignId campaignId
   */
  public getCampaignManagerUsingGET(
    campaignId: string
  ): Observable<Array<PlayerRole>> {
    return this.http.request<Array<PlayerRole>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/role/campaign`,
      {
        params: removeNullOrUndefined({
          campaignId,
        }),
      }
    );
  }

  /**
   * getMyRoles
   *
   */
  public getMyRolesUsingGET(): Observable<Array<PlayerRole>> {
    return this.http.request<Array<PlayerRole>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/role/my`,
      {}
    );
  }

  /**
   * getTerritoryManager
   *
   * @param territoryId territoryId
   */
  public getTerritoryManagerUsingGET(
    territoryId: string
  ): Observable<Array<PlayerRole>> {
    return this.http.request<Array<PlayerRole>>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/role/territory`,
      {
        params: removeNullOrUndefined({
          territoryId,
        }),
      }
    );
  }

  /**
   * getTrackedInstanceDetail
   *
   * @param territoryId territoryId
   * @param trackId trackId
   */
  public getTrackedInstanceDetailUsingGET(args: {
    territoryId: string;
    trackId: string;
  }): Observable<TrackedInstancePoly> {
    const { territoryId, trackId } = args;
    return this.http.request<TrackedInstancePoly>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/track/detail`,
      {
        params: removeNullOrUndefined({
          territoryId,
          trackId,
        }),
      }
    );
  }

  /**
   * modifyToCheck
   *
   * @param trackId trackId
   * @param toCheck toCheck
   */
  public modifyToCheckUsingPUT(args: {
    trackId: string;
    toCheck: any;
  }): Observable<any> {
    const { trackId, toCheck } = args;
    return this.http.request<any>(
      "put",
      environment.serverUrl.api + `/playandgo/api/console/track/check`,
      {
        params: {
          trackId,
          toCheck,
        },
      }
    );
  }

  /**
   * removeCampaignManager
   *
   * @param userName userName
   * @param campaignId campaignId
   */
  public removeCampaignManagerUsingDELETE(args: {
    userName: string;
    campaignId: string;
  }): Observable<any> {
    const { userName, campaignId } = args;
    return this.http.request<any>(
      "delete",
      environment.serverUrl.api + `/playandgo/api/console/role/campaign`,
      {
        params: removeNullOrUndefined({
          userName,
          campaignId,
        }),
      }
    );
  }

  /**
   * removeTerritoryManager
   *
   * @param userName userName
   * @param territoryId territoryId
   */
  public removeTerritoryManagerUsingDELETE(args: {
    userName: string;
    territoryId: string;
  }): Observable<any> {
    const { userName, territoryId } = args;
    return this.http.request<any>(
      "delete",
      environment.serverUrl.api + `/playandgo/api/console/role/territory`,
      {
        params: removeNullOrUndefined({
          userName,
          territoryId,
        }),
      }
    );
  }

  /**
   * revalidateTrack
   *
   * @param territoryId territoryId
   * @param campaignId campaignId
   * @param trackedInstanceId trackedInstanceId
   * @param dateFrom UTC millis
   * @param dateTo UTC millis
   */
  public revalidateTrackUsingGET(args: {
    territoryId: string;
    campaignId: string;
    trackedInstanceId?: string;
    dateFrom?: number;
    dateTo?: number;
  }): Observable<any> {
    const { territoryId, campaignId, trackedInstanceId, dateFrom, dateTo } =
      args;
    return this.http.request<any>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/track/revalidate`,
      {
        params: removeNullOrUndefined({
          territoryId,
          campaignId,
          trackedInstanceId,
          dateFrom,
          dateTo,
        }),
      }
    );
  }

  /**
   * searchPlayersByTerritory
   *
   * @param page Results page you want to retrieve (0..N)
   * @param size Number of records per page
   * @param territoryId territoryId
   * @param sort Sorting option: field,[asc,desc]
   * @param text text
   */
  public searchPlayersByTerritoryUsingGET(args: {
    page: number;
    size: number;
    territoryId: string;
    sort?: string;
    text?: string;
  }): Observable<PagePlayerInfoConsole> {
    const { page, size, territoryId, sort, text } = args;
    return this.http.request<PagePlayerInfoConsole>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/player/search`,
      {
        params: removeNullOrUndefined({
          page,
          size,
          sort,
          territoryId,
          text,
        }),
      }
    );
  }

  /**
   * searchTrackedInstance
   *
   * @param page Results page you want to retrieve (0..N)
   * @param size Number of records per page
   * @param territoryId territoryId
   * @param sort Sorting option: field,[asc,desc]
   * @param trackId trackId
   * @param playerId playerId
   * @param modeType modeType
   * @param dateFrom UTC millis
   * @param dateTo UTC millis
   * @param campaignId campaignId
   * @param status status
   * @param toCheck toCheck
   */
  public searchTrackedInstanceUsingGET(args: {
    page: number;
    size: number;
    territoryId: string;
    sort?: string;
    trackId?: string;
    playerId?: string;
    modeType?: string;
    dateFrom?: number;
    dateTo?: number;
    campaignId?: string;
    status?: string;
    toCheck?: boolean;
    scoreStatus?: string;
  }): Observable<PageTrackedInstanceConsole> {
    const {
      page,
      size,
      territoryId,
      sort,
      trackId,
      playerId,
      modeType,
      dateFrom,
      dateTo,
      campaignId,
      status,
      toCheck,
      scoreStatus,
    } = args;
    return this.http.request<PageTrackedInstanceConsole>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/track/search`,
      {
        params: removeNullOrUndefined({
          page,
          size,
          sort,
          territoryId,
          trackId,
          playerId,
          modeType,
          dateFrom,
          dateTo,
          campaignId,
          status,
          toCheck,
          scoreStatus
        }),
      }
    );
  }

  /**
   * updateValidationResult
   *
   * @param trackId trackId
   * @param validity validity
   * @param modeType modeType
   * @param distance distance
   * @param duration duration
   * @param errorType errorType
   * @param note note
   */
  public updateValidationResultUsingGET(args: {
    trackId: string;
    validity: string;
    modeType?: string;
    distance?: number;
    duration?: number;
    errorType?: string;
    note?: string;
  }): Observable<any> {
    const { trackId, validity, modeType, distance, duration, errorType, note } =
      args;
    return this.http.request<any>(
      "get",
      environment.serverUrl.api + `/playandgo/api/console/track/update`,
      {
        params: removeNullOrUndefined({
          trackId,
          validity,
          modeType,
          distance,
          duration,
          errorType,
          note,
        }),
      }
    );
  }
}

function removeNullOrUndefined(obj: any) {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] != null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
