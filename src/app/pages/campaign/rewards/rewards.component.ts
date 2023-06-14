import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { DateTime } from "luxon";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { CampaignClass } from "src/app/shared/classes/campaing-class";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-rewards",
  templateUrl: "./rewards.component.html",
  styleUrls: ["./rewards.component.scss"],
  
})

export class RewardsComponent implements OnInit {
  selectedLang: string;
  campaign: CampaignClass;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["index-dates"];
  newItem: any;
  msgError: string;
  validatingForm: FormGroup;
  weekCsv: any;
  rewardCsv: any;
  territorySelected: any;
  i: any;
  l = 1;

  constructor(
    public dialogRef: MatDialogRef<RewardsComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      weeks: new FormControl("", [Validators.required]),
      prizes: new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      defaultSurvey: "-",
    });
    this.campaignService
      .getCampaignUsingGET(this.campaign.campaignId)
      .subscribe((result) => {
        this.campaign = result;
        this.setTableData();
      });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  addPrizes() {
    this.msgError = undefined;
    if (this.validatingForm.valid) {
      const bodyWeek = new FormData();
      bodyWeek.append("data", this.weekCsv);
      const bodyRew = new FormData();
      bodyRew.append("data", this.rewardCsv);
      this.campaignService
        .uploadWeekConfsUsingPOST({
          campaignId: this.campaign.campaignId,
          body: bodyWeek,
        })
        .subscribe(
          (resWeek) => {
            const resErrorCheck = this.noErrorIn(resWeek); 
            if (!!resErrorCheck) {
              this.msgError =
              this.translate.instant("errorWhileLoadingWeeks") +
              ": " +
              resErrorCheck;
            }else{
              this.campaignService
              .uploadRewardsUsingPOST({
                campaignId: this.campaign.campaignId,
                body: bodyRew,
              })
              .subscribe(
                (resReward) => {
                  const resErrorCheck = this.noErrorIn(resReward); 
                  if (!!resErrorCheck) {
                    this.msgError =
                    this.translate.instant("errorWhileLoadingRewards") +
                    ": " +
                    resErrorCheck;
                  }else{
                    this.campaignService
                    .getCampaignUsingGET(this.campaign.campaignId)
                    .subscribe((resCamp) => {
                      if (resCamp) {
                        this.campaign = resCamp;
                        this.setTableData();
                        const text = this.translate.instant("savedData");
                        this._snackBar.openFromComponent(
                          SnackbarSavedComponent,
                          {
                            data: { displayText: text },
                            duration: 4999,
                          }
                        );
                      }
                    });
                  }
                },
                (error) => {
                  this.msgError =
                    this.translate.instant("errorWhileLoadingRewards") +
                    ": " +
                    error.error.ex
                      ? error.error.ex
                      : "Undefined error";
                }
              );
            }
          },
          (error) => {
            this.msgError =
              this.translate.instant("errorWhileLoadingWeeks") +
              ": " +
              error.error.ex
                ? error.error.ex
                : "Undefined error";
          }
        );
    } else {
      this.msgError = this.translate.instant("fillAllfields");
      this.validatingForm.markAllAsTouched();
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.campaign.weekConfs);
  }

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  uploadWeeks(event: any) {
    this.weekCsv = event.target.files[0];
  }

  uploadRewards(event: any) {
    this.rewardCsv = event.target.files[0];
  }

  fromTimestampToDate(timestamp: any): string {
    if (timestamp === 0) {
      return "-";
    }
    const a = new Date(timestamp);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    //var month = months[a.getMonth()+1];
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + "/" + month + "/" + year;
    return time;
  }

  download(type: string) {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    const fileName = "../../../../assets/files/" + type + ".csv";
    link.setAttribute("href", fileName);
    if (type === "rewDownload") {
      link.setAttribute(
        "download",
        this.translate.instant("prizes_example.csv")
      ); //'esempio_premi.csv'
    } else {
      link.setAttribute(
        "download",
        this.translate.instant("weeks_example.csv")
      ); // 'esempio_settimane.csv'
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  noErrorIn(list: string[]):boolean{
    var res = undefined;
    for(let item of list){
      if (this.parseError(item)) {
        res = item;
        break;
      }
    };
    return res;
  }

  parseError(item: string): boolean {
    return item.includes('error');
  }

  viewEditPeriod: boolean = false;
  viewEditPrizes: boolean = false;
  viewNewPeriod: boolean = true;
  viewNewPrize: boolean = false;
  viewFinalPrizes: boolean = false;
  viewLoadCSV: boolean = false;
  date_from: string;
  date_to: string;
  prize_desc: string;
  nickname: string;
  sponsor_name: string;
  sponsor_desc: string;
  sponsor_website: string;
  reward_note: string;
  isFinalPrizes: boolean = false;
  isSponsor: boolean = false;
  sponsorNomeProva: string = '';

  controllaSponsor() {
    if (this.sponsorNomeProva.length > 0) {
      this.isSponsor = true;
    } else {
      this.isSponsor = false;
    }
  this.switchLoadCSV()
  }

  switchIsFinalPrizes() {
    this.isFinalPrizes = !this.isFinalPrizes
  }

  goFinalPrizes() {
    this.viewFinalPrizes = true;
    this.viewEditPeriod=false;
    this.viewEditPrizes=false;
    this.viewNewPeriod=false;
    this.viewNewPrize=false;
  }

  goEditPeriod(oggetto) {
    this.viewEditPeriod=true;
    this.viewEditPrizes=false;
    this.viewNewPeriod=false;
    this.viewNewPrize=false;
    this.viewFinalPrizes = false;
    this.date_from = this.createDate(oggetto.dateFrom);
    this.date_to = this.createDate(oggetto.dateTo);
  }

  goEditPrizes(oggetto) {
    this.viewEditPeriod=false;
    this.viewEditPrizes=true;
    this.viewNewPeriod=false;
    this.viewNewPrize=false;
    this.viewFinalPrizes = false;
    this.prize_desc = oggetto.desc[this.selectedLang];
    this.nickname = oggetto.winner[this.selectedLang];
    this.sponsor_name = oggetto.sponsor[this.selectedLang];
    this.sponsor_desc = oggetto.sponsorDesc[this.selectedLang];
    this.sponsor_website = oggetto.sponsorWebsite[this.selectedLang];
    this.reward_note = oggetto.rewardNote[this.selectedLang];
    
  }

  goNewPeriod() {
    this.viewEditPeriod=false;
    this.viewEditPrizes=false;
    this.viewNewPeriod=true;
    this.viewNewPrize=false;
    this.viewFinalPrizes = false;
  }

  goNewPrize() {
    this.viewEditPeriod=false;
    this.viewEditPrizes=false;
    this.viewNewPeriod=false;
    this.viewNewPrize=true;
    this.viewFinalPrizes = false;
  }

  switchLoadCSV() {
    this.viewLoadCSV = !this.viewLoadCSV;
  }

  get descriptionRichControl() {
    const name = "description" + this.selectedLang;
    return this.validatingForm.controls[name] as FormControl;
  }

  fromDateTimeToLong(dateString: string): number {
    //yyyy-mm-ddThh:mm:ss format date
    if (dateString.length === "yyyy-mm-ddThh:mm:ss".length) {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm:ss", {
        zone: this.territorySelected.timezone,
      });
      return newDate.toMillis();
    } else {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm", {
        zone: this.territorySelected.timezone,
      });
      return newDate.toMillis();
    }
  }

  createDate(timestamp: number): string {
    const date = DateTime.fromMillis(timestamp);
    return date.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  }

  svuotaNickname() {
    this.nickname = null;
  }

  selezionaLinguaItaliana() {
    this.selectedLang = "it";
  }

  selezionaLinguaInglese() {
    this.selectedLang = "en";
  }
}